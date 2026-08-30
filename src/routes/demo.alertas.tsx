import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertTriangle, CheckCircle2, Clock3, Save, UserCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { useLang } from "@/lib/i18n";
import { demoT } from "@/lib/demo-i18n";
import { recentAlerts, students } from "@/lib/demo-data";
import { useDemoAuth } from "@/lib/demo-auth";
import {
  DEMO_INTERVENTION_STORAGE_KEY,
  createInitialInterventions,
  mergeStoredInterventions,
  updateIntervention,
  type InterventionStatus,
} from "@/lib/demo-interventions";

export const Route = createFileRoute("/demo/alertas")({
  component: Alerts,
});

const alertIds = recentAlerts.map((alert) => alert.id);

function Alerts() {
  const { lang } = useLang();
  const { session } = useDemoAuth();
  const t = demoT[lang];
  const [ready, setReady] = useState(false);
  const [interventions, setInterventions] = useState(() => createInitialInterventions(alertIds));

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(DEMO_INTERVENTION_STORAGE_KEY);
      setInterventions(mergeStoredInterventions(alertIds, raw ? JSON.parse(raw) : null));
    } catch {
      setInterventions(createInitialInterventions(alertIds));
    }
    setReady(true);
  }, []);

  const save = (alertId: string, patch: Parameters<typeof updateIntervention>[2]) => {
    setInterventions((current) => {
      const next = updateIntervention(current, alertId, patch, new Date().toISOString());
      window.localStorage.setItem(DEMO_INTERVENTION_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const resolvedCount = interventions.filter((item) => item.status === "resolved").length;

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{t.alerts.title}</h1>
          <p className="text-sm text-ink-soft">{t.alerts.subtitle}</p>
        </div>
        <div className="rounded-full border border-border/70 bg-white px-3 py-1.5 text-xs font-medium text-ink-soft">
          {lang === "es"
            ? `${resolvedCount} de ${interventions.length} resueltas`
            : `${resolvedCount} of ${interventions.length} resolved`}
        </div>
      </header>

      <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-4 text-sm text-blue-900">
        {lang === "es"
          ? "Flujo de intervención simulado: los cambios se guardan solo en este navegador y no notifican a personas reales."
          : "Simulated intervention workflow: changes are stored only in this browser and do not notify real people."}
      </div>

      <ul className="flex flex-col gap-4" aria-busy={!ready}>
        {recentAlerts.map((alert) => {
          const student = students.find((item) => item.id === alert.studentId)!;
          const intervention = interventions.find((item) => item.alertId === alert.id)!;
          return (
            <li key={alert.id} className="card-soft p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div
                    className={`grid h-10 w-10 place-items-center rounded-xl ${alert.severity === "danger" ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-600"}`}
                  >
                    <AlertTriangle className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{student.name}</div>
                    <div className="mt-0.5 text-sm text-ink-soft">
                      {t.strings[alert.messageKey]}
                    </div>
                    <Link
                      to="/demo/alumno/$id"
                      params={{ id: student.id }}
                      className="mt-2 inline-block text-xs font-medium text-brand hover:underline"
                    >
                      {t.students.openProfile} →
                    </Link>
                  </div>
                </div>
                <StatusBadge status={intervention.status} lang={lang} />
              </div>

              <div className="mt-5 grid gap-4 border-t border-border/70 pt-5 md:grid-cols-[180px_1fr]">
                <label className="text-xs font-medium text-ink-soft">
                  {lang === "es" ? "Estado" : "Status"}
                  <select
                    value={intervention.status}
                    onChange={(event) =>
                      save(alert.id, { status: event.target.value as InterventionStatus })
                    }
                    className="mt-1.5 w-full rounded-xl border border-input bg-white px-3 py-2 text-sm text-ink"
                  >
                    <option value="open">{lang === "es" ? "Abierta" : "Open"}</option>
                    <option value="follow-up">
                      {lang === "es" ? "En seguimiento" : "Following up"}
                    </option>
                    <option value="resolved">{lang === "es" ? "Resuelta" : "Resolved"}</option>
                  </select>
                </label>
                <label className="text-xs font-medium text-ink-soft">
                  {lang === "es" ? "Nota de seguimiento" : "Follow-up note"}
                  <textarea
                    value={intervention.note}
                    maxLength={500}
                    rows={2}
                    onChange={(event) => save(alert.id, { note: event.target.value })}
                    placeholder={
                      lang === "es"
                        ? "Describe la siguiente acción (datos simulados)…"
                        : "Describe the next action (simulated data)…"
                    }
                    className="mt-1.5 w-full resize-y rounded-xl border border-input bg-white px-3 py-2 text-sm text-ink"
                  />
                </label>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs text-ink-soft">
                  {intervention.owner
                    ? `${lang === "es" ? "Responsable" : "Owner"}: ${intervention.owner}`
                    : lang === "es"
                      ? "Sin responsable"
                      : "Unassigned"}
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      save(alert.id, { owner: session?.name ?? null, status: "follow-up" })
                    }
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-3 py-1.5 text-xs font-medium text-ink transition hover:bg-muted"
                  >
                    <UserCheck className="h-3.5 w-3.5" />
                    {lang === "es" ? "Asignarme" : "Assign to me"}
                  </button>
                  <button
                    type="button"
                    onClick={() => save(alert.id, { status: "resolved" })}
                    className="inline-flex items-center gap-1.5 rounded-full bg-gradient-brand px-3 py-1.5 text-xs font-medium text-white shadow-glow"
                  >
                    <Save className="h-3.5 w-3.5" />
                    {lang === "es" ? "Marcar resuelta" : "Mark resolved"}
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function StatusBadge({ status, lang }: { status: InterventionStatus; lang: "es" | "en" }) {
  const config = {
    open: {
      icon: AlertTriangle,
      label: lang === "es" ? "Abierta" : "Open",
      className: "bg-red-50 text-red-700 ring-red-200",
    },
    "follow-up": {
      icon: Clock3,
      label: lang === "es" ? "En seguimiento" : "Following up",
      className: "bg-amber-50 text-amber-700 ring-amber-200",
    },
    resolved: {
      icon: CheckCircle2,
      label: lang === "es" ? "Resuelta" : "Resolved",
      className: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    },
  }[status];
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${config.className}`}
    >
      <Icon className="h-3.5 w-3.5" /> {config.label}
    </span>
  );
}
