import { Link, createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ArrowRight, BookOpen, ExternalLink, Lightbulb, RotateCcw, ShieldCheck } from "lucide-react";
import { NEWTON_GENIALLY_INDEX_URL, retosNewton } from "@/lib/newton-actividades";

export const Route = createFileRoute("/newton")({
  head: () => ({
    meta: [
      { title: "Matemáticas paso a paso · NeuroAula AI" },
      {
        name: "description",
        content: "Actividades originales de proporcionalidad con apoyos personalizables y enlace al índice de recursos matemáticos de Genially.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AulaNewton,
});

function AulaNewton() {
  const [retoIndex, setRetoIndex] = useState(0);
  const [paso, setPaso] = useState(0);
  const [respuestas, setRespuestas] = useState<Record<string, number>>({});
  const [mostrarPista, setMostrarPista] = useState(false);
  const [mostrarArabe, setMostrarArabe] = useState(false);
  const [textoGrande, setTextoGrande] = useState(false);
  const [guiaVisual, setGuiaVisual] = useState(true);
  const [modoCalma, setModoCalma] = useState(false);
  const reto = retosNewton[retoIndex];
  const ejercicio = reto.pasos[paso];
  const clave = reto.id + ":" + paso;
  const seleccion = respuestas[clave];
  const acertado = seleccion === ejercicio.correcta;
  const correctas = retosNewton.reduce(
    (total, r) =>
      total +
      r.pasos.filter((p, indice) => respuestas[r.id + ":" + indice] === p.correcta).length,
    0,
  );

  function irAReto(indice: number) {
    setRetoIndex(indice);
    setPaso(0);
    setMostrarPista(false);
  }

  function irAPaso(indice: number) {
    setPaso(indice);
    setMostrarPista(false);
  }

  function siguiente() {
    if (!acertado) return;
    if (paso < reto.pasos.length - 1) irAPaso(paso + 1);
    else if (retoIndex < retosNewton.length - 1) irAReto(retoIndex + 1);
  }

  function reiniciar() {
    setRespuestas({});
    setRetoIndex(0);
    setPaso(0);
    setMostrarPista(false);
  }

  return (
    <div className="min-h-screen bg-[oklch(0.985_0.005_260)] text-ink">
      <header className="border-b border-border/70 bg-white">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-brand text-white"><BookOpen className="h-5 w-5" aria-hidden="true" /></span>
            NeuroAula AI
          </Link>
          <Link to="/libros" className="inline-flex items-center gap-2 text-sm text-ink-soft hover:text-ink">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Volver a los libros
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-5xl space-y-6 px-4 py-8 sm:px-6">
        <div>
          <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-900">
            <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" /> Demostración con respuestas locales
          </span>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight">Matemáticas paso a paso</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-ink-soft">
            Práctica original de proporcionalidad directa e inversa con apoyos opcionales para la
            atención, comprensión y memoria. Sin límite de tiempo, sin registro de alumnos y sin
            calificaciones. Los ejercicios pueden repetirse cuantas veces se necesite.
          </p>
          <Link to="/tutor" className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-xl bg-gradient-brand px-5 py-2 text-sm font-semibold text-white shadow-glow">
            Probar tutor secuencial <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
        {!modoCalma && <section className="rounded-2xl border border-border/70 bg-white p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-2xl">
              <h2 className="text-lg font-semibold">Biblioteca de recursos Newton · Genially</h2>
              <p className="mt-2 text-sm leading-6 text-ink-soft">
                Índice externo aportado por la docente, creado por pepvidalg. Contiene materiales
                de cálculo, fracciones, proporcionalidad, geometría y otros temas. Se abre
                fuera de NeuroAula y requiere internet; no se reproduce ni descarga su contenido.
              </p>
            </div>
            <a
              href={NEWTON_GENIALLY_INDEX_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-gradient-brand px-4 py-2 text-sm font-semibold text-white shadow-glow"
            >
              Ver índice original <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </section>}

        <section className="rounded-2xl border border-border/70 bg-white p-5" aria-labelledby="apoyos-matematicas">
          <h2 id="apoyos-matematicas" className="text-base font-semibold">Elige cómo quieres trabajar</h2>
          <p className="mt-1 text-sm text-ink-soft">Son preferencias de presentación, no diagnósticos. No se guardan.</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {([
              { label: "Texto más grande", value: textoGrande, set: setTextoGrande },
              { label: "Guía visual", value: guiaVisual, set: setGuiaVisual },
              { label: "Menos estímulos", value: modoCalma, set: setModoCalma },
              { label: "Traducción árabe", value: mostrarArabe, set: setMostrarArabe },
            ] as const).map((opcion) => (
              <label key={opcion.label} className="flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border border-border/70 px-3 py-2 text-sm">
                <input
                  type="checkbox"
                  className="h-5 w-5 accent-indigo-700"
                  checked={opcion.value}
                  onChange={(event) => opcion.set(event.target.checked)}
                />
                {opcion.label}
              </label>
            ))}
          </div>
        </section>

        <section aria-label="Retos de proporcionalidad" className={modoCalma ? "mx-auto grid max-w-2xl gap-5" : "grid gap-5 lg:grid-cols-[minmax(0,0.4fr)_minmax(0,0.6fr)]"}>
          {!modoCalma && <aside className="space-y-3 rounded-2xl border border-border/70 bg-white p-5">
            <h2 className="text-base font-semibold">Elige un problema</h2>
            {retosNewton.map((r, index) => (
              <button
                key={r.id}
                type="button"
                onClick={() => irAReto(index)}
                aria-current={index === retoIndex ? "true" : undefined}
                className={
                  "flex min-h-12 w-full items-center justify-between gap-2 rounded-xl border px-3 py-3 text-left text-sm " +
                  (index === retoIndex ? "border-indigo-500 bg-indigo-50 font-semibold" : "border-border/70 hover:bg-muted")
                }
              >
                <span>{index + 1}. {r.titulo}</span>
                <span className="text-xs text-ink-soft">{r.tipo === "directa" ? "Directa" : "Inversa"}</span>
              </button>
            ))}
            <p className="text-xs text-ink-soft">{correctas} de {retosNewton.length * 3} pasos acertados en esta sesión.</p>
            <button type="button" onClick={reiniciar} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-border/70 px-3 text-sm hover:bg-muted">
              <RotateCcw className="h-4 w-4" aria-hidden="true" /> Reiniciar ejercicios
            </button>
          </aside>}

          <article className="rounded-2xl border border-border/70 bg-white p-5 sm:p-7">
            <div className="flex items-center justify-between gap-2 text-xs text-ink-soft">
              <span>{reto.titulo}</span><span>Paso {paso + 1} de {reto.pasos.length}</span>
            </div>
            {guiaVisual && (
              <div className="mt-4 flex gap-2" aria-label={"Progreso: paso " + (paso + 1) + " de tres"}>
                {reto.pasos.map((p, index) => (
                  <button
                    key={p.objetivo}
                    type="button"
                    onClick={() => irAPaso(index)}
                    aria-label={"Ir al paso " + (index + 1)}
                    className={"h-2 flex-1 rounded-full " + (index <= paso ? "bg-indigo-500" : "bg-muted")}
                  />
                ))}
              </div>
            )}
            <h2 className="mt-6 text-xl font-semibold">{ejercicio.objetivo}</h2>
            <p lang="es" className={"mt-4 rounded-xl bg-muted/50 p-4 leading-8 " + (textoGrande ? "text-2xl" : "text-lg")}>
              {reto.situacion}
            </p>
            {mostrarArabe && (
              <p lang="ar" dir="rtl" className={"mt-3 rounded-xl bg-muted/50 p-4 text-right leading-9 " + (textoGrande ? "text-2xl" : "text-xl")}>
                {reto.apoyoArabe}
              </p>
            )}
            <h3 className={"mt-6 font-semibold " + (textoGrande ? "text-xl" : "text-base")}>
              {ejercicio.pregunta}
            </h3>
            <div className="mt-4 grid gap-3">
              {ejercicio.opciones.map((opcion, indice) => (
                <button
                  key={opcion}
                  type="button"
                  aria-pressed={seleccion === indice}
                  onClick={() => setRespuestas((prev) => ({ ...prev, [clave]: indice }))}
                  className={
                    "flex min-h-12 items-center gap-3 rounded-xl border px-4 py-3 text-left " +
                    (textoGrande ? "text-lg " : "text-sm ") +
                    (seleccion === indice
                      ? acertado
                        ? "border-emerald-500 bg-emerald-50"
                        : "border-amber-500 bg-amber-50"
                      : "border-border/70 hover:bg-muted")
                  }
                >
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-current text-xs" aria-hidden="true">{indice + 1}</span>
                  {opcion}
                </button>
              ))}
            </div>
            {seleccion !== undefined && (
              <p role="status" className={"mt-4 rounded-xl p-3 text-sm leading-6 " + (acertado ? "bg-emerald-50 text-emerald-900" : "bg-amber-50 text-amber-900")}>
                {acertado ? ejercicio.explicacion : "Puedes intentarlo de nuevo. No pasa nada por equivocarse."}
              </p>
            )}
            {!acertado && (
              <div className="mt-3">
                <button type="button" onClick={() => setMostrarPista((valor) => !valor)} aria-expanded={mostrarPista} className="inline-flex min-h-11 items-center gap-2 text-sm text-ink-soft hover:text-ink">
                  {!modoCalma && <Lightbulb className="h-4 w-4" aria-hidden="true" />}
                  {mostrarPista ? "Ocultar pista" : "Mostrar pista"}
                </button>
                {mostrarPista && <p className="mt-1 text-sm leading-6 text-ink-soft">{ejercicio.pista}</p>}
              </div>
            )}
            <div className="mt-6 flex flex-wrap justify-between gap-3 border-t border-border/70 pt-4">
              <button type="button" onClick={() => irAPaso(paso - 1)} disabled={paso === 0} className="min-h-11 rounded-xl border border-border/70 px-4 text-sm disabled:opacity-40">
                Anterior
              </button>
              {!(retoIndex === retosNewton.length - 1 && paso === reto.pasos.length - 1) && (
                <button
                  type="button"
                  onClick={siguiente}
                  disabled={!acertado}
                  className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-gradient-brand px-4 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Siguiente <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              )}
            </div>
          </article>
        </section>
        <p className="text-xs leading-6 text-ink-soft">
          Actividades originales de NeuroAula AI. No constituyen una reproducción del Genially,
          un diagnóstico clínico ni una evaluación mediante inteligencia artificial.
          Las respuestas permanecen temporalmente en esta página. Esta web alojada requiere
          internet para cargarse; la instalación offline es una etapa pendiente.
        </p>
      </main>
    </div>
  );
}
