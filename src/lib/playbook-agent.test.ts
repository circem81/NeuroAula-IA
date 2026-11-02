import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  PLAYBOOK_DEMO_ACTIVITY_ID,
  runPlaybookAgent,
} from "./playbook-agent.ts";

describe("playbook demo agent", () => {
  it("checks a correct answer and retains it for teacher review", () => {
    const result = runPlaybookAgent({ activityId: PLAYBOOK_DEMO_ACTIVITY_ID, answer: "−10" });
    assert.equal(result.status, "pending_teacher_review");
    assert.equal(result.comparison, "correct");
    assert.equal(result.observedAnswer, -10);
    assert.equal(result.checks.length, 8);
    assert.equal(result.checks.every((check) => check.passed), true);
    assert.equal(result.review.publicationEnabled, false);
  });

  it("reports an incorrect answer without diagnosing a student", () => {
    const result = runPlaybookAgent({ activityId: PLAYBOOK_DEMO_ACTIVITY_ID, answer: "−16" });
    assert.equal(result.status, "pending_teacher_review");
    assert.equal(result.comparison, "incorrect");
    assert.match(result.feedbackProposal ?? "", /restar.*sumar 3/i);
    assert.doesNotMatch(result.feedbackProposal ?? "", /TDAH|dislexia|diagnóstico/i);
  });

  it("refuses malformed and empty answers", () => {
    for (const answer of ["", "dos", "3+4", "100000", "0; alert(1)"]) {
      const result = runPlaybookAgent({ activityId: PLAYBOOK_DEMO_ACTIVITY_ID, answer });
      assert.equal(result.status, "needs_input");
      assert.equal(result.comparison, "unavailable");
      assert.equal(result.feedbackProposal, null);
      assert.equal(result.review.publicationEnabled, false);
      assert.equal(result.checks.find((c) => c.id === "input")?.passed, false);
    }
  });

  it("rejects an unknown activity instead of fabricating a criterion", () => {
    const result = runPlaybookAgent({ activityId: "unknown", answer: "-10" });
    assert.equal(result.status, "needs_input");
    assert.equal(result.evidenceRefs.length, 0);
    assert.equal(result.feedbackProposal, null);
  });

  it("normalizes a Unicode minus and surrounding whitespace transparently", () => {
    const result = runPlaybookAgent({
      activityId: PLAYBOOK_DEMO_ACTIVITY_ID,
      answer: "  −10  ",
    });
    assert.equal(result.observedAnswer, -10);
    assert.equal(result.corrections.length, 1);
  });
});
