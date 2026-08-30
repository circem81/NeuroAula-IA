import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  createInitialInterventions,
  mergeStoredInterventions,
  updateIntervention,
} from "./demo-interventions.ts";

describe("demo intervention workflow", () => {
  it("creates open, unassigned interventions", () => {
    assert.deepEqual(createInitialInterventions(["a"]), [
      { alertId: "a", status: "open", owner: null, note: "", updatedAt: null },
    ]);
  });

  it("ignores unknown alerts and repairs invalid stored values", () => {
    const merged = mergeStoredInterventions(
      ["a"],
      [
        { alertId: "a", status: "invalid", owner: 4, note: "ok" },
        { alertId: "deleted", status: "resolved" },
      ],
    );
    assert.equal(merged.length, 1);
    assert.equal(merged[0]?.status, "open");
    assert.equal(merged[0]?.owner, null);
  });

  it("updates only the selected intervention", () => {
    const state = createInitialInterventions(["a", "b"]);
    const next = updateIntervention(state, "b", { status: "resolved" }, "2026-08-07");
    assert.equal(next[0]?.status, "open");
    assert.equal(next[1]?.status, "resolved");
    assert.equal(next[1]?.updatedAt, "2026-08-07");
  });
});
