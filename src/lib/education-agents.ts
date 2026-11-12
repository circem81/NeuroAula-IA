import { z } from "zod";
import {
  analystInputSchema,
  analyzeEvidence,
  guidedAnalysis,
  type AnalystInput,
} from "./learning-analyst.ts";
import { tutorActivity, type TutorLang } from "./tutor.ts";

export const agentIds = [
  "curriculum",
  "evaluation",
  "analytics",
  "executive",
  "teacher",
  "family",
  "accessibility",
  "research",
] as const;
export type EducationAgentId = (typeof agentIds)[number];
type Localized = { es: string; en: string };
type Field = { key: string; label: Localized };
type Definition = { id: EducationAgentId; name: Localized; purpose: Localized; fields: Field[] };
const field = (key: string, es: string, en: string): Field => ({ key, label: { es, en } });
export const educationAgents: Definition[] = [
  {
    id: "curriculum",
    name: { es: "Currículo", en: "Curriculum" },
    purpose: {
      es: "Objetivo, prerrequisitos y secuencia del ejercicio.",
      en: "Exercise objective, prerequisites and sequence.",
    },
    fields: [
      field("objective", "Objetivo", "Objective"),
      field("prerequisites", "Prerrequisitos por comprobar", "Prerequisites to check"),
      field("sequence", "Secuencia propuesta", "Suggested sequence"),
    ],
  },
  {
    id: "evaluation",
    name: { es: "Evaluación", en: "Assessment" },
    purpose: {
      es: "Criterios para observar el procedimiento, sin asignar notas.",
      en: "Criteria for observing the method, without grading.",
    },
    fields: [
      field("criteria", "Criterios observables", "Observable criteria"),
      field("evidence", "Evidencia disponible", "Available evidence"),
      field("check", "Pregunta de comprobación", "Check question"),
    ],
  },
  {
    id: "analytics",
    name: { es: "Analítica de aprendizaje", en: "Learning analytics" },
    purpose: {
      es: "Resume intentos y distingue hechos de interpretaciones.",
      en: "Summarizes attempts and separates facts from interpretations.",
    },
    fields: [
      field("summary", "Resumen", "Summary"),
      field("questions", "Preguntas para el docente", "Teacher questions"),
      field("nextStep", "Siguiente paso", "Next step"),
    ],
  },
  {
    id: "executive",
    name: { es: "Funciones ejecutivas", en: "Executive functions" },
    purpose: {
      es: "Apoyos para planificar y comprobar la tarea, sin inferir un perfil.",
      en: "Supports for planning and checking the task, without inferring a profile.",
    },
    fields: [
      field("plan", "Plan de trabajo", "Work plan"),
      field("checklist", "Lista de comprobación", "Checklist"),
      field("choice", "Elección del alumno", "Learner choice"),
    ],
  },
  {
    id: "teacher",
    name: { es: "Asistente docente", en: "Teacher assistant" },
    purpose: {
      es: "Prepara una intervención breve para revisar en clase.",
      en: "Prepares a short intervention for classroom review.",
    },
    fields: [
      field("intervention", "Intervención", "Intervention"),
      field("question", "Pregunta al alumno", "Learner question"),
      field("review", "Qué revisar después", "What to review next"),
    ],
  },
  {
    id: "family",
    name: { es: "Asistente familiar", en: "Family assistant" },
    purpose: {
      es: "Borrador para explicar la actividad a la familia; no se envía.",
      en: "Draft explaining the activity to families; nothing is sent.",
    },
    fields: [
      field("message", "Borrador de mensaje", "Message draft"),
      field("homeActivity", "Propuesta voluntaria", "Optional activity"),
      field("boundary", "Límites del mensaje", "Message limits"),
    ],
  },
  {
    id: "accessibility",
    name: { es: "Accesibilidad", en: "Accessibility" },
    purpose: {
      es: "Reformula instrucciones y ofrece opciones de presentación.",
      en: "Rephrases instructions and offers presentation options.",
    },
    fields: [
      field("instruction", "Instrucción clara", "Clear instruction"),
      field("presentation", "Opciones de presentación", "Presentation options"),
      field("preference", "Preferencia por consultar", "Preference to ask about"),
    ],
  },
  {
    id: "research",
    name: { es: "Investigación", en: "Research" },
    purpose: {
      es: "Formula una pregunta y un método; no inventa bibliografía.",
      en: "Frames a question and method; never invents references.",
    },
    fields: [
      field("question", "Pregunta de investigación", "Research question"),
      field("method", "Método propuesto", "Proposed method"),
      field("limitations", "Limitaciones", "Limitations"),
    ],
  },
];
export function educationAgent(id: EducationAgentId) {
  return educationAgents.find((agent) => agent.id === id)!;
}
export const educationAgentInputSchema = z
  .object({ agentId: z.enum(agentIds), context: analystInputSchema })
  .strict();
