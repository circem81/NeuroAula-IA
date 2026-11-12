import { bookContextSchema, type BookContext } from "./book-context.ts";
export type { BookContext } from "./book-context.ts";
import { mvpActivity, type MvpCycleState } from "./mvp-learning-cycle.ts";

// Content is authored data, never executable HTML from a model or retrieved document.
export const interactiveBook = {
  id: "neuroaula-algebra-book",
  version: 1,
  activityId: mvpActivity.id,
  criterionId: mvpActivity.criterionId,
  title: "El equilibrio de una ecuación",
  source: "NeuroAula · contenido sintético ALG-01 · v1 (no validado como LOMLOE)",
  pages: [
    {
      id: "predict",
      title: "1. Predice",
      text: "Una ecuación expresa una igualdad. Antes de calcular, piensa: ¿qué significa que ambos lados estén equilibrados?",
      supportLevel: 0,
    },
    {
      id: "explore",
      title: "2. Explora con ayuda",
      text: "Para conservar la igualdad, realiza la misma operación en ambos lados. Una operación inversa deshace otra: restar deshace sumar y dividir deshace multiplicar por un número distinto de cero. Comprueba tu resultado sustituyendo la incógnita.",
      supportLevel: 2,
    },
    {
      id: "challenge",
      title: "3. Resuelve y explica",
      text: "Resuelve la actividad que aparece debajo del libro. Después, explica en tu libreta cada paso y comprueba tu respuesta. El docente revisará la evaluación; una respuesta por sí sola no demuestra transferencia.",
      supportLevel: 0,
    },
  ],
} as const;

export function bookContext(presentation: BookContext["presentation"]): BookContext {
  return bookContextSchema.parse({
    bookId: interactiveBook.id,
    bookVersion: interactiveBook.version,
    activityPageId: "challenge",
    sourceId: interactiveBook.criterionId,
    presentation,
  });
}

/** Reading is not evidence. Only explicit answers use the existing assessment pipeline. */
export function readBookPage(state: MvpCycleState, pageId: string): MvpCycleState {
  const page = interactiveBook.pages.find((item) => item.id === pageId);
  if (!page) throw new Error("Unknown book page");
  return { ...state, supportLevel: Math.max(state.supportLevel, page.supportLevel) };
}

/** Proposal only: the teacher chooses whether to open the support page. */
export function proposeBookPage(state: MvpCycleState): "explore" | "challenge" {
  const last = state.assessments.at(-1);
  if (!last || last.reviewStatus === "pending") return "challenge";
  const correction = state.reviews.find((review) => review.assessmentId === last.id);
  const score = correction?.correctedScore ?? last.score;
  return score < 50 ? "explore" : "challenge";
}
