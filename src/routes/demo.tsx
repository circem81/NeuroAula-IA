import { Link, Outlet, createFileRoute, redirect, useRouterState } from "@tanstack/react-router";
import {
  Brain,
  Home,
  Users,
  Sparkles,
  Layers,
  ClipboardList,
  FileText,
  Bell,
  Settings,
  ArrowLeft,
  LogOut,
  LockKeyhole,
} from "lucide-react";
import { LanguageProvider, useLang, type Lang } from "@/lib/i18n";
import { demoT } from "@/lib/demo-i18n";
import { DemoAuthProvider, demoProfiles, useDemoAuth } from "@/lib/demo-auth";
import { DemoAccess } from "@/components/demo-access";
import { canAccessDemoPath, canSeeDemoSection } from "@/lib/demo-permissions";
import { getServerDemoSession } from "@/lib/demo-auth.server";

export const Route = createFileRoute("/demo")({
  loader: async ({ location }) => {
    const session = await getServerDemoSession();
    if (!session && location.pathname !== "/demo") throw redirect({ to: "/demo" });
    return session;
  },
  head: () => ({
    meta: [
      { title: "NeuroAula AI — Demo con datos simulados" },
      {
        name: "description",
        content:
          "Demo navegable de NeuroAula AI con datos simulados: panel del profesor, perfil educativo y aprendizaje adaptativo.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: DemoLayout,
});

function DemoLayout() {
  const initialSession = Route.useLoaderData();
  return (
    <LanguageProvider>
      <DemoAuthProvider initialSession={initialSession}>
        <DemoGate />
      </DemoAuthProvider>
    </LanguageProvider>
  );
}

function DemoGate() {
  const { passwordRecovery, ready, session } = useDemoAuth();

  if (!ready) {
    return <div className="min-h-screen bg-[oklch(0.985_0.005_260)]" aria-busy="true" />;
  }

  return session && !passwordRecovery ? <Shell /> : <DemoAccess />;
}

function Shell() {
  const { selectOrganization, session, signOut } = useDemoAuth();
  const { lang, setLang } = useLang();
  const t = demoT[lang];
  const demoLabel = lang === "es" ? "Demo con datos simulados" : "Demo with simulated data";
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const profile = session ? demoProfiles[session.role] : null;

  const allItems = [
    { to: "/demo", label: t.nav.home, icon: Home, exact: true },
    { to: "/demo/alumnado", label: t.nav.students, icon: Users },
    { to: "/demo/gemelo", label: t.nav.twin, icon: Brain },
    { to: "/demo/adaptativo", label: t.nav.adaptive, icon: Sparkles },
    { to: "/demo/actividades", label: t.nav.activities, icon: Layers },
    { to: "/demo/informes", label: t.nav.reports, icon: FileText },
    { to: "/demo/alertas", label: t.nav.alerts, icon: Bell },
    { to: "/demo/config", label: t.nav.settings, icon: Settings },
  ];
  const familyItem = {
    to: "/demo/alumno/lucia-fernandez",
    label: lang === "es" ? "Progreso de Lucía" : "Lucía's progress",
    icon: Users,
    exact: false,
  };
  const items = session
    ? [
        ...allItems.filter((item) => canSeeDemoSection(session.role, item.to)),
        ...(session.role === "family" ? [familyItem] : []),
      ]
    : [];
  const canAccessCurrentRoute = session ? canAccessDemoPath(session.role, pathname) : false;

  const isActive = (to: string, exact?: boolean) =>
    exact ? pathname === to : pathname === to || pathname.startsWith(to + "/");

  return (
    <div className="min-h-screen bg-[oklch(0.985_0.005_260)] text-ink">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden w-64 shrink-0 flex-col border-r border-border/70 bg-white lg:flex">
          <div className="flex items-center gap-2 px-5 py-5">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-brand">
              <Brain className="h-4 w-4 text-white" />
            </div>
            <div>
              <div className="text-sm font-semibold">NeuroAula AI</div>
              <div className="text-[11px] text-ink-soft">{t.school}</div>
            </div>
          </div>
          <nav className="flex flex-1 flex-col gap-0.5 px-3 py-2 text-sm">
            {items.map((it) => {
              const Icon = it.icon;
              const active = isActive(it.to, it.exact);
              return (
                <Link
                  key={it.to}
                  to={it.to}
                  className={`flex items-center gap-2.5 rounded-xl px-3 py-2 transition ${
                    active
                      ? "bg-gradient-brand text-white shadow-glow"
                      : "text-ink-soft hover:bg-muted hover:text-ink"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {it.label}
                </Link>
              );
            })}
          </nav>
          <div className="border-t border-border/70 px-4 py-4 text-xs">
            <Link to="/" className="inline-flex items-center gap-1.5 text-ink-soft hover:text-ink">
              <ArrowLeft className="h-3.5 w-3.5" /> {t.nav.backSite}
            </Link>
          </div>
        </aside>

        {/* Main */}
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-border/70 bg-white/85 px-5 py-3 backdrop-blur">
            <div className="min-w-0">
              <div className="mb-1 inline-flex rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-800 ring-1 ring-amber-200">
                {demoLabel}
              </div>
              <div className="text-[11px] font-mono uppercase tracking-widest text-ink-soft">
                {t.school} · {t.course}
              </div>
              <div className="truncate text-sm font-semibold">
                {t.teacher} — {t.group}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <LangSwitch value={lang} onChange={setLang} />
              {session && session.memberships.length > 1 && (
                <select
                  aria-label={lang === "es" ? "Centro activo" : "Active organization"}
                  value={session.organizationId}
                  onChange={(event) => selectOrganization(event.target.value)}
                  className="hidden max-w-44 rounded-lg border border-border bg-white px-2 py-1.5 text-xs md:block"
                >
                  {session.memberships.map((membership) => (
                    <option key={membership.organizationId} value={membership.organizationId}>
                      {membership.organizationName}
                    </option>
                  ))}
                </select>
              )}
              <div className="hidden text-right md:block">
                <div className="text-xs font-semibold text-ink">{session?.name}</div>
                <div className="text-[10px] text-ink-soft">
                  {profile?.label} · {session?.organizationName}
                </div>
              </div>
              <button
                type="button"
                onClick={() => void signOut()}
                title={lang === "es" ? "Cerrar sesión" : "Sign out"}
                aria-label={lang === "es" ? "Cerrar sesión" : "Sign out"}
                className="grid h-8 w-8 place-items-center rounded-full border border-border/70 bg-white text-ink-soft transition hover:bg-muted hover:text-ink"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
          </header>

          <nav
            aria-label={lang === "es" ? "Navegación de la demo" : "Demo navigation"}
            className="sticky top-[81px] z-20 flex gap-1 overflow-x-auto border-b border-border/70 bg-white px-3 py-2 text-xs lg:hidden"
          >
            {items.map((it) => {
              const Icon = it.icon;
              const active = isActive(it.to, it.exact);
              return (
                <Link
                  key={it.to}
                  to={it.to}
                  aria-current={active ? "page" : undefined}
                  className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-2 transition ${
                    active
                      ? "bg-gradient-brand text-white shadow-glow"
                      : "bg-muted text-ink-soft hover:text-ink"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {it.label}
                </Link>
              );
            })}
            <Link
              to="/"
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-2 text-ink-soft hover:bg-muted hover:text-ink"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> {t.nav.backSite}
            </Link>
          </nav>

          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
            <p className="sr-only">
              {demoLabel}.{" "}
              {lang === "es"
                ? "Ningún contenido de esta zona procede de estudiantes reales."
                : "No content in this area comes from real students."}
            </p>
            {canAccessCurrentRoute ? <Outlet /> : <AccessDenied />}
          </main>
        </div>
      </div>
    </div>
  );
}

function AccessDenied() {
  const { lang } = useLang();
  const { session } = useDemoAuth();
  const profile = session ? demoProfiles[session.role] : null;

  return (
    <section className="mx-auto grid max-w-xl place-items-center py-20 text-center">
      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-amber-50 text-amber-700 ring-1 ring-amber-200">
        <LockKeyhole className="h-5 w-5" />
      </span>
      <h1 className="mt-5 text-2xl font-semibold text-ink">
        {lang === "es" ? "Sección no disponible" : "Section unavailable"}
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-ink-soft">
        {lang === "es"
          ? `El perfil de ${profile?.label.toLowerCase() ?? "esta sesión"} no tiene acceso a esta sección de la demostración.`
          : `The ${profile?.label.toLowerCase() ?? "current"} profile cannot access this section of the demo.`}
      </p>
      <Link
        to="/demo"
        className="mt-6 inline-flex rounded-full bg-gradient-brand px-4 py-2 text-sm font-medium text-white shadow-glow"
      >
        {lang === "es" ? "Volver al panel" : "Back to dashboard"}
      </Link>
    </section>
  );
}

function LangSwitch({ value, onChange }: { value: Lang; onChange: (l: Lang) => void }) {
  return (
    <div className="inline-flex items-center gap-0.5 rounded-full border border-border/70 bg-white p-0.5 text-xs font-medium">
      {(["es", "en"] as Lang[]).map((code) => {
        const active = value === code;
        return (
          <button
            key={code}
            type="button"
            onClick={() => onChange(code)}
            aria-pressed={active}
            className={`rounded-full px-2.5 py-1 transition ${
              active ? "bg-gradient-brand text-white" : "text-ink-soft hover:text-ink"
            }`}
          >
            {code.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}
