import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { interactiveBook, proposeBookPage, type BookContext } from "@/lib/interactive-book";
import type { MvpCycleState } from "@/lib/mvp-learning-cycle";
import type { mountBook } from "@/lib/interactive-book/viewer";

export function InteractiveLearningBook({
  state,
  onRead,
  onPresentation,
}: {
  state: MvpCycleState;
  onRead: (pageId: string) => void;
  onPresentation: (presentation: BookContext["presentation"]) => void;
}) {
  const [pageId, setPageId] = useState<string>("predict");
  const [enabled, setEnabled] = useState(false);
  const [error, setError] = useState(false);
  const host = useRef<HTMLDivElement>(null);
  const viewer = useRef<ReturnType<typeof mountBook> | null>(null);
  const page = interactiveBook.pages.find((item) => item.id === pageId)!;
  const latestPage = useRef(page);
  latestPage.current = page;
  const proposal = proposeBookPage(state);

  useEffect(() => {
    if (!enabled || !host.current) return;
    let cancelled = false;
    let mounted: ReturnType<typeof mountBook> | null = null;
    const container = host.current;
    void import("@/lib/interactive-book/viewer")
      .then(({ mountBook }) => {
        if (cancelled) return;
        mounted = mountBook(container, interactiveBook.title);
        viewer.current = mounted;
        mounted.show(latestPage.current.title, latestPage.current.text);
      })
      .catch(() => {
        if (!cancelled) {
          setError(true);
          setEnabled(false);
        }
      });
    return () => {
      cancelled = true;
      mounted?.dispose();
      viewer.current = null;
    };
  }, [enabled]);

  useEffect(() => {
    viewer.current?.show(page.title, page.text);
  }, [page]);
  useEffect(() => {
    onPresentation(enabled ? "3d" : "reading");
  }, [enabled, onPresentation]);

  const read = (id: string) => {
    onRead(id);
    setPageId(id);
  };
  return (
    <section
      className="border-b border-border/60 bg-muted/20 p-5 sm:p-6"
      aria-label="Libro interactivo de aprendizaje"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs text-ink-soft">
            Libro interactivo · demostración docente · v{interactiveBook.version}
          </p>
          <h3 className="text-lg font-semibold">{interactiveBook.title}</h3>
        </div>
        <Button
          variant="outline"
          aria-pressed={enabled}
          onClick={() => {
            setError(false);
            setEnabled(!enabled);
          }}
        >
          {enabled ? "Desactivar vista 3D" : "Activar vista 3D opcional"}
        </Button>
      </div>
      {error && (
        <p role="status" className="mt-3 text-sm">
          No se ha podido abrir la vista 3D. Puedes continuar con la lectura y las actividades.
        </p>
      )}
      {enabled && (
        <div
          ref={host}
          aria-hidden="true"
          className="relative mt-4 h-80 overflow-hidden rounded-xl bg-stone-100"
        />
      )}
      <nav aria-label="Páginas del libro" className="my-4 flex flex-wrap gap-2">
        {interactiveBook.pages.map((item) => (
          <Button
            key={item.id}
            variant={pageId === item.id ? "default" : "outline"}
            aria-current={pageId === item.id ? "page" : undefined}
            onClick={() => read(item.id)}
          >
            {item.title}
          </Button>
        ))}
      </nav>
      <article aria-live="polite" className="rounded-xl border border-border bg-background p-5">
        <h4 className="font-semibold">{page.title}</h4>
        <p className="mt-2 max-w-3xl leading-relaxed">{page.text}</p>
      </article>
      {state.assessments.at(-1)?.reviewStatus !== "pending" && state.assessments.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
          <p>
            Propuesta tras la revisión docente:{" "}
            {proposal === "explore"
              ? "repasar con ayuda"
              : "explicar el procedimiento y comprobarlo"}
            .
          </p>
          <Button size="sm" variant="outline" onClick={() => read(proposal)}>
            Abrir propuesta (docente)
          </Button>
        </div>
      )}
      <p className="mt-3 text-xs text-ink-soft">
        Abrir «Explora» registra ayuda conceptual en el siguiente intento. Leer o pasar páginas no
        crea evidencias de aprendizaje. {interactiveBook.source}.
      </p>
      <p className="mt-2 text-xs text-ink-soft">
        Motor visual adaptado de Cristian Sepúlveda-Irribarra ·{" "}
        <a
          className="underline"
          href="https://github.com/csepulvedai/libro-3d-interactivo"
          target="_blank"
          rel="noreferrer"
        >
          libro-3d-interactivo
        </a>{" "}
        ·{" "}
        <a
          className="underline"
          href="/licenses/libro-3d-interactivo.txt"
          target="_blank"
          rel="noreferrer"
        >
          Licencia MIT
        </a>
        .
      </p>
    </section>
  );
}
