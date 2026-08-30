import { createFileRoute } from "@tanstack/react-router";
import { FileText, CheckCircle2, Sparkles } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { demoT } from "@/lib/demo-i18n";
import { lomloeReport } from "@/lib/demo-data";

export const Route = createFileRoute("/demo/informes")({
  component: Reports,
});

function Reports() {
  const { lang } = useLang();
  const t = demoT[lang];
  const r = lomloeReport;
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">{t.reports.title}</h1>
        <p className="text-sm text-ink-soft">{t.reports.subtitle}</p>
      </header>

      <div className="card-soft p-6">
        <div className="mb-4 flex items-center gap-2">
          <FileText className="h-5 w-5 text-[oklch(0.55_0.2_265)]" />
          <div className="text-sm font-semibold">Números enteros — 2.º ESO · {t.group}</div>
        </div>

        <Section title={t.reports.competencies}>
          <ul className="flex flex-col gap-2 text-sm">
            {r.competencies.map((c) => (
              <li key={c.code} className="flex gap-2">
                <span className="rounded-md bg-muted px-2 py-0.5 font-mono text-[11px]">
                  {c.code}
                </span>
                <span>{c.name}</span>
              </li>
            ))}
          </ul>
        </Section>

        <Section title={t.reports.criteria}>
          <ul className="flex flex-col gap-2 text-sm">
            {r.criteria.map((c) => (
              <li key={c} className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" /> {c}
              </li>
            ))}
          </ul>
        </Section>

        <Section title={t.reports.evidence}>
          <ul className="flex flex-col gap-2 text-sm text-ink-soft">
            {r.evidence.map((e) => (
              <li key={e}>· {e}</li>
            ))}
          </ul>
        </Section>

        <div className="my-5 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl bg-emerald-50 p-4">
            <div className="text-[11px] uppercase tracking-wider text-emerald-700">
              {t.reports.achievement}
            </div>
            <div className="text-lg font-semibold text-emerald-900">{r.achievement}</div>
          </div>
          <div className="rounded-2xl bg-muted/60 p-4 text-sm">
            <div className="text-[11px] uppercase tracking-wider text-ink-soft">
              {t.reports.observations}
            </div>
            <div className="mt-1">{r.observations}</div>
          </div>
        </div>

        <Section title={t.reports.recommendations}>
          <ul className="flex flex-col gap-2 text-sm">
            {r.recommendations.map((c) => (
              <li
                key={c}
                className="flex items-start gap-2 rounded-xl bg-[oklch(0.97_0.02_275)] p-3"
              >
                <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[oklch(0.55_0.2_265)]" /> {c}
              </li>
            ))}
          </ul>
        </Section>

        <button
          type="button"
          disabled
          aria-describedby="report-demo-note"
          className="mt-4 cursor-not-allowed rounded-full bg-gradient-brand px-4 py-2 text-sm font-medium text-white opacity-60 shadow-glow"
        >
          {t.reports.generate}
        </button>
        <p id="report-demo-note" className="mt-2 text-xs text-ink-soft">
          {lang === "es"
            ? "Función no disponible en esta demo; el informe mostrado utiliza datos simulados."
            : "Not available in this demo; the report shown uses simulated data."}
        </p>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-border/60 py-4">
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-soft">{title}</h3>
      {children}
    </div>
  );
}
