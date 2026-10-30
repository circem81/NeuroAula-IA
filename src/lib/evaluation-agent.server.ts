import {
  PROPORTIONALITY_CASE,
  type AgentSuggestion,
  parseSuggestion,
} from "./evaluation-agent";

const OUTPUT_SCHEMA = {
  type: "object",
  properties: {
    category: {
      type: "string",
      enum: ["none", "conceptual", "calculation", "procedure", "uncertain"],
    },
    feedback: { type: "string" },
    hint: { type: "string" },
  },
  required: ["category", "feedback", "hint"],
  additionalProperties: false,
} as const;

type ModelResponse = {
  status?: string;
  output?: Array<{
    type?: string;
    content?: Array<{ type?: string; text?: string }>;
  }>;
};

/**
 * Server-only provider adapter; no persistence or third-party student data.
 * Feature is disabled unless explicitly enabled by the deployer.
 */
export async function generateEvaluationSuggestion(input: {
  answer: string;
  correct: boolean;
}): Promise<AgentSuggestion> {
  const key = process.env.OPENAI_API_KEY;
  const model = process.env.NEUROAULA_EVAL_MODEL;
  if (process.env.NEUROAULA_AGENT_DEMO_ENABLED !== "true") {
    throw new Error("La prueba con LLM está desactivada en este entorno.");
  }
  if (!key || !model) {
    throw new Error("Falta configurar el modelo o la clave de API en el servidor.");
  }

  let response: Response;
  try {
    response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      signal: AbortSignal.timeout(12000),
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        store: false,
        max_output_tokens: 450,
        instructions:
          "Eres un evaluador formativo de matemáticas de ESO. " +
          "Analiza exclusivamente la respuesta numérica a un ejercicio sintético. " +
          "No infieras salud, neurodivergencia ni rasgos personales. " +
          "El indicador 'correct' está calculado por código y no se puede contradecir. " +
          "Si es correcta, responde category=none. Si es incorrecta y no puedes " +
          "determinar la causa, category=uncertain. Redacta en español: feedback " +
          "breve y una pista, sin inventar información sobre el estudiante. " +
          "No tomes decisiones académicas ni asignes niveles.",
        input: JSON.stringify({
          activity: PROPORTIONALITY_CASE.statement,
          correctAnswer: PROPORTIONALITY_CASE.expectedAnswer,
          studentAnswer: input.answer,
          correct: input.correct,
        }),
        text: {
          format: {
            type: "json_schema",
            name: "neuroaula_evaluation_v1",
            strict: true,
            schema: OUTPUT_SCHEMA,
          },
        },
      }),
    });
  } catch {
    throw new Error("El servicio de evaluación no respondió a tiempo.");
  }
  if (!response.ok) {
    // Do not relay provider errors, response bodies or credentials to the UI.
    throw new Error("El proveedor LLM no pudo completar la evaluación.");
  }

  let payload: ModelResponse;
  try {
    payload = (await response.json()) as ModelResponse;
  } catch {
    throw new Error("El proveedor devolvió una respuesta ilegible.");
  }
  if (payload.status !== "completed") {
    throw new Error("El modelo no completó la evaluación.");
  }
  const rawText = payload.output
    ?.filter((item) => item.type === "message")
    .flatMap((item) => item.content ?? [])
    .find((item) => item.type === "output_text")?.text;
  if (!rawText) throw new Error("El modelo no devolvió una evaluación estructurada.");

  let parsed: unknown;
  try {
    parsed = JSON.parse(rawText);
  } catch {
    throw new Error("El modelo devolvió JSON inválido.");
  }
  return parseSuggestion(parsed);
}
