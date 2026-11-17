import { createFileRoute } from "@tanstack/react-router";
import { useLang } from "@/lib/i18n";
import { demoT } from "@/lib/demo-i18n";
import { latestActivities } from "@/lib/demo-data";
import { WaterInquiry } from "@/components/water-inquiry";
import {
  faradayArea,
  faradayContributions,
  faradayIndexUrl,
  faradayPdfUrl,
  faradayPilots,
} from "@/lib/faraday-catalog";

export const Route = createFileRoute("/demo/actividades")({
  component: Activities,
});

function Activities() {
  const { lang } = useLang();
  const t = demoT[lang];
  const es = lang === "es";

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">{t.nav.activities}</h1>
        <p className="text-sm text-ink-soft">{t.dashboard.latestActivities}</p>
      </header>
      <WaterInquiry lang={lang} />

      <section aria-labelledby="faraday-heading" className="card-soft space-y-4 p-5">
        <div>
          <div className="text-[11px] uppercase tracking-wider text-ink-soft">
            {es ? "Biblioteca didáctica · recurso externo" : "Teaching library · external resource"}
          </div>
          <h2 id="faraday-heading" className="mt-1 text-lg font-semibold">
            Faraday 2026 · {es ? "Experimentar para comprender" : "Experiment to understand"}
          </h2>
          <p className="mt-2 text-sm text-ink-soft">
            {es
              ? "Número especial del GEDH (RSEF/RSEQ): 31 contribuciones con autoría atribuida y seis posibles pilotos diseñados por NeuroAula."
              : "Special issue by GEDH (RSEF/RSEQ): 31 credited contributions and six proposed NeuroAula pilot adaptations."}
          </p>
          <p className="mt-2 text-xs text-ink-soft">
            {es
              ? "Catálogo documental, no actividad ejecutable: sin RAG, sin evaluación por IA y sin PDF alojado aquí."
              : "Documentary catalog, not a runnable activity: no RAG, no AI assessment and no PDF hosted here."}
          </p>
        </div>

        <div className="flex flex-wrap gap-3 text-sm underline underline-offset-4">
          <a href={faradayIndexUrl} target="_blank" rel="noopener noreferrer">
            {es ? "Índice y autoría oficial" : "Official index and credits"}
          </a>
          <a href={faradayPdfUrl} target="_blank" rel="noopener noreferrer">
            {es ? "Consultar PDF en origen" : "View PDF at publisher"}
          </a>
        </div>

        <div>
          <h3 className="text-sm font-semibold">
            {es ? "Seis propuestas originales para explorar" : "Six original pilot proposals"}
          </h3>
          <ul className="mt-3 grid gap-3 md:grid-cols-2">
            {faradayPilots.map((pilot) => {
              const source = faradayContributions.find((article) => article.number === pilot.number);
              if (!source) return null;
              return (
                <li key={pilot.number} className="rounded-lg border border-border p-3">
                  <div className="text-xs text-ink-soft">
                    {faradayArea(pilot.number)} · {pilot.stage}
                  </div>
                  <div className="mt-1 text-sm font-semibold">{source.title}</div>
                  <p className="mt-1 text-xs text-ink-soft">
                    {es ? "Autoría:" : "Authors:"} {source.authors}
                  </p>
                  <p className="mt-2 text-sm">{pilot.objective}</p>
                  <p className="mt-2 text-xs text-ink-soft">
                    <strong>{es ? "Posible confusión en una respuesta:" : "Possible misconception in a response:"}</strong>{" "}
                    {pilot.commonError}
                  </p>
                  <p className="mt-1 text-xs text-ink-soft">
                    <strong>{es ? "Apoyo propuesto:" : "Proposed scaffold:"}</strong>{" "}
                    {pilot.scaffold}
                  </p>
                </li>
              );
            })}
          </ul>
          {!es && (
            <p className="mt-2 text-xs text-ink-soft">
              Pilot descriptions are currently in Spanish; the source publication is in Spanish.
            </p>
          )}
        </div>

        <details className="rounded-lg border border-border p-3">
          <summary className="cursor-pointer text-sm font-semibold">
            {es ? "Consultar las 31 contribuciones" : "Browse all 31 contributions"}
          </summary>
          <ol className="mt-3 space-y-2 text-sm">
            {faradayContributions.map((article) => (
              <li key={article.number}>
                <span className="font-medium">{article.number}. {article.title}</span>
                <span className="block text-xs text-ink-soft">
                  {faradayArea(article.number)} · {article.authors}
                </span>
              </li>
            ))}
          </ol>
        </details>
        <p className="text-xs text-ink-soft">
          {es
            ? "Las propuestas son de NeuroAula, no de los autores. Validar seguridad, nivel curricular y derechos antes de usar una práctica."
            : "Proposals are NeuroAula's own, not the authors'. Check safety, curriculum and rights before using an experiment."}
        </p>
      </section>

      <section aria-labelledby="latest-activities-title" className="space-y-3">
        <h2 id="latest-activities-title" className="text-lg font-semibold">
          {t.dashboard.latestActivities}
        </h2>
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
      </section>
    </div>
  );
}
