import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  agentIds,
  educationAgent,
  educationAgentInputSchema,
  programmedAgentDraft,
  validateAgentDraft,
  reviewAgentDraft,
  nextTrialStep,
  type EducationAgentInput,
  type AgentBoard,
} from "./education-agents.ts";
import { requestEducationAgent, runEducationAgent } from "./education-agents-provider.server.ts";
import { createTutorLimiter } from "./tutor-provider.server.ts";
import { guidedAnalysis } from "./learning-analyst.ts";

const organizationId = "00000000-0000-4000-8000-000000000001";
const config = { apiKey: "test-secret", model: "gpt-6-astra" };
const context: EducationAgentInput["context"] = {
  organizationId,
  activityId: "linear-equation-v1",
  lang: "es",
  attempts: [{ answer: "3", hintBefore: "none" }],
};
const teacher = { id: "teacher", memberships: [{ organizationId, role: "teacher" }] };
const complete = (value: unknown) =>
  Response.json({
    status: "completed",
    output: [{ type: "message", content: [{ type: "output_text", text: JSON.stringify(value) }] }],
  });
const providerBody = (input: EducationAgentInput) => {
  if (input.agentId === "analytics")
    return guidedAnalysis(input.context.attempts, input.context.lang);
  const { agentId: _, ...body } = programmedAgentDraft(input);
  return body;
};

