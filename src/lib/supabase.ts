import { createBrowserClient } from "@supabase/ssr";
import { isSupabaseConfigured, supabasePublishableKey, supabaseUrl } from "@/lib/supabase-config";

export { isSupabaseConfigured } from "@/lib/supabase-config";

// Cookie-backed auth lets the browser and TanStack Start server share the
// same session. The publishable key remains safe to include in the bundle.
export const supabase =
  isSupabaseConfigured && typeof window !== "undefined"
    ? createBrowserClient(supabaseUrl, supabasePublishableKey)
    : null;
