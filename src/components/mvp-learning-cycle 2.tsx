import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Bot,
  Check,
  CheckCircle2,
  ClipboardCheck,
  GraduationCap,
  History,
  Lightbulb,
  RotateCcw,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDemoAuth } from "@/lib/demo-auth";
import { useLang } from "@/lib/i18n";
import {
  createMvpIds,
  emptyMvpCycle,
  mvpActivity,
  mvpTwin,
  requestMvpHint,
  restoreMvpCycle,
  reviewMvpAssessment,
  submitMvpAnswer,
  type MvpAnswer,
  type MvpCycleState,
} from "@/lib/mvp-learning-cycle";

export function MvpLearningCycle() {
  const { session } = useDemoAuth();
  const { lang } = useLang();
  const tr = (es: string, en: string) => (lang === "es" ? es : en);
  const [view, setView] = useState<"student" | "teacher">("student");
  const [state, setState] = useState<MvpCycleState | null>(null);
  const [answer, setAnswer] = useState<MvpAnswer | null>(null);
  const [reviewNote, setReviewNote] = useState("");
  const [correctedScore, setCorrectedScore] = useState("50");
  const organizationId = session?.organizationId;
  const accountId = session?.id;
  const role = session?.role;
  const reviewerName = session?.name;
  const storageKey =
    accountId && organizationId
      ? `neuroaula:mvp-cycle:v1:${accountId}:${organizationId}`
      : "neuroaula:mvp-cycle:unavailable";

  useEffect(() => {
    if (!organizationId || role !== "teacher") return;
    try {
      const saved = window.localStorage.getItem(storageKey);
      setState(
        saved ? restoreMvpCycle(JSON.parse(saved), organizationId) : emptyMvpCycle(organizationId),
      );
    } catch {
      setState(emptyMvpCycle(organizationId));
    }
  }, [organizationId, role, storageKey]);

  useEffect(() => {
    if (!state || role !== "teacher") return;
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(state));
    } catch {
      // The active cycle still works in memory when storage is unavailable.
    }
  }, [role, state, storageKey]);

  const twin = useMemo(() => (state ? mvpTwin(state) : null), [state]);
  if (!session || session.role !== "teacher") return null;
  if (!state) return <div className="card-soft h-72 animate-pulse" aria-busy="true" />;
  const lastAssessment = state.assessments.at(-1);
  const lastAttempt = state.attempts.at(-1);
  const solved = lastAttempt?.answer === mvpActivity.correctAnswer;
  const currentHint =
    state.supportLevel === 0 ? null : mvpActivity.hints[state.supportLevel === 2 ? 0 : 1];

  const submit = () => {
    if (!answer) return;
    setState((current) =>
      current
        ? submitMvpAnswer(current, answer, createMvpIds(), new Date().toISOString())
        : current,
    );
    setAnswer(null);
  };

  const review = (decision: "approved" | "corrected") => {
    if (!lastAssessment) return;
    const score = Number(correctedScore);
    if (decision === "corrected" && (!Number.isFinite(score) || score < 0 || score > 100)) return;
    setState((current) =>
      current
        ? reviewMvpAssessment(current, {
            assessmentId: lastAssessment.id,
            decision,
            correctedScore: decision === "corrected" ? score : undefined,
            note: reviewNote,
            reviewer: reviewerName ?? "Docente",
            reviewId: crypto.randomUUID(),
            eventId: crypto.randomUUID(),
            evidenceId: decision === "corrected" ? crypto.randomUUID() : undefined,
            interactionId: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
          })
        : current,
    );
    setReviewNote("");
  };

  return (
    <section className="card-soft overflow-hidden" aria-labelledby="mvp-cycle-title">
      <header className="border-b border-border/60 p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-primary">
              <ShieldCheck className="h-5 w-5" /> MVP end-to-end ·{" "}
              {tr("datos sintéticos", "synthetic data")}
            </div>
            <h2 id="mvp-cycle-title" className="text-xl font-semibold">
              {tr(
                "Alumno → evidencia → Learning Twin → profesor",
                "Learner → evidence → Learning Twin → teacher",
              )}
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-ink-soft">
              {tr(
                "Este recorrido funciona con reglas deterministas. No utiliza expedientes reales ni convierte la respuesta en una etiqueta psicológica.",
                "This journey uses deterministic rules. It uses no real learner records and does not turn an answer into a psychological label.",
              )}
            </p>
          </div>
          <div className="flex rounded-xl bg-muted p-1" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={view === "student"}
              onClick={() => setView("student")}
              className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${view === "student" ? "bg-white font-medium shadow-sm" : "text-ink-soft"}`}
            >
              <UserRound className="h-4 w-4" /> {tr("Vista alumno", "Learner view")}
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={view === "teacher"}
              onClick={() => setView("teacher")}
              className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${view === "teacher" ? "bg-white font-medium shadow-sm" : "text-ink-soft"}`}
            >
              <GraduationCap className="h-4 w-4" /> {tr("Vista profesor", "Teacher view")}
            </button>
          </div>
        </div>
      </header>

      {view === "student" ? (
        <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-ink-soft">
              {mvpActivity.title} · {mvpActivity.criterionId}
            </p>
            <p className="my-6 font-mono text-3xl font-semibold">{mvpActivity.prompt}</p>
            <fieldset disabled={solved || state.attempts.length >= 5}>
              <legend className="sr-only">
                {tr("Selecciona una respuesta", "Choose an answer")}
              </legend>
              <div className="grid grid-cols-4 gap-2">
                {mvpActivity.answers.map((value) => (
                  <Button
                    key={value}
                    variant={answer === value ? "default" : "outline"}
                    aria-pressed={answer === value}
                    className="h-12"
                    onClick={() => setAnswer(value)}
                  >
                    x = {value}
                  </Button>
                ))}
              </div>
            </fieldset>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button disabled={!answer || solved || state.attempts.length >= 5} onClick={submit}>
                {tr("Enviar respuesta", "Submit answer")} <ArrowRight />
              </Button>
              <Button
                variant="outline"
                disabled={solved || state.supportLevel >= 4}
                onClick={() => setState(requestMvpHint(state))}
              >
                <Lightbulb /> {tr("Pedir una pista", "Request a hint")}
              </Button>
            </div>
            {currentHint && (
              <div className="mt-5 rounded-2xl bg-[oklch(0.97_0.02_275)] p-4 text-sm" role="status">
                <p className="font-medium">{tr("Pista progresiva", "Progressive hint")}</p>
                <p className="mt-1">{currentHint}</p>
              </div>
            )}
          </div>
          <aside className="rounded-2xl bg-muted/60 p-5">
            <h3 className="font-semibold">{tr("Estado de la actividad", "Activity status")}</h3>
            <dl className="mt-4 grid gap-3 text-sm">
              <div className="flex justify-between">
                <dt>{tr("Intentos", "Attempts")}</dt>
                <dd>{state.attempts.length} / 5</dd>
              </div>
              <div className="flex justify-between">
                <dt>{tr("Nivel de ayuda", "Support level")}</dt>
                <dd>{state.supportLevel} / 5</dd>
              </div>
              <div className="flex justify-between">
                <dt>{tr("Resultado", "Result")}</dt>
                <dd>{solved ? tr("Resuelta", "Solved") : tr("En curso", "In progress")}</dd>
              </div>
            </dl>
            {lastAssessment && (
              <div className="mt-5 rounded-xl bg-white p-4 text-sm">
                <p className="font-medium">{lastAssessment.evidenceSummary}</p>
                <p className="mt-2 text-ink-soft">{lastAssessment.recommendedNextAction}</p>
              </div>
            )}
            <p className="mt-5 text-xs leading-relaxed text-ink-soft">
              {tr(
                "La opción seleccionada permite comprobar el resultado, pero no revela por sí sola el razonamiento ni la causa de un error.",
                "The selected option verifies the result, but cannot by itself reveal reasoning or the cause of an error.",
              )}
            </p>
          </aside>
        </div>
      ) : (
        <div className="grid gap-5 p-5 sm:p-6 xl:grid-cols-2">
          <div className="space-y-4">
            <TeacherCard
              icon={ClipboardCheck}
              title={tr("Evaluación estructurada", "Structured assessment")}
            >
              {lastAssessment ? (
                <dl className="grid gap-2 text-sm">
                  <Row label={tr("Resumen", "Summary")} value={lastAssessment.evidenceSummary} />
                  <Row
                    label={tr("Confianza", "Confidence")}
                    value={tr("Baja · requiere revisión humana", "Low · human review required")}
                  />
                  <Row
                    label={tr("Errores observados", "Observed errors")}
                    value={
                      lastAssessment.detectedErrors.join(" ") ||
                      tr("Ninguno en el resultado", "None in the result")
                    }
                  />
                  <Row
                    label={tr("Concepciones erróneas", "Misconceptions")}
                    value={tr("No inferidas", "Not inferred")}
                  />
                  <Row
                    label={tr("Siguiente acción", "Next action")}
                    value={lastAssessment.recommendedNextAction}
                  />
                </dl>
              ) : (
                <Empty
                  text={tr("Esperando la primera respuesta.", "Waiting for the first response.")}
                />
              )}
            </TeacherCard>

            <TeacherCard icon={CheckCircle2} title={tr("Revisión humana", "Human review")}>
              {lastAssessment?.reviewStatus === "pending" ? (
                <div className="space-y-3">
                  <label className="block text-sm">
                    <span className="font-medium">{tr("Nota de revisión", "Review note")}</span>
                    <textarea
                      value={reviewNote}
                      onChange={(event) => setReviewNote(event.target.value)}
                      maxLength={300}
                      className="mt-1 min-h-20 w-full rounded-xl border border-border bg-white p-3"
                      placeholder={tr(
                        "Opcional; no incluir diagnósticos.",
                        "Optional; do not include diagnoses.",
                      )}
                    />
                  </label>
                  <div className="flex flex-wrap items-end gap-2">
                    <Button onClick={() => review("approved")}>
                      <Check /> {tr("Aprobar", "Approve")}
                    </Button>
                    <label className="text-sm">
                      <span className="block text-xs text-ink-soft">
                        {tr("Puntuación corregida", "Corrected score")}
                      </span>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={correctedScore}
                        onChange={(event) => setCorrectedScore(event.target.value)}
                        className="mt-1 w-24 rounded-lg border border-border px-3 py-2"
                      />
                    </label>
                    <Button variant="outline" onClick={() => review("corrected")}>
                      {tr("Corregir evaluación", "Correct assessment")}
                    </Button>
                  </div>
                </div>
              ) : lastAssessment ? (
                <p className="text-sm font-medium text-emerald-700">
                  {lastAssessment.reviewStatus === "approved"
                    ? tr("Evaluación aprobada y registrada.", "Assessment approved and recorded.")
                    : tr(
                        "Corrección registrada sin borrar la evidencia original.",
                        "Correction recorded without deleting original evidence.",
                      )}
                </p>
              ) : (
                <Empty
                  text={tr("No hay evaluación pendiente.", "There is no pending assessment.")}
                />
              )}
            </TeacherCard>
          </div>

          <div className="space-y-4">
            <TeacherCard icon={Bot} title="Learning Twin v1">
              {twin ? (
                <dl className="grid gap-2 text-sm">
                  <Row label={tr("Criterio", "Criterion")} value={twin.state.criterionId} />
                  <Row
                    label={tr("Estado", "State")}
                    value={
                      twin.state.confidence < 0.5
                        ? tr("Evidencia insuficiente", "Insufficient evidence")
                        : tr("Consolidación en progreso", "Consolidation in progress")
                    }
                  />
                  <Row
                    label={tr("Evidencias efectivas", "Effective evidence")}
                    value={String(twin.state.evidenceCount)}
                  />
                  <Row label={tr("Tendencia", "Trend")} value={twin.state.trend} />
                  <Row
                    label={tr("Ayuda observada", "Observed support")}
                    value={
                      twin.state.supportLevel === null
                        ? tr("No observada", "Unobserved")
                        : `${twin.state.supportLevel.toFixed(1)} / 5`
                    }
                  />
                </dl>
              ) : (
                <Empty
                  text={tr(
                    "El Twin se actualizará después de una respuesta.",
                    "The Twin will update after an answer.",
                  )}
                />
              )}
            </TeacherCard>

            <TeacherCard icon={History} title={tr("Trazabilidad", "Traceability")}>
              {state.events.length ? (
                <ol className="space-y-3 text-sm">
                  {[...state.events].reverse().map((event) => (
                    <li key={event.id} className="rounded-xl bg-muted/60 p-3">
                      <p className="font-medium">
                        {event.type === "human_review"
                          ? tr("Revisión humana", "Human review")
                          : tr("Twin actualizado", "Twin updated")}
                      </p>
                      <p className="mt-1 text-xs text-ink-soft">{event.reason}</p>
                      <p className="mt-1 font-mono text-[11px] text-ink-soft">
                        evidence: {event.evidenceId.slice(0, 8)}…
                      </p>
                    </li>
                  ))}
                </ol>
              ) : (
                <Empty text={tr("Todavía no hay eventos.", "There are no events yet.")} />
              )}
              {!!state.interactions.length && (
                <details className="mt-4 text-sm">
                  <summary className="cursor-pointer font-medium">
                    {tr("Ver interacciones de agentes", "View agent interactions")} (
                    {state.interactions.length})
                  </summary>
                  <ol className="mt-3 space-y-2">
                    {state.interactions.map((item) => (
                      <li key={item.id} className="rounded-lg border border-border/70 p-2">
                        <span className="font-mono text-xs">{item.agent}</span> ·{" "}
                        {item.outputSummary}
                      </li>
                    ))}
                  </ol>
                </details>
              )}
            </TeacherCard>
          </div>
        </div>
      )}

      <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-border/60 p-5 text-xs text-ink-soft sm:p-6">
        <p>
          {tr(
            "Persistencia de demostración en este navegador y cuenta. No es un expediente real.",
            "Demo persistence in this browser and account. This is not a real learner record.",
          )}
        </p>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setState(emptyMvpCycle(session.organizationId));
            setAnswer(null);
            setReviewNote("");
          }}
          disabled={!state.attempts.length}
        >
          <RotateCcw /> {tr("Reiniciar ciclo", "Reset cycle")}
        </Button>
      </footer>
    </section>
  );
}

function TeacherCard({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border/70 p-5">
      <h3 className="mb-4 flex items-center gap-2 font-semibold">
        <Icon className="h-4 w-4 text-primary" /> {title}
      </h3>
      {children}
    </section>
  );
}
function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wider text-ink-soft">{label}</dt>
      <dd className="mt-0.5 leading-relaxed">{value}</dd>
    </div>
  );
}
function Empty({ text }: { text: string }) {
  return <p className="text-sm text-ink-soft">{text}</p>;
}
