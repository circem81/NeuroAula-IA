import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { evaluateSyntheticProportionality } from "@/lib/evaluation-agent.functions";
import {
  PROPORTIONALITY_CASE,
  previewSyntheticProportionality,
  type EvaluationResult,
} from "@/lib/evaluation-agent";
import { useDemoAuth } from "@/lib/demo-auth";
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
      <EvaluationLab />
    </div>
  );
}

/**
 * Explicitly isolated from demo-data.ts, reports and Learning Twin.
 * The text input is numeric-only and intended for synthetic exercises.
 */
function EvaluationLab() {
  const { session } = useDemoAuth();
  const [answer, setAnswer] = useState("15");
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  if (session?.role !== "teacher") return null;

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setResult(null);
    setPending(true);
    try {
      const evaluation = await evaluateSyntheticProportionality({ data: { answer } });
      setResult(evaluation);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "No se pudo ejecutar el agente.");
    } finally {
      setPending(false);
    }
  }

  function onLocalPreview() {
    setError("");
    setResult(null);
    try {
      setResult(previewSyntheticProportionality(answer));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "No se pudo comprobar la respuesta.");
    }
  }

  const categories: Record<EvaluationResult["category"], string> = {
    none: "Sin error",
    conceptual: "Posible error conceptual",
    calculation: "Posible error de cálculo",
    procedure: "Posible error de procedimiento",
    uncertain: "No concluyente",
  };

  return (
    <section className="card-soft p-6" aria-labelledby="agent-lab-title">
      <div className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-amber-700">
        Piloto experimental · no disponible para alumnado real
      </div>
      <h2 id="agent-lab-title" className="text-lg font-semibold">
        Agente LLM de Evaluación — proporcionalidad
      </h2>
      <p className="mt-2 text-sm text-ink-soft">
        Ejercicio fijo y sintético. El modelo propone una explicación, pero la corrección numérica
        se realiza con código. Nada se guarda en el expediente ni en el gemelo.
      </p>
      <div className="mt-4 rounded-xl bg-muted/60 p-4 text-sm">
        {PROPORTIONALITY_CASE.statement}
      </div>
      <form
        onSubmit={(event) => void onSubmit(event)}
        className="mt-4 flex flex-wrap items-end gap-3"
      >
        <label className="flex flex-col gap-1 text-sm">
          Respuesta ficticia (€)
          <input
            type="text"
            value={answer}
            onChange={(event) => setAnswer(event.target.value)}
            maxLength={12}
            inputMode="decimal"
            pattern="[0-9]+([.,][0-9]{1,2})?"
            required
            className="w-40 rounded-lg border border-border bg-white px-3 py-2"
            placeholder="Ej.: 15"
          />
        </label>
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-gradient-brand px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          {pending ? "Evaluando…" : "Ejecutar agente LLM"}
        </button>
        <button
          type="button"
          disabled={pending}
          onClick={onLocalPreview}
          className="rounded-full border border-border px-4 py-2 text-sm font-semibold disabled:opacity-50"
        >
          Vista previa local (sin IA)
        </button>
      </form>
      <p className="mt-2 text-xs text-ink-soft">
        La vista previa local no requiere clave API ni envía respuestas a terceros.
        El agente LLM sí requiere configuración del servidor y autorización docente.
      </p>
      {error && (
        <p role="alert" className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-800">
          {error}
        </p>
      )}
      {result && (
        <div className="mt-4 space-y-2 rounded-xl border border-border bg-white p-4 text-sm">
          <p>
            <strong>Origen:</strong>{" "}
            {result.source === "llm" ? "Propuesta de modelo LLM" : "Reglas locales (sin IA)"}
          </p>
          <p>
            <strong>Comprobación numérica:</strong> {result.correct ? "Correcta" : "Incorrecta"}
          </p>
          <p>
            <strong>Clasificación propuesta:</strong> {categories[result.category]}
          </p>
          <p>
            <strong>Observación:</strong> {result.feedback}
          </p>
          <p>
            <strong>Pista propuesta:</strong> {result.hint}
          </p>
          <p className="text-xs text-amber-800">
            {result.source === "llm"
              ? "Propuesta LLM no validada: requiere revisión docente antes de cualquier intervención real."
              : "Simulación por reglas, no generada por IA. Requiere revisión docente; no es una evaluación del alumnado."}
          </p>
        </div>
      )}
    </section>
  );
}
