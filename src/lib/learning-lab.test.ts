import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { algebraPuzzles, mathStoryPages, retrieveDemoSupport } from "./learning-lab.ts";

describe("no-cost learning lab", () => {
  it("provides three self-contained math story pages", () => {
    assert.equal(mathStoryPages.length, 3);
    for (const page of mathStoryPages) {
      assert.equal(page.question.choices.length, 3);
      assert.ok(page.question.correctIndex >= 0);
      assert.ok(page.question.correctIndex <= 2);
    }
  });

  it("provides valid algebra transformations for each puzzle", () => {
    assert.equal(algebraPuzzles.length, 3);
    for (const level of algebraPuzzles) {
      assert.ok(level.steps.length >= 1);
      for (const step of level.steps) {
        assert.equal(step.moves.filter((move) => move.correct).length, 1);
      }
    }
  });

  it("separates mathematical prerequisites from teacher preferences", () => {
    const guided = retrieveDemoSupport("one-sided", "guided");
    const direct = retrieveDemoSupport("one-sided", "direct");
    assert.equal(guided.retrievedRule, direct.retrievedRule);
    assert.notEqual(guided.recommendation, direct.recommendation);
  });

  it("declares uncertainty and requires teacher review", () => {
    const output = retrieveDemoSupport("inverse", "guided");
    assert.match(output.uncertainty, /No se han recuperado estudios científicos/);
    assert.match(output.status, /revisión docente/);
  });
});
