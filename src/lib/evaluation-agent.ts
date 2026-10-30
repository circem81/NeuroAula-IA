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

export type ErrorCategory = "none" | "conceptual" | "calculation" | "procedure" | "uncertain";

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
  source: "llm" | "local-rules";
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
    if (typeof data[field] !== "string" || !data[field].trim() || data[field].length > 350) {
      throw new Error("El modelo produjo un texto incompleto o demasiado largo.");
    }
  }
  return {
    category: data.category as ErrorCategory,
    feedback: (data.feedback as string).trim(),
    hint: (data.hint as string).trim(),
  };
}

/** Only numerical correctness can be established without evidence of the steps taken. */
function isCorrectValue(value: number) {
  return Math.abs(value - PROPORTIONALITY_CASE.expectedAnswer) < 0.005;
}

/**
 * Standalone, transparent local preview. It never contacts an LLM, stores
 * records or attributes a cause to an incorrect answer.
 */
export function previewSyntheticProportionality(rawAnswer: unknown): EvaluationResult {
  const { answer, value } = parseNumericAnswer(rawAnswer);
  const correct = isCorrectValue(value);
  return {
    activityId: PROPORTIONALITY_CASE.id,
    answer,
    correct,
    category: correct ? "none" : "uncertain",
    feedback: correct
      ? "La respuesta numérica es correcta: siete cuadernos cuestan 21 €."
      : "La respuesta no coincide con 21 €. Con solo el resultado no sabemos por qué.",
    hint: correct
      ? "Explica cómo obtuviste el precio de siete cuadernos."
      : "¿Cuánto cuesta un cuaderno si cuatro cuestan 12 €?",
    teacherReviewRequired: true,
    source: "local-rules",
  };
}

/** Model proposals are never allowed to override the deterministic check. */
export async function evaluateProportionality(
  rawAnswer: unknown,
  generate: (input: { answer: string; correct: boolean }) => Promise<unknown>,
): Promise<EvaluationResult> {
  const { answer, value } = parseNumericAnswer(rawAnswer);
  const correct = isCorrectValue(value);
  const suggested = parseSuggestion(await generate({ answer, correct }));
  return {
    activityId: PROPORTIONALITY_CASE.id,
    answer,
    correct,
    // A numeric answer alone cannot distinguish conceptual, arithmetic or procedural mistakes.
    category: correct ? "none" : "uncertain",
    feedback: correct
      ? "La respuesta numérica es correcta: siete cuadernos cuestan 21 €."
      : suggested.feedback,
    hint: correct
      ? "Comprueba el procedimiento calculando primero el precio unitario."
      : suggested.hint,
    teacherReviewRequired: true,
    source: "llm",
  };
}
