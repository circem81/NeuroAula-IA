import { educationAgent } from "./education-agents.ts";
import {
  catalogActivity,
  pathwayRequestSchema,
  pathwayDraftSchema,
  validatePathwayDraft,
  type PathwayRequest,
  type PathwayDraft,
} from "./activity-pathway.ts";
import { canUseTutor } from "./tutor.ts";
import { tutorLimiter } from "./tutor-provider.server.ts";
import { requestEducationalModel } from "./model-gateway.server.ts";
import type { AgentResult, ProviderConfig } from "./structured-agent.server.ts";

export async function runPathwayAgent(
  session: { id: string; memberships: Array<{ organizationId: string; role: string }> } | null,
  input: PathwayRequest,
  config: ProviderConfig,
  request: typeof fetch = fetch,
  limiter = tutorLimiter,
): Promise<AgentResult<PathwayDraft>> {
  const parsed = pathwayRequestSchema.safeParse(input);
  if (!parsed.success) return { ok: false, code: "invalid_response" };
  if (!session || !canUseTutor(session, parsed.data.organizationId))
    return { ok: false, code: "unauthorized" };
  if (!limiter.acquire(session.id)) return { ok: false, code: "rate_limited" };
  try {
    const data = parsed.data;
    const activity = catalogActivity(data.activityId);
    const agent = educationAgent(data.agentId);
    const result = await requestEducationalModel(
      {
        name: "activity_pathway_draft",
        instructions: `Eres el especialista ${agent.name.es} de NeuroAula. Función: ${agent.purpose.es}. Tus campos de trabajo son: ${agent.fields.map((f) => f.label.es).join(", ")}. Escribe en español un borrador de apoyo para revisión docente, guidance de máximo 1800 caracteres y question de máximo 500. Usa solo la actividad propia suministrada y la respuesta inicial sintética. No reveles la solución de la comprobación. No diagnostiques ni infieras discapacidad, estado emocional, capacidad, motivación, dominio ni causalidad. No inventes hechos, citas, resultados ni fuentes. No tienes acceso a libros, búsqueda, contenido de Genially ni herramientas externas. No envíes mensajes ni afirmes haber aplicado adaptaciones. Si actúas como investigador, declara que no hay revisión bibliográfica. Copia activityId, agentId y sourceId exactamente. Una respuesta inicial no establece competencia global.`,
        input: {
          activityId: activity.id,
          agentId: data.agentId,
          sourceId: activity.sourceId,
          objective: activity.objective,
          prerequisite: activity.prerequisite,
          instruction: activity.instruction,
          initial: {
            prompt: activity.initial.prompt,
            selected: activity.initial.options[data.answers[activity.id]],
            correct: data.answers[activity.id] === activity.initial.correct,
          },
          checkPrompt: activity.check.prompt,
        },
        outputSchema: pathwayDraftSchema,
        jsonSchema: {
          type: "object",
          properties: {
            activityId: { type: "string", enum: [activity.id] },
            agentId: { type: "string", enum: [data.agentId] },
            sourceId: { type: "string", enum: [activity.sourceId] },
            guidance: { type: "string" },
            question: { type: "string" },
          },
          required: ["activityId", "agentId", "sourceId", "guidance", "question"],
          additionalProperties: false,
        },
      },
      config,
      request,
    );
    if (!result.ok) return result;
    const advice = validatePathwayDraft(result.advice, data);
    return advice ? { ok: true, advice } : { ok: false, code: "invalid_response" };
  } finally {
    limiter.release(session.id);
  }
}
