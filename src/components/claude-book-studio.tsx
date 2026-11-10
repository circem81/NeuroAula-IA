import { useState } from "react";
import { BookOpen, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { generateClaudeBook } from "@/lib/claude-book.server";
import type { ClaudeBook, ClaudeBookRequest } from "@/lib/claude-book";

const palette = {
  blue: "#62b9e5",
  green: "#72b98a",
  yellow: "#f3d26d",
  orange: "#f4a761",
  purple: "#a79be1",
  pink: "#f0a7c1",
};

function SafeIllustration({ page }: { page: ClaudeBook["pages"][number] }) {
  return (
    <figure className="overflow-hidden rounded-2xl border border-border/70 bg-gradient-to-b from-sky-50 to-white p-4">
      <svg
        viewBox="0 0 100 100"
        role="img"
        aria-label={page.illustration.caption}
        className="mx-auto h-44 w-full max-w-sm"
      >
        {page.illustration.objects.map((object, index) => {
          const fill = palette[object.color];
          const half = object.size / 2;
          if (object.shape === "circle") {
            return (
              <circle
                key={index}
                cx={object.x}
                cy={object.y}
                r={half}
                fill={fill}
                stroke="#475569"
                strokeWidth="0.5"
              />
            );
          }
          if (object.shape === "square") {
            return (
              <rect
                key={index}
                x={object.x - half}
                y={object.y - half}
                width={object.size}
                height={object.size}
                rx="2"
                fill={fill}
                stroke="#475569"
                strokeWidth="0.5"
              />
            );
          }
          const points = [
            [object.x, object.y - half],
            [object.x - half, object.y + half],
            [object.x + half, object.y + half],
          ]
            .map(([x, y]) => String(x) + "," + String(y))
            .join(" ");
          return (
            <polygon key={index} points={points} fill={fill} stroke="#475569" strokeWidth="0.5" />
          );
        })}
      </svg>
      <figcaption className="mt-2 text-center text-xs text-ink-soft">
        {page.illustration.caption} · dibujo geométrico generado como datos
      </figcaption>
    </figure>
  );
}

export function ClaudeBookStudio() {
  const [request, setRequest] = useState<ClaudeBookRequest>({
    topic: "Los ecosistemas de zonas áridas",
    stage: "eso",
    bilingual: false,
  });
  const [book, setBook] = useState<ClaudeBook | null>(null);
  const [pageIndex, setPageIndex] = useState(0);
  const [answer, setAnswer] = useState<number | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const page = book?.pages[pageIndex];

  async function generate() {
    setError("");
    setPending(true);
    setBook(null);
    setAnswer(null);
    try {
      const result = await generateClaudeBook({ data: request });
      setBook(result);
      setPageIndex(0);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "No se ha podido crear el libro.");
    } finally {
      setPending(false);
    }
  }

  function goToPage(index: number) {
    if (!book) return;
    setPageIndex(Math.max(0, Math.min(book.pages.length - 1, index)));
    setAnswer(null);
  }

  return (
    <section className="card-soft p-5 sm:p-7" aria-labelledby="claude-books-title">
      <div className="mb-4 flex items-center gap-2">
        <BookOpen className="h-5 w-5 text-indigo-600" aria-hidden="true" />
        <h2 id="claude-books-title" className="text-lg font-semibold">
          Taller de libros interactivos · Claude
        </h2>
      </div>
      <p className="mb-5 text-sm leading-relaxed text-ink-soft">
        Crea un borrador de tres páginas con dibujos geométricos, lectura y preguntas
        autocorregibles. Solo se envía a Claude el tema, la etapa y el idioma.
        No introduzcas nombres, diagnósticos ni datos de alumnado real.
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm sm:col-span-2">
          Tema educativo (sin datos personales)
          <input
            className="rounded-xl border border-border bg-white px-3 py-2"
            value={request.topic}
            maxLength={120}
            onChange={(event) =>
              setRequest((current) => ({ ...current, topic: event.target.value }))
            }
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Etapa
          <select
            className="rounded-xl border border-border bg-white px-3 py-2"
            value={request.stage}
            onChange={(event) =>
              setRequest((current) => ({
                ...current,
                stage: event.target.value as ClaudeBookRequest["stage"],
              }))
            }
          >
            <option value="primaria">Primaria</option>
            <option value="eso">ESO</option>
            <option value="adultos">Personas adultas</option>
          </select>
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={request.bilingual}
            onChange={(event) =>
              setRequest((current) => ({ ...current, bilingual: event.target.checked }))
            }
          />
          Bilingüe español–árabe
        </label>
      </div>
      <button
        type="button"
        onClick={() => void generate()}
        disabled={pending || request.topic.trim().length < 4}
        className="mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-brand px-5 py-2.5 text-sm font-medium text-white disabled:opacity-50"
      >
        <Sparkles className="h-4 w-4" aria-hidden="true" />
        {pending ? "Claude está preparando el borrador…" : "Generar libro con Claude"}
      </button>

      {error && (
        <p role="alert" className="mt-3 rounded-lg bg-amber-50 p-3 text-sm text-amber-900">
          {error}
        </p>
      )}

      {book && page && (
        <div className="mt-7 border-t border-border/70 pt-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-indigo-700">
            Borrador para revisión docente · página {pageIndex + 1} de {book.pages.length}
          </p>
          <h3 className="mt-1 text-xl font-semibold">{book.title}</h3>
          <p className="mt-2 text-sm text-ink-soft">{book.introduction}</p>

          <article className="mt-5 grid gap-5 lg:grid-cols-2">
            <SafeIllustration page={page} />
            <div className="space-y-3">
              <h4 className="text-lg font-semibold">{page.heading}</h4>
              <p className="whitespace-pre-line text-sm leading-relaxed">{page.textEs}</p>
              {page.textAr && (
                <p lang="ar" dir="rtl" className="whitespace-pre-line text-sm leading-loose">
                  {page.textAr}
                </p>
              )}
              <fieldset className="space-y-2 rounded-2xl border border-border/70 p-4">
                <legend className="px-1 text-sm font-semibold">{page.question}</legend>
                {page.options.map((option, index) => (
                  <button
                    type="button"
                    key={index}
                    onClick={() => setAnswer(index)}
                    aria-pressed={answer === index}
                    className="block w-full rounded-lg border border-border bg-white px-3 py-2 text-left text-sm hover:bg-indigo-50 aria-pressed:border-indigo-500 aria-pressed:bg-indigo-50"
                  >
                    {option}
                  </button>
                ))}
                {answer !== null && (
                  <p className="pt-2 text-sm" role="status">
                    <strong>
                      {answer === page.correctIndex ? "¡Correcto!" : "Revisa tu respuesta."}
                    </strong>{" "}
                    {page.feedback}
                  </p>
                )}
              </fieldset>
            </div>
          </article>

          <div className="mt-5 flex justify-between gap-3">
            <button
              type="button"
              onClick={() => goToPage(pageIndex - 1)}
              disabled={pageIndex === 0}
              className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-2 text-sm disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" /> Anterior
            </button>
            <button
              type="button"
              onClick={() => goToPage(pageIndex + 1)}
              disabled={pageIndex === book.pages.length - 1}
              className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-2 text-sm disabled:opacity-40"
            >
              Siguiente <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <p className="mt-4 text-xs text-ink-soft">
            La propuesta y sus ilustraciones se muestran solo en esta sesión: no se
            guardan, no generan calificaciones oficiales y requieren revisión docente.
          </p>
        </div>
      )}
    </section>
  );
}
