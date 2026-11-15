import test from "node:test";
import assert from "node:assert/strict";
import {
  algebraStages,
  assessAlgebraAction,
  summarizeAlgebraEvidence,
  type AlgebraEvent,
} from "./algebra-balance.ts";

test("la representación concreta coincide con las tres igualdades", () => {
  assert.equal(algebraStages[0].left.boxes * 4 + algebraStages[0].left.tokens, 11);
  assert.equal(algebraStages[1].left.boxes * 4 + algebraStages[1].left.tokens, 8);
  assert.equal(algebraStages[2].left.boxes * 4 + algebraStages[2].left.tokens, 4);
  for (const stage of algebraStages) {
    assert.equal(stage.left.boxes * 4 + stage.left.tokens, stage.right.tokens);
  }
});

test("solo las dos operaciones inversas prioritarias avanzan de fase", () => {
  assert.equal(assessAlgebraAction(0, "subtract-three-both"), "advance");
  assert.equal(assessAlgebraAction(1, "divide-two-both"), "advance");
});

test("alterar solo un miembro nunca se considera una operación válida", () => {
  assert.equal(assessAlgebraAction(0, "subtract-three-left"), "imbalance");
  assert.equal(assessAlgebraAction(1, "divide-two-left"), "imbalance");
});

test("transformaciones válidas no prioritarias no se etiquetan erróneamente como desequilibrio", () => {
  assert.equal(assessAlgebraAction(0, "divide-two-both"), "detour");
  assert.equal(assessAlgebraAction(0, "add-three-both"), "detour");
  assert.equal(assessAlgebraAction(1, "subtract-three-both"), "detour");
  assert.equal(assessAlgebraAction(1, "add-two-both"), "detour");
});

test("el resumen describe acciones observables y da prioridad al desequilibrio", () => {
  const events: AlgebraEvent[] = [
    { step: 0, action: "subtract-three-left", outcome: "imbalance", hintUsed: false },
    { step: 0, action: "subtract-three-both", outcome: "advance", hintUsed: true },
    { step: 1, action: "divide-two-both", outcome: "advance", hintUsed: false },
  ];
  assert.deepEqual(summarizeAlgebraEvidence(events, 1), {
    attempts: 3,
    completedSteps: 2,
    imbalanceCount: 1,
    detourCount: 0,
    hintsViewed: 1,
    signal: "balance",
  });
});

test("sin desequilibrios, las pistas y desvíos orientan refuerzo, no diagnóstico", () => {
  assert.equal(summarizeAlgebraEvidence([], 1).signal, "inverse");
  assert.equal(summarizeAlgebraEvidence([], 0).signal, "pending");
  assert.equal(summarizeAlgebraEvidence([
    { step: 0, action: "subtract-three-both", outcome: "advance", hintUsed: false },
    { step: 1, action: "divide-two-both", outcome: "advance", hintUsed: false },
  ], 0).signal, "extend");
  const events: AlgebraEvent[] = [
    { step: 0, action: "divide-two-both", outcome: "detour", hintUsed: false },
  ];
  assert.equal(summarizeAlgebraEvidence(events, 0).signal, "inverse");
});
