import { analyzeEvidence, analystNextSteps } from "./learning-analyst.ts";
import { requestLearningAnalysis } from "./learning-analyst-provider.server.ts";
import { canUseTutor, tutorActivity } from "./tutor.ts";
import { tutorLimiter } from "./tutor-provider.server.ts";
import { type ProviderConfig, type AgentResult } from "./structured-agent.server.ts";
import { requestEducationalModel as requestStructuredAgent } from "./model-gateway.server.ts";
import {
  educationAgent,
  educationAgentInputSchema,
  agentOutputSchema,
  validateAgentDraft,
  nextTrialStep,
  type EducationAgentInput,
  type EducationAgentId,
  type AgentDraft,
} from "./education-agents.ts";

const roles: Record<EducationAgentId, string> = {
  curriculum:
    "Design an exercise-level learning objective, prerequisites to check, and a short teaching sequence. Never claim official curriculum alignment or invent standards.",
  evaluation:
    "Propose observable assessment criteria and a check question. Correctness comes only from the supplied rule-computed facts. Do not assign grades or infer mastery from selected answers.",
  analytics: "Summarize observed evidence, distinguishing facts from unknown causes.",
  executive:
    "Suggest optional task planning, sequencing and self-check supports. Never assess or infer executive-function ability, attention, memory, or a cognitive profile.",
  teacher:
    "Draft a brief classroom intervention, one learner question and a follow-up observation. Respect the supplied nextTrialStep; no further attempts after an exhausted trial.",
  family:
    "Draft a plain-language explanation of this fictional exercise for teacher review, an optional home discussion and explicit limits. It is not a report about a real learner. Never invent family circumstances. Do not send anything or imply a message has been sent.",
  accessibility:
    "Rewrite the instruction in plain language and suggest optional presentation choices. Keep the equation and learning objective unchanged. Ask a preference without presuming disability. Do not claim accessibility certification or that a UI adaptation has been applied.",
  research:
    "Propose a research question, an evaluation method and limitations. You have NO external search or bibliography. Do not invent citations, URLs, authors, studies or results. Explicitly state there is no literature review and a fictional trial cannot establish causal effects. Do not propose collecting identifiable learner data.",
};

export async function requestEducationAgent(
  input: EducationAgentInput,
  config: ProviderConfig,
  request: typeof fetch = fetch,
): Promise<AgentResult<AgentDraft>> {
  const parsed = educationAgentInputSchema.safeParse(input);
  if (!parsed.success) return { ok: false, code: "invalid_response" };
  const { agentId, context } = parsed.data;
  if (agentId === "analytics") {
    const result = await requestLearningAnalysis(context, config, request);
    if (!result.ok) return result;
    return {
      ok: true,
      advice: {
        agentId,
        fields: {
          summary: result.advice.summary,
          questions: result.advice.questions.join("\n"),
          nextStep: analystNextSteps[context.lang][result.advice.nextStep],
        },
        evidenceAttempts: result.advice.evidenceAttempts,
        sourceId: tutorActivity.source,
      },
    };
  }
  const definition = educationAgent(agentId);
  const properties = Object.fromEntries(
    definition.fields.map(({ key }) => [key, { type: "string" }]),
  );
  const result = await requestStructuredAgent(
    {
      name: `education_${agentId}`,
      instructions: `You are NeuroAula's ${agentId} specialist. ${roles[agentId]} Write in ${context.lang === "es" ? "Spanish" : "English"}. Each field must contain at most 900 characters. Work only with the supplied authored exercise and rule-computed fictional evidence. Do not reveal the solution unless facts.solved is true. Never infer diagnosis, disability, emotional state, motivation, mastery or causality. Do not invent evidence. Cite actual attempt numbers in evidenceAttempts and copy sourceId exactly. sourceId is internal authored material, not external scientific evidence. Respect nextTrialStep, including teacher review at five unsolved attempts. Produce a draft for teacher review, not an autonomous decision. No tools, external actions or student records are available. Field meanings: ${definition.fields.map((field) => `${field.key}: ${field.label.en}`).join("; ")}.`,
      input: {
        activity: tutorActivity.equation,
        sourceId: tutorActivity.source,
        facts: analyzeEvidence(context.attempts),
        nextTrialStep: nextTrialStep(context, context.lang),
      },
      outputSchema: agentOutputSchema(agentId),
      jsonSchema: {
        type: "object",
        properties: {
          fields: {
            type: "object",
            properties,
            required: Object.keys(properties),
            additionalProperties: false,
          },
          evidenceAttempts: { type: "array", items: { type: "integer" } },
          sourceId: { type: "string", enum: [tutorActivity.source] },
        },
        required: ["fields", "evidenceAttempts", "sourceId"],
        additionalProperties: false,
      },
    },
    config,
    request,
  );
  if (!result.ok) return result;
  const draft = validateAgentDraft(agentId, result.advice, context);
  return draft ? { ok: true, advice: draft } : { ok: false, code: "invalid_response" };
}

// The server supplies the verified session. Never accept it from a browser payload.
export async function runEducationAgent(
  session: { id: string; memberships: Array<{ organizationId: string; role: string }> } | null,
  input: EducationAgentInput,
  config: ProviderConfig,
  request: typeof fetch = fetch,
  limiter = tutorLimiter,
): Promise<AgentResult<AgentDraft>> {
  const parsed = educationAgentInputSchema.safeParse(input);
  if (!parsed.success) return { ok: false, code: "invalid_response" };
  if (!session || !canUseTutor(session, parsed.data.context.organizationId))
    return { ok: false, code: "unauthorized" };
  if (!limiter.acquire(session.id)) return { ok: false, code: "rate_limited" };
  try {
    return await requestEducationAgent(parsed.data, config, request);
  } finally {
    limiter.release(session.id);
  }
}
