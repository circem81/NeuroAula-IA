import { useState } from "react";
import { ArrowRight, Lightbulb, RotateCcw } from "lucide-react";

type DemoLang = "es" | "en";
type Turn = { step: number; response: string; alternateSupport: boolean };

const guidedCopy = {
  es: {
    eyebrow: "Demostración local · preguntas orientadoras",
    heading: "Primero pensar, después recibir ayuda",
    intro:
      "Una pregunta cada vez. Esta versión no interpreta respuestas, no califica y no guarda información.",
    questionLabel: "Pregunta",
    responseLabel: "Explica tu razonamiento (puedes escribir «no lo sé»)",
    placeholder: "¿Cómo lo pensarías? No hace falta acertar a la primera.",
    alternative: "Necesito otra forma de entenderlo",
    continue: "Continuar",
    unsure: "No lo sé todavía",
    afterSupport: "Sigo necesitando ayuda",
    supportHeading: "Otra representación, sin darte la respuesta",
    teacherHint:
      "El docente debe revisar las respuestas y comprobar la comprensión con una actividad supervisada.",
    summary: "Registro de reflexión — sin calificación",
    noResponse: "Todavía no lo sé; necesito ayuda.",
    supportRequested: "Se pidió otra representación",
    withoutSupport: "Sin apoyo adicional de esta demo",
    restart: "Volver a empezar",
    stages: [
      {
        name: "Comprender",
        question:
          "¿Qué representa cada signo en esta operación? ¿Qué significa quitar un número negativo?",
        alternative:
          "Piensa en una deuda: ¿qué sucedería con tu saldo si alguien eliminara una parte de esa deuda?",
      },
      {
        name: "Representar",
        question: "¿Cómo mostrarías esta operación en una recta numérica? Explica los movimientos.",
        alternative:
          "Empieza señalando −8. ¿Hacia dónde te moverías al añadir un número negativo?",
      },
      {
        name: "Justificar",
        question: "¿Qué parte de tu procedimiento comprobarías primero? ¿Por qué?",
        alternative:
          "Prueba a explicar el último término sin usar una regla memorizada: ¿qué cambia cuando quitas una deuda?",
      },
      {
        name: "Transferir",
        question: "Con un ejemplo nuevo, ¿cómo resolverías y explicarías −6 − (−4)?",
        alternative:
          "Imagina que tienes una deuda de 6 y te perdonan 4: representa qué pasa, sin copiar el ejercicio anterior.",
      },
    ],
  },
  en: {
    eyebrow: "Local demo · guiding questions",
    heading: "Think first, get support second",
    intro:
      "One question at a time. This version does not interpret or grade answers and saves no data.",
    questionLabel: "Question",
    responseLabel: "Explain your reasoning (you may write “I don't know”)",
    placeholder: "How would you approach it? Your first attempt need not be correct.",
    alternative: "I need another way to understand",
    continue: "Save response and continue",
    unsure: "I don't know yet",
    afterSupport: "I still need help",
    supportHeading: "Another representation, without revealing the answer",
    teacherHint:
      "A teacher must review the responses and verify understanding in a supervised activity.",
    summary: "Reflection log — no grades",
    noResponse: "I don't know yet; I need help.",
    supportRequested: "Another representation was requested",
    withoutSupport: "No extra support from this demo",
    restart: "Start again",
    stages: [
      {
        name: "Understand",
        question: "What does each sign represent here? What does subtracting a negative mean?",
        alternative:
          "Think of a debt: what happens to your balance if someone cancels part of that debt?",
      },
      {
        name: "Represent",
        question: "How would you show this operation on a number line? Explain each move.",
        alternative: "Start at −8. Which way would you move when adding a negative number?",
      },
      {
        name: "Justify",
        question: "Which part of your working would you check first? Why?",
        alternative:
          "Describe the last term without a memorized rule: what changes when a debt is removed?",
      },
      {
        name: "Transfer",
        question: "Using a new example, how would you solve and explain −6 − (−4)?",
        alternative:
          "Imagine you owe 6 and 4 is forgiven. Show what changes without copying the original.",
      },
    ],
  },
} satisfies Record<
  DemoLang,
  {
  eyebrow: string;
  heading: string;
  intro: string;
  questionLabel: string;
  responseLabel: string;
  placeholder: string;
  alternative: string;
  continue: string;
  unsure: string;
  afterSupport: string;
  supportHeading: string;
  teacherHint: string;
  summary: string;
  noResponse: string;
  supportRequested: string;
  withoutSupport: string;
  restart: string;
  stages: { name: string; question: string; alternative: string }[];
  }
