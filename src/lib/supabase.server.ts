import { createServerClient } from "@supabase/ssr";
import { getCookies, getResponse, setCookie } from "@tanstack/react-start/server";
import { isSupabaseConfigured, supabasePublishableKey, supabaseUrl } from "@/lib/supabase-config";

export function createSupabaseServerClient() {
  if (!isSupabaseConfigured) return null;

  return createServerClient(supabaseUrl, supabasePublishableKey, {
    cookies: {
      getAll() {
        return Object.entries(getCookies()).map(([name, value]) => ({ name, value }));
      },
      setAll(cookiesToSet, headers) {
        for (const { name, value, options } of cookiesToSet) {
          setCookie(name, value, options);
        }

        const responseHeaders = getResponse().headers;
        for (const [name, value] of Object.entries(headers)) {
          responseHeaders.set(name, value);
        }
      },
    },
  });
}
