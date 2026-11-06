import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Beaker,
  BookOpen,
  ClipboardCopy,
  HelpCircle,
  RotateCcw,
} from "lucide-react";
import type { Lang } from "@/lib/i18n";
import {
  assessWaterInquiry,
  canAdvanceInquiryStep,
  evidenceAnswers,
  inferenceAnswers,
  waterSamples,
  type EvidenceAnswer,
  type InferenceAnswer,
} from "@/lib/water-inquiry";

const reviewKeys = ["compare", "differentiate", "limitations"] as const;
type ReviewKey = (typeof reviewKeys)[number];

const copy = {
  es: {
    eyebrow: "Ciencias · ESO · 20–30 minutos",
    title: "Investigación: ¿qué nos dicen dos muestras de agua?",
    subtitle: "Una indagación guiada para formular hipótesis, analizar datos y explicar sus límites.",
    simulated: "Prototipo interactivo · datos completamente simulados",
    privacy: "Las respuestas solo se mantienen mientras esta página está abierta: no se guardan ni se envían.",
    steps: ["Problema", "Hipótesis", "Datos", "Contraste", "Conclusión", "Revisión"],
    stepOf: "Paso",
    of: "de",
    introTitle: "El misterio de las dos muestras",
    introBody:
      "Un grupo de estudiantes recoge dos muestras de agua en puntos distintos de una acequia cercana a cultivos. ¿Son iguales? ¿Podemos saber por qué son diferentes?",
    introWarning:
      "Los valores son inventados para aprender a interpretar evidencias. No permiten determinar la potabilidad del agua ni identificar una fuente real de contaminación.",
    inquiryGoal:
      "Tu misión: plantear una hipótesis, comparar tres indicadores y redactar una conclusión prudente basada en datos.",
    hypoTitle: "Antes de observar los resultados, ¿qué esperas encontrar?",
    hypoPrompt:
      "Escribe una hipótesis que se pueda contrastar. Puedes predecir diferencias, pero no necesitas acertar.",
    hypoPlaceholder:
      "Creo que la muestra B podría presentar ... porque ...",
    hypoHint:
      "Prueba esta estructura: «Si las muestras proceden de puntos diferentes, entonces ...; lo comprobaría comparando ...». No confundas una hipótesis con un hecho.",
    dataTitle: "Observa y compara los datos",
    dataHelp:
      "Lee primero los números de cada columna y sus unidades. No confundas una diferencia observada con su causa.",
    sample: "Muestra",
    nitrates: "Nitratos (mg/L)",
    turbidity: "Turbidez (NTU)",
    ph: "pH",
    simulatedTable: "Mediciones ficticias para la actividad",
    evidencePrompt: "¿Qué afirmación coincide con los datos de la tabla?",
    evidenceOptions: {
      "higher-b": "La muestra B tiene más nitratos y mayor turbidez que la A.",
      "equal-nitrates": "Las dos muestras tienen exactamente la misma concentración de nitratos.",
      "equal-turbidity": "La turbidez es idéntica en las dos muestras.",
    },
    inferenceTitle: "¿Qué podemos concluir… y qué no?",
    inferencePrompt: "Selecciona la interpretación científicamente más prudente.",
    inferenceOptions: {
      "different-not-causal":
        "Hay diferencias entre las muestras, pero estos datos por sí solos no demuestran la causa.",
      "fertilizers-proven":
        "Está demostrado que los fertilizantes de los cultivos causaron estas diferencias.",
      "water-safe": "Las dos muestras son potables porque el pH es parecido.",
    },
    inferenceHint:
      "Para hablar de causas o potabilidad necesitaríamos más muestras, controles, información contextual y análisis adecuados.",
    conclusionTitle: "Construye tu conclusión científica",
    conclusionPrompt:
      "Redacta una conclusión que incluya al menos un dato numérico y una limitación de la investigación.",
    conclusionPlaceholder:
      "En la muestra A ... y en la B ... Esto indica ... Sin embargo, todavía no sabemos ...",
    conclusionHint:
      "Estructura sugerida: «Observamos ... (dato). Esto sugiere ... No podemos afirmar ... porque faltarían ...».",
    hypothesisLengthHelp: "Escribe al menos 20 caracteres para continuar. La hipótesis será revisada por el docente.",
    lengthHelp: "Escribe al menos 40 caracteres para continuar. No se evalúa automáticamente la calidad del texto.",
    reviewTitle: "Revisa tus evidencias y tu razonamiento",
    guided: "Preguntas guiadas",
    correct: "respuestas coherentes con los datos",
    openReview:
      "La hipótesis y la conclusión son respuestas abiertas: necesitan revisión docente. Aquí no se utiliza IA para calificarlas.",
    hypothesis: "Tu hipótesis",
    observation: "Observación elegida",
    interpretation: "Interpretación elegida",
    conclusion: "Tu conclusión",
    nextFocus: "Próximo apoyo recomendado",
    focus: {
      "compare-data": "Repasar la lectura de la tabla y comparar nitratos y turbidez en A y B.",
      causality: "Practicar la diferencia entre observar un cambio y demostrar su causa.",
      "extend-inquiry":
        "Ampliación: ¿qué nuevas muestras o controles permitirían investigar la causa?",
    },
    checklistTitle: "Autoevaluación",
    checklist: {
      compare: "He comparado al menos dos indicadores con sus unidades.",
      differentiate: "He distinguido entre datos observados y posibles causas.",
      limitations: "He indicado qué información falta para investigar mejor.",
    },
    teacherTitle: "Guía breve para revisión docente",
    teacherBody:
      "Comprobar si la hipótesis es contrastable, si se citan datos correctos y si la conclusión reconoce límites. La puntuación de 0–2 solo se refiere a las dos elecciones cerradas.",
    source:
      "Inspiración pedagógica: aprendizaje por indagación y recursos de divulgación del CSIC. Actividad propia; no es un material oficial ni existe colaboración institucional.",
    sourceLink: "Banco de Recursos del CSIC",
    hint: "Ver una pista",
    hideHint: "Ocultar pista",
    back: "Anterior",
    continue: "Continuar",
    copy: "Copiar resumen para el docente",
    copied: "Resumen copiado.",
    copyError: "No se pudo copiar automáticamente. Puedes seleccionar el resumen en pantalla.",
    reviewAnswers: "Revisar mis respuestas",
    restart: "Empezar de nuevo",
    required: "Completa esta parte para avanzar.",
  },
  en: {
    eyebrow: "Science · Secondary school · 20–30 minutes",
    title: "Investigation: what do two water samples tell us?",
    subtitle: "A guided inquiry to build hypotheses, interpret data, and recognize uncertainty.",
    simulated: "Interactive prototype · entirely simulated data",
    privacy: "Answers stay on this page only: they are not saved or sent anywhere.",
    steps: ["Question", "Hypothesis", "Data", "Interpretation", "Conclusion", "Review"],
    stepOf: "Step",
    of: "of",
    introTitle: "The mystery of two samples",
    introBody:
      "Students collect two water samples at different points along an irrigation channel near farmland. Are they the same? Can we explain any differences?",
    introWarning:
      "All measurements are invented for learning purposes. They cannot establish drinking-water safety or identify a real pollution source.",
    inquiryGoal:
      "Your mission: propose a hypothesis, compare three indicators, and write a cautious evidence-based conclusion.",
    hypoTitle: "Before looking at the results, what do you expect to find?",
    hypoPrompt:
      "Write a testable hypothesis. You may predict differences; you do not have to be right.",
    hypoPlaceholder: "I think sample B might show ... because ...",
    hypoHint:
      "Try: 'If the samples come from different points, then ...; I could test this by comparing ...'. A hypothesis is not a proven fact.",
    dataTitle: "Observe and compare the data",
    dataHelp:
      "Read each column carefully, including units. An observed difference is not necessarily proof of its cause.",
    sample: "Sample",
    nitrates: "Nitrates (mg/L)",
    turbidity: "Turbidity (NTU)",
    ph: "pH",
    simulatedTable: "Invented measurements for this activity",
    evidencePrompt: "Which statement matches the data?",
    evidenceOptions: {
      "higher-b": "Sample B has more nitrates and higher turbidity than A.",
      "equal-nitrates": "Both samples have exactly the same nitrate concentration.",
      "equal-turbidity": "Turbidity is identical in both samples.",
    },
    inferenceTitle: "What can — and can't — we conclude?",
    inferencePrompt: "Select the most scientifically careful interpretation.",
    inferenceOptions: {
      "different-not-causal":
        "The samples differ, but these data alone do not establish why.",
      "fertilizers-proven":
        "The data prove that fertilizers from the fields caused the differences.",
      "water-safe": "Both samples are safe to drink because their pH is similar.",
    },
    inferenceHint:
      "Claims about causes or drinking-water safety require further samples, controls, context, and suitable testing.",
    conclusionTitle: "Write your scientific conclusion",
    conclusionPrompt:
      "Write a conclusion using at least one numerical observation and one limitation of this investigation.",
    conclusionPlaceholder:
      "In sample A ... and in sample B ... This suggests ... However, we still do not know ...",
    conclusionHint:
      "Try: 'We observed ... (data). This suggests ... We cannot conclude ... because we would need ...'.",
    hypothesisLengthHelp: "Write at least 20 characters to continue. Your teacher will review the hypothesis.",
    lengthHelp: "Write at least 40 characters to continue. Text quality is not automatically scored.",
    reviewTitle: "Review your evidence and reasoning",
    guided: "Guided questions",
    correct: "answers supported by the data",
    openReview:
      "The hypothesis and conclusion are open responses and require teacher review. No AI is used to grade them here.",
    hypothesis: "Your hypothesis",
    observation: "Selected observation",
    interpretation: "Selected interpretation",
    conclusion: "Your conclusion",
    nextFocus: "Suggested next support",
    focus: {
      "compare-data": "Practise comparing nitrate and turbidity values in samples A and B.",
      causality: "Practise telling an observed pattern apart from proof of its cause.",
      "extend-inquiry":
        "Extension: what additional samples or controls could help investigate the cause?",
    },
    checklistTitle: "Self-assessment",
    checklist: {
      compare: "I compared at least two indicators and their units.",
      differentiate: "I distinguished observations from possible causes.",
      limitations: "I explained what information is missing.",
    },
    teacherTitle: "Short guide for teacher review",
    teacherBody:
      "Check whether the hypothesis can be tested, the data are correctly cited, and the conclusion acknowledges uncertainty. The 0–2 result covers only the two closed questions.",
    source:
      "Pedagogical inspiration: inquiry-based learning and CSIC science outreach resources. This is our own activity, not official CSIC content or a partnership.",
    sourceLink: "CSIC Resource Bank",
    hint: "Show a hint",
    hideHint: "Hide hint",
    back: "Back",
    continue: "Continue",
    copy: "Copy summary for teacher",
    copied: "Summary copied.",
    copyError: "Could not copy automatically. You can select the summary on the page.",
    reviewAnswers: "Review my answers",
    restart: "Start again",
    required: "Complete this part to continue.",
  },
} as const;

