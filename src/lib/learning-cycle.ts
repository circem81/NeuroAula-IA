import { z } from "zod";
import { emptyTutorState, tutorStateSchema, updateTutor, type TutorAction } from "./tutor.ts";
import {
  analystReportSchema,
  observedAttempts,
  validateAnalystReport,
  type AnalystReport,
} from "./learning-analyst.ts";

const analysisSchema = z
  .object({
    report: analystReportSchema,
    source: z.enum(["guided", "ai"]),
    review: z.enum(["pending", "approved", "rejected"]),
    revision: z.number().int().nonnegative(),
  })
  .strict();
const cycleSchema = z
  .object({
    version: z.literal(2),
    revision: z.number().int().nonnegative(),
    tutor: tutorStateSchema,
    analysis: analysisSchema.nullable(),
  })
  .strict();
export type LearningCycle = z.infer<typeof cycleSchema>;
export const emptyLearningCycle = (): LearningCycle => ({
  version: 2,
  revision: 0,
  tutor: emptyTutorState(),
  analysis: null,
});

export function restoreLearningCycle(value: unknown): LearningCycle {
  const parsed = cycleSchema.safeParse(value);
  if (parsed.success) {
    const cycle = parsed.data;
    if (
      cycle.analysis &&
      (cycle.analysis.revision !== cycle.revision ||
        !validateAnalystReport(cycle.analysis.report, observedAttempts(cycle.tutor)))
    )
      return { ...cycle, analysis: null };
    return cycle;
  }
  // Preserve existing v1 trials when adopting the two-agent workflow.
  const legacy = tutorStateSchema.safeParse(value);
  return legacy.success ? { ...emptyLearningCycle(), tutor: legacy.data } : emptyLearningCycle();
}

export type CycleAction =
  | { type: "tutor"; action: TutorAction }
  | { type: "analysis"; report: AnalystReport; source: "guided" | "ai"; revision: number }
  | { type: "review_analysis"; decision: "approved" | "rejected"; revision: number };

export function updateLearningCycle(cycle: LearningCycle, action: CycleAction): LearningCycle {
  if (action.type === "tutor") {
    const tutor = updateTutor(cycle.tutor, action.action);
    if (tutor === cycle.tutor) return cycle;
    // Every changed attempt or tutor review invalidates an older analyst proposal.
    return { ...cycle, revision: cycle.revision + 1, tutor, analysis: null };
  }
  if (action.revision !== cycle.revision) return cycle;
  if (action.type === "analysis") {
    const report = validateAnalystReport(action.report, observedAttempts(cycle.tutor));
    if (!report) return cycle;
    return {
      ...cycle,
      analysis: { report, source: action.source, review: "pending", revision: cycle.revision },
    };
  }
  if (!cycle.analysis || cycle.analysis.review !== "pending") return cycle;
  return { ...cycle, analysis: { ...cycle.analysis, review: action.decision } };
}

export function approvedAnalysis(cycle: LearningCycle): AnalystReport | null {
  return cycle.analysis?.review === "approved" && cycle.analysis.revision === cycle.revision
    ? cycle.analysis.report
    : null;
}
