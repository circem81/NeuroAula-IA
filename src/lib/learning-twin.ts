import { z } from "zod";

export const LEARNING_TWIN_CONFIG = {
  version: "learning-twin-v1",
  weights: { correctness: 0.3, reasoning: 0.25, independence: 0.2, transfer: 0.15, evaluator: 0.1 },
  updateRate: 0.25,
  confidenceSampleTarget: 20,
  confidenceActivityTarget: 8,
  confidenceHalfLifeDays: 90,
  trendMinimum: 6,
  trendThreshold: 0.08,
  emergingMinimum: 3,
  consistentMinimum: 6,
  consistentDays: 14,
  shortTermDays: 14,
  mediumTermDays: 56,
} as const;

export const ERROR_TYPES: Record<string, readonly string[]> = {
  mathematics: [
    "conceptual_error",
    "procedural_error",
    "calculation_error",
    "misread_problem",
    "representation_error",
    "unit_error",
    "reasoning_gap",
    "random_answer",
  ],
  biology: [
    "concept_confusion",
    "causal_error",
    "classification_error",
    "terminology_error",
    "process_sequence_error",
  ],
};
const unit = z.number().finite().min(0).max(1);
const code = z.string().trim().min(1).max(100);
export const learningEvidenceSchema = z
  .object({
    id: z.string().uuid(),
    organizationId: z.string().uuid(),
    studentId: z.string().uuid(),
    activityId: code,
    criterionId: code,
    subject: code,
    correct: z.boolean(),
    // Null means unobserved, never inferred from the final answer.
    reasoningQuality: unit.nullable(),
    supportLevel: z.number().int().min(0).max(5).nullable(),
    transferLevel: z.number().int().min(0).max(4).nullable(),
    attempts: z.number().int().min(1).max(100),
    errorType: code.nullable(),
    strategies: z
      .array(
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
      )
      .max(8),
    evaluatorConfidence: unit,
    previousEvidenceId: z.string().uuid().nullable(),
    createdAt: z.string().datetime(),
  })
  .strict();
export type LearningEvidence = z.infer<typeof learningEvidenceSchema>;
export type ObservationStatus =
  "observed" | "emerging_pattern" | "consistent_pattern" | "requires_human_review";
export type LearningTwinState = {
  organizationId: string;
  studentId: string;
  criterionId: string;
  mastery: number;
  confidence: number;
  supportLevel: number | null;
  transferLevel: number | null;
  trend: "improving" | "stable" | "declining" | "insufficient_evidence";
  evidenceCount: number;
  lastEvidenceAt: string;
  updatedAt: string;
  engineVersion: string;
};
const day = 86_400_000;
const mean = (values: number[]) =>
  values.length ? values.reduce((sum, v) => sum + v, 0) / values.length : 0;
const observedMean = (values: (number | null)[]) => {
  const known = values.filter((v): v is number => v !== null);
  return known.length ? mean(known) : null;
};

/** Missing dimensions contribute no credit. Reliability gates the update separately. */
export function evidenceQuality(e: LearningEvidence): number {
  const w = LEARNING_TWIN_CONFIG.weights;
  return (
    w.correctness * Number(e.correct) +
    w.reasoning * (e.reasoningQuality ?? 0) +
    w.independence * (e.supportLevel === null ? 0 : 1 - e.supportLevel / 5) +
    w.transfer * (e.transferLevel === null ? 0 : e.transferLevel / 4) +
    w.evaluator * e.evaluatorConfidence
  );
}

export function validateEvidence(value: unknown, taxonomy = ERROR_TYPES): LearningEvidence {
  const e = learningEvidenceSchema.parse(value);
  if (e.errorType && !taxonomy[e.subject]?.includes(e.errorType))
    throw new Error("Unknown error category for subject");
  if (e.correct && e.errorType)
    throw new Error("A correct response cannot carry an error category");
  if (new Set(e.strategies).size !== e.strategies.length) throw new Error("Duplicate strategy");
  return e;
}

function patternStatus(evidence: LearningEvidence[]): ObservationStatus {
  const activities = new Set(evidence.map((e) => e.activityId)).size;
  const span = (Date.parse(evidence.at(-1)!.createdAt) - Date.parse(evidence[0].createdAt)) / day;
  if (
    evidence.length >= LEARNING_TWIN_CONFIG.consistentMinimum &&
    activities >= 3 &&
    span >= LEARNING_TWIN_CONFIG.consistentDays
  )
    return "consistent_pattern";
  if (evidence.length >= LEARNING_TWIN_CONFIG.emergingMinimum && activities >= 2)
    return "emerging_pattern";
  return "observed";
}

