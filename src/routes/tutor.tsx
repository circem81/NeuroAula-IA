import { Link, createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, BookOpen, BrainCircuit, Lightbulb, RotateCcw, ShieldCheck } from "lucide-react";
import { catalogoNewton, fasesNewton } from "@/lib/newton-catalogo";
import { retosNewton } from "@/lib/newton-actividades";
import {
  crearEstadoTutor, estadisticasTutor, obtenerPreguntaTutor, responderTutor,
  solicitarPistaTutor,
} from "@/lib/newton-tutor";

export const Route=createFileRoute("/tutor")({
  head:()=>({meta:[
    {title:"Tutor matemático Newton · NeuroAula AI"},
    {name:"description",content:"Demostración de tutor por reglas con cuatro fases Newton, apoyos graduales y revisión docente."},
    {name:"robots",content:"noindex"},
  ]}),
  component:TutorNewton,
});

function TutorNewton(){
  const [estado,setEstado]=useState(crearEstadoTutor);
  const [mensaje,setMensaje]=useState("");
  const [pistaVisible,setPistaVisible]=useState(false);
  const [traduccion,setTraduccion]=useState(false);
  const [textoGrande,setTextoGrande]=useState(false);
  const [modoCalma,setModoCalma]=useState(true);
  const [verCatalogo,setVerCatalogo]=useState(false);
  const pregunta=obtenerPreguntaTutor(estado);
  const reto=retosNewton[estado.retoIndex];
  const stats=estadisticasTutor(estado);

  function responder(indice:number){
    const resultado=responderTutor(estado,indice);
    setEstado(resultado.estado);
    setMensaje(resultado.mensaje);
    setPistaVisible(false);
  }
  function mostrarPista(){
    setEstado((s)=>solicitarPistaTutor(s));
    setPistaVisible(true);
  }
  function reiniciar(){
    setEstado(crearEstadoTutor());
    setPistaVisible(false);
    setMensaje("");
  }
  return (
    <div className="min-h-screen bg-[oklch(0.985_0.005_260)] text-ink">
      <header className="border-b border-border/70 bg-white">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-brand text-white">
              <BrainCircuit className="h-5 w-5" aria-hidden="true"/>
            </span>
            NeuroAula AI
          </Link>
          <Link to="/newton" className="inline-flex items-center gap-2 text-sm text-ink-soft hover:text-ink">
            <ArrowLeft className="h-4 w-4" aria-hidden="true"/> Biblioteca Newton
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-900">
          <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true"/> Prototipo sin cuentas ni datos personales
        </span>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight">Mi tutor de matemáticas</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-ink-soft">
          El tutor propone una actividad cada vez. Si necesitas ayuda, te ofrece una pista o
          un ejercicio más sencillo. Recorre las cuatro fases de Newton y no utiliza
          modelos de IA ni RAG todavía: las decisiones se basan en reglas pedagógicas transparentes.
        </p>

        <section aria-label="Preferencias de apoyo" className="my-6 flex flex-wrap gap-3 rounded-2xl border border-border/70 bg-white p-4">
          <label className="inline-flex min-h-11 items-center gap-2 text-sm">
            <input type="checkbox" checked={traduccion} onChange={(e)=>setTraduccion(e.target.checked)} className="h-5 w-5 accent-indigo-700"/>
            Ayuda en árabe
          </label>
          <label className="inline-flex min-h-11 items-center gap-2 text-sm">
            <input type="checkbox" checked={textoGrande} onChange={(e)=>setTextoGrande(e.target.checked)} className="h-5 w-5 accent-indigo-700"/>
            Letra grande
          </label>
          <label className="inline-flex min-h-11 items-center gap-2 text-sm">
            <input type="checkbox" checked={modoCalma} onChange={(e)=>setModoCalma(e.target.checked)} className="h-5 w-5 accent-indigo-700"/>
            Modo tranquilo
          </label>
        </section>

        <section className={modoCalma?"mx-auto max-w-2xl":"grid items-start gap-5 lg:grid-cols-[minmax(0,0.65fr)_minmax(0,0.35fr)]"}>
          <article className="rounded-2xl border border-border/70 bg-white p-5 sm:p-7">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-ink-soft">
              <span>Problema {estado.retoIndex+1} de {retosNewton.length}</span>
              <span>{estado.tipo==="refuerzo"?"Refuerzo guiado":"Proporcionalidad · "+reto.tipo}</span>
            </div>
            <div className="mt-4 grid grid-cols-4 gap-1.5" aria-label="Fases Newton">
              {fasesNewton.map((fase,i)=>(
                <div key={fase} className={
                  "rounded-lg px-1 py-2 text-center text-[10px] font-medium sm:text-xs " +
                  (i===estado.faseIndex?"bg-indigo-100 text-indigo-900":"bg-muted text-ink-soft")
                }>{i+1}. {fase}</div>
              ))}
            </div>

            {!estado.terminado && (
              <>
                <h2 className="mt-7 text-xl font-semibold">{reto.titulo}</h2>
                <p className={"mt-3 rounded-xl bg-muted/50 p-4 leading-8 "+(textoGrande?"text-2xl":"text-lg")}>
                  {reto.situacion}
                </p>
                {traduccion && <p lang="ar" dir="rtl" className="mt-3 rounded-xl bg-muted/50 p-4 text-right text-xl leading-10">{reto.apoyoArabe}</p>}
                <div className="mt-6">
                  <p className="text-xs font-medium uppercase tracking-wide text-ink-soft">
                    {estado.tipo==="refuerzo"?"Actividad puente":"Fase: "+pregunta?.fase}
                  </p>
                  <h3 className={"mt-2 font-semibold leading-7 "+(textoGrande?"text-xl":"text-base")}>
                    {pregunta?.pregunta}
                  </h3>
                  <div className="mt-4 grid gap-2">
                    {pregunta?.opciones.map((opcion,i)=>(
                      <button key={i} type="button" disabled={estado.bloqueoRevision} onClick={()=>responder(i)}
                        className={"flex min-h-14 w-full items-center gap-3 rounded-xl border border-border/70 px-4 py-3 text-left hover:border-indigo-400 hover:bg-indigo-50 disabled:opacity-40 "+(textoGrande?"text-lg":"text-sm")}>
                        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-current text-xs" aria-hidden="true">{i+1}</span>
                        {opcion}
                      </button>
                    ))}
                  </div>
                </div>
                {!estado.bloqueoRevision &&
                  <button type="button" onClick={mostrarPista}
                    className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-ink-soft hover:text-ink">
                    <Lightbulb className="h-4 w-4" aria-hidden="true"/> Necesito una pista
                  </button>
                }
                {pistaVisible && <p className="rounded-xl bg-muted/70 px-4 py-3 text-sm">{pregunta?.pista}</p>}
                {estado.bloqueoRevision && (
                  <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4">
                    <p className="text-sm font-medium text-amber-900">Intervención docente recomendada</p>
                    <p className="mt-2 text-sm leading-6 text-amber-900">
                      Conviene comprobar qué parte del problema no se comprende y dar una
                      explicación individual. No es un diagnóstico ni una calificación.
                    </p>
                    <button type="button"
                      onClick={()=>{
                        setEstado((s)=>({...s,bloqueoRevision:false,erroresConsecutivos:0,pistasUtilizadas:0}));
                        setMensaje("Volvemos a intentar el ejercicio con acompañamiento.");
                      }}
                      className="mt-3 min-h-11 rounded-xl border border-amber-400 bg-white px-4 text-sm font-medium text-amber-900">
                      Reintentar con acompañamiento
                    </button>
                  </div>
                )}
              </>
            )}
            {estado.terminado && (
              <div className="py-10 text-center">
                <BookOpen className="mx-auto h-12 w-12 text-indigo-600" aria-hidden="true"/>
                <h2 className="mt-3 text-2xl font-semibold">¡Recorrido completado!</h2>
                <p className="mt-3 text-sm leading-6 text-ink-soft">
                  Has practicado las cuatro fases con tres situaciones. Puedes revisar el
                  proceso con tu docente y repetir los ejercicios.
                </p>
              </div>
            )}
            {mensaje && (
              <p role="status" aria-live="polite" className="mt-5 rounded-xl bg-indigo-50 p-4 text-sm leading-6 text-indigo-950">{mensaje}</p>
            )}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-2 border-t border-border/70 pt-4">
              <span className="text-xs text-ink-soft">
                {stats.fasesRevisadas} de {retosNewton.length*4} fases superadas
              </span>
              <button type="button" onClick={reiniciar}
                className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-border/70 px-3 text-sm hover:bg-muted">
                <RotateCcw className="h-4 w-4" aria-hidden="true"/> Reiniciar
              </button>
            </div>
          </article>
          {!modoCalma && (
            <aside className="rounded-2xl border border-border/70 bg-white p-5">
              <h2 className="text-base font-semibold">Mi recorrido</h2>
              <p className="mt-2 text-sm text-ink-soft">
                Respuestas correctas: {stats.aciertos} de {stats.intentos} intentos.
                Actividades puente realizadas: {stats.refuerzos}.
              </p>
              <p className="mt-3 text-xs leading-6 text-ink-soft">
                Las evidencias son locales, provisionales y no identifican a nadie.
                Se borran al recargar la página.
              </p>
            </aside>
          )}
        </section>
        <section className="mt-8 rounded-2xl border border-border/70 bg-white p-5">
          <button type="button" className="flex min-h-11 w-full items-center justify-between gap-2 text-left text-sm font-semibold"
            onClick={()=>setVerCatalogo((s)=>!s)} aria-expanded={verCatalogo}>
            <span>Mapa completo de contenidos del índice de Genially</span>
            <span aria-hidden="true">{verCatalogo?"−":"+"}</span>
          </button>
          {verCatalogo && (
            <div className="mt-3">
              <p className="text-xs leading-6 text-ink-soft">
                Todos estos bloques están identificados para el diseño del itinerario.
                Solo proporcionalidad tiene ejercicios propios operativos en este prototipo.
                Los demás NO se han incorporado como ejercicios navegables.
              </p>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {catalogoNewton.map((bloque)=>(
                  <li key={bloque.id} className="rounded-lg border border-border/70 p-3">
                    <p className="text-sm font-medium">{bloque.titulo}</p>
                    <p className="text-xs text-ink-soft">{bloque.estado==="prototipo"?"Ejercicios propios de prueba":"Pendiente de desarrollo"}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
        <p className="mt-5 text-xs leading-6 text-ink-soft">
          Este motor usa reglas locales, no agentes LLM ni RAG. No almacena ni envía
          datos del alumno. No hay conexión al Genially desde el motor y no se
          reproducen sus actividades. Se necesita internet para cargar la web;
          distribución offline pendiente.
        </p>
      </main>
    </div>
  );
}
