import { useState } from "react";
import { BookOpen, ChevronLeft, ChevronRight, Puzzle, SearchCheck } from "lucide-react";
import {
  algebraPuzzles,
  mathStoryPages,
  retrieveDemoSupport,
  type ObservedError,
  type TeachingApproach,
} from "@/lib/learning-lab";

function BalanceIllustration({ equation }: { equation: string }) {
  const [left, right] = equation.split("=");
  return (
    <figure className="rounded-2xl border border-border bg-white p-4">
      <svg
        viewBox="0 0 420 170"
        className="mx-auto w-full max-w-lg"
        role="img"
        aria-label={`Balanza equilibrada: ${equation}`}
      >
        <path d="M210 25 V125" stroke="#64748b" strokeWidth="5" />
        <path d="M85 57 H335" stroke="#334155" strokeWidth="7" strokeLinecap="round" />
        <circle cx="210" cy="57" r="8" fill="#64748b" />
        <path d="M85 57 V115 M335 57 V115" stroke="#64748b" strokeWidth="3" />
        <path d="M30 115 Q85 150 140 115 Z" fill="#bbf7d0" stroke="#64748b" strokeWidth="2" />
        <path d="M280 115 Q335 150 390 115 Z" fill="#bfdbfe" stroke="#64748b" strokeWidth="2" />
        <path d="M175 130 H245 L265 155 H155 Z" fill="#94a3b8" />
        <text x="85" y="105" textAnchor="middle" fontSize="20" fontWeight="600" fill="#1e293b">
          {left?.trim()}
        </text>
        <text x="335" y="105" textAnchor="middle" fontSize="20" fontWeight="600" fill="#1e293b">
          {right?.trim()}
        </text>
      </svg>
      <figcaption className="text-center text-xs text-ink-soft">
        Ilustración original · principio de igualdad
      </figcaption>
    </figure>
  );
}

