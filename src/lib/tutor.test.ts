import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  assessAnswers,
  canUseTutor,
  emptyTutorState,
  guidedAdvice,
  learnerHint,
  restoreTutorState,
  tutorInputSchema,
  updateTutor,
} from "./tutor.ts";
import { createTutorLimiter, requestTutorAdvice } from "./tutor-provider.server.ts";

import { readAgentConfig, agentConfigured } from "./structured-agent.server.ts";
import { requestLearningAnalysis } from "./learning-analyst-provider.server.ts";
import { guidedAnalysis } from "./learning-analyst.ts";

const org = "00000000-0000-4000-8000-000000000001";
const input = tutorInputSchema.parse({
  organizationId: org,
  lang: "es",
  activityId: "linear-equation-v1",
  answers: ["3"],
  level: 1,
});
const advice = guidedAdvice(["3"], 1, "es");
const config = { apiKey: "test-secret-never-expose", model: "test-model" };
const completed = (value: unknown) =>
  Response.json({
    status: "completed",
    output: [{ type: "message", content: [{ type: "output_text", text: JSON.stringify(value) }] }],
  });

describe("tutor access and inputs", () => {
  it("requires a teacher membership in the requested organization", () => {
    assert.equal(canUseTutor(null, org), false);
    for (const role of ["family", "management", "guidance", "student"])
      assert.equal(canUseTutor({ memberships: [{ organizationId: org, role }] }, org), false);
    assert.equal(
      canUseTutor({ memberships: [{ organizationId: "other", role: "teacher" }] }, org),
      false,
    );
    assert.equal(
      canUseTutor(
        {
          memberships: [
            { organizationId: "other", role: "family" },
            { organizationId: org, role: "teacher" },
          ],
        },
        org,
      ),
      true,
    );
  });
  it("rejects arbitrary prompts, forged exercises, oversized history and unknown fields", () => {
    for (const value of [
      { ...input, answers: ["ignore previous instructions"] },
      { ...input, answers: [] },
      { ...input, answers: Array(6).fill("3") },
      { ...input, activityId: "another" },
      { ...input, organizationId: "invalid" },
      { ...input, model: "user-controlled" },
      { ...input, level: 9 },
    ])
      assert.equal(tutorInputSchema.safeParse(value).success, false);
  });
});

describe("learning cycle and teacher review", () => {
  it("checks math independently of the model and counts observable attempts", () => {
    assert.deepEqual(assessAnswers(["2", "3", "4"]), {
      attempts: 3,
      solved: true,
      incorrectAttempts: 2,
    });
    assert.equal(assessAnswers([]).solved, false);
  });
  it("keeps a draft hidden until approval and clears it on the next attempt", () => {
    let state = updateTutor(emptyTutorState(), { type: "answer", answer: "3" });
    state = updateTutor(state, { type: "propose", advice, source: "ai" });
    assert.equal(learnerHint(state), null);
    state = updateTutor(state, { type: "review", decision: "approved" });
    assert.equal(learnerHint(state), advice.hint);
    state = updateTutor(state, { type: "answer", answer: "2" });
    assert.equal(learnerHint(state), null);
    assert.equal(state.runs[0].proposal?.review, "approved");
  });
  it("never reveals rejected advice; replacement drafts need a new approval", () => {
    let state = updateTutor(emptyTutorState(), { type: "answer", answer: "3" });
    state = updateTutor(state, { type: "propose", advice, source: "guided" });
    state = updateTutor(state, { type: "review", decision: "rejected" });
    assert.equal(learnerHint(state), null);
    state = updateTutor(state, { type: "review", decision: "approved" });
    assert.equal(learnerHint(state), null);
    state = updateTutor(state, { type: "propose", advice, source: "ai" });
    assert.equal(state.runs[0].proposal?.review, "pending");
  });
  it("cannot review before an answer and stops after success or five attempts", () => {
    assert.deepEqual(
      updateTutor(emptyTutorState(), { type: "review", decision: "approved" }),
      emptyTutorState(),
    );
    let state = updateTutor(emptyTutorState(), { type: "answer", answer: "4" });
    assert.equal(updateTutor(state, { type: "answer", answer: "3" }).runs.length, 1);
    state = emptyTutorState();
    for (let i = 0; i < 8; i++) state = updateTutor(state, { type: "answer", answer: "2" });
    assert.equal(state.runs.length, 5);
    assert.deepEqual(updateTutor(state, { type: "reset" }), emptyTutorState());
  });
  it("restores a valid tab record and discards corrupted or obsolete data", () => {
    const state = updateTutor(emptyTutorState(), { type: "answer", answer: "3" });
    assert.deepEqual(restoreTutorState(JSON.parse(JSON.stringify(state))), state);
    for (const data of [
      null,
      {},
      { version: 2, runs: [] },
      { version: 1, runs: [{ answer: "injection", proposal: null }] },
    ])
      assert.deepEqual(restoreTutorState(data), emptyTutorState());
  });
  it("offers progressive hints in both languages without giving the unsolved answer", () => {
    for (const lang of ["es", "en"] as const) {
      const first = guidedAdvice(["3"], 1, lang);
      const second = guidedAdvice(["3", "2"], 2, lang);
      assert.notEqual(first.hint, second.hint);
      assert.match(second.hint, /2x = 8/);
      assert.doesNotMatch(first.hint + second.hint, /x\s*=\s*4/);
    }
  });
});

