import type { SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";
import { buildLearningTwin, validateEvidence, type LearningEvidence } from "./learning-twin.ts";

const scopeSchema = z
  .object({
    organizationId: z.string().uuid(),
    studentId: z.string().uuid(),
    criterionId: z.string().min(1).max(100),
  })
  .strict();
type Scope = z.infer<typeof scopeSchema>;

async function requireTeacher(client: SupabaseClient, scope: Scope) {
  const {
    data: { user },
    error,
  } = await client.auth.getUser();
  if (error || !user) throw new Error("Unauthorized");
  const membership = await client
    .from("organization_memberships")
    .select("role")
    .eq("organization_id", scope.organizationId)
    .eq("user_id", user.id)
    .eq("status", "active")
    .eq("role", "teacher")
    .maybeSingle();
  if (membership.error || !membership.data) throw new Error("Unauthorized");
  return user.id;
}

// Explicit column mapping avoids exposing database-only audit fields to the engine/model.
function fromRow(row: Record<string, unknown>): LearningEvidence {
  return validateEvidence({
    id: row.id,
    organizationId: row.organization_id,
    studentId: row.student_id,
    activityId: row.activity_id,
    criterionId: row.criterion_id,
    subject: row.subject,
    correct: row.correct,
    reasoningQuality: row.reasoning_quality,
    supportLevel: row.support_level,
    transferLevel: row.transfer_level,
    attempts: row.attempts,
    errorType: row.error_type,
    strategies: row.strategies,
    evaluatorConfidence: row.evaluator_confidence,
    previousEvidenceId: row.previous_evidence_id,
    createdAt: new Date(String(row.created_at)).toISOString(),
  });
}

async function loadEvidence(client: SupabaseClient, scope: Scope) {
  const evidence: LearningEvidence[] = [];
  // Do not silently truncate at PostgREST's default page size.
  for (let offset = 0; ; offset += 500) {
    const { data, error } = await client
      .from("learning_twin_evidence")
      .select("*")
      .eq("organization_id", scope.organizationId)
      .eq("student_id", scope.studentId)
      .eq("criterion_id", scope.criterionId)
      .order("created_at")
      .order("id")
      .range(offset, offset + 499);
    if (error) throw new Error("Unable to load learning evidence");
    evidence.push(...(data ?? []).map(fromRow));
    if (!data || data.length < 500) return evidence;
  }
}

/** Teacher read: decay confidence at read time without changing historic mastery. */
export async function readLearningTwin(
  client: SupabaseClient,
  input: Scope,
  now = new Date().toISOString(),
) {
  const scope = scopeSchema.parse(input);
  await requireTeacher(client, scope);
  return buildLearningTwin(await loadEvidence(client, scope), now);
}

/** Internal Evaluation Agent hook, not a browser server-function. Never pass model-generated state.
 * requestClient is cookie-scoped; writer is a server-only service client supplied by the caller.
 * A future real activity endpoint must derive identity and rubric from its stored assignment.
 */
export async function recordEvaluatedEvidence(
  requestClient: SupabaseClient,
  writer: SupabaseClient,
  input: LearningEvidence,
  classroomId: string,
  now = new Date().toISOString(),
) {
  const evidence = validateEvidence(input);
  z.string().uuid().parse(evidence.activityId);
  z.string().uuid().parse(classroomId);
  const scope = scopeSchema.parse({
    organizationId: evidence.organizationId,
    studentId: evidence.studentId,
    criterionId: evidence.criterionId,
  });
  const actor = await requireTeacher(requestClient, scope);
  // Authorize resources through the request client's RLS before any privileged write.
  const learner = await requestClient
    .from("learners")
    .select("id")
    .eq("id", scope.studentId)
    .eq("organization_id", scope.organizationId)
    .maybeSingle();
  const activity = await requestClient
    .from("learning_activities")
    .select("id")
    .eq("id", evidence.activityId)
    .eq("organization_id", scope.organizationId)
    .eq("classroom_id", classroomId)
    .maybeSingle();
  if (learner.error || !learner.data || activity.error || !activity.data)
    throw new Error("Unauthorized learning scope");
  for (let retry = 0; retry < 3; retry++) {
    const history = await loadEvidence(requestClient, scope);
    const twin = buildLearningTwin([...history, evidence], now)!;
    const { data, error } = await writer.rpc("commit_learning_twin_v1", {
      p_expected_count: history.length,
      p_evidence: {
        id: evidence.id,
        organization_id: evidence.organizationId,
        student_id: evidence.studentId,
        classroom_id: classroomId,
        activity_id: evidence.activityId,
        criterion_id: evidence.criterionId,
        subject: evidence.subject,
        correct: evidence.correct,
        reasoning_quality: evidence.reasoningQuality,
        support_level: evidence.supportLevel,
        transfer_level: evidence.transferLevel,
        attempts: evidence.attempts,
        error_type: evidence.errorType,
        strategies: evidence.strategies,
        evaluator_confidence: evidence.evaluatorConfidence,
        previous_evidence_id: evidence.previousEvidenceId,
        created_at: evidence.createdAt,
        recorded_by: actor,
      },
      p_snapshot: {
        state: twin.state,
        errorPatterns: twin.errorPatterns,
        supportEffectiveness: twin.supportEffectiveness,
      },
    });
    if (error) throw new Error("Learning Twin transaction failed");
    if (data === "inserted" || data === "duplicate") return twin;
    if (data !== "conflict") throw new Error("Unexpected Learning Twin transaction result");
  }
  throw new Error("Concurrent evidence update; retry the same evidence ID");
}
