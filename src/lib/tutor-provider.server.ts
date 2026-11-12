import {
  tutorAdviceSchema,
  guidedAdvice,
  tutorActivity,
  type TutorInput,
  type TutorAdvice,
} from "./tutor.ts";
import {
  agentConfigured,
  type AgentErrorCode,
  type AgentResult,
  type ProviderConfig,
} from "./structured-agent.server.ts";
import { requestEducationalModel as requestStructuredAgent } from "./model-gateway.server.ts";

export type TutorErrorCode = AgentErrorCode;
export type TutorResult = AgentResult<TutorAdvice>;
export const tutorConfigured = agentConfigured;

export async function requestTutorAdvice(
  input: TutorInput,
  config: ProviderConfig,
  request: typeof fetch = fetch,
): Promise<TutorResult> {
  return requestStructuredAgent(
    {
      name: "tutor_advice",
      instructions: `You are a teaching assistant drafting a short hint for teacher review, in ${input.lang === "es" ? "Spanish" : "English"}. Use only the supplied authored exercise and observed answers. Never diagnose, infer cognitive traits, motivation or disability, claim mastery or causality, or invent external sources. Correctness is established by the supplied answer key, not by you. Offer the requested hint level; do not reveal x = 4 unless the learner has already answered correctly. The observation must distinguish observed facts from unknown causes. Propose one practical next step. Your output is a draft, never an autonomous teaching decision.`,
      input: {
        activity: tutorActivity.equation,
        correctAnswer: tutorActivity.correctAnswer,
        source: tutorActivity.source,
        answers: input.answers,
        hintLevel: input.level,
        evidence: guidedAdvice(input.answers, input.level, input.lang),
      },
      outputSchema: tutorAdviceSchema,
      jsonSchema: {
        type: "object",
        properties: {
          hint: { type: "string" },
          observation: { type: "string" },
          nextStep: { type: "string" },
        },
        required: ["hint", "observation", "nextStep"],
        additionalProperties: false,
      },
    },
    config,
    request,
  );
}

// A per-process safeguard for the demonstration, not a distributed production quota.
export function createTutorLimiter() {
  const windows = new Map<string, { start: number; count: number; busy: boolean }>();
  return {
    acquire(key: string, now = Date.now()) {
      for (const [id, entry] of windows)
        if (!entry.busy && now - entry.start >= 60_000) windows.delete(id);
      const entry = windows.get(key) ?? { start: now, count: 0, busy: false };
      if (entry.busy || entry.count >= 5 || (!windows.has(key) && windows.size >= 1000))
        return false;
      entry.count += 1;
      entry.busy = true;
      windows.set(key, entry);
      return true;
    },
    release(key: string) {
      const entry = windows.get(key);
      if (entry) entry.busy = false;
    },
  };
}

export const tutorLimiter = createTutorLimiter();
