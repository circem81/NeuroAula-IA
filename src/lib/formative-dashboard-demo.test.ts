import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { formativeDashboardDemo } from "./formative-dashboard-demo.ts";

describe("simulated formative evidence dashboard", () => {
  it("links all example criteria to explicit observations and next steps", () => {
    for (const sample of Object.values(formativeDashboardDemo)) {
      if (!sample) continue;
      assert.ok(sample.criteria.length > 0);
      assert.ok(sample.evolution.length > 0);
      assert.ok(sample.strengths.length > 0);
      assert.ok(sample.opportunities.length > 0);
      for (const criterion of sample.criteria) {
        assert.match(criterion.id, /^DEMO-/);
        assert.ok(criterion.competency.trim());
        assert.ok(criterion.evidence.trim());
        assert.ok(criterion.support.trim());
        assert.ok(criterion.nextStep.trim());
      }
    }
  });

  it("never treats unverified assisted practice as teacher validation", () => {
    for (const sample of Object.values(formativeDashboardDemo)) {
      if (!sample) continue;
      for (const criterion of sample.criteria) {
        if (criterion.status === "teacher_validated") {
          assert.equal(criterion.context, "supervised");
        }
      }
    }
  });
});