export type EducationAgentInput = z.infer<typeof educationAgentInputSchema>;
export type AgentDraft = {
  agentId: EducationAgentId;
  fields: Record<string, string>;
  evidenceAttempts: number[];
  sourceId: typeof tutorActivity.source;
};

export function agentOutputSchema(id: EducationAgentId) {
  const fields = Object.fromEntries(
    educationAgent(id).fields.map(({ key }) => [key, z.string().trim().min(1).max(900)]),
  );
  return z
    .object({
      fields: z.object(fields).strict(),
      evidenceAttempts: z.array(z.number().int().min(1).max(5)).min(1).max(5),
      sourceId: z.literal(tutorActivity.source),
    })
    .strict();
}
export function validateAgentDraft(
  id: EducationAgentId,
  value: unknown,
  context: AnalystInput,
): AgentDraft | null {
  const result = agentOutputSchema(id).safeParse(value);
  if (!result.success) return null;
  const refs = result.data.evidenceAttempts;
  if (new Set(refs).size !== refs.length || refs.some((n) => n > context.attempts.length))
    return null;
  return { agentId: id, ...result.data };
}
export function nextTrialStep(context: AnalystInput, lang: TutorLang) {
  const facts = analyzeEvidence(context.attempts);
  if (!facts.solved && facts.total >= 5)
    return lang === "es"
      ? "Prueba finalizada: revisar con el docente antes de reiniciar."
      : "Trial ended: review with the teacher before restarting.";
  if (facts.solved)
    return lang === "es"
      ? "Comprobar el procedimiento en otro ejercicio; un acierto no demuestra dominio."
      : "Check the method on another exercise; one correct answer does not establish mastery.";
  return lang === "es"
    ? "Explicar la primera operación con el docente antes de volver a intentarlo."
    : "Explain the first operation with the teacher before trying again.";
}
export function programmedAgentDraft(input: EducationAgentInput): AgentDraft {
  const { agentId, context } = educationAgentInputSchema.parse(input);
  const es = context.lang === "es";
  const tr = (a: string, b: string) => (es ? a : b);
  const facts = analyzeEvidence(context.attempts);
  const analysis = guidedAnalysis(context.attempts, context.lang);
  const summary = tr(
    `${facts.total} intento(s), ${facts.incorrect} incorrecto(s).`,
    `${facts.total} attempt(s), ${facts.incorrect} incorrect answer(s).`,
  );
  const next = nextTrialStep(context, context.lang);
  const entries: Record<EducationAgentId, string[]> = {
    curriculum: [
      tr(
        "Practicar operaciones equivalentes en una ecuación lineal.",
        "Practise equivalent operations in a linear equation.",
      ),
      tr(
        "Comprobar que puede identificar ambos miembros y explicar operaciones inversas. No se han evaluado estos prerrequisitos.",
        "Check whether the learner can identify both sides and explain inverse operations. These prerequisites have not been assessed.",
      ),
      next,
    ],
    evaluation: [
      tr(
        "Observar si explica la misma operación en ambos miembros y comprueba su resultado.",
        "Observe whether the learner explains the same operation on both sides and checks the result.",
      ),
      summary +
        " " +
        tr(
          "Las respuestas seleccionadas no muestran el procedimiento seguido.",
          "Selected answers do not show the method used.",
        ),
      tr(
        "¿Cómo justificarías tu primera operación?",
        "How would you justify your first operation?",
      ),
    ],
    analytics: [analysis.summary, analysis.questions.join("\n"), next],
    executive: [
      tr(
        "Leer la ecuación, elegir una operación y comprobar ambos miembros.",
        "Read the equation, choose an operation and check both sides.",
      ),
      tr(
        "Una operación por línea. Revisar signos y copiar la igualdad completa.",
        "One operation per line. Check signs and copy the complete equality.",
      ),
      tr(
        "Preguntar si prefiere una lista escrita o explicar el plan en voz alta. No se infieren capacidades ejecutivas.",
        "Ask whether a written checklist or explaining the plan aloud is preferred. No executive abilities are inferred.",
      ),
    ],
    teacher: [
      next,
      tr(
        "¿Qué intentaste y qué cambiarías en tu primera operación?",
        "What did you try, and what would you change in your first operation?",
      ),
      summary +
        " " +
        tr(
          "Pedir una explicación; este registro no demuestra causas ni eficacia de la ayuda.",
          "Ask for an explanation; this record does not establish causes or the effectiveness of support.",
        ),
    ],
    family: [
      tr(
        "Borrador sobre una prueba ficticia: se practica cómo mantener la igualdad en una ecuación. El docente revisará el procedimiento.",
        "Draft about a fictional trial: the activity practises keeping both sides of an equation equal. The teacher will review the method.",
      ),
      tr(
        "Si lo desea, el alumno puede explicar qué significa el signo igual, sin resolver otra tarea por obligación.",
        "If they wish, the learner can explain what the equals sign means, without being required to solve another task.",
      ),
      tr(
        "No describe a un alumno real, no atribuye dificultades ni se envía automáticamente.",
        "This does not describe a real learner, attribute difficulties or send anything automatically.",
      ),
    ],
    accessibility: [
      tr(
        "Lee 2x + 3 = 11. Elige una respuesta. Explica qué operación harías primero.",
        "Read 2x + 3 = 11. Choose an answer. Explain which operation you would do first.",
      ),
      tr(
        "Ofrecer una instrucción por línea y espacio para escribir. Mantener la ecuación y el objetivo.",
        "Offer one instruction per line and space to write. Keep the equation and objective unchanged.",
      ),
      tr(
        "¿Prefieres leer la instrucción o que el docente la lea? Estas opciones no presuponen una discapacidad.",
        "Would you rather read the instruction or have the teacher read it? These options do not assume a disability.",
      ),
    ],
    research: [
      tr(
        "¿Qué explicaciones da el alumno antes y después de recibir una pista revisada?",
        "What explanations does the learner give before and after a reviewed hint?",
      ),
      tr(
        "Proponer una rúbrica de explicación y comparar varias actividades con revisión docente. No recopilar nuevos datos desde esta prueba.",
        "Propose an explanation rubric and compare several activities with teacher review. Do not collect new data from this trial.",
      ),
      tr(
        "Una prueba ficticia no permite conclusiones causales. No hay búsqueda bibliográfica ni referencias externas verificadas.",
        "A fictional trial cannot support causal conclusions. No literature search or verified external references are available.",
      ),
    ],
  };
  return {
    agentId,
    fields: Object.fromEntries(
      educationAgent(agentId).fields.map((field, i) => [field.key, entries[agentId][i]]),
    ),
    evidenceAttempts: context.attempts.map((_, i) => i + 1),
    sourceId: tutorActivity.source,
  };
}

export type ReviewedAgentDraft = {
  draft: AgentDraft;
  source: "guided" | "ai";
  review: "pending" | "approved" | "rejected";
};
export type AgentBoard = Partial<Record<EducationAgentId, ReviewedAgentDraft>>;
export function reviewAgentDraft(
  board: AgentBoard,
  id: EducationAgentId,
  decision: "approved" | "rejected",
): AgentBoard {
  const entry = board[id];
  if (!entry || entry.review !== "pending") return board;
  return { ...board, [id]: { ...entry, review: decision } };
}
