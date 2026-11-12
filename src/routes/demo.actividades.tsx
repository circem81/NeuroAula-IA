import { createFileRoute } from "@tanstack/react-router";
import { useLang } from "@/lib/i18n";
import { demoT } from "@/lib/demo-i18n";
import { latestActivities } from "@/lib/demo-data";
import { TutorWorkbench } from "@/components/tutor-workbench";
import { ActivityPathway } from "@/components/activity-pathway";
import { MvpLearningCycle } from "@/components/mvp-learning-cycle";

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
      <ActivityPathway />
      <MvpLearningCycle />
      <details className="card-soft p-5">
        <summary className="cursor-pointer text-sm font-semibold">
          {lang === "es"
            ? "Laboratorio anterior de tutor y especialistas"
            : "Previous tutor and specialist laboratory"}
        </summary>
        <div className="mt-5">
          <TutorWorkbench />
        </div>
      </details>
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
