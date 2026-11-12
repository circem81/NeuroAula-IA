import {
  analystInputSchema,
  analystReportSchema,
  analyzeEvidence,
  validateAnalystReport,
  type AnalystInput,
  type AnalystReport,
} from "./learning-analyst.ts";
import { tutorActivity } from "./tutor.ts";
import { type AgentResult, type ProviderConfig } from "./structured-agent.server.ts";
import { requestEducationalModel as requestStructuredAgent } from "./model-gateway.server.ts";

export async function requestLearningAnalysis(
  input: AnalystInput,
  config: ProviderConfig,
  request: typeof fetch = fetch,
): Promise<AgentResult<AnalystReport>> {
  // Recheck the boundary here as well: internal callers cannot bypass data minimization.
  if (!analystInputSchema.safeParse(input).success) return { ok: false, code: "invalid_response" };
  const facts = analyzeEvidence(input.attempts);
  const result = await requestStructuredAgent(
    {
      name: "learning_analysis",
      instructions: `You are the learning analyst, not the hint-writing tutor. Draft a concise report for a teacher in ${input.lang === "es" ? "Spanish" : "English"}. This is a fictional trial, not an authenticated learner record. Use only the supplied, rule-computed evidence. Summarize observed answers and cite actual attempt numbers in evidenceAttempts. Suggest one to three questions the teacher can ask to understand the procedure. Do not write a hint or disclose a solution. Never infer diagnosis, disability, cognitive traits, emotional state, motivation, mastery or causes. A correct answer after a hint does not prove that the hint worked. Explicitly acknowledge this uncertainty. Select a next step: ask_first_step, guided_practice, transfer_exercise only if solved, or teacher_review. At five unsolved attempts, select teacher_review. This is a draft requiring teacher review, never a command to execute.`,
      input: { activity: tutorActivity.equation, source: tutorActivity.source, facts },
      outputSchema: analystReportSchema,
      jsonSchema: {
        type: "object",
        properties: {
          summary: { type: "string" },
          evidenceAttempts: { type: "array", items: { type: "integer" } },
          questions: { type: "array", items: { type: "string" } },
          nextStep: {
            type: "string",
            enum: ["ask_first_step", "guided_practice", "transfer_exercise", "teacher_review"],
          },
        },
        required: ["summary", "evidenceAttempts", "questions", "nextStep"],
        additionalProperties: false,
      },
    },
    config,
    request,
  );
  if (!result.ok) return result;
  const report = validateAnalystReport(result.advice, input.attempts);
  return report ? { ok: true, advice: report } : { ok: false, code: "invalid_response" };
}
