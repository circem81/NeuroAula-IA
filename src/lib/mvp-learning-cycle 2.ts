import { z } from "zod";
import {
  buildLearningTwin,
  evidenceQuality,
  type LearningEvidence,
  type LearningTwin,
} from "./learning-twin.ts";

export const mvpActivity = {
  id: "11000000-0000-4000-8000-000000000001",
  studentId: "11000000-0000-4000-8000-000000000002",
  criterionId: "NEUROAULA.ALG-01.v1",
  subject: "mathematics",
  title: "Ecuaciones de primer grado",
  prompt: "Resuelve: 2x + 3 = 11",
  answers: ["2", "3", "4", "6"] as const,
  correctAnswer: "4" as const,
  hints: [
    "¿Qué operación deshace sumar 3? Aplícala en ambos lados.",
    "Después de restar 3 queda 2x = 8. ¿Qué operación deshace multiplicar por 2?",
  ] as const,
  source: "NeuroAula · actividad sintética ALG-01 · v1",
};
export type MvpAnswer = (typeof mvpActivity.answers)[number];

const stateSnapshotSchema = z.object({
  mastery: z.number().min(0).max(1),
  confidence: z.number().min(0).max(1),
  trend: z.enum(["improving", "stable", "declining", "insufficient_evidence"]),
  evidenceCount: z.number().int().nonnegative(),
});
const assessmentSchema = z.object({
  id: z.string().uuid(),
  attemptId: z.string().uuid(),
  evidenceId: z.string().uuid(),
  score: z.number().min(0).max(100),
  masteryEstimate: z.number().min(0).max(1),
  detectedErrors: z.array(z.string()),
  strengths: z.array(z.string()),
  misconceptions: z.array(z.string()),
  evidenceSummary: z.string(),
  confidence: z.number().min(0).max(1),
  requiresHumanReview: z.boolean(),
  recommendedNextAction: z.string(),
  reviewStatus: z.enum(["pending", "approved", "corrected"]),
  createdAt: z.string().datetime(),
});
const evidenceSchema = z.object({
  id: z.string().uuid(),
  organizationId: z.string().uuid(),
  studentId: z.string().uuid(),
  activityId: z.string().uuid(),
  criterionId: z.string(),
  subject: z.string(),
  correct: z.boolean(),
  reasoningQuality: z.number().min(0).max(1).nullable(),
  supportLevel: z.number().int().min(0).max(5).nullable(),
  transferLevel: z.number().int().min(0).max(4).nullable(),
  attempts: z.number().int().positive(),
  errorType: z.string().nullable(),
  strategies: z.array(
    z.enum([
      "UsesDiagram",
      "UsesEquation",
      "TrialAndError",
      "PatternRecognition",
      "VerbalReasoning",
      "AnalogicalReasoning",
      "Recall",
      "AlgorithmicProcedure",
    ]),
  ),
  evaluatorConfidence: z.number().min(0).max(1),
  previousEvidenceId: z.string().uuid().nullable(),
  createdAt: z.string().datetime(),
  supersedesEvidenceId: z.string().uuid().nullable(),
});
export type MvpEvidence = z.infer<typeof evidenceSchema>;
const mvpCycleSchema = z.object({
  version: z.literal(1),
  organizationId: z.string().uuid(),
  supportLevel: z.number().int().min(0).max(4),
  attempts: z.array(
    z.object({
      id: z.string().uuid(),
      answer: z.enum(mvpActivity.answers),
      supportLevel: z.number().int().min(0).max(4),
      submittedAt: z.string().datetime(),
    }),
  ),
  assessments: z.array(assessmentSchema),
  evidence: z.array(evidenceSchema),
  events: z.array(
    z.object({
      id: z.string().uuid(),
      type: z.enum(["learning_twin_updated", "human_review"]),
      evidenceId: z.string().uuid(),
      previousState: stateSnapshotSchema.nullable(),
      newState: stateSnapshotSchema,
      reason: z.string(),
      createdAt: z.string().datetime(),
    }),
  ),
  interactions: z.array(
    z.object({
      id: z.string().uuid(),
      agent: z.enum([
        "student",
        "evaluation",
        "evidence_store",
        "learning_twin",
        "recommendation",
        "teacher",
      ]),
      attemptId: z.string().uuid(),
      evidenceId: z.string().uuid().nullable(),
      inputSummary: z.string(),
      outputSummary: z.string(),
      confidence: z.number().min(0).max(1).nullable(),
      model: z.string().nullable(),
      createdAt: z.string().datetime(),
    }),
  ),
  recommendations: z.array(
    z.object({
      id: z.string().uuid(),
      evidenceId: z.string().uuid(),
      text: z.string(),
      status: z.enum(["proposed", "accepted", "dismissed"]),
      createdAt: z.string().datetime(),
    }),
  ),
  reviews: z.array(
    z.object({
      id: z.string().uuid(),
      assessmentId: z.string().uuid(),
      evidenceId: z.string().uuid(),
      decision: z.enum(["approved", "corrected"]),
      correctedScore: z.number().min(0).max(100).nullable(),
      note: z.string().max(300),
      reviewer: z.string(),
      createdAt: z.string().datetime(),
    }),
  ),
});
export type MvpCycleState = z.infer<typeof mvpCycleSchema>;