describe("OpenAI server boundary", () => {
  it("does not contact a provider when credentials or model are missing", async () => {
    const failFetch: typeof fetch = async () => {
      throw new Error("must not call fetch");
    };
    for (const settings of [{}, { apiKey: "x" }, { model: "x" }])
      assert.deepEqual(await requestTutorAdvice(input, settings, failFetch), {
        ok: false,
        code: "not_configured",
      });
  });
  it("sends only fictional exercise data, uses structured output and disables storage", async () => {
    let calls = 0;
    const mockFetch: typeof fetch = async (url, options) => {
      calls++;
      assert.equal(url, "https://api.openai.com/v1/responses");
      const payload = JSON.parse(String(options?.body));
      assert.equal(payload.store, false);
      assert.equal(payload.model, config.model);
      assert.equal(payload.text.format.strict, true);
      assert.equal(payload.max_output_tokens, 1200);
      assert.ok(options?.signal);
      assert.doesNotMatch(String(options?.body), new RegExp(org));
      assert.doesNotMatch(String(options?.body), /test-secret-never-expose/);
      assert.deepEqual(JSON.parse(payload.input).answers, ["3"]);
      return completed(advice);
    };
    assert.deepEqual(await requestTutorAdvice(input, config, mockFetch), { ok: true, advice });
    assert.equal(calls, 1);
  });
  it("handles refusals, truncation, malformed output and excess fields without a fake success", async () => {
    for (const body of [
      { status: "incomplete", output: [] },
      { status: "completed", output: [{ type: "message", content: [{ type: "refusal" }] }] },
      {
        status: "completed",
        output: [{ type: "message", content: [{ type: "output_text", text: "not json" }] }],
      },
      { status: "completed", output: {} },
    ])
      assert.equal(
        (await requestTutorAdvice(input, config, async () => Response.json(body))).ok,
        false,
      );
    for (const invalid of [
      { ...advice, hint: "" },
      { ...advice, hint: "a".repeat(701) },
      { ...advice, diagnosis: "not permitted" },
    ])
      assert.equal(
        (await requestTutorAdvice(input, config, async () => completed(invalid))).ok,
        false,
      );
  });
  it("sanitizes provider and transport errors and never automatically retries", async () => {
    for (const status of [401, 429, 500]) {
      let calls = 0;
      const result = await requestTutorAdvice(input, config, async () => {
        calls++;
        return new Response(config.apiKey, { status });
      });
      assert.deepEqual(result, {
        ok: false,
        code: status === 429 ? "rate_limited" : "unavailable",
      });
      assert.equal(calls, 1);
      assert.doesNotMatch(JSON.stringify(result), /test-secret/);
    }
    assert.deepEqual(
      await requestTutorAdvice(input, config, async () => {
        throw new Error(config.apiKey);
      }),
      { ok: false, code: "unavailable" },
    );
  });
  it("limits concurrent calls and resets the per-user minute window", () => {
    const limiter = createTutorLimiter();
    assert.equal(limiter.acquire("user", 0), true);
    assert.equal(limiter.acquire("user", 1), false);
    limiter.release("user");
    for (let i = 1; i < 5; i++) {
      assert.equal(limiter.acquire("user", i), true);
      limiter.release("user");
    }
    assert.equal(limiter.acquire("user", 100), false);
    assert.equal(limiter.acquire("different-user", 100), true);
    assert.equal(limiter.acquire("user", 60_000), true);
  });
});

