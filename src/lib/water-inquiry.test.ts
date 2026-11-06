import test from "node:test";
import assert from "node:assert/strict";
import { assessWaterInquiry, canAdvanceInquiryStep, waterSamples } from "./water-inquiry.ts";

test("las muestras de la demo están identificadas como valores fijos y distintos", () => {
  assert.equal(waterSamples.length, 2);
  assert.ok(waterSamples[1].nitrateMgL > waterSamples[0].nitrateMgL);
  assert.ok(waterSamples[1].turbidityNTU > waterSamples[0].turbidityNTU);
});

test("valora únicamente las dos respuestas cerradas y propone ampliación", () => {
  const result = assessWaterInquiry("higher-b", "different-not-causal");
  assert.equal(result.guidedCorrect, 2);
  assert.equal(result.nextFocus, "extend-inquiry");
});

test("orienta hacia los datos antes que hacia la causalidad si se interpreta mal la tabla", () => {
  const result = assessWaterInquiry("equal-nitrates", "fertilizers-proven");
  assert.equal(result.guidedCorrect, 0);
  assert.equal(result.nextFocus, "compare-data");
});

test("cuando los datos son correctos pero se afirma una causa, propone contrastar inferencias", () => {
  const result = assessWaterInquiry("higher-b", "fertilizers-proven");
  assert.equal(result.guidedCorrect, 1);
  assert.equal(result.nextFocus, "causality");
});

test("las respuestas abiertas y las elecciones son necesarias para avanzar", () => {
  assert.equal(canAdvanceInquiryStep(1, "breve", "", "", ""), false);
  assert.equal(
    canAdvanceInquiryStep(1, "Las muestras de agua pueden ser distintas.", "", "", ""),
    true,
  );
  assert.equal(canAdvanceInquiryStep(2, "", "", "", ""), false);
  assert.equal(canAdvanceInquiryStep(2, "", "higher-b", "", ""), true);
  assert.equal(canAdvanceInquiryStep(3, "", "higher-b", "", ""), false);
  assert.equal(canAdvanceInquiryStep(4, "", "higher-b", "different-not-causal", "corta"), false);
  assert.equal(
    canAdvanceInquiryStep(
      4,
      "",
      "higher-b",
      "different-not-causal",
      "Las muestras son diferentes, pero no podemos establecer la causa con estos datos.",
    ),
    true,
  );
});