export function emptyMvpCycle(organizationId: string): MvpCycleState {
  return mvpCycleSchema.parse({
    version: 1,
    organizationId,
    supportLevel: 0,
    attempts: [],
    assessments: [],
    evidence: [],
    events: [],
    interactions: [],
    recommendations: [],
    reviews: [],
  });
}

export function restoreMvpCycle(value: unknown, organizationId: string): MvpCycleState {
  const parsed = mvpCycleSchema.safeParse(value);
  return parsed.success && parsed.data.organizationId === organizationId
    ? parsed.data
    : emptyMvpCycle(organizationId);
}

function effectiveEvidence(state: MvpCycleState): LearningEvidence[] {
  const superseded = new Set(
    state.evidence.flatMap((item) =>
      item.supersedesEvidenceId ? [item.supersedesEvidenceId] : [],
    ),
  );
  return state.evidence
    .filter((item) => !superseded.has(item.id))
    .map(({ supersedesEvidenceId: _, ...item }) => item);
}

export function mvpTwin(state: MvpCycleState, now = new Date().toISOString()): LearningTwin | null {
  return buildLearningTwin(effectiveEvidence(state), now);
}

function snapshot(twin: LearningTwin | null) {
  return twin
    ? {
        mastery: twin.state.mastery,
        confidence: twin.state.confidence,
        trend: twin.state.trend,
        evidenceCount: twin.state.evidenceCount,
      }
    : null;
}

export type MvpIds = {
  attemptId: string;
  assessmentId: string;
  evidenceId: string;
  eventId: string;
  recommendationId: string;
  interactionIds: [string, string, string, string, string];
};

