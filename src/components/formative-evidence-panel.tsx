import { ClipboardCheck, Eye, Lightbulb } from "lucide-react";
import {
  formativeDashboardDemo,
  type EvidenceContext,
  type FormativeStatus,
} from "@/lib/formative-dashboard-demo";

const labels = {
  es: {
    title: "Mapa de criterios y evidencias",
    demo: "Simulación pedagógica · criterios ilustrativos, no códigos oficiales LOMLOE",
    description:
      "Las observaciones de práctica no equivalen a aprendizaje autónomo acreditado. No hay evaluación ni seguimiento automático.",
    noSamples: "Este perfil no tiene ejemplos de evidencias formativas en la demo.",
    strengths: "Fortalezas observadas (ejemplo)",
    evolution: "Evolución de aprendizaje (secuencia simulada)",
    opportunities: "Aspectos a reforzar (ejemplo)",
    competency: "Competencia relacionada",
    evidence: "Evidencia",
    support: "Apoyo proporcionado",
    next: "Siguiente intervención propuesta",
    context: {
      assisted_unverified: "Práctica asistida/no verificada",
      supervised: "Actividad supervisada",
    },
    status: {
      developing: "En proceso",
      pending_review: "Pendiente de revisión humana",
      teacher_validated: "Validado por docente (simulado)",
    },
    footer:
      "En un sistema real cada evidencia tendría fecha, referencia curricular, autoría, procedencia y revisión autorizada. La nota siempre es una decisión profesional.",
  },
  en: {
    title: "Criteria and evidence map",
    demo: "Educational simulation · sample criteria, not official curriculum codes",
    description:
      "Unverified practice does not certify independent understanding. No automated assessment or tracking is performed.",
    noSamples: "This demo profile has no formative evidence examples.",
    strengths: "Observed strengths (sample)",
    evolution: "Learning development (simulated sequence)",
    opportunities: "Areas to support (sample)",
    competency: "Related competency",
    evidence: "Evidence",
    support: "Support offered",
    next: "Suggested next intervention",
    context: {
      assisted_unverified: "Assisted/unverified practice",
      supervised: "Supervised activity",
    },
    status: {
      developing: "Developing",
      pending_review: "Awaiting human review",
      teacher_validated: "Teacher-validated (simulated)",
    },
    footer:
      "In a real system, each evidence record needs a date, curriculum reference, provenance and authorized review. Grades are always a professional decision.",
  },
} satisfies Record<
  "es" | "en",
  {
    title: string;
    demo: string;
    description: string;
    noSamples: string;
    strengths: string;
    evolution: string;
    opportunities: string;
    competency: string;
    evidence: string;
    support: string;
    next: string;
    context: Record<EvidenceContext, string>;
    status: Record<FormativeStatus, string>;
    footer: string;
  }
>;

export function FormativeEvidencePanel({
  studentId,
  lang,
}: {
  studentId: string;
  lang: "es" | "en";
}) {
  const sample = formativeDashboardDemo[studentId];
  const t = labels[lang];
  return (
    <section className="card-soft p-5 sm:p-6" aria-labelledby="formative-evidence-title">
      <div className="flex items-center gap-2">
        <ClipboardCheck className="h-5 w-5 text-ink-soft" aria-hidden="true" />
        <h2 id="formative-evidence-title" className="text-base font-semibold">
          {t.title}
        </h2>
      </div>
      <p className="mt-2 text-xs font-semibold text-ink-soft">{t.demo}</p>
      <p className="mt-2 text-sm text-ink-soft">{t.description}</p>
      {!sample ? (
        <p className="mt-4 rounded-xl bg-muted/60 p-4 text-sm">{t.noSamples}</p>
      ) : (
        <>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-border p-4">
              <h3 className="flex items-center gap-2 text-sm font-semibold">
                <Eye className="h-4 w-4" aria-hidden="true" />
                {t.strengths}
              </h3>
              <ul className="mt-2 list-inside list-disc space-y-2 text-sm text-ink-soft">
                {sample.strengths.map((observation) => (
                  <li key={observation}>{observation}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-border p-4">
              <h3 className="flex items-center gap-2 text-sm font-semibold">
                <Lightbulb className="h-4 w-4" aria-hidden="true" />
                {t.opportunities}
              </h3>
              <ul className="mt-2 list-inside list-disc space-y-2 text-sm text-ink-soft">
                {sample.opportunities.map((observation) => (
                  <li key={observation}>{observation}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-5 rounded-xl border border-border p-4">
            <h3 className="text-sm font-semibold">{t.evolution}</h3>
            <ol className="mt-3 grid gap-3 md:grid-cols-2">
              {sample.evolution.map((item) => (
                <li key={item.moment} className="rounded-xl bg-muted/60 p-3 text-sm">
                  <div className="font-medium">{item.moment}</div>
                  <p className="mt-1 text-ink-soft">{item.observation}</p>
                  <p className="mt-2 text-xs text-ink-soft">{item.support}</p>
                </li>
              ))}
            </ol>
          </div>
          <div className="mt-5 grid gap-3 lg:grid-cols-2">
            {sample.criteria.map((criterion) => (
              <article key={criterion.id} className="rounded-xl border border-border p-4">
                <div className="font-mono text-[11px] text-ink-soft">{criterion.id}</div>
                <h3 className="mt-1 text-sm font-semibold">{criterion.title}</h3>
                <p className="mt-2 text-xs text-ink-soft">
                  {t.competency}: {criterion.competency}
                </p>
                <p className="mt-3 text-xs font-semibold">{t.status[criterion.status]}</p>
                <p className="mt-1 text-xs text-ink-soft">{t.context[criterion.context]}</p>
                <dl className="mt-3 space-y-3 text-sm">
                  <div>
                    <dt className="font-medium">{t.evidence}</dt>
                    <dd className="mt-1 text-ink-soft">{criterion.evidence}</dd>
                  </div>
                  <div>
                    <dt className="font-medium">{t.support}</dt>
                    <dd className="mt-1 text-ink-soft">{criterion.support}</dd>
                  </div>
                  <div>
                    <dt className="font-medium">{t.next}</dt>
                    <dd className="mt-1 text-ink-soft">{criterion.nextStep}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        </>
      )}
      <p className="mt-4 text-xs text-ink-soft">{t.footer}</p>
    </section>
  );
}
