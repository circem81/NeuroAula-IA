import test from "node:test";
import assert from "node:assert/strict";
import { z } from "zod";
import {
  createModelGateway,
  MODEL_GATEWAY_CONFIG,
  requestEducationalModel,
  type EducationalModelAdapter,
  type EducationalAgentSpec,
} from "./model-gateway.server.ts";

const schema = z.object({ hint: z.string().max(100) }).strict();
const spec = {
  name: "test",
  instructions: "Use task facts only",
  input: { correct: true },
  jsonSchema: { type: "object" },
  outputSchema: schema,
};

test("provider adapter validates output and cannot mutate caller evidence", async () => {
  const adapter: EducationalModelAdapter = {
    async generate<T>(request: EducationalAgentSpec<T>) {
      (request.input as { correct: boolean }).correct = false;
      return { ok: true, advice: { hint: "Check both sides" } as T };
    },
  };
  const result = await createModelGateway(adapter)(spec, {});
  assert.deepEqual(result, { ok: true, advice: { hint: "Check both sides" } });
  assert.equal(spec.input.correct, true);
});

test("gateway rejects invalid output from a new adapter", async () => {
  const adapter: EducationalModelAdapter = {
    async generate<T>() {
      return { ok: true, advice: { diagnosis: "unsupported" } as T };
    },
  };
  assert.deepEqual(await createModelGateway(adapter)(spec, {}), {
    ok: false,
    code: "invalid_response",
  });
});

test("gateway refuses oversized input before provider invocation", async () => {
  const adapter: EducationalModelAdapter = {
    async generate() {
      assert.fail("Provider should not run");
    },
  };
  assert.deepEqual(
    await createModelGateway(adapter)(
      { ...spec, input: "x".repeat(MODEL_GATEWAY_CONFIG.maxInputBytes) },
      {},
    ),
    { ok: false, code: "invalid_response" },
  );
});

test("gateway preserves explicit failures and sanitizes exceptions without fallback", async () => {
  let calls = 0;
  const adapter: EducationalModelAdapter = {
    async generate() {
      calls++;
      throw new Error("private configuration");
    },
  };
  assert.deepEqual(await createModelGateway(adapter)(spec, {}), { ok: false, code: "unavailable" });
  assert.equal(calls, 1);
  assert.deepEqual(
    await requestEducationalModel(spec, {}, async () => {
      assert.fail("Missing credentials must not trigger a request");
    }),
    { ok: false, code: "not_configured" },
  );
});