export function submitMvpAnswer(
  state: MvpCycleState,
  answer: MvpAnswer,
  ids: MvpIds,
  submittedAt: string,
): MvpCycleState {
  if (state.attempts.at(-1)?.answer === mvpActivity.correctAnswer || state.attempts.length >= 5)
    return state;
  if (!Number.isFinite(Date.parse(submittedAt))) throw new Error("Invalid submission time");
  const correct = answer === mvpActivity.correctAnswer;
  const attemptNumber = state.attempts.length + 1;
  const previousEvidenceId = effectiveEvidence(state).at(-1)?.id ?? null;
  // A selected option establishes correctness only. It does not reveal reasoning or misconception.
  const evidence: MvpEvidence = evidenceSchema.parse({
    id: ids.evidenceId,
    organizationId: state.organizationId,
    studentId: mvpActivity.studentId,
    activityId: mvpActivity.id,
    criterionId: mvpActivity.criterionId,
    subject: mvpActivity.subject,
    correct,
    reasoningQuality: null,
    supportLevel: state.supportLevel,
    transferLevel: 0,
    attempts: attemptNumber,
    errorType: null,
    strategies: [],
    evaluatorConfidence: 0.45,
    previousEvidenceId,
    createdAt: submittedAt,
    supersedesEvidenceId: null,
  });
  const quality = evidenceQuality(evidence);
  const assessment = assessmentSchema.parse({
    id: ids.assessmentId,
    attemptId: ids.attemptId,
    evidenceId: evidence.id,
    score: correct ? 100 : 0,
    masteryEstimate: quality,
    detectedErrors: correct ? [] : ["La respuesta no satisface la ecuación."],
    strengths: correct ? ["El resultado final es correcto."] : [],
    misconceptions: [],
    evidenceSummary: correct
      ? `Respuesta correcta en el intento ${attemptNumber}, con ayuda ${state.supportLevel}/5.`
      : `Respuesta incorrecta en el intento ${attemptNumber}, con ayuda ${state.supportLevel}/5. La causa no se ha observado.`,
    confidence: 0.45,
    requiresHumanReview: true,
    recommendedNextAction: correct
      ? "Pedir que explique el procedimiento y comprobar transferencia en otra actividad."
      : state.supportLevel < 4
        ? "Ofrecer la siguiente pista progresiva y volver a observar el procedimiento."
        : "Revisar el primer paso con el docente antes de otro intento.",
    reviewStatus: "pending",
    createdAt: submittedAt,
  });
  const previousTwin = mvpTwin(state, submittedAt);
  const nextBase: MvpCycleState = {
    ...state,
    attempts: [
      ...state.attempts,
      { id: ids.attemptId, answer, supportLevel: state.supportLevel, submittedAt },
    ],
    assessments: [...state.assessments, assessment],
    evidence: [...state.evidence, evidence],
  };
  const nextTwin = mvpTwin(nextBase, submittedAt)!;
  const recommendation = {
    id: ids.recommendationId,
    evidenceId: evidence.id,
    text: assessment.recommendedNextAction,
    status: "proposed" as const,
    createdAt: submittedAt,
  };
  const [student, evaluation, store, twin, recommendationTrace] = ids.interactionIds;
  return mvpCycleSchema.parse({
    ...nextBase,
    events: [
      ...state.events,
      {
        id: ids.eventId,
        type: "learning_twin_updated",
        evidenceId: evidence.id,
        previousState: snapshot(previousTwin),
        newState: snapshot(nextTwin),
        reason: "Nueva evidencia estructurada generada por evaluación determinista v1.",
        createdAt: submittedAt,
      },
    ],
    recommendations: [...state.recommendations, recommendation],
    interactions: [
      ...state.interactions,
      {
        id: student,
        agent: "student",
        attemptId: ids.attemptId,
        evidenceId: null,
        inputSummary: "Actividad sintética presentada",
        outputSummary: `Respuesta ${answer} registrada`,
        confidence: null,
        model: null,
        createdAt: submittedAt,
      },
      {
        id: evaluation,
        agent: "evaluation",
        attemptId: ids.attemptId,
        evidenceId: evidence.id,
        inputSummary: `Respuesta, clave, intento ${attemptNumber} y ayuda ${state.supportLevel}`,
        outputSummary: assessment.evidenceSummary,
        confidence: assessment.confidence,
        model: "deterministic-rules-v1",
        createdAt: submittedAt,
      },
      {
        id: store,
        agent: "evidence_store",
        attemptId: ids.attemptId,
        evidenceId: evidence.id,
        inputSummary: "Evaluación validada",
        outputSummary: "Evidencia inmutable añadida",
        confidence: assessment.confidence,
        model: null,
        createdAt: submittedAt,
      },
      {
        id: twin,
        agent: "learning_twin",
        attemptId: ids.attemptId,
        evidenceId: evidence.id,
        inputSummary: `${nextTwin.evidence.length} evidencia(s) efectiva(s)`,
        outputSummary: `Estado actualizado con confianza ${nextTwin.state.confidence.toFixed(2)}`,
        confidence: nextTwin.state.confidence,
        model: "learning-twin-v1",
        createdAt: submittedAt,
      },
      {
        id: recommendationTrace,
        agent: "recommendation",
        attemptId: ids.attemptId,
        evidenceId: evidence.id,
        inputSummary: "Estado y evaluación estructurada",
        outputSummary: recommendation.text,
        confidence: assessment.confidence,
        model: "deterministic-rules-v1",
        createdAt: submittedAt,
      },
    ],
  });
}

