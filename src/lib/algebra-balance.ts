/**
 * Prototipo original de álgebra con datos exclusivamente locales y simulados.
 * Las recomendaciones son reglas didácticas transparentes, no IA ni calificaciones.
 */
export type AlgebraStep = 0 | 1 | 2;
export type AlgebraAction =
  | "subtract-three-both"
  | "subtract-three-left"
  | "divide-two-both"
  | "divide-two-left"
  | "add-three-both"
  | "add-two-both";

export type AlgebraOutcome = "advance" | "imbalance" | "detour";

export type AlgebraEvent = {
  step: 0 | 1;
  action: AlgebraAction;
  outcome: AlgebraOutcome;
  hintUsed: boolean;
};

export const algebraStages = [
  { expression: "2x + 3 = 11", left: { boxes: 2, tokens: 3 }, right: { boxes: 0, tokens: 11 } },
  { expression: "2x = 8", left: { boxes: 2, tokens: 0 }, right: { boxes: 0, tokens: 8 } },
  { expression: "x = 4", left: { boxes: 1, tokens: 0 }, right: { boxes: 0, tokens: 4 } },
] as const;

export const algebraChoices: Record<0 | 1, AlgebraAction[]> = {
  0: ["subtract-three-both", "subtract-three-left", "divide-two-both", "add-three-both"],
  1: ["divide-two-both", "divide-two-left", "subtract-three-both", "add-two-both"],
};

export function assessAlgebraAction(step: 0 | 1, action: AlgebraAction): AlgebraOutcome {
  if (action === "subtract-three-left" || action === "divide-two-left") return "imbalance";
  if (step === 0 && action === "subtract-three-both") return "advance";
  if (step === 1 && action === "divide-two-both") return "advance";
  return "detour";
}

export type AlgebraSignal = "pending" | "balance" | "inverse" | "extend";

/** No inferimos perfiles cognitivos: solo describimos acciones observables. */
export function summarizeAlgebraEvidence(events: readonly AlgebraEvent[], hintsViewed: number) {
  const imbalanceCount = events.filter((event) => event.outcome === "imbalance").length;
  const detourCount = events.filter((event) => event.outcome === "detour").length;
  const completedSteps = events.filter((event) => event.outcome === "advance").length;
  const signal: AlgebraSignal =
    imbalanceCount > 0
      ? "balance"
      : detourCount > 0 || hintsViewed > 0
        ? "inverse"
        : completedSteps === 2
          ? "extend"
          : "pending";
  return {
    attempts: events.length,
    completedSteps,
    imbalanceCount,
    detourCount,
    hintsViewed,
    signal,
  };
}
