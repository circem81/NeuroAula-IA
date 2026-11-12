import assert from "node:assert/strict";
import test from "node:test";
import { bookContext, readBookPage, proposeBookPage } from "./interactive-book.ts";
import {
  createMvpIds,
  emptyMvpCycle,
  mvpTwin,
  restoreMvpCycle,
  reviewMvpAssessment,
  submitMvpAnswer,
} from "./mvp-learning-cycle.ts";

const org = "22000000-0000-4000-8000-000000000001";
const at = "2026-10-29T10:00:00.000Z";

test("reading and 3D navigation never create evidence; support is frozen on submission", () => {
  const empty = emptyMvpCycle(org);
  assert.deepEqual(readBookPage(empty, "predict"), empty);
  const helped = readBookPage(empty, "explore");
  assert.equal(helped.evidence.length, 0);
  assert.equal(mvpTwin(helped, at), null);
  const submitted = submitMvpAnswer(helped, "2", createMvpIds(), at, bookContext("3d"));
  assert.equal(submitted.evidence[0].supportLevel, 2);
  assert.equal(submitted.evidence[0].reasoningQuality, null);
  assert.equal(submitted.assessments[0].reviewStatus, "pending");
  assert.equal(submitted.attempts[0].bookContext?.bookVersion, 1);
  assert.match(submitted.interactions[0].inputSummary, /neuroaula-algebra-book v1/);
  assert.equal(readBookPage(submitted, "predict").supportLevel, 2);
  assert.equal(proposeBookPage(submitted), "challenge");
  assert.throws(() => readBookPage(empty, "injected-page"));
});

test("book trace survives restore and teacher correction; proposal uses corrected result", () => {
  const submitted = submitMvpAnswer(
    emptyMvpCycle(org),
    "4",
    createMvpIds(),
    at,
    bookContext("reading"),
  );
  const reviewed = reviewMvpAssessment(submitted, {
    assessmentId: submitted.assessments[0].id,
    decision: "corrected",
    correctedScore: 0,
    note: "Revisión sintética de prueba",
    reviewer: "Docente",
    reviewId: crypto.randomUUID(),
    eventId: crypto.randomUUID(),
    evidenceId: crypto.randomUUID(),
    interactionId: crypto.randomUUID(),
    createdAt: "2026-10-29T10:01:00.000Z",
  });
  assert.equal(proposeBookPage(reviewed), "explore");
  assert.deepEqual(reviewed.evidence[0], submitted.evidence[0]);
  assert.equal(reviewed.evidence[1].supersedesEvidenceId, submitted.evidence[0].id);
  assert.deepEqual(restoreMvpCycle(JSON.parse(JSON.stringify(reviewed)), org), reviewed);
  assert.equal(restoreMvpCycle(reviewed, crypto.randomUUID()).attempts.length, 0);
  const invalid = JSON.parse(JSON.stringify(reviewed));
  invalid.attempts[0].bookContext.bookVersion = 999;
  assert.equal(restoreMvpCycle(invalid, org).attempts.length, 0);
});

test("existing cycles without book provenance remain valid", () => {
  const legacy = submitMvpAnswer(emptyMvpCycle(org), "2", createMvpIds(), at);
  assert.equal(restoreMvpCycle(JSON.parse(JSON.stringify(legacy)), org).attempts.length, 1);
  assert.equal(legacy.attempts[0].bookContext, undefined);
});
