import { z } from "zod";

export const tutorInputSchema = z
  .object({
    organizationId: z.string().uuid(),
    lang: z.enum(["es", "en"]),
    activityId: z.literal("linear-equation-v1"),
    answers: z
      .array(z.enum(["2", "3", "4", "6"]))
      .min(1)
      .max(5),
    level: z.union([z.literal(1), z.literal(2)]),
  })
  .strict();

export type TutorInput = z.infer<typeof tutorInputSchema>;
export type Answer = TutorInput["answers"][number];
export type TutorLang = TutorInput["lang"];

// Versioned, internally authored exercise. No student record or free text is sent to the model.
export const tutorActivity = {
  id: "linear-equation-v1" as const,
  equation: "2x + 3 = 11",
  answers: ["2", "3", "4", "6"] as const,
  correctAnswer: "4" as const,
  source: "NeuroAULA · ALG-01 · v1",
};

export const tutorAdviceSchema = z
  .object({
    hint: z.string().trim().min(1).max(700),
    observation: z.string().trim().min(1).max(700),
    nextStep: z.string().trim().min(1).max(500),
  })
  .strict();
export type TutorAdvice = z.infer<typeof tutorAdviceSchema>;
export type Proposal = TutorAdvice & {
  source: "guided" | "ai";
  review: "pending" | "approved" | "rejected";
};

export function assessAnswers(answers: readonly Answer[]) {
  return {
    attempts: answers.length,
    solved: answers.at(-1) === tutorActivity.correctAnswer,
    incorrectAttempts: answers.filter((answer) => answer !== tutorActivity.correctAnswer).length,
  };
}

export function guidedAdvice(answers: Answer[], level: 1 | 2, lang: TutorLang): TutorAdvice {
  const { solved, attempts, incorrectAttempts } = assessAnswers(answers);
  if (lang === "en")
    return {
      hint: solved
        ? "Substitute your value of x into the original equation and check that both sides are equal."
        : level === 1
          ? "First isolate the term containing x. Which operation undoes adding 3? Apply it to both sides."
          : "Subtract 3 from both sides: 2x = 8. Which operation undoes multiplying x by 2?",
      observation: `${attempts} recorded attempt(s); ${incorrectAttempts} incorrect answer(s). ${solved ? "The last answer satisfies the equation." : "The last answer does not satisfy the equation. The answer alone does not establish the cause."}`,
      nextStep: solved
        ? "Try 3x + 2 = 17 to practise the same method. One solved exercise does not establish mastery."
        : "Ask the learner to explain their first operation, then try the activity again.",
    };
  return {
    hint: solved
      ? "Sustituye tu valor de x en la ecuación original y comprueba que ambos lados son iguales."
      : level === 1
        ? "Primero aísla el término que contiene x. ¿Qué operación deshace sumar 3? Aplícala en ambos lados."
        : "Resta 3 en ambos lados: 2x = 8. ¿Qué operación deshace multiplicar x por 2?",
    observation: `${attempts} intento(s) registrado(s); ${incorrectAttempts} respuesta(s) incorrecta(s). ${solved ? "La última respuesta satisface la ecuación." : "La última respuesta no satisface la ecuación. La respuesta por sí sola no permite determinar la causa."}`,
    nextStep: solved
      ? "Practica el mismo procedimiento con 3x + 2 = 17. Resolver un ejercicio no acredita el dominio de la competencia."
      : "Pide que explique la primera operación y después que vuelva a intentarlo.",
  };
}

export function canUseTutor(
  session: { memberships: Array<{ organizationId: string; role: string }> } | null,
  organizationId: string,
) {
  return !!session?.memberships.some(
    (membership) => membership.organizationId === organizationId && membership.role === "teacher",
  );
}

const proposalSchema = tutorAdviceSchema.extend({
  source: z.enum(["guided", "ai"]),
  review: z.enum(["pending", "approved", "rejected"]),
});
const runSchema = z.object({
  answer: z.enum(tutorActivity.answers),
  proposal: proposalSchema.nullable(),
  evidenceId: z.string().uuid().optional(),
  answeredAt: z.string().datetime().optional(),
  observedSupport: z.number().int().min(0).max(5).nullable().optional(),
});
export const tutorStateSchema = z
  .object({
    version: z.literal(1),
    runs: z.array(runSchema).max(5),
  })
  .strict();
export type TutorState = z.infer<typeof tutorStateSchema>;
export const emptyTutorState = (): TutorState => ({ version: 1, runs: [] });

export function restoreTutorState(value: unknown): TutorState {
  const parsed = tutorStateSchema.safeParse(value);
  return parsed.success ? parsed.data : emptyTutorState();
}

export type TutorAction =
  | { type: "answer"; answer: Answer }
  | { type: "propose"; advice: TutorAdvice; source: Proposal["source"] }
  | { type: "review"; decision: "approved" | "rejected" }
  | { type: "reset" };

export function updateTutor(state: TutorState, action: TutorAction): TutorState {
  if (action.type === "reset") return emptyTutorState();
  if (action.type === "answer") {
    if (state.runs.length >= 5 || state.runs.at(-1)?.answer === tutorActivity.correctAnswer)
      return state;
    const approved = state.runs.filter((run) => run.proposal?.review === "approved");
    const observedSupport = approved.some((run) => run.proposal?.source === "ai")
      ? null
      : Math.max(0, ...approved.map((run) => (state.runs.indexOf(run) === 0 ? 2 : 4)));
    const answeredAt = new Date(
      Math.max(Date.now(), Date.parse(state.runs.at(-1)?.answeredAt ?? "1970-01-01") + 1),
    ).toISOString();
    return {
      ...state,
      runs: [
        ...state.runs,
        {
          answer: action.answer,
          proposal: null,
          evidenceId: crypto.randomUUID(),
          answeredAt,
          observedSupport,
        },
      ],
    };
  }
  const last = state.runs.at(-1);
  if (!last) return state;
  const proposal =
    action.type === "propose"
      ? {
          ...tutorAdviceSchema.parse(action.advice),
          source: action.source,
          review: "pending" as const,
        }
      : last.proposal?.review === "pending"
        ? { ...last.proposal, review: action.decision }
        : last.proposal;
  return { ...state, runs: [...state.runs.slice(0, -1), { ...last, proposal }] };
}

export function learnerHint(state: TutorState): string | null {
  const proposal = state.runs.at(-1)?.proposal;
  return proposal?.review === "approved" ? proposal.hint : null;
}
