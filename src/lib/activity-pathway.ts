import { z } from "zod";
import { agentIds, educationAgent, type EducationAgentId } from "./education-agents.ts";

export const newtonIndex = {
  url: "https://view.genially.com/5f7e09dd1b2b330d2efa2489",
  title: "Índice Genially · pepvidalg",
  source: "G01",
};
export const activityIds = ["fractions", "proportions", "equations"] as const;
export type ActivityId = (typeof activityIds)[number];
type Question = { prompt: string; options: string[]; correct: number };
export type CatalogActivity = {
  id: ActivityId;
  title: string;
  objective: string;
  prerequisite: string;
  sourceId: string;
  agentId: EducationAgentId;
  initial: Question;
  check: Question;
  instruction: string;
};
// Authored examples, not copies or verified individual activities from Genially.
export const activityCatalog: CatalogActivity[] = [
  {
    id: "fractions",
    title: "Fracciones equivalentes",
    objective: "Reconocer fracciones equivalentes",
    prerequisite: "Interpretar numerador y denominador; comprobarlo con el docente",
    sourceId: "neuroaula:fractions:v1",
    agentId: "accessibility",
    initial: {
      prompt: "¿Qué fracción equivale a 1/2?",
      options: ["1/4", "2/4", "2/3"],
      correct: 1,
    },
    check: { prompt: "¿Qué fracción equivale a 2/3?", options: ["4/6", "2/6", "3/4"], correct: 0 },
    instruction:
      "Dibuja dos rectángulos iguales. Divide uno en tres partes y otro en seis. Representa la misma cantidad en ambos y explica tu elección.",
  },
  {
    id: "proportions",
    title: "Proporcionalidad",
    objective: "Mantener una razón al cambiar cantidades",
    prerequisite: "Explicar una multiplicación y reconocer cantidades relacionadas; por comprobar",
    sourceId: "neuroaula:proportions:v1",
    agentId: "executive",
    initial: {
      prompt: "Dos cuadernos cuestan 6 €. Al mismo precio por unidad, ¿cuánto cuestan cuatro?",
      options: ["8 €", "10 €", "12 €"],
      correct: 2,
    },
    check: {
      prompt: "Tres cuadernos cuestan 9 €. Al mismo precio por unidad, ¿cuánto cuestan cinco?",
      options: ["11 €", "15 €", "18 €"],
      correct: 1,
    },
    instruction:
      "Organiza una tabla de cantidad y precio. Busca el precio de una unidad y comprueba si la relación se mantiene.",
  },
  {
    id: "equations",
    title: "Ecuaciones paso a paso",
    objective: "Resolver una ecuación conservando la igualdad",
    prerequisite: "Reconocer operaciones inversas y ambos miembros de una igualdad; por comprobar",
    sourceId: "neuroaula:equations:v1",
    agentId: "teacher",
    initial: { prompt: "En 2x + 3 = 11, ¿cuánto vale x?", options: ["3", "4", "7"], correct: 1 },
    check: { prompt: "En 3x + 2 = 17, ¿cuánto vale x?", options: ["3", "4", "5"], correct: 2 },
    instruction:
      "Escribe una operación por línea. Haz la misma operación en ambos miembros y comprueba el resultado sustituyéndolo.",
  },
];
export const catalogActivity = (id: ActivityId) => activityCatalog.find((a) => a.id === id)!;
export const initialAnswersSchema = z
  .object({
    fractions: z.number().int().min(0).max(2),
    proportions: z.number().int().min(0).max(2),
    equations: z.number().int().min(0).max(2),
  })
  .strict();
export type InitialAnswers = z.infer<typeof initialAnswersSchema>;
export function recommendActivities(answers: InitialAnswers) {
  const valid = initialAnswersSchema.parse(answers);
  return [...activityCatalog]
    .sort(
      (a, b) =>
        Number(valid[a.id] === a.initial.correct) - Number(valid[b.id] === b.initial.correct),
    )
    .map((a) => ({
      activityId: a.id,
      agentId: a.agentId,
      reason:
        valid[a.id] === a.initial.correct
          ? "Acierto en una pregunta inicial: comprobar el procedimiento en otra tarea. No demuestra dominio."
          : "Respuesta inicial incorrecta: revisar este objetivo con apoyo y preguntar por el procedimiento. No demuestra su causa.",
    }));
}
export const pathwayRequestSchema = z
  .object({
    organizationId: z.string().uuid(),
    activityId: z.enum(activityIds),
    agentId: z.enum(agentIds),
    answers: initialAnswersSchema,
  })
  .strict();
export type PathwayRequest = z.infer<typeof pathwayRequestSchema>;
export const pathwayDraftSchema = z
  .object({
    activityId: z.enum(activityIds),
    agentId: z.enum(agentIds),
    sourceId: z.string().max(80),
    guidance: z.string().trim().min(1).max(1800),
    question: z.string().trim().min(1).max(500),
  })
  .strict();
