import { createServerFn } from "@tanstack/react-start";
import { educationAgentInputSchema, type AgentDraft } from "./education-agents";
import type { AgentResult } from "./structured-agent.server";

export const generateEducationAgent = createServerFn({ method: "POST" })
  .validator(educationAgentInputSchema)
  .handler(async ({ data }): Promise<AgentResult<AgentDraft>> => {
    const { getResponse } = await import("@tanstack/react-start/server");
    getResponse().headers.set("Cache-Control", "no-store");
    const { getServerDemoSession } = await import("./demo-auth.server");
    const { runEducationAgent } = await import("./education-agents-provider.server");
    const { readAgentConfig } = await import("./structured-agent.server");
    return runEducationAgent(await getServerDemoSession(), data, readAgentConfig(process.env));
  });