/** Replay immutable facts in chronological order; old evidence can arrive late. */
export function buildLearningTwin(
  input: readonly LearningEvidence[],
  now: string,
  taxonomy = ERROR_TYPES,
) {
  if (!Number.isFinite(Date.parse(now))) throw new Error("Invalid observation time");
  const byId = new Map<string, LearningEvidence>();
  for (const raw of input) {
    const e = validateEvidence(raw, taxonomy);
    const prior = byId.get(e.id);
    if (prior && JSON.stringify(prior) !== JSON.stringify(e))
      throw new Error("Evidence is immutable");
    if (Date.parse(e.createdAt) > Date.parse(now)) throw new Error("Future evidence");
    byId.set(e.id, e);
  }
  const evidence = [...byId.values()].sort(
    (a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt) || a.id.localeCompare(b.id),
  );
  if (!evidence.length) return null;
  const first = evidence[0];
  if (
    evidence.some(
      (e) =>
        e.organizationId !== first.organizationId ||
        e.studentId !== first.studentId ||
        e.criterionId !== first.criterionId ||
        e.subject !== first.subject,
    )
  )
    throw new Error("Mixed learning scope");
  const pairs = new Set<string>();
  for (const e of evidence) {
    if (!e.previousEvidenceId) continue;
    const previous = byId.get(e.previousEvidenceId);
    if (
      !previous ||
      previous.id === e.id ||
      previous.activityId !== e.activityId ||
      previous.attempts + 1 !== e.attempts ||
      Date.parse(previous.createdAt) >= Date.parse(e.createdAt) ||
      pairs.has(previous.id)
    )
      throw new Error("Invalid before/after evidence pair");
    pairs.add(previous.id);
  }
  let mastery = 0;
  const progression = evidence.map((e) => {
    // Repeated attempts are weaker evidence than a fresh independent task.
    const rate = (LEARNING_TWIN_CONFIG.updateRate * e.evaluatorConfidence) / Math.sqrt(e.attempts);
    mastery = mastery * (1 - rate) + evidenceQuality(e) * rate;
    return { evidenceId: e.id, createdAt: e.createdAt, mastery };
  });
  const last = evidence.at(-1)!;
  // One activity contributes one independent sample, however many retries it has.
  const activitySamples = [...new Map(evidence.map((e) => [e.activityId, e])).values()];
  const scores = activitySamples.map(evidenceQuality);
  const average = mean(scores);
  const consistency = Math.max(0, 1 - 2 * Math.sqrt(mean(scores.map((v) => (v - average) ** 2))));
  const quantity = Math.min(
    1,
    activitySamples.length / LEARNING_TWIN_CONFIG.confidenceSampleTarget,
  );
  const diversity = Math.min(
    1,
    activitySamples.length / LEARNING_TWIN_CONFIG.confidenceActivityTarget,
  );
  const reliability = mean(activitySamples.map((e) => e.evaluatorConfidence));
  const completeness = mean(
    activitySamples.map(
      (e) =>
        (2 +
          Number(e.reasoningQuality !== null) +
          Number(e.supportLevel !== null) +
          Number(e.transferLevel !== null)) /
        5,
    ),
  );
  const recency = mean(
    activitySamples.map(
      (e) =>
        2 **
        (-Math.max(0, (Date.parse(now) - Date.parse(e.createdAt)) / day) /
          LEARNING_TWIN_CONFIG.confidenceHalfLifeDays),
    ),
  );
  const confidence =
    quantity * (0.4 + 0.3 * consistency + 0.3 * diversity) * recency * reliability * completeness;
  const recent = evidence.filter(
    (e) => Date.parse(now) - Date.parse(e.createdAt) <= LEARNING_TWIN_CONFIG.mediumTermDays * day,
  );
  const recentActivities = [...new Map(recent.map((e) => [e.activityId, e])).values()];
  const delta =
    mean(recentActivities.slice(-3).map(evidenceQuality)) -
    mean(recentActivities.slice(-6, -3).map(evidenceQuality));
  const state: LearningTwinState = {
    organizationId: first.organizationId,
    studentId: first.studentId,
    criterionId: first.criterionId,
    mastery,
    confidence,
    supportLevel: observedMean(recent.map((e) => e.supportLevel)),
    transferLevel: observedMean(recent.filter((e) => e.correct).map((e) => e.transferLevel)),
    trend:
      recentActivities.length < LEARNING_TWIN_CONFIG.trendMinimum
        ? "insufficient_evidence"
        : delta > LEARNING_TWIN_CONFIG.trendThreshold
          ? "improving"
          : delta < -LEARNING_TWIN_CONFIG.trendThreshold
            ? "declining"
            : "stable",
    evidenceCount: evidence.length,
    lastEvidenceAt: last.createdAt,
    updatedAt: now,
    engineVersion: LEARNING_TWIN_CONFIG.version,
  };
  const errorPatterns = [
    ...new Set(evidence.flatMap((e) => (e.errorType ? [e.errorType] : []))),
  ].map((errorType) => {
    const matches = evidence.filter((e) => e.errorType === errorType);
    const active = recent.filter((e) => e.errorType === errorType);
    return {
      errorType,
      occurrences: matches.length,
      firstSeenAt: matches[0].createdAt,
      lastSeenAt: matches.at(-1)!.createdAt,
      persistenceScore: recent.length ? active.length / recent.length : 0,
      status: active.length ? patternStatus(active) : ("observed" as ObservationStatus),
      evidenceIds: matches.map((e) => e.id),
    };
  });
  const supportEffectiveness = [1, 2, 3, 4, 5]
    .map((supportLevel) => {
      const uses = evidence.filter((e) => e.supportLevel === supportLevel);
      const paired = uses.filter((e) => e.previousEvidenceId !== null);
      const gains = paired.map((e) => {
        const previous = byId.get(e.previousEvidenceId!)!;
        return Number(e.correct) - Number(previous.correct);
      });
      return {
        supportLevel,
        uses: uses.length,
        pairedCount: paired.length,
        meanCorrectnessChange: gains.length ? mean(gains) : null,
        status: paired.length ? patternStatus(paired) : ("observed" as ObservationStatus),
        evidenceIds: uses.map((e) => e.id),
      };
    })
    .filter((s) => s.uses > 0);
  const strategyObservations = evidence.flatMap((e) =>
    e.strategies.map((strategy) => ({ evidenceId: e.id, strategy, createdAt: e.createdAt })),
  );
  return {
    state,
    evidence,
    errorPatterns,
    supportEffectiveness,
    strategyObservations,
    progression,
    horizons: {
      shortTerm: evidence.filter(
        (e) =>
          Date.parse(now) - Date.parse(e.createdAt) <= LEARNING_TWIN_CONFIG.shortTermDays * day,
      ).length,
      mediumTerm: recent.length,
      allRecorded: evidence.length,
    },
  };
}
export type LearningTwin = NonNullable<ReturnType<typeof buildLearningTwin>>;

