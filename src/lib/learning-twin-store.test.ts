import test from "node:test";
import assert from "node:assert/strict";
import type { SupabaseClient } from "@supabase/supabase-js";
import { recordEvaluatedEvidence, readLearningTwin } from "./learning-twin-store.server.ts";
import type { LearningEvidence } from "./learning-twin.ts";

const id = "00000000-0000-4000-8000-000000000001";
const evidence: LearningEvidence = {
  id,
  organizationId: id,
  studentId: id,
  activityId: id,
  criterionId: "ALG-01",
  subject: "mathematics",
  correct: true,
  reasoningQuality: 1,
  supportLevel: 0,
  transferLevel: 0,
  attempts: 1,
  errorType: null,
  strategies: [],
  evaluatorConfidence: 1,
  previousEvidenceId: null,
  createdAt: "2026-09-01T10:00:00.000Z",
};
function requestClient(authorized = true) {
  const queries: { table: string; filters: [string, unknown][] }[] = [];
  const client = {
    auth: { getUser: async () => ({ data: { user: { id } }, error: null }) },
    from(table: string) {
      const query = { table, filters: [] as [string, unknown][] };
      queries.push(query);
      const builder = {
        select() {
          return builder;
        },
        eq(key: string, value: unknown) {
          query.filters.push([key, value]);
          return builder;
        },
        order() {
          return builder;
        },
        async range() {
          return { data: [], error: null };
        },
        async maybeSingle() {
          return { data: authorized ? { id, role: "teacher" } : null, error: null };
        },
      };
      return builder;
    },
  } as unknown as SupabaseClient;
  return { client, queries };
}

test("server rejects unauthorized evaluation before privileged writer is called", async () => {
  const { client } = requestClient(false);
  const writer = {
    rpc() {
      assert.fail("Unauthorized privileged call");
    },
  } as unknown as SupabaseClient;
  await assert.rejects(recordEvaluatedEvidence(client, writer, evidence, id), /Unauthorized/);
});

test("server computes state from evidence, scopes reads, and reloads on a concurrent conflict", async () => {
  const { client, queries } = requestClient();
  let calls = 0;
  const writer = {
    async rpc(name: string, args: Record<string, unknown>) {
      calls++;
      assert.equal(name, "commit_learning_twin_v1");
      assert.equal(args.p_expected_count, 0);
      const payload = args.p_evidence as Record<string, unknown>;
      assert.equal(payload.recorded_by, id);
      const snapshot = args.p_snapshot as { state: { mastery: number; evidenceCount: number } };
      assert.equal(snapshot.state.evidenceCount, 1);
      assert.ok(Math.abs(snapshot.state.mastery - 0.2125) < 1e-10);
      return { data: calls === 1 ? "conflict" : "inserted", error: null };
    },
  } as unknown as SupabaseClient;
  const twin = await recordEvaluatedEvidence(client, writer, evidence, id, evidence.createdAt);
  assert.equal(twin.state.evidenceCount, 1);
  assert.equal(calls, 2);
  const reads = queries.filter((q) => q.table === "learning_twin_evidence");
  assert.equal(reads.length, 2);
  for (const read of reads)
    assert.deepEqual(read.filters, [
      ["organization_id", id],
      ["student_id", id],
      ["criterion_id", "ALG-01"],
    ]);
});

test("server bounds conflicts and sanitizes database errors", async () => {
  const { client } = requestClient();
  let calls = 0;
  const writer = {
    async rpc() {
      calls++;
      return { data: "conflict", error: null };
    },
  } as unknown as SupabaseClient;
  await assert.rejects(
    recordEvaluatedEvidence(client, writer, evidence, id),
    /Concurrent evidence update/,
  );
  assert.equal(calls, 3);
  const failing = {
    async rpc() {
      return { data: null, error: { message: "private database details" } };
    },
  } as unknown as SupabaseClient;
  await assert.rejects(recordEvaluatedEvidence(client, failing, evidence, id), {
    message: "Learning Twin transaction failed",
  });
});

test("empty authorized history yields no invented state", async () => {
  const { client } = requestClient();
  assert.equal(
    await readLearningTwin(client, { organizationId: id, studentId: id, criterionId: "ALG-01" }),
    null,
  );
});
