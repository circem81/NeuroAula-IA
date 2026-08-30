import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { adaptiveActivity, latestActivities, recentAlerts, students } from "./demo-data.ts";

describe("simulated demo data", () => {
  it("uses unique, URL-safe student identifiers", () => {
    const ids = students.map((student) => student.id);

    assert.equal(new Set(ids).size, ids.length);
    assert.ok(ids.every((id) => /^[a-z0-9-]+$/.test(id)));
  });

  it("keeps scores and progress within display bounds", () => {
    for (const student of students) {
      assert.ok(student.progress >= 0 && student.progress <= 100);
      assert.ok(Object.values(student.cognitive).every((value) => value >= 0 && value <= 100));
      assert.ok(student.competencies.every(({ value }) => value >= 0 && value <= 100));
    }
  });

  it("only references students present in the simulated dataset", () => {
    const ids = new Set(students.map((student) => student.id));

    assert.ok(recentAlerts.every((alert) => ids.has(alert.studentId)));
  });

  it("keeps activity totals and adaptive guidance internally complete", () => {
    assert.ok(
      latestActivities.every(({ completed, total }) => completed >= 0 && completed <= total),
    );
    assert.ok(adaptiveActivity.stepByStep.length > 0);
    assert.ok(adaptiveActivity.nextActivity.length > 0);
  });
});
