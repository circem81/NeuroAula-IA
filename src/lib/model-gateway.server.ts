import type { ZodType } from "zod";
import {
  requestStructuredAgent,
  type AgentResult,
  type ProviderConfig,
} from "./structured-agent.server.ts";

export type EducationalAgentSpec<T> = {
  instructions: string;
  input: unknown;
  name: string;
  jsonSchema: Record<string, unknown>;
  outputSchema: ZodType<T>;
};

/** NeuroAula-owned port. Additional providers must implement and test this contract explicitly. */
export interface EducationalModelAdapter {
  generate<T>(
    spec: EducationalAgentSpec<T>,
    config: ProviderConfig,
    request: typeof fetch,
  ): Promise<AgentResult<T>>;
}

const openAIAdapter: EducationalModelAdapter = { generate: requestStructuredAgent };
export const MODEL_GATEWAY_CONFIG = { maxInputBytes: 16_384, maxInstructionsBytes: 8_192 } as const;

export function createModelGateway(adapter: EducationalModelAdapter) {
  return async function generate<T>(
    spec: EducationalAgentSpec<T>,
    config: ProviderConfig,
    request: typeof fetch = fetch,
  ): Promise<AgentResult<T>> {
    try {
      const serialized = JSON.stringify(spec.input);
      if (
        serialized === undefined ||
        new TextEncoder().encode(serialized).length > MODEL_GATEWAY_CONFIG.maxInputBytes ||
        new TextEncoder().encode(spec.instructions).length >
          MODEL_GATEWAY_CONFIG.maxInstructionsBytes
      )
        return { ok: false, code: "invalid_response" };
      // Never pass a mutable reference to caller-owned evidence/state into a provider adapter.
      const result = await adapter.generate(
        { ...spec, input: JSON.parse(serialized) },
        { ...config },
        request,
      );
      if (!result.ok) return result;
      const validated = spec.outputSchema.safeParse(result.advice);
      return validated.success
        ? { ok: true, advice: validated.data }
        : { ok: false, code: "invalid_response" };
    } catch {
      return { ok: false, code: "unavailable" };
    }
  };
}

// No automatic fallback to another provider, local runtime or model.
export const requestEducationalModel = createModelGateway(openAIAdapter);
