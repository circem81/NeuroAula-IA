import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, ArrowRight } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { demoT } from "@/lib/demo-i18n";
import { latestActivities } from "@/lib/demo-data";

export const Route = createFileRoute("/demo/actividades")({
  component: Activities,
});

function Activities() {
  const { lang } = useLang();
  const t = demoT[lang];
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">{t.nav.activities}</h1>
        <p className="text-sm text-ink-soft">{t.dashboard.latestActivities}</p>
      </header>
      <Link
        to="/libros"
        className="group flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[oklch(0.73_0.12_265)] bg-white p-5 shadow-sm transition hover:shadow-md"
      >
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-brand text-white">
            <BookOpen className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-base font-semibold">Libros interactivos · Español / العربية</h2>
            <p className="mt-1 max-w-xl text-sm text-ink-soft">
              Abre la demostración bilingüe de lectura y vocabulario: A1, A2 y B1.
              Contenido ficticio, autocorrección local y vista del docente.
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 text-sm font-medium text-ink">
          Abrir libro <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </span>
      </Link>
      <Link
        to="/newton"
        className="group flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border/70 bg-white p-5 shadow-sm transition hover:shadow-md"
      >
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-brand text-white">
            <BookOpen className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-base font-semibold">Matemáticas Newton · Proporcionalidad</h2>
            <p className="mt-1 max-w-xl text-sm text-ink-soft">
              Actividades propias paso a paso y acceso al índice externo de Genially.
              Apoyos personalizables para atención, comprensión y lectura.
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 text-sm font-medium text-ink">
          Abrir matemáticas <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </span>
      </Link>
      <ul className="grid gap-3 sm:grid-cols-2">
        {latestActivities.map((a) => {
          const pct = Math.round((a.completed / a.total) * 100);
          return (
            <li key={a.title} className="card-soft p-5">
              <div className="text-[11px] uppercase tracking-wider text-ink-soft">{a.type}</div>
              <div className="text-sm font-semibold">{a.title}</div>
              <div className="mt-3 text-xs text-ink-soft">
                {a.completed}/{a.total} {t.dashboard.completed}
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                <div className="h-full bg-gradient-brand" style={{ width: `${pct}%` }} />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
