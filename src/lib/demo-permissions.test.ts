import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { canAccessDemoPath } from "./demo-permissions.ts";

describe("demo role permissions", () => {
  it("keeps every profile on the shared dashboard", () => {
    for (const role of ["teacher", "guidance", "management", "family"] as const) {
      assert.equal(canAccessDemoPath(role, "/demo"), true);
    }
  });

  it("separates operational sections by professional role", () => {
    assert.equal(canAccessDemoPath("teacher", "/demo/actividades"), true);
    assert.equal(canAccessDemoPath("guidance", "/demo/actividades"), false);
    assert.equal(canAccessDemoPath("guidance", "/demo/gemelo"), true);
    assert.equal(canAccessDemoPath("management", "/demo/config"), true);
    assert.equal(canAccessDemoPath("teacher", "/demo/config"), false);
  });

  it("limits the family profile to its simulated student", () => {
    assert.equal(canAccessDemoPath("family", "/demo/alumno/lucia-fernandez"), true);
    assert.equal(canAccessDemoPath("family", "/demo/alumno/mateo-ruiz"), false);
    assert.equal(canAccessDemoPath("family", "/demo/alumnado"), false);
  });
});
