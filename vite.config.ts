// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { loadEnv } from "vite";

// Read server-only development settings without defining them in the client bundle.
// Production gets these values from the host's runtime secrets.
const serverEnv = loadEnv(process.env.NODE_ENV ?? "development", process.cwd(), "OPENAI_");
for (const key of ["OPENAI_API_KEY", "OPENAI_MODEL"] as const) {
  if (!process.env[key] && serverEnv[key]) process.env[key] = serverEnv[key];
}

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
});