describe("eight education specialists", () => {
  it("provides eight distinct contracts and valid bilingual examples across trial states", () => {
    assert.equal(agentIds.length, 8);
    assert.equal(
      new Set(
        agentIds.map((id) =>
          educationAgent(id)
            .fields.map((field) => field.key)
            .join(),
        ),
      ).size,
      8,
    );
    for (const lang of ["es", "en"] as const) {
      for (const attempts of [
        context.attempts,
        [{ answer: "4" as const, hintBefore: "none" as const }],
        Array.from({ length: 5 }, () => ({ answer: "3" as const, hintBefore: "none" as const })),
      ]) {
        for (const agentId of agentIds) {
          const input = { agentId, context: { ...context, lang, attempts } };
          const { agentId: _, ...draft } = programmedAgentDraft(input);
          assert.ok(validateAgentDraft(agentId, draft, input.context));
          if (attempts.at(-1)?.answer !== "4")
            assert.doesNotMatch(JSON.stringify(draft), /x\s*=\s*4/);
        }
      }
    }
  });
  it("routes every specialist through one bounded, private provider request", async () => {
    for (const agentId of agentIds) {
      const input = { agentId, context };
      let calls = 0;
      const result = await requestEducationAgent(input, config, async (url, options) => {
        calls++;
        assert.equal(url, "https://api.openai.com/v1/responses");
        const body = JSON.parse(String(options?.body));
        assert.equal(body.model, "gpt-6-astra");
        assert.equal(body.store, false);
        assert.equal(body.text.format.strict, true);
        assert.equal(body.tools, undefined);
        assert.doesNotMatch(String(options?.body), new RegExp(organizationId));
        assert.doesNotMatch(String(options?.body), /test-secret/);
        assert.equal(
          body.text.format.name,
          agentId === "analytics" ? "learning_analysis" : `education_${agentId}`,
        );
        return complete(providerBody(input));
      });
      assert.equal(calls, 1);
      assert.equal(result.ok, true);
      if (result.ok) assert.equal(result.advice.agentId, agentId);
    }
  });
  it("rejects unknown agents, invented evidence and injected context before calling the provider", async () => {
    for (const input of [
      { agentId: "unknown", context },
      { agentId: "family", context: { ...context, studentName: "private" } },
      { agentId: "family", context: { ...context, attempts: [] } },
      {
        agentId: "family",
        context: {
          ...context,
          attempts: [
            { answer: "4", hintBefore: "none" },
            { answer: "3", hintBefore: "none" },
          ],
        },
      },
      { agentId: "family", context: { ...context, attempts: [{ answer: "3", hintBefore: "ai" }] } },
    ]) {
      assert.equal(educationAgentInputSchema.safeParse(input).success, false);
      let calls = 0;
      const result = await requestEducationAgent(input as EducationAgentInput, config, async () => {
        calls++;
        return complete({});
      });
      assert.equal(result.ok, false);
      assert.equal(calls, 0);
    }
  });
  it("rejects wrong fields, fabricated references, duplicate attempts and extra properties", async () => {
    const input: EducationAgentInput = { agentId: "research", context };
    const { agentId: _, ...valid } = programmedAgentDraft(input);
    for (const body of [
      { ...valid, evidenceAttempts: [2] },
      { ...valid, evidenceAttempts: [1, 1] },
      { ...valid, sourceId: "Invented paper" },
      { ...valid, diagnosis: "invented" },
      { ...valid, fields: { ...valid.fields, question: "x".repeat(901) } },
      { ...valid, fields: { instruction: "wrong specialist" } },
    ]) {
      assert.equal(validateAgentDraft("research", body, context), null);
      assert.deepEqual(await requestEducationAgent(input, config, async () => complete(body)), {
        ok: false,
        code: "invalid_response",
      });
    }
  });
  it("keeps analytical progression constraints when dispatched through the team", async () => {
    const input: EducationAgentInput = { agentId: "analytics", context };
    const invalid = { ...guidedAnalysis(context.attempts, "es"), nextStep: "transfer_exercise" };
    assert.deepEqual(await requestEducationAgent(input, config, async () => complete(invalid)), {
      ok: false,
      code: "invalid_response",
    });
    assert.match(
      nextTrialStep(
        {
          ...context,
          attempts: Array.from({ length: 5 }, () => ({ answer: "3", hintBefore: "none" })),
        },
        "es",
      ),
      /finalizada/,
    );
  });
  it("requires a teacher membership in the requested organization", async () => {
    let calls = 0;
    const request: typeof fetch = async () => {
      calls++;
      return complete({});
    };
    for (const session of [
      null,
      { id: "user", memberships: [{ organizationId, role: "family" }] },
      { id: "user", memberships: [{ organizationId: "other", role: "teacher" }] },
    ]) {
      assert.deepEqual(
        await runEducationAgent(session, { agentId: "family", context }, config, request),
        { ok: false, code: "unauthorized" },
      );
    }
    assert.equal(calls, 0);
  });
  it("shares quotas across specialists and releases concurrency after failure", async () => {
    const limiter = createTutorLimiter();
    const input: EducationAgentInput = { agentId: "curriculum", context };
    const failed: typeof fetch = async () => {
      throw new Error("test-secret");
    };
    assert.deepEqual(await runEducationAgent(teacher, input, config, failed, limiter), {
      ok: false,
      code: "unavailable",
    });
    for (const agentId of ["evaluation", "executive", "family", "research"] as const) {
      const job = { agentId, context };
      const result = await runEducationAgent(
        teacher,
        job,
        config,
        async () => complete(providerBody(job)),
        limiter,
      );
      assert.equal(result.ok, true);
    }
    assert.deepEqual(await runEducationAgent(teacher, input, config, failed, limiter), {
      ok: false,
      code: "rate_limited",
    });
  });
  it("never turns a provider failure or refusal into a programmed success", async () => {
    for (const request of [
      async () => new Response(null, { status: 429 }),
      async () => Response.json({ status: "incomplete", output: [] }),
      async () =>
        Response.json({
          status: "completed",
          output: [{ type: "message", content: [{ type: "refusal" }] }],
        }),
    ]) {
      const result = await requestEducationAgent({ agentId: "family", context }, config, request);
      assert.equal(result.ok, false);
    }
  });
  it("only reviews pending proposals and does not approve other specialists", () => {
    const board: AgentBoard = {
      family: {
        draft: programmedAgentDraft({ agentId: "family", context }),
        source: "guided",
        review: "pending",
      },
    };
    const approved = reviewAgentDraft(board, "family", "approved");
    assert.equal(approved.family?.review, "approved");
    assert.equal(board.family?.review, "pending");
    assert.equal(reviewAgentDraft(approved, "family", "rejected"), approved);
    assert.equal(reviewAgentDraft(board, "teacher", "approved"), board);
  });
});
