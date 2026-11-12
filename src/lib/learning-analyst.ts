import { z } from "zod";
import { tutorActivity, type TutorLang, type TutorState } from "./tutor.ts";

const observedAttemptSchema = z
  .object({
    answer: z.enum(tutorActivity.answers),
    hintBefore: z.enum(["none", "guided", "ai"]),
  })
  .strict();

export const analystInputSchema = z
  .object({
    organizationId: z.string().uuid(),
    activityId: z.literal(tutorActivity.id),
    lang: z.enum(["es", "en"]),
    attempts: z.array(observedAttemptSchema).min(1).max(5),
  })
  .strict()
  .superRefine((input, ctx) => {
    if (input.attempts[0]?.hintBefore !== "none")
      ctx.addIssue({
        code: "custom",
        message: "The first attempt cannot follow a hint.",
        path: ["attempts", 0, "hintBefore"],
      });
    if (
      input.attempts.slice(0, -1).some((attempt) => attempt.answer === tutorActivity.correctAnswer)
    )
      ctx.addIssue({
        code: "custom",
        message: "No attempts are accepted after success.",
        path: ["attempts"],
      });
  });
export type AnalystInput = z.infer<typeof analystInputSchema>;

export function observedAttempts(state: TutorState): AnalystInput["attempts"] {
  return state.runs.map((run, index) => {
    const previous = state.runs[index - 1]?.proposal;
    return {
      answer: run.answer,
      hintBefore: previous?.review === "approved" ? previous.source : "none",
    };
  });
}

export function analyzeEvidence(attempts: AnalystInput["attempts"]) {
  const evidence = attempts.map((attempt, index) => ({
    attempt: index + 1,
    answer: attempt.answer,
    correct: attempt.answer === tutorActivity.correctAnswer,
    hintBefore: attempt.hintBefore,
  }));
  return {
    evidence,
    total: evidence.length,
    incorrect: evidence.filter((item) => !item.correct).length,
    solved: evidence.at(-1)?.correct ?? false,
    attemptsAfterHint: evidence.filter((item) => item.hintBefore !== "none").length,
    correctAfterHint: evidence.filter((item) => item.hintBefore !== "none" && item.correct).length,
  };
}

export const analystReportSchema = z
  .object({
    summary: z.string().trim().min(1).max(700),
    evidenceAttempts: z.array(z.number().int().min(1).max(5)).min(1).max(5),
    questions: z.array(z.string().trim().min(1).max(300)).min(1).max(3),
    nextStep: z.enum(["ask_first_step", "guided_practice", "transfer_exercise", "teacher_review"]),
  })
  .strict();
export type AnalystReport = z.infer<typeof analystReportSchema>;

export function validateAnalystReport(
  value: unknown,
  attempts: AnalystInput["attempts"],
): AnalystReport | null {
  const result = analystReportSchema.safeParse(value);
  if (!result.success || !attempts.length) return null;
  const report = result.data;
  if (
    new Set(report.evidenceAttempts).size !== report.evidenceAttempts.length ||
    report.evidenceAttempts.some((n) => n > attempts.length)
  )
    return null;
  // The model cannot advance an unsolved trial or request further attempts after the trial limit.
  const { solved, total } = analyzeEvidence(attempts);
  if (report.nextStep === "transfer_exercise" && !solved) return null;
  if (!solved && total >= 5 && report.nextStep !== "teacher_review") return null;
  return report;
}

export function guidedAnalysis(attempts: AnalystInput["attempts"], lang: TutorLang): AnalystReport {
  if (!attempts.length) throw new Error("An analysis requires an observed attempt.");
  const { solved, total, incorrect, attemptsAfterHint } = analyzeEvidence(attempts);
  return {
    summary:
      lang === "es"
        ? `Se registraron ${total} intento(s), ${incorrect} incorrecto(s) y ${attemptsAfterHint} posterior(es) a una pista aprobada. ${solved ? "La última respuesta es correcta." : "La actividad sigue sin resolverse."} Este registro no demuestra la causa de los errores ni la eficacia de las pistas.`
        : `${total} attempt(s), ${incorrect} incorrect answer(s), and ${attemptsAfterHint} attempt(s) following an approved hint were recorded. ${solved ? "The last answer is correct." : "The activity remains unsolved."} This record does not establish error causes or hint effectiveness.`,
    evidenceAttempts: attempts.map((_, i) => i + 1),
    questions: [
      lang === "es"
        ? solved
          ? "¿Cómo comprobarías tu resultado sustituyéndolo en la ecuación?"
          : "¿Qué operación harías primero y por qué en ambos lados?"
        : solved
          ? "How would you check your result by substituting it into the equation?"
          : "Which operation would you do first, and why on both sides?",
    ],
    nextStep: solved
      ? "transfer_exercise"
      : total >= 5
        ? "teacher_review"
        : attemptsAfterHint
          ? "guided_practice"
          : "ask_first_step",
  };
}

export const analystNextSteps = {
  es: {
    ask_first_step: "Pedir que explique la primera operación antes de ofrecer otra pista.",
    guided_practice: "Revisar juntos una operación y volver a intentarlo.",
    transfer_exercise: "Proponer 3x + 2 = 17 para comprobar el procedimiento en otro ejercicio.",
    teacher_review:
      "Cerrar esta prueba y revisar el procedimiento con el docente antes de reiniciar.",
  },
  en: {
    ask_first_step: "Ask the learner to explain the first operation before offering another hint.",
    guided_practice: "Review one operation together and try again.",
    transfer_exercise: "Suggest 3x + 2 = 17 to check the method in another exercise.",
    teacher_review: "End this trial and review the method with the teacher before restarting.",
  },
} as const;
