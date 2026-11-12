import { createServerFn } from "@tanstack/react-start";
import { pathwayRequestSchema } from "./activity-pathway";
export const generatePathwayDraft = createServerFn({ method: "POST" })
  .validator(pathwayRequestSchema)
  .handler(async ({ data }) => {
    const { getResponse } = await import("@tanstack/react-start/server");
    getResponse().headers.set("Cache-Control", "no-store");
    const { getServerDemoSession } = await import("./demo-auth.server");
    const { readAgentConfig } = await import("./structured-agent.server");
    const { runPathwayAgent } = await import("./activity-pathway-provider.server");
    return runPathwayAgent(await getServerDemoSession(), data, readAgentConfig(process.env));
  });