export function supportLabel(level: number | null, lang: "es" | "en") {
  const labels =
    lang === "es"
      ? [
          "sin ayuda",
          "reformulación",
          "pista conceptual",
          "ejemplo análogo",
          "procedimiento guiado",
          "solución dirigida",
        ]
      : [
          "unaided",
          "rephrasing",
          "conceptual hint",
          "analogous example",
          "guided procedure",
          "directed solution",
        ];
  return level === null
    ? lang === "es"
      ? "nivel no observado"
      : "unobserved level"
    : labels[level];
}

export function twinTeacherReport(twin: LearningTwin, lang: "es" | "en" = "es") {
  const es = lang === "es";
  const correct = twin.evidence.filter((e) => e.correct).length;
  const activities = new Set(twin.evidence.map((e) => e.activityId)).size;
  const observedErrors = twin.errorPatterns
    .filter((p) => p.status !== "observed")
    .sort((a, b) => b.persistenceScore - a.persistenceScore);
  return {
    state:
      twin.state.confidence < 0.5
        ? es
          ? "Evidencia todavía insuficiente"
          : "Insufficient evidence so far"
        : es
          ? "Consolidación en progreso"
          : "Consolidation in progress",
    evidence: es
      ? `${correct} de ${twin.evidence.length} respuestas correctas en ${activities} actividad(es).`
      : `${correct} of ${twin.evidence.length} correct responses across ${activities} activity/activities.`,
    support: es
      ? "La ayuda se describe por tarea; una mejora posterior no demuestra causalidad."
      : "Support is described per task; subsequent improvement does not prove causality.",
    supportSequence: twin.evidence
      .slice(-5)
      .map((e) => supportLabel(e.supportLevel, lang))
      .join(" → "),
    difficulty: observedErrors.length
      ? es
        ? `Hay un error recurrente registrado en ${observedErrors[0].occurrences} respuestas; revisar las tareas citadas antes de intervenir.`
        : `A recurring error was recorded in ${observedErrors[0].occurrences} responses; review the cited tasks before intervening.`
      : es
        ? "Aún no hay evidencia suficiente para describir una dificultad recurrente."
        : "There is not enough evidence to describe a recurring difficulty yet.",
    nextStep: twin.evidence.at(-1)?.correct
      ? es
        ? "Proponer otra actividad y pedir que explique el procedimiento antes de comprobar transferencia."
        : "Offer another activity and ask for an explanation before checking transfer."
      : es
        ? "Pedir que explique el primer paso y registrar la ayuda utilizada."
        : "Ask for the first step and record the support used.",
    limitation: es
      ? "Las evidencias actuales describen estas tareas y condiciones, no rasgos del alumno."
      : "Current evidence describes these tasks and conditions, not learner traits.",
  };
}