export type PathwayDraft = z.infer<typeof pathwayDraftSchema>;
export function validatePathwayDraft(value: unknown, request: PathwayRequest) {
  const parsed = pathwayDraftSchema.safeParse(value);
  if (
    !parsed.success ||
    parsed.data.activityId !== request.activityId ||
    parsed.data.agentId !== request.agentId ||
    parsed.data.sourceId !== catalogActivity(request.activityId).sourceId
  )
    return null;
  return parsed.data;
}
export function guidedPathwayDraft(request: PathwayRequest): PathwayDraft {
  const input = pathwayRequestSchema.parse(request);
  const a = catalogActivity(input.activityId);
  const role: Record<EducationAgentId, string> = {
    curriculum: `Objetivo: ${a.objective}. Prerrequisito: ${a.prerequisite}. Secuencia: representar, explicar y comprobar.`,
    evaluation:
      "Observa la explicación y la comprobación. La opción marcada solo informa del resultado de esta pregunta; no permite asignar una nota global.",
    analytics: recommendActivities(input.answers).find((r) => r.activityId === a.id)!.reason,
    executive:
      "Divide la tarea en tres pasos: leer, representar y comprobar. Marca cada paso al terminar. El alumno puede elegir empezar por un dibujo o una tabla.",
    teacher:
      "Pide una explicación antes de dar más ayuda. Compara la representación con el enunciado y acuerda una comprobación final.",
    family:
      "Borrador para revisión docente: proponemos conversar sobre cómo se resuelve esta actividad ficticia. Es voluntario y no es un informe del alumno. No se ha enviado ningún mensaje.",
    accessibility:
      "Lee una instrucción cada vez. Ofrece texto ampliado o una representación en papel según la preferencia del alumno. No se presume discapacidad ni se ha aplicado una adaptación automática.",
    research:
      "Pregunta: ¿qué explicaciones aparecen al usar esta representación? Registra solo observaciones sintéticas para revisar el método. No hay revisión bibliográfica ni se pueden inferir efectos causales.",
  };
  return {
    activityId: a.id,
    agentId: input.agentId,
    sourceId: a.sourceId,
    guidance: `${role[input.agentId]} ${a.instruction}`,
    question: "¿Cómo explicarías tu procedimiento y cómo comprobarías tu respuesta?",
  };
}
export const pathwayEventSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("initial"), answers: initialAnswersSchema }).strict(),
  z
    .object({
      type: z.literal("proposal"),
      draft: pathwayDraftSchema,
      source: z.enum(["guided", "ai"]),
    })
    .strict(),
  z.object({ type: z.literal("review"), decision: z.enum(["approved", "rejected"]) }).strict(),
  z.object({ type: z.literal("answer"), option: z.number().int().min(0).max(2) }).strict(),
  z
    .object({ type: z.literal("evidence_review"), decision: z.enum(["confirmed", "needs_review"]) })
    .strict(),
]);
export type PathwayAction = z.infer<typeof pathwayEventSchema>;
const entrySchema = z
  .object({
    id: z.string().uuid(),
    at: z.string().datetime(),
    actorId: z.string().uuid(),
    action: pathwayEventSchema,
  })
  .strict();
export type PathwayEntry = z.infer<typeof entrySchema>;
export type PathwayState = {
  answers?: InitialAnswers;
  proposal?: {
    draft: PathwayDraft;
    source: "guided" | "ai";
    review: "pending" | "approved" | "rejected";
  };
  evidence?: {
    activityId: ActivityId;
    sourceId: string;
    option: number;
    correct: boolean;
    review: "pending" | "confirmed" | "needs_review";
  };
  entries: PathwayEntry[];
};
export function reducePathway(state: PathwayState, entry: PathwayEntry): PathwayState {
  const checked = entrySchema.safeParse(entry);
  if (
    !checked.success ||
    state.entries.length >= 100 ||
    state.entries.some((e) => e.id === entry.id)
  )
    return state;
  const action = checked.data.action;
  let next: PathwayState;
  switch (action.type) {
    case "initial":
      if (state.answers) return state;
      next = { answers: action.answers, entries: state.entries };
      break;
    case "proposal": {
      if (
        !state.answers ||
        state.proposal?.review === "pending" ||
        (state.proposal?.review === "approved" &&
          (!state.evidence || state.evidence.review === "pending"))
      )
        return state;
      const draft = validatePathwayDraft(action.draft, {
        organizationId: "00000000-0000-4000-8000-000000000000",
        answers: state.answers,
        activityId: action.draft.activityId,
        agentId: action.draft.agentId,
      });
      if (!draft) return state;
      next = {
        answers: state.answers,
        proposal: { draft, source: action.source, review: "pending" },
        entries: state.entries,
      };
      break;
    }
    case "review":
      if (state.proposal?.review !== "pending") return state;
      next = { ...state, proposal: { ...state.proposal, review: action.decision } };
      break;
    case "answer": {
      if (state.proposal?.review !== "approved" || state.evidence) return state;
      const a = catalogActivity(state.proposal.draft.activityId);
      next = {
        ...state,
        evidence: {
          activityId: a.id,
          sourceId: a.sourceId,
          option: action.option,
          correct: action.option === a.check.correct,
          review: "pending",
        },
      };
      break;
    }
    case "evidence_review":
      if (state.evidence?.review !== "pending") return state;
      next = { ...state, evidence: { ...state.evidence, review: action.decision } };
      break;
  }
  return { ...next, entries: [...state.entries, checked.data] };
}
export const pathwayRecordSchema = z
  .object({
    version: z.literal(1),
    organizationId: z.string().uuid(),
    actorId: z.string().uuid(),
    entries: z.array(entrySchema).max(100),
  })
  .strict();
export function restorePathway(
  value: unknown,
  organizationId: string,
  actorId: string,
): PathwayState | null {
  const parsed = pathwayRecordSchema.safeParse(value);
  if (
    !parsed.success ||
    parsed.data.organizationId !== organizationId ||
    parsed.data.actorId !== actorId
  )
    return null;
  let state: PathwayState = { entries: [] };
  for (const entry of parsed.data.entries) {
    if (entry.actorId !== actorId) return null;
    const next = reducePathway(state, entry);
    if (next === state) return null;
    state = next;
  }
  return state;
}
export const agentName = (id: EducationAgentId) => educationAgent(id).name.es;
