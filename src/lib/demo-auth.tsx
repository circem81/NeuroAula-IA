import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  demoProfiles,
  loadDemoSession,
  selectDemoOrganization,
  type DemoRole,
  type DemoSession,
} from "@/lib/demo-session";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

export type { DemoRole, DemoSession } from "@/lib/demo-session";
export { demoProfiles } from "@/lib/demo-session";

type AuthResult = { error: string | null; emailConfirmationRequired?: boolean };
type DemoAuthContextValue = {
  configured: boolean;
  passwordRecovery: boolean;
  ready: boolean;
  session: DemoSession | null;
  selectOrganization: (organizationId: string) => void;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signUp: (name: string, email: string, password: string) => Promise<AuthResult>;
  requestPasswordReset: (email: string) => Promise<AuthResult>;
  updatePassword: (password: string) => Promise<AuthResult>;
  signOut: () => Promise<void>;
};

const ACTIVE_ORGANIZATION_KEY = "neuroaula.active-organization";
const DemoAuthContext = createContext<DemoAuthContextValue | null>(null);

function preferredOrganizationId() {
  try {
    return window.localStorage.getItem(ACTIVE_ORGANIZATION_KEY);
  } catch {
    return null;
  }
}

export function DemoAuthProvider({
  children,
  initialSession,
}: {
  children: ReactNode;
  initialSession: DemoSession | null;
}) {
  // The route loader has already completed a server-side auth check, including
  // when it returns null for an anonymous request.
  const [ready, setReady] = useState(true);
  const [session, setSession] = useState<DemoSession | null>(initialSession);
  const [passwordRecovery, setPasswordRecovery] = useState(false);

  useEffect(() => {
    if (!supabase) return;
    const client = supabase;
    let active = true;

    const refreshSession = async () => {
      const { data } = await client.auth.getSession();
      const nextSession = await loadDemoSession(client, data.session, preferredOrganizationId());
      if (active) {
        setSession(nextSession);
        setReady(true);
      }
    };

    void refreshSession();
    const { data } = client.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setPasswordRecovery(true);
      // Defer database reads until the auth callback releases its internal lock.
      window.setTimeout(() => void refreshSession(), 0);
    });

    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<DemoAuthContextValue>(
    () => ({
      configured: isSupabaseConfigured,
      passwordRecovery,
      ready,
      session,
      selectOrganization(organizationId) {
        if (!session) return;
        const next = selectDemoOrganization(session, organizationId);
        try {
          window.localStorage.setItem(ACTIVE_ORGANIZATION_KEY, next.organizationId);
        } catch {
          // Selection remains valid for this tab when storage is unavailable.
        }
        setSession(next);
      },
      async signIn(email, password) {
        if (!supabase) return { error: "Supabase todavía no está configurado." };
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (!error && !(await loadDemoSession(supabase, data.session, preferredOrganizationId()))) {
          await supabase.auth.signOut();
          return { error: "Tu cuenta no tiene una membresía activa en NeuroAula." };
        }
        return { error: error?.message ?? null };
      },
      async signUp(name, email, password) {
        if (!supabase) return { error: "Supabase todavía no está configurado." };
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { name }, emailRedirectTo: `${window.location.origin}/demo` },
        });
        return {
          error: error?.message ?? null,
          emailConfirmationRequired: !error && !data.session,
        };
      },
      async requestPasswordReset(email) {
        if (!supabase) return { error: "Supabase todavía no está configurado." };
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/demo`,
        });
        return { error: error?.message ?? null };
      },
      async updatePassword(password) {
        if (!supabase) return { error: "Supabase todavía no está configurado." };
        const { error } = await supabase.auth.updateUser({ password });
        if (!error) setPasswordRecovery(false);
        return { error: error?.message ?? null };
      },
      async signOut() {
        if (supabase) await supabase.auth.signOut();
        try {
          window.localStorage.removeItem(ACTIVE_ORGANIZATION_KEY);
        } catch {
          // Supabase still clears the authentication cookies.
        }
        setSession(null);
      },
    }),
    [passwordRecovery, ready, session],
  );

  return <DemoAuthContext.Provider value={value}>{children}</DemoAuthContext.Provider>;
}

export function useDemoAuth() {
  const context = useContext(DemoAuthContext);
  if (!context) throw new Error("useDemoAuth must be used inside DemoAuthProvider");
  return context;
}