export function requestMvpHint(state: MvpCycleState): MvpCycleState {
  if (state.supportLevel >= 4 || state.attempts.at(-1)?.answer === mvpActivity.correctAnswer)
    return state;
  return { ...state, supportLevel: state.supportLevel === 0 ? 2 : 4 };
}

export function reviewMvpAssessment(
  state: MvpCycleState,
  input: {
    assessmentId: string;
    decision: "approved" | "corrected";
    correctedScore?: number;
    note: string;
    reviewer: string;
    reviewId: string;
    eventId: string;
    evidenceId?: string;
    interactionId: string;
    createdAt: string;
  },
): MvpCycleState {
  const assessment = state.assessments.find((item) => item.id === input.assessmentId);
  if (!assessment || assessment.reviewStatus !== "pending") return state;
  if (input.decision === "corrected" && (input.correctedScore === undefined || !input.evidenceId))
    throw new Error("A correction requires score and evidence ID");
  const previousTwin = mvpTwin(state, input.createdAt)!;
  let evidence = state.evidence;
  let effectiveEvidenceId = assessment.evidenceId;
  if (input.decision === "corrected") {
    const original = state.evidence.find((item) => item.id === assessment.evidenceId)!;
    effectiveEvidenceId = input.evidenceId!;
    evidence = [
      ...evidence,
      evidenceSchema.parse({
        ...original,
        id: effectiveEvidenceId,
        correct: input.correctedScore! >= 50,
        evaluatorConfidence: 1,
        previousEvidenceId: original.previousEvidenceId,
        createdAt: input.createdAt,
        supersedesEvidenceId: original.id,
      }),
    ];
  }
  const base: MvpCycleState = {
    ...state,
    evidence,
    assessments: state.assessments.map((item) =>
      item.id === assessment.id ? { ...item, reviewStatus: input.decision } : item,
    ),
    reviews: [
      ...state.reviews,
      {
        id: input.reviewId,
        assessmentId: assessment.id,
        evidenceId: effectiveEvidenceId,
        decision: input.decision,
        correctedScore: input.decision === "corrected" ? input.correctedScore! : null,
        note: input.note.trim(),
        reviewer: input.reviewer,
        createdAt: input.createdAt,
      },
    ],
  };
  const nextTwin = mvpTwin(base, input.createdAt)!;
  return mvpCycleSchema.parse({
    ...base,
    events: [
      ...state.events,
      {
        id: input.eventId,
        type: "human_review",
        evidenceId: effectiveEvidenceId,
        previousState: snapshot(previousTwin),
        newState: snapshot(nextTwin),
        reason:
          input.decision === "approved"
            ? `Evaluación aprobada por ${input.reviewer}.`
            : `Evaluación corregida por ${input.reviewer}; la evidencia original se conserva.`,
        createdAt: input.createdAt,
      },
    ],
    interactions: [
      ...state.interactions,
      {
        id: input.interactionId,
        agent: "teacher",
        attemptId: assessment.attemptId,
        evidenceId: effectiveEvidenceId,
        inputSummary: `Revisión humana ${input.decision}`,
        outputSummary: input.note.trim() || "Sin observaciones adicionales",
        confidence: 1,
        model: null,
        createdAt: input.createdAt,
      },
    ],
  });
}

export function createMvpIds(): MvpIds {
  return {
    attemptId: crypto.randomUUID(),
    assessmentId: crypto.randomUUID(),
    evidenceId: crypto.randomUUID(),
    eventId: crypto.randomUUID(),
    recommendationId: crypto.randomUUID(),
    interactionIds: [
      crypto.randomUUID(),
      crypto.randomUUID(),
      crypto.randomUUID(),
      crypto.randomUUID(),
      crypto.randomUUID(),
    ],
  };
}
