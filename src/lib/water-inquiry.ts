/** Actividad didáctica local: TODOS los valores son simulados, no datos ambientales reales. */
export const waterSamples = [
  { id: "A", nitrateMgL: 12, turbidityNTU: 1.8, pH: 7.1 },
  { id: "B", nitrateMgL: 46, turbidityNTU: 7.1, pH: 7.3 },
] as const;

export const evidenceAnswers = ["higher-b", "equal-nitrates", "equal-turbidity"] as const;
export type EvidenceAnswer = (typeof evidenceAnswers)[number];

export const inferenceAnswers = ["different-not-causal", "fertilizers-proven", "water-safe"] as const;
export type InferenceAnswer = (typeof inferenceAnswers)[number];

export function assessWaterInquiry(
  evidence: EvidenceAnswer,
  inference: InferenceAnswer,
) {
  const evidenceCorrect = evidence === "higher-b";
  const inferenceCorrect = inference === "different-not-causal";
  return {
    evidenceCorrect,
    inferenceCorrect,
    guidedCorrect: Number(evidenceCorrect) + Number(inferenceCorrect),
    nextFocus: !evidenceCorrect
      ? ("compare-data" as const)
      : !inferenceCorrect
        ? ("causality" as const)
        : ("extend-inquiry" as const),
  };
}

/** Este cálculo solo corrige dos opciones cerradas. No evalúa hipótesis ni textos abiertos. */
export function canAdvanceInquiryStep(
  step: number,
  hypothesis: string,
  evidence: EvidenceAnswer | "",
  inference: InferenceAnswer | "",
  conclusion: string,
) {
  if (step === 1) return hypothesis.trim().length >= 20;
  if (step === 2) return evidence !== "";
  if (step === 3) return inference !== "";
  if (step === 4) return conclusion.trim().length >= 40;
  return step >= 0 && step < 5;
}
