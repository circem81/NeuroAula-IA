import test from "node:test";
import assert from "node:assert/strict";
import {
  buildLearningTwin,
  validateEvidence,
  twinTeacherReport,
  type LearningEvidence,
} from "./learning-twin.ts";
import { evaluateTutorEvidence, tutorLearningTwin } from "./learning-twin-demo.ts";
import { emptyTutorState, guidedAdvice, updateTutor } from "./tutor.ts";

const org = "00000000-0000-4000-8000-000000000001";
const now = "2026-09-21T10:00:00.000Z";
function evidence(n: number, patch: Partial<LearningEvidence> = {}): LearningEvidence {
  return {
    id: `00000000-0000-4000-8000-${String(n).padStart(12, "0")}`,
    organizationId: org,
    studentId: org,
    activityId: `task-${n}`,
    criterionId: "ALG-01",
    subject: "mathematics",
    correct: true,
    reasoningQuality: 1,
    supportLevel: 0,
    transferLevel: 3,
    attempts: 1,
    errorType: null,
    strategies: [],
    evaluatorConfidence: 1,
    previousEvidenceId: null,
    createdAt: new Date(Date.parse(now) - (30 - n) * 86400000).toISOString(),
    ...patch,
  };
}
const twin = (items: LearningEvidence[], date = now) => buildLearningTwin(items, date)!;

test("1: correct independent answer raises mastery", () =>
  assert.ok(twin([evidence(1)]).state.mastery > 0));
test("2: fully directed success raises mastery less", () =>
  assert.ok(
    twin([evidence(1)]).state.mastery > twin([evidence(1, { supportLevel: 5 })]).state.mastery,
  ));
test("3: partial reasoning differs from an unreasoned wrong answer", () =>
  assert.ok(
    twin([evidence(1, { correct: false, reasoningQuality: 0.6 })]).state.mastery >
      twin([evidence(1, { correct: false, reasoningQuality: 0 })]).state.mastery,
  ));
test("4: three excellent pieces cannot give high confidence", () =>
  assert.ok(twin([1, 2, 3].map((n) => evidence(n))).state.confidence < 0.2));
test("5: many consistent independent activities raise confidence", () => {
  const many = twin(Array.from({ length: 20 }, (_, i) => evidence(i + 1)));
  assert.ok(many.state.confidence > 0.7);
  assert.ok(many.state.confidence > twin([evidence(1)]).state.confidence);
});
test("6: recurring errors require activity diversity and time for consistent pattern", () => {
  const error = (n: number) => evidence(n, { correct: false, errorType: "unit_error" });
  assert.equal(twin([1, 2, 3].map(error)).errorPatterns[0].status, "emerging_pattern");
  assert.equal(
    twin([1, 5, 9, 13, 17, 21].map(error)).errorPatterns[0].status,
    "consistent_pattern",
  );
  assert.equal(
    twin([1, 2, 3, 4, 5, 6].map((n) => ({ ...error(n), activityId: "one" }))).errorPatterns[0]
      .status,
    "observed",
  );
});
test("7: paired improvement updates the particular support, without inventing an unpaired gain", () => {
  const before = evidence(1, { correct: false, reasoningQuality: 0 });
  const after = evidence(2, {
    activityId: before.activityId,
    attempts: 2,
    supportLevel: 2,
    previousEvidenceId: before.id,
  });
  const result = twin([before, after]).supportEffectiveness[0];
  assert.equal(result.meanCorrectnessChange, 1);
  assert.equal(result.pairedCount, 1);
  assert.equal(
    twin([{ ...after, previousEvidenceId: null }]).supportEffectiveness[0].meanCorrectnessChange,
    null,
  );
});
test("8: same final answer, different process, different Learning Twin", () => {
  assert.notEqual(
    twin([evidence(1)]).state.mastery,
    twin([evidence(1, { supportLevel: 5, attempts: 4, reasoningQuality: 0.2 })]).state.mastery,
  );
});
test("confidence decays; mastery and evidence stay unchanged", () => {
  const facts = [evidence(1), evidence(2)];
  const a = twin(facts),
    b = twin(facts, "2027-09-21T10:00:00.000Z");
  assert.equal(a.state.mastery, b.state.mastery);
  assert.ok(b.state.confidence < a.state.confidence / 2);
  assert.deepEqual(a.evidence, b.evidence);
  assert.equal(b.state.trend, "insufficient_evidence");
});
test("duplicates are idempotent, conflicting facts and mixed scopes rejected", () => {
  const e = evidence(1);
  assert.deepEqual(twin([e, e]), twin([e]));
  assert.throws(() => twin([e, { ...e, correct: false }]));
  for (const field of ["organizationId", "studentId", "criterionId"] as const)
    assert.throws(() =>
      twin([e, evidence(2, { [field]: "00000000-0000-4000-8000-000000000099" })]),
    );
  assert.throws(() => twin([evidence(1, { createdAt: "2030-01-01T00:00:00.000Z" })]));
});
test("late arrival replays in timestamp order and retries cannot inflate confidence", () => {
  assert.deepEqual(
    twin([evidence(3), evidence(1), evidence(2)]),
    twin([evidence(1), evidence(2), evidence(3)]),
  );
  const repeated = Array.from({ length: 20 }, (_, i) =>
    evidence(i + 1, { activityId: "same-task", attempts: i + 1 }),
  );
  assert.ok(twin(repeated).state.confidence < 0.06);
});
test("invalid evaluations, pair reuse, self pairs and unknown errors fail", () => {
  assert.throws(() => validateEvidence(evidence(1, { supportLevel: 6 })));
  assert.throws(() => validateEvidence(evidence(1, { evaluatorConfidence: NaN })));
  assert.throws(() => validateEvidence(evidence(1, { errorType: "diagnosis" })));
  const e = evidence(1);
  assert.throws(() => twin([{ ...e, previousEvidenceId: e.id }]));
  assert.throws(() => twin([e, evidence(2, { previousEvidenceId: e.id })]));
});
test("zero evaluator reliability cannot increase mastery or confidence", () => {
  const s = twin([evidence(1, { evaluatorConfidence: 0 })]).state;
  assert.equal(s.mastery, 0);
  assert.equal(s.confidence, 0);
});
test("laboratory evaluates frozen support at answer time, with no invented reasoning", () => {
  let state = updateTutor(emptyTutorState(), { type: "answer", answer: "2" });
  state = updateTutor(state, {
    type: "propose",
    advice: guidedAdvice(["2"], 1, "es"),
    source: "guided",
  });
  state = updateTutor(state, { type: "review", decision: "approved" });
  state = updateTutor(state, { type: "answer", answer: "4" });
  const facts = evaluateTutorEvidence(state, org);
  assert.deepEqual(
    facts.map((e) => e.supportLevel),
    [0, 2],
  );
  assert.equal(facts[1].reasoningQuality, null);
  assert.equal(facts[1].errorType, null);
  const result = tutorLearningTwin(state, org, "2030-01-01T00:00:00.000Z")!;
  assert.equal(result.supportEffectiveness[0].pairedCount, 1);
  assert.equal(twinTeacherReport(result).state, "Evidencia todavía insuficiente");
});
test("legacy trials do not acquire fictitious dates or evidence", () => {
  assert.deepEqual(
    evaluateTutorEvidence({ version: 1, runs: [{ answer: "2", proposal: null }] }, org),
    [],
  );
});
