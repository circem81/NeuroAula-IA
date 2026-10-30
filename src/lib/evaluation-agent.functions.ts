import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { createSupabaseServerClient } from "./supabase.server";
import { loadDemoSession } from "./demo-session";
import { evaluateProportionality } from "./evaluation-agent";
import { generateEvaluationSuggestion } from "./evaluation-agent.server";

// Temporary single-process pilot throttle, not a production distributed quota.
const recentRequests = new Map<string, number[]>();
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 5;

function enforcePilotLimit(userId: string) {
  const now = Date.now();
  const times = (recentRequests.get(userId) ?? []).filter((time) => now - time < WINDOW_MS);
  if (times.length >= MAX_REQUESTS) {
    throw new Error("Límite de cinco evaluaciones por minuto alcanzado.");
  }
  recentRequests.set(userId, [...times, now]);
}

export const evaluateSyntheticProportionality = createServerFn({ method: "POST" })
  .validator(z.object({ answer: z.string().min(1).max(12) }))
  .handler(async ({ data }) => {
    // Authorization lives in this endpoint, not merely in route navigation.
    const supabase = createSupabaseServerClient();
    if (!supabase) throw new Error("No está disponible la autenticación del servidor.");
    const { data: auth, error } = await supabase.auth.getUser();
    if (error || !auth.user) throw new Error("Es necesario iniciar sesión.");

    const session = await loadDemoSession(supabase, auth.user);
    if (!session || session.role !== "teacher") {
      throw new Error("Esta prueba solo está autorizada para docentes.");
    }

    // The caller cannot choose activity, prompt, model or student identity.
    if (process.env.NEUROAULA_AGENT_DEMO_ENABLED !== "true") {
      throw new Error("El agente LLM aún no está habilitado en este entorno.");
    }
    enforcePilotLimit(auth.user.id);
    return evaluateProportionality(data.answer, generateEvaluationSuggestion);
  });
