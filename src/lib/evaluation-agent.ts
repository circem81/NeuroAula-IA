/**
 * A fixed, synthetic evaluation case. No student identifiers, accounts,
 * histories or educational records are sent to the model.
 */
export const PROPORTIONALITY_CASE = {
  id: "proportionality-notebooks-v1",
  topic: "Proporcionalidad directa",
  statement: "Cuatro cuadernos cuestan 12 €. ¿Cuánto cuestan siete cuadernos?",
  expectedAnswer: 21,
} as const;

export type ErrorCategory =
  | "none"
  | "conceptual"
  | "calculation"
  | "procedure"
  | "uncertain";

export type AgentSuggestion = {
  category: ErrorCategory;
  feedback: string;
  hint: string;
};

export type EvaluationResult = AgentSuggestion & {
  activityId: typeof PROPORTIONALITY_CASE.id;
  answer: string;
  correct: boolean;
  teacherReviewRequired: true;
  source: "llm";
};

export function parseNumericAnswer(raw: unknown): { answer: string; value: number } {
  if (typeof raw !== "string") throw new Error("Escribe una respuesta numérica.");
  const answer = raw.trim();
  // This pilot accepts numbers only: no names, free text or prompt injection.
  if (!/^\d{1,4}(?:[.,]\d{1,2})?$/.test(answer)) {
    throw new Error("Introduce solo un número (por ejemplo, 18 o 18,50).");
  }
  const value = Number(answer.replace(",", "."));
  if (!Number.isFinite(value) || value > 1000) {
    throw new Error("La respuesta debe estar comprendida entre 0 y 1000.");
  }
  return { answer, value };
}

export function parseSuggestion(candidate: unknown): AgentSuggestion {
  if (!candidate || typeof candidate !== "object") {
    throw new Error("El modelo no devolvió una evaluación válida.");
  }
  const data = candidate as Record<string, unknown>;
  const allowed: readonly unknown[] = [
    "none",
    "conceptual",
    "calculation",
    "procedure",
    "uncertain",
  ];
  if (!allowed.includes(data.category)) {
    throw new Error("Categoría de error no reconocida.");
  }
  for (const field of ["feedback", "hint"] as const) {
    if (
      typeof data[field] !== "string" ||
      !data[field].trim() ||
      data[field].length > 350
    ) {
      throw new Error("El modelo produjo un texto incompleto o demasiado largo.");
    }
  }
  return {
    category: data.category as ErrorCategory,
    feedback: (data.feedback as string).trim(),
    hint: (data.hint as string).trim(),
  };
}

/** Model proposals are never allowed to override the deterministic check. */
export async function evaluateProportionality(
  rawAnswer: unknown,
  generate: (input: { answer: string; correct: boolean }) => Promise<unknown>,
): Promise<EvaluationResult> {
  const { answer, value } = parseNumericAnswer(rawAnswer);
  const correct = Math.abs(value - PROPORTIONALITY_CASE.expectedAnswer) < 0.005;
  const suggested = parseSuggestion(await generate({ answer, correct }));
  return {
    activityId: PROPORTIONALITY_CASE.id,
    answer,
    correct,
    category: correct
      ? "none"
      : suggested.category === "none"
        ? "uncertain"
        : suggested.category,
    feedback: suggested.feedback,
    hint: suggested.hint,
    teacherReviewRequired: true,
    source: "llm",
  };
}
