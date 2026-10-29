import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  GraduationCap,
  Lightbulb,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";
import {
  librosBilingues,
  nivelesLibros,
  resumenLibro,
  type NivelLibro,
} from "@/lib/libros-bilingues";

export const Route = createFileRoute("/libros")({
  head: () => ({
    meta: [
      { title: "Libros bilingües español–árabe | NeuroAula AI" },
      {
        name: "description",
        content: "Prototipo interactivo gratuito de lectura y ejercicios de español con apoyo en árabe, niveles A1, A2 y B1.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: LibrosBilingues,
});

function LibrosBilingues() {
  const [nivel, setNivel] = useState<NivelLibro>("A1");
  const [pagina, setPagina] = useState(0);
  const [respuestas, setRespuestas] = useState<Record<string, number>>({});
  const [mostrarArabe, setMostrarArabe] = useState(true);
  const [mostrarVocabulario, setMostrarVocabulario] = useState(true);
  const [pistaAbierta, setPistaAbierta] = useState<string | null>(null);
  const [vistaDocente, setVistaDocente] = useState(false);
  const [unaPregunta, setUnaPregunta] = useState(false);
  const [preguntaActual, setPreguntaActual] = useState(0);
  const [textoGrande, setTextoGrande] = useState(false);
  const [sinDistracciones, setSinDistracciones] = useState(false);
  const [guiaPasos, setGuiaPasos] = useState(true);

  const paginas = librosBilingues[nivel];
  const actual = paginas[pagina];
  const resumen = resumenLibro(nivel, respuestas);
  const preguntasVisibles = unaPregunta ? actual.preguntas.slice(preguntaActual, preguntaActual + 1) : actual.preguntas;
  const resueltasPagina = actual.preguntas.filter(
    (pregunta) => respuestas[pregunta.id] === pregunta.correcta,
  ).length;

  function cambiarPagina(indice: number) {
    if (indice < 0 || indice >= paginas.length) return;
    setPagina(indice);
    setPreguntaActual(0);
    setPistaAbierta(null);
  }

  function cambiarNivel(siguiente: NivelLibro) {
    setNivel(siguiente);
    setPagina(0);
    setPreguntaActual(0);
    setPistaAbierta(null);
  }

  function siguientePagina() {
    if (pagina < paginas.length - 1) {
      cambiarPagina(pagina + 1);
      return;
    }
    const siguiente = nivelesLibros.indexOf(nivel) + 1;
    if (siguiente < nivelesLibros.length) cambiarNivel(nivelesLibros[siguiente]);
  }

  function reiniciar() {
    setRespuestas({});
    setPreguntaActual(0);
    setPagina(0);
    setPistaAbierta(null);
  }

  return (
    <div className="min-h-screen bg-[oklch(0.985_0.005_260)] text-ink">
      <header className="border-b border-border/70 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold hover:underline">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-brand text-white">
              <BookOpen className="h-5 w-5" aria-hidden="true" />
            </span>
            NeuroAula AI
          </Link>
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-ink-soft hover:text-ink">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Volver a la web
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-7 sm:px-6">
        <div className="mb-5 inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-900">
          <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
          Prototipo con contenidos ficticios · sin datos de estudiantes
        </div>
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Mi libro bilingüe</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-soft">
              Aprende español con apoyo en árabe. Lee a tu ritmo, consulta palabras y
              comprueba lo aprendido. No necesitas una cuenta para esta demostración.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setVistaDocente((value) => !value)}
            aria-pressed={vistaDocente}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-border bg-white px-4 py-2 text-sm font-medium hover:bg-muted"
          >
            <GraduationCap className="h-4 w-4" aria-hidden="true" />
            {vistaDocente ? "Volver a leer" : "Vista del docente"}
          </button>
        </div>

        <section aria-label="Elegir nivel" className="my-6 flex flex-wrap gap-2">
          {nivelesLibros.map((opcion) => (
            <button
              key={opcion}
              type="button"
              onClick={() => cambiarNivel(opcion)}
              aria-pressed={nivel === opcion}
              className={
                "min-h-11 rounded-xl px-5 py-2 text-sm font-semibold transition " +
                (nivel === opcion
                  ? "bg-gradient-brand text-white shadow-glow"
                  : "border border-border bg-white hover:bg-muted")
              }
            >
              {opcion === "A1" ? "Inicial A1" : opcion === "A2" ? "Intermedio A2" : "Avanzado B1"}
            </button>
          ))}
        </section>

        <section className="mb-6 rounded-2xl border border-border/70 bg-white p-4 sm:p-5" aria-labelledby="apoyos-titulo">
          <h2 id="apoyos-titulo" className="text-base font-semibold">Personaliza los apoyos</h2>
          <p className="mt-1 text-sm text-ink-soft">
            Elige lo que te ayuda a aprender; no hace falta indicar un diagnóstico.
            Puedes cambiar estas opciones cuando quieras.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {([
              { titulo: "Una pregunta cada vez", activo: unaPregunta, cambiar: setUnaPregunta },
              { titulo: "Letra más grande", activo: textoGrande, cambiar: setTextoGrande },
              { titulo: "Menos distracciones", activo: sinDistracciones, cambiar: setSinDistracciones },
              { titulo: "Guía paso a paso", activo: guiaPasos, cambiar: setGuiaPasos },
            ] as const).map((opcion) => (
              <label key={opcion.titulo} className="flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border border-border/70 px-3 py-2 text-sm">
                <input
                  type="checkbox"
                  checked={opcion.activo}
                  onChange={(event) => {
                    opcion.cambiar(event.target.checked);
                    setPreguntaActual(0);
                  }}
                  className="h-5 w-5 accent-indigo-700"
                />
                <span>{opcion.titulo}</span>
              </label>
            ))}
          </div>
          {guiaPasos && !vistaDocente && (
            <p className="mt-4 rounded-xl bg-muted/60 px-4 py-3 text-sm font-medium">
              1. Lee el texto → 2. Consulta las palabras → 3. Contesta → 4. Revisa tu respuesta.
            </p>
          )}
        </section>

        {vistaDocente ? (
          <section className="card-soft space-y-5 p-5 sm:p-7" aria-label="Panel del docente">
            <div>
              <h2 className="text-xl font-semibold">Vista docente · demostración local</h2>
              <p className="mt-2 text-sm leading-6 text-ink-soft">
                Los aciertos que se muestran se calculan en esta pantalla. No se guardan,
                no se envían a un servidor y no representan una evaluación con inteligencia artificial.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {nivelesLibros.map((opcion) => {
                const datos = resumenLibro(opcion, respuestas);
                return (
                  <div key={opcion} className="rounded-xl border border-border/70 bg-white p-4">
                    <div className="text-sm font-semibold">Nivel {opcion}</div>
                    <div className="mt-2 text-2xl font-bold">
                      {datos.correctas} / {datos.total}
                    </div>
                    <p className="text-xs text-ink-soft">Ejercicios resueltos correctamente</p>
                  </div>
                );
              })}
            </div>
            <button
              type="button"
              onClick={reiniciar}
              className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-border bg-white px-4 py-2 text-sm hover:bg-muted"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Reiniciar respuestas de esta sesión
            </button>
          </section>
        ) : (
          <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
            <article className="card-soft overflow-hidden">
              <div className="border-b border-border/70 bg-white px-5 py-5 sm:px-7">
                <div className="flex items-center justify-between gap-3 text-xs text-ink-soft">
                  <span>Lectura {pagina + 1} de {paginas.length}</span>
                  <span>Nivel {nivel}</span>
                </div>
                <div className="mt-3 flex gap-1.5" aria-label={"Progreso de páginas: " + (pagina + 1) + " de " + paginas.length}>
                  {paginas.map((lectura, indice) => (
                    <button
                      key={lectura.id}
                      type="button"
                      onClick={() => cambiarPagina(indice)}
                      aria-label={"Ir a la lectura " + (indice + 1)}
                      aria-current={pagina === indice ? "step" : undefined}
                      className={
                        "h-2 min-w-0 flex-1 rounded-full transition " +
                        (indice <= pagina ? "bg-[oklch(0.6_0.2_265)]" : "bg-muted")
                      }
                    />
                  ))}
                </div>
                <div className="mt-6 text-center">
                  {!sinDistracciones && <div className="text-5xl" aria-hidden="true">{actual.icono}</div>}
                  <h2 className="mt-3 text-2xl font-semibold">{actual.titulo}</h2>
                </div>
              </div>
              <div className="space-y-5 p-5 sm:p-7">
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-soft">Lectura en español</p>
                  <p lang="es" className={textoGrande ? "text-2xl leading-10" : "text-lg leading-9"}>{actual.textoEspanol}</p>
                </div>
                <div className="border-t border-border/70 pt-4">
                  <button
                    type="button"
                    aria-expanded={mostrarArabe}
                    onClick={() => setMostrarArabe((valor) => !valor)}
                    className="inline-flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm font-medium hover:bg-muted"
                  >
                    {mostrarArabe ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    {mostrarArabe ? "Ocultar traducción árabe" : "Ver traducción árabe"}
                  </button>
                  {mostrarArabe && (
                    <div className="mt-3 rounded-xl bg-muted/50 px-4 py-4">
                      <p lang="ar" dir="rtl" className={textoGrande ? "text-right text-2xl leading-10" : "text-right text-xl leading-10"}>
                        {actual.textoArabe}
                      </p>
                    </div>
                  )}
                </div>
                <div className="border-t border-border/70 pt-4">
                  <button
                    type="button"
                    onClick={() => setMostrarVocabulario((value) => !value)}
                    aria-expanded={mostrarVocabulario}
                    className="min-h-11 text-sm font-semibold hover:underline"
                  >
                    {mostrarVocabulario ? "Ocultar palabras clave" : "Ver palabras clave"} · Español / العربية
                  </button>
                  {mostrarVocabulario && (
                    <dl className="mt-3 grid gap-2">
                      {actual.vocabulario.map((palabra) => (
                        <div key={palabra.es} className="flex items-center justify-between gap-4 rounded-lg bg-muted/40 px-3 py-2">
                          <dt className="font-medium">{palabra.es}</dt>
                          <dd lang="ar" dir="rtl" className="text-right text-lg">{palabra.ar}</dd>
                        </div>
                      ))}
                    </dl>
                  )}
                </div>
              </div>
            </article>

            <section className="card-soft space-y-5 p-5 sm:p-7" aria-label="Ejercicios interactivos">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">Practica lo aprendido</p>
                <h2 className="mt-1 text-xl font-semibold">Responde tocando la opción</h2>
                <p className="mt-2 text-xs text-ink-soft">
                  {resueltasPagina} de {actual.preguntas.length} ejercicios resueltos en esta lectura
                </p>
              </div>
              {unaPregunta && (
                <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-muted/50 p-3 text-sm">
                  <span>Pregunta {preguntaActual + 1} de {actual.preguntas.length}</span>
                  <div className="flex gap-2">
                    <button type="button" className="min-h-10 rounded-lg border border-border bg-white px-3 disabled:opacity-40" disabled={preguntaActual === 0} onClick={() => { setPreguntaActual((n) => n - 1); setPistaAbierta(null); }}>Anterior</button>
                    <button type="button" className="min-h-10 rounded-lg border border-border bg-white px-3 disabled:opacity-40" disabled={preguntaActual === actual.preguntas.length - 1} onClick={() => { setPreguntaActual((n) => n + 1); setPistaAbierta(null); }}>Siguiente</button>
                  </div>
                </div>
              )}
              {preguntasVisibles.map((pregunta) => {
                const indice = actual.preguntas.findIndex((item) => item.id === pregunta.id);
                const elegida = respuestas[pregunta.id];
                const acertada = elegida === pregunta.correcta;
                const respondida = elegida !== undefined;
                const abierta = pistaAbierta === pregunta.id;
                return (
                  <div key={pregunta.id} className="rounded-xl border border-border/70 bg-white p-4">
                    <div className="text-xs font-medium text-ink-soft">
                      {indice + 1}. {pregunta.categoria}
                    </div>
                    <h3 className="mt-2 text-base font-semibold leading-6">{pregunta.enunciado}</h3>
                    <div className="mt-3 grid gap-2">
                      {pregunta.opciones.map((opcion, numero) => (
                        <button
                          key={numero}
                          type="button"
                          onClick={() => setRespuestas((prev) => ({ ...prev, [pregunta.id]: numero }))}
                          aria-pressed={elegida === numero}
                          className={
                            "flex min-h-12 items-center gap-3 rounded-xl border px-3 py-3 text-left text-sm transition " +
                            (elegida === numero
                              ? acertada
                                ? "border-emerald-500 bg-emerald-50 text-emerald-900"
                                : "border-amber-400 bg-amber-50 text-amber-900"
                              : "border-border/70 hover:border-[oklch(0.6_0.2_265)] hover:bg-muted/50")
                          }
                        >
                          <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-current text-xs" aria-hidden="true">
                            {numero + 1}
                          </span>
                          <span lang={/[\u0600-\u06FF]/.test(opcion) ? "ar" : "es"}>{opcion}</span>
                        </button>
                      ))}
                    </div>
                    {respondida && (
                      <p role="status" className={"mt-3 flex items-start gap-2 text-sm " + (acertada ? "text-emerald-800" : "text-amber-800")}>
                        {acertada && <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />}
                        {acertada ? pregunta.explicacion : "Todavía no. Revisa la lectura y vuelve a intentarlo."}
                      </p>
                    )}
                    {!acertada && (
                      <div className="mt-3">
                        <button
                          type="button"
                          aria-expanded={abierta}
                          onClick={() => setPistaAbierta(abierta ? null : pregunta.id)}
                          className="inline-flex min-h-10 items-center gap-1.5 text-sm font-medium text-ink-soft hover:text-ink"
                        >
                          <Lightbulb className="h-4 w-4" aria-hidden="true" />
                          {abierta ? "Ocultar pista" : "Necesito una pista"}
                        </button>
                        {abierta && <p className="mt-1 text-sm text-ink-soft">{pregunta.pista}</p>}
                      </div>
                    )}
                  </div>
                );
              })}
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/70 pt-4">
                <button
                  type="button"
                  disabled={pagina === 0}
                  onClick={() => cambiarPagina(pagina - 1)}
                  className="inline-flex min-h-11 items-center gap-1.5 rounded-xl border border-border px-3 text-sm disabled:cursor-not-allowed disabled:opacity-40 hover:bg-muted"
                >
                  <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                  Anterior
                </button>
                {!(pagina === paginas.length - 1 && nivel === "B1") && (
                  <button
                    type="button"
                    onClick={siguientePagina}
                    className="inline-flex min-h-11 items-center gap-1.5 rounded-xl bg-gradient-brand px-4 text-sm font-medium text-white shadow-glow"
                  >
                    {pagina === paginas.length - 1 ? "Siguiente nivel" : "Siguiente lectura"}
                    <ChevronRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                )}
              </div>
              <p className="text-xs leading-5 text-ink-soft">
                Progreso en el nivel: {resumen.correctas} de {resumen.total} ejercicios.
                Puedes avanzar sin terminar para explorar las lecturas.
              </p>
            </section>
          </div>
        )}

        <footer className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-border/70 py-5 text-xs leading-5 text-ink-soft">
          <p>
            Sin llamadas a IA, sin cuentas, sin envío ni almacenamiento de respuestas.
            Las traducciones deben revisarse antes de uso docente.
          </p>
          <p className="inline-flex items-center gap-1">
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            Futuro piloto offline: pendiente de desarrollo y validación
          </p>
        </footer>
      </main>
    </div>
  );
}
