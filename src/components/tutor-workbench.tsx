import { useEffect, useRef, useState } from "react";
import { Brain, Check, LoaderCircle, RotateCcw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDemoAuth } from "@/lib/demo-auth";
import { useLang } from "@/lib/i18n";
import {
  assessAnswers,
  emptyTutorState,
  guidedAdvice,
  learnerHint,
  restoreTutorState,
  tutorActivity,
  updateTutor,
  type Answer,
  type TutorAction,
  type TutorLang,
} from "@/lib/tutor";
import { EducationAgentWorkbench } from "@/components/education-agent-workbench";
import { LearningTwinSummary } from "@/components/learning-twin-summary";
import { observedAttempts } from "@/lib/learning-analyst";
import { generateTutorAdvice, getTutorAvailability } from "@/lib/tutor.server";

export function TutorWorkbench() {
  const { session } = useDemoAuth();
  const { lang } = useLang();
  if (!session || session.role !== "teacher") return null;
  return (
    <Workbench
      key={`${session.id}:${session.organizationId}:${lang}`}
      organizationId={session.organizationId}
      scope={`${session.id}:${session.organizationId}:${lang}`}
      lang={lang}
    />
  );
}

function Workbench({
  organizationId,
  scope,
  lang,
}: {
  organizationId: string;
  scope: string;
  lang: TutorLang;
}) {
  const tr = (es: string, en: string) => (lang === "es" ? es : en);
  const [state, setState] = useState(emptyTutorState);
  const [ready, setReady] = useState(false);
  const [answer, setAnswer] = useState<Answer | null>(null);
  const [available, setAvailable] = useState<boolean | null>(null);
  const [aiResponded, setAiResponded] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [storageFailed, setStorageFailed] = useState(false);
  const mounted = useRef(true);
  const storageKey = `neuroaula:tutor:v1:${scope}`;

  useEffect(() => {
    mounted.current = true;
    try {
      const saved = window.sessionStorage.getItem(storageKey);
      if (saved) setState(restoreTutorState(JSON.parse(saved)));
    } catch {
      setStorageFailed(true);
    }
    setReady(true);
    return () => {
      mounted.current = false;
    };
  }, [storageKey]);

  useEffect(() => {
    if (!ready) return;
    try {
      window.sessionStorage.setItem(storageKey, JSON.stringify(state));
    } catch {
      setStorageFailed(true);
    }
  }, [state, ready, storageKey]);

  useEffect(() => {
    let cancelled = false;
    void getTutorAvailability({ data: { organizationId } })
      .then((result) => {
        if (!cancelled) setAvailable(result.available);
      })
      .catch(() => {
        if (!cancelled) setAvailable(false);
      });
    return () => {
      cancelled = true;
    };
  }, [organizationId]);

  const dispatch = (action: TutorAction) => setState((previous) => updateTutor(previous, action));
  const answers = state.runs.map((run) => run.answer);
  const assessment = assessAnswers(answers);
  const proposal = state.runs.at(-1)?.proposal;
  const visibleHint = learnerHint(state);
  const level = state.runs.length > 1 ? 2 : 1;

  async function generate() {
    if (busy || !answers.length) return;
    setBusy(true);
    setError("");
    try {
      const result = await generateTutorAdvice({
        data: { organizationId, lang, activityId: tutorActivity.id, answers, level },
      });
      if (!mounted.current) return;
      if (result.ok) {
        dispatch({ type: "propose", advice: result.advice, source: "ai" });
        setAiResponded(true);
      } else
        setError(
          result.code === "unauthorized"
            ? tr(
                "Tu sesión no permite generar esta ayuda. Vuelve a iniciar sesión con un perfil docente.",
                "Your session cannot generate this hint. Sign in again with a teacher profile.",
              )
            : result.code === "rate_limited"
              ? tr(
                  "Has alcanzado el límite temporal. Espera un minuto o utiliza la pista programada.",
                  "The temporary limit was reached. Wait a minute or use the programmed hint.",
                )
              : result.code === "not_configured"
                ? tr(
                    "La conexión de IA aún no está configurada. Puedes utilizar la pista programada.",
                    "The AI connection is not configured yet. You can use the programmed hint.",
                  )
                : tr(
                    "No se ha podido obtener una propuesta de IA válida. Puedes reintentar o utilizar la pista programada.",
                    "A valid AI draft could not be obtained. Retry or use the programmed hint.",
                  ),
        );
    } catch {
      if (mounted.current)
        setError(
          tr(
            "No se ha podido conectar. Tu ejercicio sigue disponible.",
            "The connection failed. Your exercise is still available.",
          ),
        );
    } finally {
      if (mounted.current) setBusy(false);
    }
  }

  return (
    <section
      className="card-soft overflow-hidden"
      aria-labelledby="tutor-title"
      aria-busy={busy || !ready}
    >
      <header className="flex flex-wrap items-start justify-between gap-4 border-b border-border/60 p-5 sm:p-6">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-primary">
            <Brain className="h-5 w-5" />
            {tr("Primer ciclo de aprendizaje", "First learning cycle")}
          </div>
          <h2 id="tutor-title" className="text-xl font-semibold">
            {tr("Laboratorio del tutor", "Tutor workbench")}
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-soft">
            {tr(
              "Prueba docente con respuestas ficticias. La corrección usa reglas; las pistas requieren tu revisión antes de mostrarse en la vista del alumno.",
              "Teacher trial with fictional answers. Rules check correctness; hints need your review before appearing in the learner preview.",
            )}
          </p>
        </div>
        <span className="rounded-full bg-muted px-3 py-1.5 text-sm">
          {available === null
            ? tr("Comprobando conexión…", "Checking connection…")
            : aiResponded
              ? tr("IA: respuesta recibida", "AI: response received")
              : available
                ? tr("IA configurada · pendiente de probar", "AI configured · awaiting a test")
                : tr("Modo guiado · IA no disponible", "Guided mode · AI unavailable")}
        </span>
      </header>

      <div className="grid gap-6 p-5 sm:p-6 xl:grid-cols-2">
        <div className="flex flex-col gap-5">
          <div>
            <h3 className="text-base font-semibold">
              {tr("1. Responde como alumno de prueba", "1. Answer as a test learner")}
            </h3>
            <p className="mt-2 text-sm text-ink-soft">
              {tr("Resuelve la ecuación. ¿Cuánto vale x?", "Solve the equation. What is x?")}
            </p>
            <p className="my-5 font-mono text-3xl font-semibold tracking-wide">
              {tutorActivity.equation}
            </p>
            <fieldset disabled={busy || !ready || assessment.solved || state.runs.length >= 5}>
              <legend className="sr-only">{tr("Elige tu respuesta", "Choose your answer")}</legend>
              <div className="grid grid-cols-4 gap-2">
                {tutorActivity.answers.map((value) => (
                  <Button
                    key={value}
                    type="button"
                    variant={answer === value ? "default" : "outline"}
                    className="h-12 text-base"
                    aria-pressed={answer === value}
                    onClick={() => setAnswer(value)}
                  >
                    x = {value}
                  </Button>
                ))}
              </div>
            </fieldset>
            <Button
              className="mt-3 w-full"
              disabled={!ready || !answer || busy || assessment.solved || state.runs.length >= 5}
              onClick={() => {
                if (answer) {
                  dispatch({ type: "answer", answer });
                  setAnswer(null);
                  setError("");
                }
              }}
            >
              {tr("Comprobar respuesta", "Check answer")}
            </Button>
          </div>

          <div aria-live="polite" className="rounded-2xl bg-muted/70 p-4 text-sm leading-relaxed">
            {state.runs.length ? (
              <>
                <p className="font-semibold">
                  {assessment.solved
                    ? tr("Respuesta correcta", "Correct answer")
                    : tr("La respuesta aún no es correcta", "The answer is not correct yet")}
                </p>
                <p className="mt-1">
                  {tr("Intentos registrados", "Recorded attempts")}: {assessment.attempts} / 5
                </p>
              </>
            ) : (
              tr(
                "Selecciona una respuesta para iniciar el ciclo.",
                "Select an answer to start the cycle.",
              )
            )}
            {state.runs.length >= 5 && !assessment.solved && (
              <p className="mt-2">
                {tr(
                  "Fin de esta prueba. Revisa los intentos con el docente antes de reiniciar.",
                  "End of this trial. Review the attempts with the teacher before restarting.",
                )}
              </p>
            )}
          </div>

          <div className="rounded-2xl border border-primary/20 p-4">
            <h3 className="text-base font-semibold">{tr("Vista del alumno", "Learner preview")}</h3>
            <p className="mt-2 text-sm leading-relaxed" aria-live="polite">
              {visibleHint ??
                tr(
                  "Aquí aparecerá únicamente la pista aprobada por el docente para el intento actual.",
                  "Only the teacher-approved hint for the current attempt will appear here.",
                )}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="text-base font-semibold">
            {tr("2. Revisa la propuesta del tutor", "2. Review the tutor draft")}
          </h3>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              disabled={!state.runs.length || busy}
              onClick={() => {
                dispatch({
                  type: "propose",
                  advice: guidedAdvice(answers, level, lang),
                  source: "guided",
                });
                setError("");
              }}
            >
              {tr("Preparar pista programada", "Prepare programmed hint")}
            </Button>
            <Button
              disabled={!available || !state.runs.length || busy}
              onClick={() => void generate()}
            >
              {busy ? <LoaderCircle className="animate-spin" /> : <Sparkles />}
              {busy
                ? tr("Generando…", "Generating…")
                : tr("Generar pista con IA", "Generate AI hint")}
            </Button>
          </div>
          {error && (
            <p role="alert" className="text-sm text-red-700">
              {error}
            </p>
          )}
          {proposal ? (
            <div className="rounded-2xl bg-muted/50 p-4">
              <p className="text-sm font-medium">
                {proposal.source === "ai"
                  ? tr("Borrador generado por IA", "AI-generated draft")
                  : tr("Ayuda programada · sin IA", "Programmed help · no AI")}
              </p>
              <p className="mt-3 text-base leading-relaxed">{proposal.hint}</p>
              <h4 className="mt-4 text-sm font-semibold">
                {tr("Observaciones para el docente", "Observations for the teacher")}
              </h4>
              <p className="mt-1 text-sm leading-relaxed">{proposal.observation}</p>
              <h4 className="mt-4 text-sm font-semibold">
                {tr("Siguiente paso propuesto", "Suggested next step")}
              </h4>
              <p className="mt-1 text-sm leading-relaxed">{proposal.nextStep}</p>
              <p className="mt-3 text-xs text-ink-soft">
                {tr("Material de referencia", "Reference material")}: {tutorActivity.source}
              </p>
              {proposal.review === "pending" ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button
                    disabled={busy}
                    onClick={() => dispatch({ type: "review", decision: "approved" })}
                  >
                    <Check />
                    {tr("Aprobar pista", "Approve hint")}
                  </Button>
                  <Button
                    variant="outline"
                    disabled={busy}
                    onClick={() => dispatch({ type: "review", decision: "rejected" })}
                  >
                    {tr("Rechazar", "Reject")}
                  </Button>
                </div>
              ) : (
                <p className="mt-4 text-sm font-semibold" role="status">
                  {proposal.review === "approved"
                    ? tr(
                        "Aprobada y visible en la vista del alumno.",
                        "Approved and visible in the learner preview.",
                      )
                    : tr(
                        "Rechazada. No se muestra al alumno.",
                        "Rejected. Hidden from the learner.",
                      )}
                </p>
              )}
            </div>
          ) : (
            <p className="text-sm leading-relaxed text-ink-soft">
              {tr(
                "Después de responder, prepara una pista. Comprueba su exactitud y decide si es adecuada antes de aprobarla.",
                "After answering, prepare a hint. Check its accuracy and suitability before approving it.",
              )}
            </p>
          )}
        </div>
      </div>

      <footer className="border-t border-border/60 p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-base font-semibold">
            {tr("3. Registro de esta prueba", "3. Trial record")}
          </h3>
          <Button
            variant="ghost"
            disabled={busy || !ready || !state.runs.length}
            onClick={() => {
              dispatch({ type: "reset" });
              setAnswer(null);
              setError("");
            }}
          >
            <RotateCcw />
            {tr("Reiniciar prueba", "Restart trial")}
          </Button>
        </div>
        <p className="mt-1 text-sm text-ink-soft">
          {storageFailed
            ? tr(
                "El navegador no permite guardar la prueba. Se perderá al recargar.",
                "The browser cannot save this trial. Reloading will clear it.",
              )
            : tr(
                "Guardado solo en esta pestaña, separado por cuenta, centro e idioma. No se envía a la base de datos ni es un expediente del alumno.",
                "Saved only in this tab, separately for each account, organization and language. Not sent to the database and not a learner record.",
              )}
        </p>
        <ol className="mt-3 flex flex-col gap-2 text-sm">
          {state.runs.map((run, index) => (
            <li
              key={index}
              className="flex flex-wrap justify-between gap-2 rounded-lg bg-muted/50 px-3 py-2"
            >
              <span>
                {tr("Intento", "Attempt")} {index + 1} · x = {run.answer} ·{" "}
                {run.answer === tutorActivity.correctAnswer
                  ? tr("Correcto", "Correct")
                  : tr("Incorrecto", "Incorrect")}
              </span>
              <span>
                {!run.proposal
                  ? tr("Sin pista", "No hint")
                  : run.proposal.review === "approved"
                    ? tr("Pista aprobada", "Hint approved")
                    : run.proposal.review === "rejected"
                      ? tr("Pista rechazada", "Hint rejected")
                      : tr("Pendiente de revisión", "Awaiting review")}
              </span>
            </li>
          ))}
        </ol>
      </footer>
      {ready && <LearningTwinSummary state={state} organizationId={organizationId} lang={lang} />}
      {ready && (
        <EducationAgentWorkbench
          key={JSON.stringify(state)}
          context={{
            organizationId,
            lang,
            activityId: tutorActivity.id,
            attempts: observedAttempts(state),
          }}
          available={available === true}
          busy={busy}
          onBusyChange={setBusy}
        />
      )}
    </section>
  );
}
