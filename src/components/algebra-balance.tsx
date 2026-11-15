import { useState } from "react";
import { CheckCircle2, ClipboardCopy, Lightbulb, RotateCcw, Scale } from "lucide-react";
import type { Lang } from "@/lib/i18n";
import {
  algebraChoices,
  algebraStages,
  assessAlgebraAction,
  summarizeAlgebraEvidence,
  type AlgebraAction,
  type AlgebraEvent,
  type AlgebraOutcome,
  type AlgebraStep,
} from "@/lib/algebra-balance";

const actionLabels: Record<AlgebraAction, { es: string; en: string }> = {
  "subtract-three-both": { es: "Restar 3 a ambos lados", en: "Subtract 3 on both sides" },
  "subtract-three-left": { es: "Restar 3 solo a la izquierda", en: "Subtract 3 on the left only" },
  "divide-two-both": { es: "Dividir ambos lados entre 2", en: "Divide both sides by 2" },
  "divide-two-left": { es: "Dividir solo la izquierda entre 2", en: "Divide only the left side by 2" },
  "add-three-both": { es: "Sumar 3 a ambos lados", en: "Add 3 on both sides" },
  "add-two-both": { es: "Sumar 2 a ambos lados", en: "Add 2 on both sides" },
};

const copy = {
  es: {
    eyebrow: "Matemáticas · 1.º–2.º ESO · Prototipo original",
    title: "Laboratorio de ecuaciones: conserva el equilibrio",
    description:
      "Toma decisiones sobre una ecuación visual. Registramos los pasos, los desvíos y las pistas, no solo el resultado.",
    privacy: "Datos de ejemplo. No hay modelos de IA ni almacenamiento de respuestas.",
    sideLeft: "Miembro izquierdo",
    sideRight: "Miembro derecho",
    box: "Caja x",
    token: "Unidad positiva",
    instruction: "¿Qué operación aisla la incógnita de forma más directa sin romper la igualdad?",
    hint: "Ver pista",
    hintText: [
      "Primero elimina las tres unidades que acompañan a las dos cajas x. Haz lo mismo en ambos miembros.",
      "Ahora hay dos cajas iguales que valen 8 unidades en total. Reparte ambos miembros entre 2.",
    ],
    advance: "Bien: la operación mantiene la igualdad y te acerca a x.",
    imbalance: "Atención: cambiar solo un miembro rompe la igualdad. La misma operación debe afectar a los dos.",
    detour: "Esa transformación conserva la igualdad, pero no es la vía más directa. Busca la operación inversa.",
    finished: "Has aislado la incógnita: x = 4. Comprueba: 2 · 4 + 3 = 11.",
    evidence: "Registro observable para revisión docente",
    attempts: "Decisiones",
    balances: "Operaciones en un solo miembro",
    detours: "Transformaciones válidas poco eficientes",
    hints: "Pistas consultadas",
    steps: "Pasos resueltos",
    signal: {
      pending: "Completa la actividad antes de proponer una ampliación.",
      balance: "Proponer otra igualdad para practicar la simetría entre ambos miembros.",
      inverse: "Practicar cómo elegir operaciones inversas antes de aumentar la dificultad.",
      extend: "Proponer una ecuación de transferencia con otros coeficientes.",
    },
    teacher:
      "La recomendación es una regla provisional basada en las acciones observadas. El profesorado decide si procede; no hay diagnóstico ni calificación automática.",
    copy: "Copiar registro para el docente",
    copied: "Registro copiado.",
    copyError: "No se pudo copiar. Prueba a seleccionar el texto.",
    restart: "Reiniciar actividad",
    log: "Historial de decisiones",
    outcome: { advance: "Paso conseguido", imbalance: "Igualdad alterada", detour: "Camino alternativo" },
  },
  en: {
    eyebrow: "Mathematics · Secondary school · Original prototype",
    title: "Equation lab: keep both sides balanced",
    description: "Make choices about a visual equation. We record steps, detours and hints, not only the final answer.",
    privacy: "Sample data only. No AI models and no answer storage.",
    sideLeft: "Left side",
    sideRight: "Right side",
    box: "Box x",
    token: "Positive unit",
    instruction: "Which operation isolates the unknown most directly while preserving equality?",
    hint: "Show a hint",
    hintText: [
      "First remove the three units beside the two x boxes. Do the same on both sides.",
      "Now two equal boxes are worth 8 units altogether. Divide both sides by 2.",
    ],
    advance: "Good: this preserves equality and gets you closer to x.",
    imbalance: "Careful: changing only one side breaks equality. Apply the same operation to both sides.",
    detour: "This transformation keeps equality, but it is not the shortest route. Look for an inverse operation.",
    finished: "You isolated the unknown: x = 4. Check: 2 · 4 + 3 = 11.",
    evidence: "Observable evidence for teacher review",
    attempts: "Decisions",
    balances: "One-sided operations",
    detours: "Valid but inefficient transformations",
    hints: "Hints viewed",
    steps: "Steps completed",
    signal: {
      pending: "Complete the activity before suggesting an extension.",
      balance: "Try another equation focusing on doing the same to both sides.",
      inverse: "Practise choosing inverse operations before increasing difficulty.",
      extend: "Try a transfer equation with different coefficients.",
    },
    teacher:
      "This recommendation is a provisional rule based on observable actions. The teacher makes the final decision; there is no diagnosis or automated grading.",
    copy: "Copy teacher summary",
    copied: "Summary copied.",
    copyError: "Could not copy automatically. Select the text instead.",
    restart: "Restart activity",
    log: "Decision history",
    outcome: { advance: "Step completed", imbalance: "Balance broken", detour: "Alternative path" },
  },
} as const;

