import { createServerFn } from "@tanstack/react-start";
import { loadDemoSession } from "@/lib/demo-session";
import { createSupabaseServerClient } from "@/lib/supabase.server";

export const getServerDemoSession = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = createSupabaseServerClient();
  if (!supabase) return null;

  // Server code verifies the token with Supabase Auth; it never trusts the
  // cookie contents or getSession() as proof of identity.
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;

  return loadDemoSession(supabase, data.user);
});