>;

export function GuidedQuestionsDemo({
  lang,
  statement,
}: {
  lang: DemoLang;
  statement: string;
}) {
  const copy = guidedCopy[lang];
  const [step, setStep] = useState(0);
  const [answer, setAnswer] = useState("");
  const [showAlternative, setShowAlternative] = useState(false);
  const [turns, setTurns] = useState<Turn[]>([]);
  const completed = step >= copy.stages.length;
  const current = copy.stages[step];

  function saveTurn(asUnknown = false) {
    const response = asUnknown ? copy.noResponse : answer.trim();
    if (!response) return;
    setTurns((previous) => [...previous, { step, response, alternateSupport: showAlternative }]);
    setAnswer("");
    setShowAlternative(false);
    setStep((previous) => previous + 1);
  }

  function restart() {
    setStep(0);
    setAnswer("");
    setShowAlternative(false);
    setTurns([]);
  }

  return (
    <section className="card-soft p-5 sm:p-6" aria-label={copy.heading}>
      <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-soft">
        {copy.eyebrow}
      </div>
      <h2 className="mt-1 text-xl font-semibold">{copy.heading}</h2>
      <p className="mt-1 text-sm text-ink-soft">{copy.intro}</p>
      <div className="mt-4 rounded-xl bg-muted/70 p-4 font-mono text-sm">{statement}</div>

      {!completed && current ? (
        <div className="mt-6">
          <div className="flex items-center justify-between gap-3 text-xs font-medium text-ink-soft">
            <span>{current.name}</span>
            <span>
              {step + 1} / {copy.stages.length}
            </span>
          </div>
          <div
            className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted"
            role="progressbar"
            aria-valuenow={step}
            aria-valuemin={0}
            aria-valuemax={copy.stages.length}
          >
            <div
              className="h-full bg-gradient-brand"
              style={{ width: `${(step / copy.stages.length) * 100}%` }}
            />
          </div>
          <h3 className="mt-5 text-base font-semibold">
            {copy.questionLabel}: {current.question}
          </h3>
          {showAlternative && (
            <div
              role="status"
              className="mt-3 rounded-xl bg-amber-50 p-3 text-sm text-amber-900"
            >
              <div className="flex items-center gap-2 font-semibold">
                <Lightbulb className="h-4 w-4" aria-hidden="true" />
                {copy.supportHeading}
              </div>
              <p className="mt-1">{current.alternative}</p>
            </div>
          )}
          <label htmlFor="guided-response" className="mt-4 block text-sm font-medium">
            {copy.responseLabel}
          </label>
          <textarea
            id="guided-response"
            rows={3}
            value={answer}
            onChange={(event) => setAnswer(event.target.value)}
            placeholder={copy.placeholder}
            className="mt-2 w-full rounded-xl border border-border bg-white p-3 text-sm text-ink"
          />
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setShowAlternative(true)}
              disabled={showAlternative}
              className="rounded-full border border-border px-4 py-2 text-sm font-medium disabled:opacity-60"
            >
              {copy.alternative}
            </button>
            <button
              type="button"
              onClick={() => (showAlternative ? saveTurn(true) : setShowAlternative(true))}
              className="rounded-full border border-border px-4 py-2 text-sm font-medium"
            >
              {showAlternative ? copy.afterSupport : copy.unsure}
            </button>
            <button
              type="button"
              onClick={() => saveTurn()}
              disabled={!answer.trim()}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-brand px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
            >
              {copy.continue} <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-6">
          <h3 className="text-base font-semibold">{copy.summary}</h3>
          <ol className="mt-3 space-y-3">
            {turns.map((turn) => (
              <li key={turn.step} className="rounded-xl border border-border p-3 text-sm">
                <div className="font-semibold">
                  {copy.stages[turn.step].name}: {copy.stages[turn.step].question}
                </div>
                <p className="mt-2 whitespace-pre-wrap break-words">{turn.response}</p>
                <p className="mt-1 text-xs text-ink-soft">
                  {turn.alternateSupport ? copy.supportRequested : copy.withoutSupport}
                </p>
              </li>
            ))}
          </ol>
          <p className="mt-4 rounded-xl bg-muted/70 p-4 text-sm">{copy.teacherHint}</p>
          <button
            type="button"
            onClick={restart}
            className="mt-4 inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" /> {copy.restart}
          </button>
        </div>
      )}
    </section>
  );
}