export function NeuroaulaLearningLab() {
  const [pageIndex, setPageIndex] = useState(0);
  const [storyAnswer, setStoryAnswer] = useState<number | null>(null);
  const [levelIndex, setLevelIndex] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [message, setMessage] = useState("");
  const [errorType, setErrorType] = useState<ObservedError>("none");
  const [teachingApproach, setTeachingApproach] = useState<TeachingApproach>("guided");

  const page = mathStoryPages[pageIndex];
  const level = algebraPuzzles[levelIndex];
  const step = level.steps[stepIndex];
  const levelComplete = stepIndex >= level.steps.length;
  const support = retrieveDemoSupport(errorType, teachingApproach);

  function changePage(next: number) {
    setPageIndex(Math.max(0, Math.min(mathStoryPages.length - 1, next)));
    setStoryAnswer(null);
  }

  function makeMove(index: number) {
    const move = step?.moves[index];
    if (!move) return;
    setMessage(move.feedback);
    if (move.correct) {
      setErrorType("none");
      setStepIndex((current) => current + 1);
    } else {
      setErrorType(move.label.includes("solo") ? "one-sided" : "inverse");
    }
  }

  function nextLevel() {
    setLevelIndex((current) => (current + 1) % algebraPuzzles.length);
    setStepIndex(0);
    setMessage("");
    setErrorType("none");
  }

  return (
    <section className="space-y-6" aria-labelledby="learning-lab-title">
      <header className="space-y-2">
        <h2 id="learning-lab-title" className="text-xl font-semibold">
          Laboratorio visual · libros y retos de álgebra
        </h2>
        <p className="text-sm leading-relaxed text-ink-soft">
          Prototipo original sin API ni costes de generación: combina un cuento interactivo,
          retos matemáticos manipulativos y una búsqueda simulada de reglas pedagógicas.
          No utiliza datos reales de estudiantes ni registra sus respuestas.
        </p>
      </header>

      <article className="card-soft overflow-hidden p-5 sm:p-7" aria-labelledby="math-story-title">
        <div className="flex items-center gap-2 text-indigo-700">
          <BookOpen className="h-5 w-5" aria-hidden="true" />
          <h3 id="math-story-title" className="text-lg font-semibold">
            Libro interactivo: La misión de la balanza
          </h3>
        </div>
        <p className="mb-4 mt-2 text-xs text-ink-soft">
          Página {pageIndex + 1} de {mathStoryPages.length} · contenido preparado para demostración docente
        </p>
        <div className="grid gap-5 lg:grid-cols-2">
          <BalanceIllustration equation={page.example} />
          <div>
            <h4 className="text-base font-semibold">{page.title}</h4>
            <p className="mt-2 text-sm leading-relaxed">{page.text}</p>
            <fieldset className="mt-4 space-y-2 rounded-xl border border-border/70 p-3">
              <legend className="px-1 text-sm font-medium">{page.question.prompt}</legend>
              {page.question.choices.map((choice, index) => (
                <button
                  key={choice}
                  type="button"
                  onClick={() => setStoryAnswer(index)}
                  aria-pressed={storyAnswer === index}
                  className="block w-full rounded-lg border border-border bg-white px-3 py-2 text-left text-sm hover:bg-indigo-50 aria-pressed:border-indigo-500 aria-pressed:bg-indigo-50"
                >
                  {choice}
                </button>
              ))}
              {storyAnswer !== null && (
                <p className="pt-2 text-sm" role="status">
                  <strong>
                    {storyAnswer === page.question.correctIndex ? "¡Correcto!" : "Inténtalo de nuevo."}
                  </strong>{" "}
                  {page.question.feedback}
                </p>
              )}
            </fieldset>
          </div>
        </div>
        <div className="mt-5 flex items-center justify-between gap-2">
          <button
            type="button"
            disabled={pageIndex === 0}
            onClick={() => changePage(pageIndex - 1)}
            className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-2 text-sm disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" /> Anterior
          </button>
          <button
            type="button"
            disabled={pageIndex === mathStoryPages.length - 1}
            onClick={() => changePage(pageIndex + 1)}
            className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-2 text-sm disabled:opacity-40"
          >
            Siguiente <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </article>

      <article className="card-soft p-5 sm:p-7" aria-labelledby="math-puzzle-title">
        <div className="flex items-center gap-2 text-indigo-700">
          <Puzzle className="h-5 w-5" aria-hidden="true" />
          <h3 id="math-puzzle-title" className="text-lg font-semibold">
            Retos originales de álgebra visual
          </h3>
        </div>
        <p className="mt-2 text-sm text-ink-soft">
          Inspirados en el aprendizaje matemático mediante juego y descubrimiento.
          Sin reproducir personajes, arte ni niveles de DragonBox.
        </p>
        <h4 className="mt-5 font-semibold">{level.title}</h4>
        <p className="mt-2 rounded-xl bg-indigo-50 px-4 py-3 text-center font-mono text-xl font-bold">
          {levelComplete ? level.solution : step.equation}
        </p>
        {levelComplete ? (
          <div className="mt-4 space-y-3">
            <p role="status" className="text-sm font-medium text-green-700">
              Nivel superado: has mantenido la equivalencia de la ecuación.
            </p>
            <button
              type="button"
              onClick={nextLevel}
              className="rounded-full bg-gradient-brand px-4 py-2 text-sm font-medium text-white"
            >
              {levelIndex === algebraPuzzles.length - 1 ? "Volver al nivel 1" : "Siguiente nivel"}
            </button>
          </div>
        ) : (
          <div className="mt-4 space-y-2">
            <p className="text-sm font-medium">Elige una transformación para ambos lados:</p>
            {step.moves.map((move, index) => (
              <button
                key={move.label}
                type="button"
                onClick={() => makeMove(index)}
                className="block w-full rounded-lg border border-border bg-white px-3 py-2 text-left text-sm hover:bg-indigo-50"
              >
                {move.label}
              </button>
            ))}
          </div>
        )}
        {message && (
          <p role="status" className="mt-3 rounded-lg bg-muted px-3 py-2 text-sm">
            {message}
          </p>
        )}
      </article>

      <article className="card-soft p-5 sm:p-7" aria-labelledby="learning-support-title">
        <div className="flex items-center gap-2 text-indigo-700">
          <SearchCheck className="h-5 w-5" aria-hidden="true" />
          <h3 id="learning-support-title" className="text-lg font-semibold">
            Dos capas: conocimientos y orientación docente
          </h3>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          Demostración basada en reglas locales, no en un RAG conectado a artículos científicos.
          La relación entre la observación, la fuente y la propuesta se muestra para que el
          docente pueda revisarla.
        </p>
        <label className="mt-4 flex flex-col gap-1 text-sm">
          Orientación didáctica elegida por el docente
          <select
            value={teachingApproach}
            onChange={(event) => setTeachingApproach(event.target.value as TeachingApproach)}
            className="max-w-md rounded-lg border border-border bg-white px-3 py-2"
          >
            <option value="guided">Preguntas y pistas graduadas</option>
            <option value="direct">Explicación directa con ejemplo</option>
          </select>
        </label>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div className="rounded-xl border border-border bg-white p-4">
            <h4 className="text-xs font-semibold uppercase text-ink-soft">Capa de conocimientos</h4>
            <p className="mt-2 text-sm">{support.prerequisite}</p>
            <p className="mt-2 text-xs text-ink-soft">Regla: {support.retrievedRule}</p>
          </div>
          <div className="rounded-xl border border-border bg-white p-4">
            <h4 className="text-xs font-semibold uppercase text-ink-soft">Capa pedagógica</h4>
            <p className="mt-2 text-sm">{support.educatorPreference}</p>
            <p className="mt-2 text-xs text-ink-soft">Propuesta: {support.recommendation}</p>
          </div>
        </div>
        <div className="mt-3 rounded-xl bg-amber-50 p-4 text-sm">
          <p><strong>Fundamento utilizado:</strong> {support.source}</p>
          <p className="mt-2"><strong>Límite:</strong> {support.uncertainty}</p>
          <p className="mt-2 text-xs font-semibold">{support.status}</p>
        </div>
      </article>
    </section>
  );
}
