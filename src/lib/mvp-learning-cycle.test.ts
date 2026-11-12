import assert from "node:assert/strict";
import test from "node:test";
import {
  emptyMvpCycle,
  mvpTwin,
  requestMvpHint,
  restoreMvpCycle,
  reviewMvpAssessment,
  submitMvpAnswer,
  type MvpIds,
} from "./mvp-learning-cycle.ts";

const organizationId = "22000000-0000-4000-8000-000000000001";
const at = "2026-09-22T10:00:00.000Z";
const uuid = (n: number) => `22000000-0000-4000-8000-${String(n).padStart(12, "0")}`;
function ids(start: number): MvpIds {
  return {
    attemptId: uuid(start),
    assessmentId: uuid(start + 1),
    evidenceId: uuid(start + 2),
    eventId: uuid(start + 3),
    recommendationId: uuid(start + 4),
    interactionIds: [
      uuid(start + 5),
      uuid(start + 6),
      uuid(start + 7),
      uuid(start + 8),
      uuid(start + 9),
    ],
  };
}

test("complete deterministic cycle records attempt, assessment, evidence, Twin, recommendation and audit", () => {
  const state = submitMvpAnswer(emptyMvpCycle(organizationId), "4", ids(1), at);
  assert.equal(state.attempts.length, 1);
  assert.equal(state.assessments[0].score, 100);
  assert.equal(state.assessments[0].requiresHumanReview, true);
  assert.deepEqual(state.assessments[0].misconceptions, []);
  assert.equal(state.evidence.length, 1);
  assert.equal(state.events[0].evidenceId, state.evidence[0].id);
  assert.equal(state.recommendations.length, 1);
  assert.deepEqual(
    state.interactions.map((item) => item.agent),
    ["student", "evaluation", "evidence_store", "learning_twin", "recommendation"],
  );
  assert.equal(mvpTwin(state, at)?.state.evidenceCount, 1);
});

test("progressive help is frozen on the next answer and causes no invented reasoning", () => {
  let state = requestMvpHint(emptyMvpCycle(organizationId));
  assert.equal(state.supportLevel, 2);
  state = requestMvpHint(state);
  assert.equal(state.supportLevel, 4);
  state = submitMvpAnswer(state, "2", ids(20), at);
  assert.equal(state.evidence[0].supportLevel, 4);
  assert.equal(state.evidence[0].reasoningQuality, null);
  assert.equal(state.evidence[0].errorType, null);
  assert.match(state.assessments[0].evidenceSummary, /causa no se ha observado/);
});

test("teacher approval is traced once and does not rewrite evidence", () => {
  const submitted = submitMvpAnswer(emptyMvpCycle(organizationId), "4", ids(40), at);
  const reviewed = reviewMvpAssessment(submitted, {
    assessmentId: submitted.assessments[0].id,
    decision: "approved",
    note: "Comprobado con la actividad.",
    reviewer: "Docente",
    reviewId: uuid(60),
    eventId: uuid(61),
    interactionId: uuid(62),
    createdAt: "2026-09-22T10:01:00.000Z",
  });
  assert.equal(reviewed.assessments[0].reviewStatus, "approved");
  assert.deepEqual(reviewed.evidence, submitted.evidence);
  assert.equal(reviewed.reviews.length, 1);
  assert.equal(reviewed.events.at(-1)?.type, "human_review");
  assert.equal(
    reviewMvpAssessment(reviewed, {
      assessmentId: reviewed.assessments[0].id,
      decision: "approved",
      note: "Duplicada",
      reviewer: "Docente",
      reviewId: uuid(63),
      eventId: uuid(64),
      interactionId: uuid(65),
      createdAt: "2026-09-22T10:02:00.000Z",
    }),
    reviewed,
  );
});

test("teacher correction preserves original evidence and replaces it in the effective Twin", () => {
  const submitted = submitMvpAnswer(emptyMvpCycle(organizationId), "2", ids(70), at);
  const original = submitted.evidence[0];
  const reviewed = reviewMvpAssessment(submitted, {
    assessmentId: submitted.assessments[0].id,
    decision: "corrected",
    correctedScore: 100,
    note: "La clave configurada no correspondía a la versión mostrada.",
    reviewer: "Docente",
    reviewId: uuid(90),
    eventId: uuid(91),
    evidenceId: uuid(92),
    interactionId: uuid(93),
    createdAt: "2026-09-22T10:03:00.000Z",
  });
  assert.equal(reviewed.evidence.length, 2);
  assert.deepEqual(reviewed.evidence[0], original);
  assert.equal(reviewed.evidence[1].supersedesEvidenceId, original.id);
  assert.equal(reviewed.evidence[1].evaluatorConfidence, 1);
  const twin = mvpTwin(reviewed, "2026-09-22T10:03:00.000Z")!;
  assert.equal(twin.state.evidenceCount, 1);
  assert.equal(twin.evidence[0].id, reviewed.evidence[1].id);
});

test("cycle stops after success or five attempts and restores only the active organization", () => {
  const solved = submitMvpAnswer(emptyMvpCycle(organizationId), "4", ids(100), at);
  assert.equal(submitMvpAnswer(solved, "2", ids(120), "2026-09-22T10:01:00.000Z"), solved);
  let exhausted = emptyMvpCycle(organizationId);
  for (let n = 0; n < 6; n++)
    exhausted = submitMvpAnswer(
      exhausted,
      "2",
      ids(200 + n * 10),
      new Date(Date.parse(at) + n * 1000).toISOString(),
    );
  assert.equal(exhausted.attempts.length, 5);
  assert.deepEqual(restoreMvpCycle(exhausted, organizationId), exhausted);
  assert.equal(restoreMvpCycle(exhausted, uuid(999)).attempts.length, 0);
  assert.equal(restoreMvpCycle({ bad: true }, organizationId).attempts.length, 0);
});