function EquationSide({
  boxes,
  tokens,
  label,
  lang,
}: {
  boxes: number;
  tokens: number;
  label: string;
  lang: Lang;
}) {
  return (
    <div className="min-w-0 flex-1 rounded-xl border border-indigo-100 bg-white p-3">
      <p className="mb-3 text-xs text-ink-soft">{label}</p>
      <div className="flex min-h-20 flex-wrap content-center items-center gap-1.5">
        {Array.from({ length: boxes }, (_, index) => (
          <span
            key={`box-${index}`}
            title={lang === "es" ? "Caja x" : "Box x"}
            className="grid h-11 w-11 place-items-center rounded-lg border-2 border-indigo-400 bg-indigo-100 text-lg font-semibold text-indigo-900"
          >
            x
          </span>
        ))}
        {Array.from({ length: tokens }, (_, index) => (
          <span
            key={`token-${index}`}
            title={lang === "es" ? "Unidad positiva" : "Positive unit"}
            className="grid h-7 w-7 place-items-center rounded-full border border-amber-400 bg-amber-100 text-sm font-medium text-amber-900"
          >
            1
          </span>
        ))}
      </div>
    </div>
  );
}

export function AlgebraBalance({ lang }: { lang: Lang }) {
  const t = copy[lang];
  const [step, setStep] = useState<AlgebraStep>(0);
  const [events, setEvents] = useState<AlgebraEvent[]>([]);
  const [hintedSteps, setHintedSteps] = useState<AlgebraStep[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState<AlgebraOutcome | null>(null);
  const [copyStatus, setCopyStatus] = useState<"idle" | "success" | "error">("idle");
  const state = algebraStages[step];
  const evidence = summarizeAlgebraEvidence(events, hintedSteps.length);

  function choose(action: AlgebraAction) {
    if (step === 2) return;
    const currentStep = step as 0 | 1;
    const outcome = assessAlgebraAction(currentStep, action);
    setEvents((previous) => [...previous, { step: currentStep, action, outcome, hintUsed: showHint }]);
    setFeedback(outcome);
    setCopyStatus("idle");
    if (outcome === "advance") {
      setStep(currentStep === 0 ? 1 : 2);
      setShowHint(false);
    }
  }

  function showHelp() {
    if (!hintedSteps.includes(step)) setHintedSteps((previous) => [...previous, step]);
    setShowHint(true);
  }

  function restart() {
    setStep(0);
    setEvents([]);
    setHintedSteps([]);
    setShowHint(false);
    setFeedback(null);
    setCopyStatus("idle");
  }

  async function copySummary() {
    const note = [
      t.title,
      t.privacy,
      `${t.steps}: ${evidence.completedSteps}/2`,
      `${t.attempts}: ${evidence.attempts}`,
      `${t.balances}: ${evidence.imbalanceCount}`,
      `${t.detours}: ${evidence.detourCount}`,
      `${t.hints}: ${evidence.hintsViewed}`,
      `${t.log}:\n${events.map((event, index) => `${index + 1}. ${actionLabels[event.action][lang]} — ${t.outcome[event.outcome]}`).join("\n")}`,
      `${t.evidence}: ${t.signal[evidence.signal]}`,
      t.teacher,
    ].join("\n\n");
    try {
      await navigator.clipboard.writeText(note);
      setCopyStatus("success");
    } catch {
      setCopyStatus("error");
    }
  }

  return (
    <section className="card-soft overflow-hidden" aria-labelledby="algebra-title">
      <div className="border-b border-border/70 bg-gradient-to-br from-indigo-50 via-white to-violet-50 p-5 sm:p-7">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-indigo-800">
          <Scale aria-hidden="true" className="h-5 w-5" /> {t.eyebrow}
        </div>
        <h2 id="algebra-title" className="mt-2 text-xl font-semibold sm:text-2xl">{t.title}</h2>
        <p className="mt-2 text-sm text-ink-soft">{t.description}</p>
        <p className="mt-3 text-xs font-medium text-amber-800">{t.privacy}</p>
      </div>

      <div className="space-y-5 p-5 sm:p-7">
        <p className="text-center font-mono text-2xl font-semibold" aria-live="polite">
          {state.expression}
        </p>
        <div className="flex items-stretch gap-2 sm:gap-4">
          <EquationSide boxes={state.left.boxes} tokens={state.left.tokens} label={t.sideLeft} lang={lang} />
          <div className="grid place-items-center text-2xl font-bold text-indigo-700" aria-hidden="true">=</div>
          <EquationSide boxes={state.right.boxes} tokens={state.right.tokens} label={t.sideRight} lang={lang} />
        </div>

        {step < 2 ? (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">{t.instruction}</h3>
            <div className="grid gap-2 sm:grid-cols-2">
              {algebraChoices[step as 0 | 1].map((action) => (
                <button
                  key={action}
                  type="button"
                  onClick={() => choose(action)}
                  className="rounded-xl border border-border bg-white px-4 py-3 text-left text-sm transition hover:border-indigo-400 hover:bg-indigo-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                >
                  {actionLabels[action][lang]}
                </button>
              ))}
            </div>
            <button type="button" onClick={showHelp} className="inline-flex items-center gap-2 text-sm font-medium text-indigo-700 underline underline-offset-4">
              <Lightbulb aria-hidden="true" className="h-4 w-4" /> {t.hint}
            </button>
            {showHint && <p className="rounded-xl bg-indigo-50 p-3 text-sm">{t.hintText[step as 0 | 1]}</p>}
          </div>
        ) : (
          <div className="flex items-start gap-2 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-900">
            <CheckCircle2 aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0" />
            <p>{t.finished}</p>
          </div>
        )}

        {feedback && step < 2 && (
          <p role="status" className="rounded-xl border border-border/80 bg-muted/50 p-3 text-sm">
            {t[feedback]}
          </p>
        )}

        <div className="space-y-3 rounded-2xl border border-border/70 bg-muted/30 p-4">
          <h3 className="text-sm font-semibold">{t.evidence}</h3>
          <dl className="grid grid-cols-2 gap-3 text-xs sm:grid-cols-3">
            {[
              [t.steps, `${evidence.completedSteps}/2`],
              [t.attempts, evidence.attempts],
              [t.balances, evidence.imbalanceCount],
              [t.detours, evidence.detourCount],
              [t.hints, evidence.hintsViewed],
            ].map(([label, value]) => (
              <div key={String(label)}>
                <dt className="text-ink-soft">{label}</dt>
                <dd className="mt-1 text-lg font-semibold">{value}</dd>
              </div>
            ))}
          </dl>
          <p className="text-sm font-medium">{t.signal[evidence.signal]}</p>
          <p className="text-xs leading-relaxed text-ink-soft">{t.teacher}</p>
          {events.length > 0 && (
            <details className="text-xs">
              <summary className="cursor-pointer font-medium">{t.log}</summary>
              <ol className="mt-2 list-inside list-decimal space-y-1">
                {events.map((event, index) => (
                  <li key={index}>{actionLabels[event.action][lang]} — {t.outcome[event.outcome]}</li>
                ))}
              </ol>
            </details>
          )}
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => void copySummary()} className="inline-flex items-center gap-2 rounded-lg border border-border bg-white px-3 py-2 text-xs font-medium hover:bg-muted">
              <ClipboardCopy aria-hidden="true" className="h-4 w-4" /> {t.copy}
            </button>
            <button type="button" onClick={restart} className="inline-flex items-center gap-2 rounded-lg border border-border bg-white px-3 py-2 text-xs font-medium hover:bg-muted">
              <RotateCcw aria-hidden="true" className="h-4 w-4" /> {t.restart}
            </button>
          </div>
          {copyStatus !== "idle" && <p role="status" className="text-xs">{copyStatus === "success" ? t.copied : t.copyError}</p>}
        </div>
      </div>
    </section>
  );
}
