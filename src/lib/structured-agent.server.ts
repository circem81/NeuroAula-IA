import { z, type ZodType } from "zod";

export type AgentErrorCode =
  "not_configured" | "unavailable" | "invalid_response" | "rate_limited" | "unauthorized";
export type AgentResult<T> = { ok: true; advice: T } | { ok: false; code: AgentErrorCode };
export type ProviderConfig = {
  apiKey?: string;
  model?: string;
  maxOutputTokens?: number;
  timeoutMs?: number;
};

const configSchema = z.object({
  apiKey: z.string().trim().min(1),
  model: z.string().trim().min(1),
  maxOutputTokens: z.number().int().min(256).max(25000).optional(),
  timeoutMs: z.number().int().min(1000).max(120000).optional(),
});

export function readAgentConfig(env: Record<string, string | undefined>): ProviderConfig {
  const number = (value: string | undefined) => (value?.trim() ? Number(value) : undefined);
  return {
    apiKey: env.OPENAI_API_KEY,
    model: env.OPENAI_MODEL,
    maxOutputTokens: number(env.OPENAI_MAX_OUTPUT_TOKENS),
    timeoutMs: number(env.OPENAI_TIMEOUT_MS),
  };
}

export function agentConfigured(config: ProviderConfig) {
  return configSchema.safeParse(config).success;
}

export async function requestStructuredAgent<T>(
  spec: {
    instructions: string;
    input: unknown;
    name: string;
    jsonSchema: Record<string, unknown>;
    outputSchema: ZodType<T>;
  },
  config: ProviderConfig,
  request: typeof fetch = fetch,
): Promise<AgentResult<T>> {
  const parsedConfig = configSchema.safeParse(config);
  if (!parsedConfig.success) return { ok: false, code: "not_configured" };
  const settings = parsedConfig.data;
  const astra = settings.model === "gpt-6-astra";
  try {
    const response = await request("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${settings.apiKey}` },
      signal: AbortSignal.timeout(settings.timeoutMs ?? (astra ? 45_000 : 25_000)),
      body: JSON.stringify({
        model: settings.model,
        store: false,
        max_output_tokens: settings.maxOutputTokens ?? (astra ? 4096 : 1200),
        ...(astra ? { reasoning: { effort: "low" }, service_tier: "default" } : {}),
        instructions: spec.instructions,
        input: JSON.stringify(spec.input),
        text: {
          format: { type: "json_schema", name: spec.name, strict: true, schema: spec.jsonSchema },
        },
      }),
    });
    if (!response.ok)
      return { ok: false, code: response.status === 429 ? "rate_limited" : "unavailable" };
    // Provider-controlled JSON must be checked before use; refusals are never successful drafts.
    const body = (await response.json()) as {
      status?: string;
      output?: Array<{ type?: string; content?: Array<{ type?: string; text?: string }> }>;
    };
    if (body.status !== "completed" || !Array.isArray(body.output))
      return { ok: false, code: "invalid_response" };
    const content = body.output
      .filter((item) => item.type === "message")
      .flatMap((item) => item.content ?? []);
    if (content.some((item) => item.type === "refusal"))
      return { ok: false, code: "invalid_response" };
    const output = content
      .filter((item) => item.type === "output_text")
      .map((item) => item.text ?? "")
      .join("");
    let parsed: unknown;
    try {
      parsed = JSON.parse(output);
    } catch {
      return { ok: false, code: "invalid_response" };
    }
    const result = spec.outputSchema.safeParse(parsed);
    return result.success
      ? { ok: true, advice: result.data }
      : { ok: false, code: "invalid_response" };
  } catch {
    // Do not expose credentials, provider bodies or stack traces, and do not retry silently.
    return { ok: false, code: "unavailable" };
  }
}
