import { buildLearningTwin, type LearningEvidence } from "./learning-twin.ts";
import { tutorActivity, type TutorState } from "./tutor.ts";

// A separate pseudonym for the fictional laboratory; never a real learner ID.
const demoStudentId = "00000000-0000-4000-8000-000000000001";
export function evaluateTutorEvidence(
  state: TutorState,
  organizationId: string,
): LearningEvidence[] {
  return state.runs.flatMap((run, index) =>
    run.evidenceId && run.answeredAt
      ? [
          {
            id: run.evidenceId,
            organizationId,
            studentId: demoStudentId,
            activityId: tutorActivity.id,
            criterionId: "NEUROAULA.ALG-01.v1",
            subject: "mathematics",
            correct: run.answer === tutorActivity.correctAnswer,
            reasoningQuality: null,
            supportLevel: run.observedSupport ?? null,
            transferLevel: 0,
            attempts: index + 1,
            errorType: null,
            strategies: [],
            evaluatorConfidence: 1,
            previousEvidenceId: state.runs[index - 1]?.evidenceId ?? null,
            createdAt: run.answeredAt,
          },
        ]
      : [],
  );
}

export function tutorLearningTwin(state: TutorState, organizationId: string, now: string) {
  return buildLearningTwin(evaluateTutorEvidence(state, organizationId), now);
}
