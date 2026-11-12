import test from "node:test";
import assert from "node:assert/strict";
import {
  createConversationMemory,
  CONVERSATION_MEMORY_CONFIG,
  type ConversationScope,
} from "./conversation-memory.server.ts";

const id = "00000000-0000-4000-8000-000000000001";
const other = "00000000-0000-4000-8000-000000000002";
const scope: ConversationScope = {
  organizationId: id,
  actorId: id,
  studentId: id,
  role: "teacher",
  conversationId: id,
  criterionId: "ALG-01",
};
const fact = {
  activityCode: "linear-equation-v1",
  attempts: 1,
  outcome: "correct" as const,
  supportLevel: 0,
};

test("memory is isolated by organization, actor, learner, role, conversation and criterion", () => {
  const memory = createConversationMemory();
  memory.append(scope, true, fact);
  for (const field of [
    "organizationId",
    "actorId",
    "studentId",
    "conversationId",
    "criterionId",
  ] as const)
    assert.deepEqual(memory.read({ ...scope, [field]: other }, true), []);
  assert.deepEqual(memory.read({ ...scope, role: "student" }, true), []);
  assert.deepEqual(memory.read(scope, true), [fact]);
});

test("memory requires explicit opt-in and erases the scope when revoked", () => {
  const memory = createConversationMemory();
  assert.equal(memory.append(scope, false, fact), false);
  assert.deepEqual(memory.read(scope, true), []);
  memory.append(scope, true, fact);
  assert.deepEqual(memory.read(scope, false), []);
  assert.deepEqual(memory.read(scope, true), []);
});

test("memory expires without sliding retention and bounds facts", () => {
  let now = 0;
  const memory = createConversationMemory(() => now);
  for (let i = 1; i <= 10; i++) memory.append(scope, true, { ...fact, attempts: i });
  assert.deepEqual(
    memory.read(scope, true).map((f) => f.attempts),
    [5, 6, 7, 8, 9, 10],
  );
  now = CONVERSATION_MEMORY_CONFIG.ttlMs - 1;
  memory.append(scope, true, fact);
  assert.equal(memory.read(scope, true).length, 6);
  now++;
  assert.deepEqual(memory.read(scope, true), []);
});

test("memory cannot be mutated through returned references, rejects transcript fields and supports logout erasure", () => {
  const memory = createConversationMemory();
  memory.append(scope, true, fact);
  memory.read(scope, true)[0].attempts = 99;
  assert.equal(memory.read(scope, true)[0].attempts, 1);
  assert.throws(() =>
    memory.append(scope, true, { ...fact, transcript: "private text" } as typeof fact),
  );
  memory.append({ ...scope, actorId: other }, true, fact);
  memory.forgetActor(id);
  assert.deepEqual(memory.read(scope, true), []);
  assert.deepEqual(memory.read({ ...scope, actorId: other }, true), [fact]);
});

test("memory capacity fails closed and expiry recovers capacity", () => {
  let now = 0;
  const memory = createConversationMemory(() => now);
  for (let i = 0; i < CONVERSATION_MEMORY_CONFIG.maxScopes; i++)
    assert.equal(memory.append({ ...scope, criterionId: `criterion-${i}` }, true, fact), true);
  assert.equal(memory.append(scope, true, fact), false);
  now = CONVERSATION_MEMORY_CONFIG.ttlMs;
  assert.equal(memory.append(scope, true, fact), true);
});
