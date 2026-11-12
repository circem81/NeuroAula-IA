import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { canUseTutor, tutorInputSchema } from "@/lib/tutor";
import type { TutorResult } from "@/lib/tutor-provider.server";
import { analystInputSchema, type AnalystReport } from "@/lib/learning-analyst";
import { agentConfigured, readAgentConfig, type AgentResult } from "@/lib/structured-agent.server";

export const getTutorAvailability = createServerFn({ method: "GET" })
  .validator(z.object({ organizationId: z.string().uuid() }).strict())
  .handler(async ({ data }) => {
    const { getResponse } = await import("@tanstack/react-start/server");
    getResponse().headers.set("Cache-Control", "no-store");
    const { getServerDemoSession } = await import("@/lib/demo-auth.server");
    const session = await getServerDemoSession();
    if (!canUseTutor(session, data.organizationId)) return { available: false };
    return {
      available: agentConfigured(readAgentConfig(process.env)),
    };
  });

export const generateLearningAnalysis = createServerFn({ method: "POST" })
  .validator(analystInputSchema)
  .handler(async ({ data }): Promise<AgentResult<AnalystReport>> => {
    const { getResponse } = await import("@tanstack/react-start/server");
    getResponse().headers.set("Cache-Control", "no-store");
    const { getServerDemoSession } = await import("@/lib/demo-auth.server");
    const session = await getServerDemoSession();
    if (!session || !canUseTutor(session, data.organizationId))
      return { ok: false, code: "unauthorized" };
    const { tutorLimiter } = await import("@/lib/tutor-provider.server");
    if (!tutorLimiter.acquire(session.id)) return { ok: false, code: "rate_limited" };
    try {
      const { requestLearningAnalysis } = await import("@/lib/learning-analyst-provider.server");
      return await requestLearningAnalysis(data, readAgentConfig(process.env));
    } finally {
      tutorLimiter.release(session.id);
    }
  });

export const generateTutorAdvice = createServerFn({ method: "POST" })
  .validator(tutorInputSchema)
  .handler(async ({ data }): Promise<TutorResult> => {
    const { getResponse } = await import("@tanstack/react-start/server");
    getResponse().headers.set("Cache-Control", "no-store");
    const { getServerDemoSession } = await import("@/lib/demo-auth.server");
    const session = await getServerDemoSession();
    if (!session || !canUseTutor(session, data.organizationId))
      return { ok: false, code: "unauthorized" };
    const { requestTutorAdvice, tutorLimiter } = await import("@/lib/tutor-provider.server");
    const key = session.id;
    if (!tutorLimiter.acquire(key)) return { ok: false, code: "rate_limited" };
    try {
      return await requestTutorAdvice(data, readAgentConfig(process.env));
    } finally {
      tutorLimiter.release(key);
    }
  });
