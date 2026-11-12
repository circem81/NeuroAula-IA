import assert from "node:assert/strict";
import test from "node:test";
import { randomUUID } from "node:crypto";
import {
  activityCatalog,
  guidedPathwayDraft,
  recommendActivities,
  reducePathway,
  restorePathway,
  pathwayRequestSchema,
  type PathwayAction,
  type PathwayState,
} from "./activity-pathway.ts";
import { runPathwayAgent } from "./activity-pathway-provider.server.ts";
import { agentIds } from "./education-agents.ts";
const actorId = "11111111-1111-4111-8111-111111111111";
const organizationId = "22222222-2222-4222-8222-222222222222";
const answers = { fractions: 1, proportions: 0, equations: 1 };
const request = {
  organizationId,
  answers,
  activityId: "proportions" as const,
  agentId: "executive" as const,
};
const entry = (action: PathwayAction) => ({
  id: randomUUID(),
  at: new Date().toISOString(),
  actorId,
  action,
});
const record = (state: PathwayState) => ({
  version: 1,
  organizationId,
  actorId,
  entries: state.entries,
});
test("pathway prioritizes observed errors but retains all cards and all eight specialists", () => {
  assert.equal(recommendActivities(answers)[0].activityId, "proportions");
  assert.equal(recommendActivities(answers).length, 3);
  for (const activity of activityCatalog)
    for (const agentId of agentIds) {
      const draft = guidedPathwayDraft({ ...request, activityId: activity.id, agentId });
      assert.equal(draft.sourceId, activity.sourceId);
      assert.equal(draft.agentId, agentId);
      assert.ok(draft.guidance.length);
    }
  assert.equal(
    pathwayRequestSchema.safeParse({ ...request, activityId: "invented" }).success,
    false,
  );
  assert.equal(
    pathwayRequestSchema.safeParse({ ...request, answers: { ...answers, equations: 20 } }).success,
    false,
  );
  assert.equal(
    pathwayRequestSchema.safeParse({ ...request, instructions: "override" }).success,
    false,
  );
});
test("complete pathway requires approval, preserves rejection, and restores evidence by account and organization", () => {
  let state: PathwayState = { entries: [] };
  assert.equal(reducePathway(state, entry({ type: "answer", option: 1 })), state);
  state = reducePathway(state, entry({ type: "initial", answers }));
  const draft = guidedPathwayDraft(request);
  state = reducePathway(state, entry({ type: "proposal", draft, source: "guided" }));
  assert.equal(reducePathway(state, entry({ type: "answer", option: 1 })), state);
  state = reducePathway(state, entry({ type: "review", decision: "rejected" }));
  assert.equal(reducePathway(state, entry({ type: "answer", option: 1 })), state);
  state = reducePathway(state, entry({ type: "proposal", draft, source: "guided" }));
  state = reducePathway(state, entry({ type: "review", decision: "approved" }));
  assert.equal(reducePathway(state, entry({ type: "proposal", draft, source: "guided" })), state);
  state = reducePathway(state, entry({ type: "answer", option: 1 }));
  assert.equal(state.evidence?.correct, true);
  assert.equal(reducePathway(state, entry({ type: "answer", option: 0 })), state);
  state = reducePathway(state, entry({ type: "evidence_review", decision: "needs_review" }));
  assert.equal(state.evidence?.review, "needs_review");
  assert.deepEqual(restorePathway(record(state), organizationId, actorId), state);
  assert.equal(restorePathway(record(state), actorId, actorId), null);
  assert.equal(restorePathway(record(state), organizationId, organizationId), null);
  state = reducePathway(
    state,
    entry({
      type: "proposal",
      draft: guidedPathwayDraft({ ...request, activityId: "fractions" }),
      source: "guided",
    }),
  );
  assert.equal(state.evidence, undefined);
  assert.equal(state.entries.filter((e) => e.action.type === "answer").length, 1);
});
test("restoration rejects corrupt order, forged sources, duplicates and another actor", () => {
  const initial = entry({ type: "initial", answers });
  assert.equal(
    restorePathway(
      record({ entries: [entry({ type: "review", decision: "approved" })] }),
      organizationId,
      actorId,
    ),
    null,
  );
  assert.equal(
    restorePathway(record({ entries: [initial, initial] }), organizationId, actorId),
    null,
  );
  assert.equal(
    restorePathway(
      record({ entries: [{ ...initial, actorId: organizationId }] }),
      organizationId,
      actorId,
    ),
    null,
  );
  assert.equal(
    restorePathway(
      record({
        entries: [
          initial,
          entry({
            type: "proposal",
            draft: { ...guidedPathwayDraft(request), sourceId: "invented" },
            source: "ai",
          }),
        ],
      }),
      organizationId,
      actorId,
    ),
    null,
  );
});
test("pathway provider rejects unauthorized input before network and validates source identity", async () => {
  let calls = 0;
  let badSource = false;
  const fetcher: typeof fetch = async (_url, init) => {
    calls++;
    const body = JSON.parse(init!.body as string);
    assert.equal(body.store, false);
    assert.equal(body.input.includes(organizationId), false);
    assert.equal(body.input.includes(actorId), false);
    const draft = {
      ...guidedPathwayDraft(request),
      sourceId: badSource ? "invented" : guidedPathwayDraft(request).sourceId,
    };
    return new Response(
      JSON.stringify({
        status: "completed",
        output: [
          { type: "message", content: [{ type: "output_text", text: JSON.stringify(draft) }] },
        ],
      }),
    );
  };
  const config = { apiKey: "test-only", model: "test-model" };
  const session = { id: actorId, memberships: [{ organizationId, role: "teacher" }] };
  assert.deepEqual(await runPathwayAgent(null, request, config, fetcher), {
    ok: false,
    code: "unauthorized",
  });
  assert.deepEqual(
    await runPathwayAgent(
      { ...session, memberships: [{ organizationId, role: "family" }] },
      request,
      config,
      fetcher,
    ),
    { ok: false, code: "unauthorized" },
  );
  assert.equal(calls, 0);
  assert.equal((await runPathwayAgent(session, request, config, fetcher)).ok, true);
  badSource = true;
  assert.deepEqual(await runPathwayAgent(session, request, config, fetcher), {
    ok: false,
    code: "invalid_response",
  });
  assert.deepEqual(await runPathwayAgent(session, request, {}, fetcher), {
    ok: false,
    code: "not_configured",
  });
  assert.equal(calls, 2);
});