export function WaterInquiry({ lang }: { lang: Lang }) {
  const t = copy[lang];
  const [step, setStep] = useState(0);
  const [hypothesis, setHypothesis] = useState("");
  const [evidence, setEvidence] = useState<EvidenceAnswer | "">("");
  const [inference, setInference] = useState<InferenceAnswer | "">("");
  const [conclusion, setConclusion] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [review, setReview] = useState<Record<ReviewKey, boolean>>({
    compare: false,
    differentiate: false,
    limitations: false,
  });
  const [copyStatus, setCopyStatus] = useState<"idle" | "success" | "error">("idle");

  const canContinue = canAdvanceInquiryStep(step, hypothesis, evidence, inference, conclusion);
  const result = evidence && inference ? assessWaterInquiry(evidence, inference) : null;

  function goToStep(next: number) {
    setStep(Math.min(5, Math.max(0, next)));
    setShowHint(false);
  }

  function restart() {
    setStep(0);
    setHypothesis("");
    setEvidence("");
    setInference("");
    setConclusion("");
    setReview({ compare: false, differentiate: false, limitations: false });
    setShowHint(false);
    setCopyStatus("idle");
  }

  function copySummary() {
    const content = [
      t.title,
      t.simulated,
      `${t.hypothesis}: ${hypothesis}`,
      `${t.observation}: ${evidence ? t.evidenceOptions[evidence] : "—"}`,
      `${t.interpretation}: ${inference ? t.inferenceOptions[inference] : "—"}`,
      `${t.conclusion}: ${conclusion}`,
      `${t.guided}: ${result?.guidedCorrect ?? 0}/2`,
      t.openReview,
    ].join("\n\n");
    if (typeof navigator === "undefined" || !navigator.clipboard) {
      setCopyStatus("error");
      return;
    }
    void navigator.clipboard
      .writeText(content)
      .then(() => setCopyStatus("success"))
      .catch(() => setCopyStatus("error"));
  }

  const hintText =
    step === 1
      ? t.hypoHint
      : step === 2
        ? t.dataHelp
        : step === 3
          ? t.inferenceHint
          : t.conclusionHint;

  return (
    <section className="card-soft overflow-hidden" aria-labelledby="water-inquiry-title">
      <div className="border-b border-border/70 bg-gradient-to-br from-cyan-50 via-white to-indigo-50 p-5 sm:p-7">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <Beaker aria-hidden="true" className="h-5 w-5 text-cyan-700" />
          <span className="text-xs font-semibold uppercase tracking-wide text-cyan-900">{t.eyebrow}</span>
        </div>
        <h2 id="water-inquiry-title" className="text-xl font-semibold tracking-tight sm:text-2xl">
          {t.title}
        </h2>
        <p className="mt-2 max-w-3xl text-sm text-ink-soft">{t.subtitle}</p>
        <p className="mt-3 inline-flex rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-900 ring-1 ring-amber-200">
          {t.simulated}
        </p>
      </div>

      <div className="space-y-5 p-5 sm:p-7">
        <div
          role="progressbar"
          aria-label={lang === "es" ? "Progreso de la investigación" : "Investigation progress"}
          aria-valuemin={1}
          aria-valuemax={6}
          aria-valuenow={step + 1}
          className="flex h-2 gap-1"
        >
          {t.steps.map((label, index) => (
            <span
              key={label}
              className={`h-2 flex-1 rounded-full ${index <= step ? "bg-cyan-600" : "bg-muted"}`}
            />
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs font-semibold text-ink-soft">
            {t.stepOf} {step + 1} {t.of} 6 — {t.steps[step]}
          </p>
          <p className="text-xs text-ink-soft">{t.privacy}</p>
        </div>

        {step === 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t.introTitle}</h3>
            <p className="leading-relaxed">{t.introBody}</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {waterSamples.map((sample) => (
                <div key={sample.id} className="rounded-2xl border border-cyan-100 bg-cyan-50/40 p-4">
                  <div className="text-lg font-semibold">
                    {t.sample} {sample.id}
                  </div>
                  <p className="mt-1 text-sm text-ink-soft">
                    {lang === "es"
                      ? "Una muestra del entorno que analizarás en los próximos pasos."
                      : "A sample from the setting that you will analyse in the next steps."}
                  </p>
                </div>
              ))}
            </div>
            <p className="rounded-xl bg-muted/60 p-4 text-sm font-medium">{t.inquiryGoal}</p>
            <p className="text-sm text-amber-900">{t.introWarning}</p>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">{t.hypoTitle}</h3>
            <label className="block text-sm text-ink-soft" htmlFor="water-hypothesis">
              {t.hypoPrompt}
            </label>
            <textarea
              id="water-hypothesis"
              className="min-h-32 w-full rounded-xl border border-border bg-white p-3 text-sm leading-relaxed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-700"
              value={hypothesis}
              onChange={(event) => setHypothesis(event.target.value)}
              placeholder={t.hypoPlaceholder}
              maxLength={1000}
            />
            <p className="text-xs text-ink-soft">{t.hypothesisLengthHelp}</p>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t.dataTitle}</h3>
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full min-w-96 border-collapse text-left text-sm">
                <caption className="p-3 text-left text-xs text-ink-soft">{t.simulatedTable}</caption>
                <thead className="bg-muted/60">
                  <tr>
                    <th scope="col" className="px-4 py-3">{t.sample}</th>
                    <th scope="col" className="px-4 py-3">{t.nitrates}</th>
                    <th scope="col" className="px-4 py-3">{t.turbidity}</th>
                    <th scope="col" className="px-4 py-3">{t.ph}</th>
                  </tr>
                </thead>
                <tbody>
                  {waterSamples.map((sample) => (
                    <tr key={sample.id} className="border-t border-border/70">
                      <th scope="row" className="px-4 py-3">{sample.id}</th>
                      <td className="px-4 py-3">{sample.nitrateMgL}</td>
                      <td className="px-4 py-3">{sample.turbidityNTU}</td>
                      <td className="px-4 py-3">{sample.pH}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <fieldset className="space-y-2">
              <legend className="mb-2 text-sm font-semibold">{t.evidencePrompt}</legend>
              {evidenceAnswers.map((answer) => (
                <label key={answer} className="flex cursor-pointer gap-3 rounded-xl border border-border p-3 text-sm hover:bg-muted/50">
                  <input
                    type="radio"
                    name="water-evidence"
                    value={answer}
                    checked={evidence === answer}
                    onChange={() => setEvidence(answer)}
                    className="mt-0.5 accent-cyan-700"
                  />
                  <span>{t.evidenceOptions[answer]}</span>
                </label>
              ))}
            </fieldset>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t.inferenceTitle}</h3>
            <fieldset className="space-y-2">
              <legend className="mb-2 text-sm font-semibold">{t.inferencePrompt}</legend>
              {inferenceAnswers.map((answer) => (
                <label key={answer} className="flex cursor-pointer gap-3 rounded-xl border border-border p-3 text-sm hover:bg-muted/50">
                  <input
                    type="radio"
                    name="water-inference"
                    value={answer}
                    checked={inference === answer}
                    onChange={() => setInference(answer)}
                    className="mt-0.5 accent-cyan-700"
                  />
                  <span>{t.inferenceOptions[answer]}</span>
                </label>
              ))}
            </fieldset>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">{t.conclusionTitle}</h3>
            <label className="block text-sm text-ink-soft" htmlFor="water-conclusion">
              {t.conclusionPrompt}
            </label>
            <textarea
              id="water-conclusion"
              className="min-h-40 w-full rounded-xl border border-border bg-white p-3 text-sm leading-relaxed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-700"
              value={conclusion}
              onChange={(event) => setConclusion(event.target.value)}
              placeholder={t.conclusionPlaceholder}
              maxLength={1500}
            />
            <p className="text-xs text-ink-soft">{t.lengthHelp}</p>
          </div>
        )}

        {step === 5 && result && (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-cyan-50 p-4">
              <BookOpen aria-hidden="true" className="h-6 w-6 text-cyan-800" />
              <div>
                <h3 className="font-semibold">{t.reviewTitle}</h3>
                <p className="text-sm">
                  {t.guided}: <strong>{result.guidedCorrect}/2</strong> {t.correct}.
                </p>
              </div>
            </div>
            <dl className="grid gap-3 text-sm">
              <div className="rounded-xl border border-border p-3">
                <dt className="font-semibold">{t.hypothesis}</dt>
                <dd className="mt-1 whitespace-pre-wrap">{hypothesis}</dd>
              </div>
              <div className="rounded-xl border border-border p-3">
                <dt className="font-semibold">{t.observation}</dt>
                <dd className="mt-1">{t.evidenceOptions[evidence as EvidenceAnswer]}</dd>
              </div>
              <div className="rounded-xl border border-border p-3">
                <dt className="font-semibold">{t.interpretation}</dt>
                <dd className="mt-1">{t.inferenceOptions[inference as InferenceAnswer]}</dd>
              </div>
              <div className="rounded-xl border border-border p-3">
                <dt className="font-semibold">{t.conclusion}</dt>
                <dd className="mt-1 whitespace-pre-wrap">{conclusion}</dd>
              </div>
            </dl>
            <div className="rounded-xl border border-cyan-200 bg-cyan-50/60 p-4 text-sm">
              <p className="font-semibold">{t.nextFocus}</p>
              <p className="mt-1">{t.focus[result.nextFocus]}</p>
            </div>
            <fieldset className="space-y-2">
              <legend className="mb-2 font-semibold">{t.checklistTitle}</legend>
              {reviewKeys.map((key) => (
                <label key={key} className="flex items-start gap-3 text-sm">
                  <input
                    type="checkbox"
                    className="mt-1 accent-cyan-700"
                    checked={review[key]}
                    onChange={(event) =>
                      setReview((previous) => ({ ...previous, [key]: event.target.checked }))
                    }
                  />
                  <span>{t.checklist[key]}</span>
                </label>
              ))}
            </fieldset>
            <div className="rounded-xl bg-amber-50 p-4 text-sm text-amber-950">
              <p className="font-semibold">{t.teacherTitle}</p>
              <p className="mt-2">{t.teacherBody}</p>
              <p className="mt-2">{t.openReview}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={copySummary}
                className="inline-flex items-center gap-2 rounded-full bg-cyan-700 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-800"
              >
                <ClipboardCopy aria-hidden="true" className="h-4 w-4" /> {t.copy}
              </button>
              <button type="button" onClick={() => goToStep(2)} className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium hover:bg-muted">
                <ArrowLeft aria-hidden="true" className="h-4 w-4" /> {t.reviewAnswers}
              </button>
              <button type="button" onClick={restart} className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium hover:bg-muted">
                <RotateCcw aria-hidden="true" className="h-4 w-4" /> {t.restart}
              </button>
            </div>
            <p aria-live="polite" className="text-xs text-ink-soft">
              {copyStatus === "success" ? t.copied : copyStatus === "error" ? t.copyError : ""}
            </p>
          </div>
        )}

        {step >= 1 && step <= 4 && (
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => setShowHint((open) => !open)}
              aria-expanded={showHint}
              className="inline-flex items-center gap-2 text-sm font-medium text-cyan-800 hover:underline"
            >
              <HelpCircle aria-hidden="true" className="h-4 w-4" />
              {showHint ? t.hideHint : t.hint}
            </button>
            {showHint && <p className="rounded-xl bg-cyan-50 p-4 text-sm leading-relaxed text-cyan-950">{hintText}</p>}
          </div>
        )}

        {step < 5 && (
          <div className="flex items-center justify-between gap-3 border-t border-border/70 pt-5">
            <button
              type="button"
              onClick={() => goToStep(step - 1)}
              disabled={step === 0}
              className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ArrowLeft aria-hidden="true" className="h-4 w-4" /> {t.back}
            </button>
            <div className="text-right">
              <button
                type="button"
                disabled={!canContinue}
                onClick={() => goToStep(step + 1)}
                className="inline-flex items-center gap-2 rounded-full bg-cyan-700 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-800 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {t.continue} <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </button>
              {!canContinue && <p className="mt-1 text-xs text-ink-soft">{t.required}</p>}
            </div>
          </div>
        )}

        <p className="border-t border-border/70 pt-4 text-xs leading-relaxed text-ink-soft">
          {t.source}{" "}
          <a
            href="https://recursosdivulgacion.csic.es/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-cyan-800 underline underline-offset-2"
          >
            {t.sourceLink}
          </a>
          .
        </p>
      </div>
    </section>
  );
}