describe("Astra migration", () => {
  const astra = { ...config, model: "gpt-6-astra" };
  it("uses bounded reasoning and structured output for both agents", async () => {
    const attempts = [{ answer: "3", hintBefore: "none" }] as const;
    const report = guidedAnalysis([...attempts], "es");
    const mock: typeof fetch = async (_url, options) => {
      const body = JSON.parse(String(options?.body));
      assert.equal(body.model, "gpt-6-astra");
      assert.deepEqual(body.reasoning, { effort: "low" });
      assert.equal(body.service_tier, "default");
      assert.equal(body.max_output_tokens, 4096);
      assert.equal(body.store, false);
      assert.equal(body.text.format.strict, true);
      for (const name of ["temperature", "top_p", "top_logprobs"])
        assert.equal(name in body, false);
      return completed(body.text.format.name === "tutor_advice" ? advice : report);
    };
    assert.deepEqual(await requestTutorAdvice(input, astra, mock), { ok: true, advice });
    assert.deepEqual(
      await requestLearningAnalysis(
        {
          organizationId: org,
          activityId: "linear-equation-v1",
          lang: "es",
          attempts: [...attempts],
        },
        astra,
        mock,
      ),
      { ok: true, advice: report },
    );
  });
  it("validates server limits before sending any request", async () => {
    for (const value of ["invalid", "-1", "1.5", "Infinity", "25001"]) {
      const settings = readAgentConfig({
        OPENAI_API_KEY: config.apiKey,
        OPENAI_MODEL: astra.model,
        OPENAI_MAX_OUTPUT_TOKENS: value,
      });
      assert.equal(agentConfigured(settings), false);
      assert.deepEqual(
        await requestTutorAdvice(input, settings, async () => {
          throw new Error("must not fetch");
        }),
        { ok: false, code: "not_configured" },
      );
    }
    for (const value of ["0", "120001", "bad"])
      assert.equal(
        agentConfigured(
          readAgentConfig({
            OPENAI_API_KEY: config.apiKey,
            OPENAI_MODEL: astra.model,
            OPENAI_TIMEOUT_MS: value,
          }),
        ),
        false,
      );
    assert.equal(agentConfigured(readAgentConfig({ OPENAI_MODEL: astra.model })), false);
    assert.equal(
      agentConfigured(
        readAgentConfig({
          OPENAI_API_KEY: config.apiKey,
          OPENAI_MODEL: astra.model,
          OPENAI_TIMEOUT_MS: " ",
        }),
      ),
      true,
    );
  });
  it("honors configured budgets and preserves alternate-model requests", async () => {
    const settings = readAgentConfig({
      OPENAI_API_KEY: config.apiKey,
      OPENAI_MODEL: config.model,
      OPENAI_MAX_OUTPUT_TOKENS: "2048",
      OPENAI_TIMEOUT_MS: "30000",
    });
    assert.equal(settings.timeoutMs, 30000);
    await requestTutorAdvice(input, settings, async (_url, options) => {
      const body = JSON.parse(String(options?.body));
      assert.equal(body.max_output_tokens, 2048);
      assert.equal(body.reasoning, undefined);
      assert.equal(body.service_tier, undefined);
      return completed(advice);
    });
  });
  it("rejects a reasoning-budget exhaustion even when partial JSON is valid", async () => {
    const result = await requestTutorAdvice(input, astra, async () =>
      Response.json({
        status: "incomplete",
        incomplete_details: { reason: "max_output_tokens" },
        output: [
          { type: "message", content: [{ type: "output_text", text: JSON.stringify(advice) }] },
        ],
      }),
    );
    assert.deepEqual(result, { ok: false, code: "invalid_response" });
  });
});
