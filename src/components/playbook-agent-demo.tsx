import { useState } from "react";
import { CheckCircle2, ClipboardCheck, XCircle } from "lucide-react";
import { useLang } from "@/lib/i18n";
import {
  PLAYBOOK_DEMO_ACTIVITY_ID,
  PLAYBOOK_VERSION,
  runPlaybookAgent,
  type PlaybookResult,
} from "@/lib/playbook-agent";

/** Caja interactiva local: no usa modelos, red ni datos educativos persistentes. */
export function PlaybookAgentDemo() {
  const { lang } = useLang();
  const [answer, setAnswer] = useState("−16");
  const [result, setResult] = useState<PlaybookResult | null>(null);
  const spanish = lang === "es";
  const passed = result?.checks.filter((check) => check.passed).length ?? 0;

  return (
    <section className="card-soft p-6" aria-labelledby="playbook-demo-title">
      <div className="mb-3 flex items-center gap-2">
        <ClipboardCheck className="h-5 w-5 text-primary" aria-hidden="true" />
        <h2 id="playbook-demo-title" className="text-lg font-semibold">
          {spanish ? "Agente con playbook · prueba interactiva" : "Playbook agent · interactive demo"}
        </h2>
      </div>
      <p className="mb-4 text-sm text-ink-soft">
        {spanish
          ? "Motor de reglas ejecutable, sin IA generativa. Usa una actividad y un criterio simulados; no guarda respuestas ni evalúa oficialmente."
          : "Executable rule-based engine without generative AI. Uses a simulated exercise and criterion; it does not store responses or issue official grades."}
      </p>
      <form
        className="flex flex-wrap items-end gap-3"
        onSubmit={(event) => {
          event.preventDefault();
          setResult(runPlaybookAgent({ activityId: PLAYBOOK_DEMO_ACTIVITY_ID, answer }));
        }}
      >
        <label className="flex min-w-40 flex-1 flex-col gap-1 text-sm font-medium">
          {spanish ? "Respuesta para comprobar" : "Answer to check"}
          <input
            className="rounded-xl border border-border bg-white px-3 py-2 font-mono text-sm"
            type="text"
            inputMode="text"
            maxLength={60}
            value={answer}
            onChange={(event) => {
              setAnswer(event.target.value);
              setResult(null);
            }}
            placeholder="−10"
          />
        </label>
        <button
          type="submit"
          className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
        >
          {spanish ? "Ejecutar y revisar" : "Run and verify"}
        </button>
      </form>

      {result && (
        <div className="mt-5 flex flex-col gap-4" aria-live="polite">
          <div className="rounded-xl border border-border bg-white p-4 text-sm">
            <p className="font-semibold">
              {result.status === "pending_teacher_review"
                ? spanish
                  ? "Comprobaciones superadas; borrador pendiente de revisión docente"
                  : "Checks passed; draft awaiting teacher review"
                : spanish
                  ? "Revisión detenida: hay comprobaciones pendientes"
                  : "Review stopped: some checks are incomplete"}
            </p>
            <p className="mt-1 text-ink-soft">
              {passed}/{result.checks.length} {spanish ? "comprobaciones superadas" : "checks passed"} · Playbook v{PLAYBOOK_VERSION}
            </p>
            {result.corrections.length > 0 && (
              <p className="mt-2 text-ink-soft">{result.corrections.join(" ")}</p>
            )}
          </div>
          <ol className="grid gap-2">
            {result.checks.map((check, index) => (
              <li key={check.id} className="flex gap-3 rounded-xl bg-white p-3 text-sm ring-1 ring-border/60">
                {check.passed ? (
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" aria-hidden="true" />
                ) : (
                  <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" aria-hidden="true" />
                )}
                <div>
                  <p className="font-medium">{index + 1}. {check.label}</p>
                  <p className="mt-1 text-ink-soft">{check.detail}</p>
                </div>
              </li>
            ))}
          </ol>
          {result.feedbackProposal && (
            <div className="rounded-xl bg-muted/60 p-4 text-sm">
              <p className="font-semibold">{spanish ? "Borrador de retroalimentación" : "Feedback draft"}</p>
              <p className="mt-1">{result.feedbackProposal}</p>
              <p className="mt-2 font-semibold">{spanish ? "Siguiente propuesta" : "Next proposal"}</p>
              <p className="mt-1">{result.nextActivityProposal}</p>
            </div>
          )}
          <p className="text-xs text-ink-soft">
            {spanish
              ? "Puerta docente: PENDIENTE. La aplicación de propuestas, las calificaciones y los cambios de nivel permanecen bloqueados. Sin persistencia, ni aprobación docente implementada."
              : "Teacher gate: PENDING. Applying proposals, grading and level changes remain blocked. No persistence or implemented teacher approval."}
          </p>
        </div>
      )}
    </section>
  );
}
