import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useDemoAuth } from "@/lib/demo-auth";
import { educationAgents, type EducationAgentId } from "@/lib/education-agents";
import {
  activityCatalog,
  catalogActivity,
  initialAnswersSchema,
  recommendActivities,
  guidedPathwayDraft,
  reducePathway,
  restorePathway,
  newtonIndex,
  agentName,
  type ActivityId,
  type InitialAnswers,
  type PathwayAction,
  type PathwayState,
} from "@/lib/activity-pathway";
import { generatePathwayDraft } from "@/lib/activity-pathway.server";

export function ActivityPathway() {
  const { session } = useDemoAuth();
  if (!session || session.role !== "teacher") return null;
  return (
    <Pathway
      key={`${session.id}:${session.organizationId}`}
      actorId={session.id}
      organizationId={session.organizationId}
    />
  );
}
function Pathway({ actorId, organizationId }: { actorId: string; organizationId: string }) {
  const [state, setState] = useState<PathwayState>({ entries: [] });
  const [answers, setAnswers] = useState<Partial<InitialAnswers>>({});
  const [selected, setSelected] = useState<ActivityId>("fractions");
  const [agentId, setAgentId] = useState<EducationAgentId>("accessibility");
  const [option, setOption] = useState<number | null>(null);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [storageError, setStorageError] = useState(false);
  const alive = useRef(true);
  const inFlight = useRef(false);
  const storageKey = `neuroaula:pathway:v1:${actorId}:${organizationId}`;
  useEffect(() => {
    alive.current = true;
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const saved = restorePathway(JSON.parse(raw), organizationId, actorId);
        if (saved) setState(saved);
        else setError("El registro guardado no es compatible. Se ha iniciado un recorrido vacío.");
      }
    } catch {
      setStorageError(true);
    }
    setReady(true);
    return () => {
      alive.current = false;
    };
  }, [actorId, organizationId, storageKey]);
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify({ version: 1, organizationId, actorId, entries: state.entries }),
      );
      setStorageError(false);
    } catch {
      setStorageError(true);
    }
  }, [state, ready, actorId, organizationId, storageKey]);
  const dispatch = (action: PathwayAction) => {
    const entry = { id: crypto.randomUUID(), at: new Date().toISOString(), actorId, action };
    setState((previous) => reducePathway(previous, entry));
  };
  const initial = () => {
    const parsed = initialAnswersSchema.safeParse(answers);
    if (!parsed.success) return;
    const first = recommendActivities(parsed.data)[0];
    setSelected(first.activityId);
    setAgentId(first.agentId);
    dispatch({ type: "initial", answers: parsed.data });
  };
  const proposal = state.proposal;
  const locked =
    proposal?.review === "pending" ||
    (proposal?.review === "approved" && (!state.evidence || state.evidence.review === "pending"));
  const generate = async (source: "guided" | "ai") => {
    if (!state.answers || inFlight.current || locked || state.entries.length >= 95) return;
    setError("");
    setOption(null);
    const data = { organizationId, activityId: selected, agentId, answers: state.answers };
    if (source === "guided") {
      dispatch({ type: "proposal", source, draft: guidedPathwayDraft(data) });
      return;
    }
    inFlight.current = true;
    setBusy(true);
    try {
      const result = await generatePathwayDraft({ data });
      if (!alive.current) return;
      if (result.ok) dispatch({ type: "proposal", source, draft: result.advice });
      else
        setError(
          result.code === "not_configured"
            ? "La IA no está configurada. Puedes elegir explícitamente el apoyo programado."
            : "La IA no pudo completar la propuesta. No se ha aprobado ni sustituido por un ejemplo.",
        );
    } catch {
      if (alive.current)
        setError("No se pudo contactar con el servicio. Puedes volver a intentarlo.");
    } finally {
      inFlight.current = false;
      if (alive.current) setBusy(false);
    }
  };
  const active = proposal ? catalogActivity(proposal.draft.activityId) : null;
  if (!ready)
    return (
      <section className="card-soft p-6" aria-busy="true">
        Cargando recorrido…
      </section>
    );
  return (
    <section className="card-soft p-5 sm:p-6" aria-labelledby="pathway-title">
      <p className="text-sm font-medium text-primary">Recorrido educativo · alumno ficticio</p>
      <h2 id="pathway-title" className="mt-2 text-xl font-semibold">
        Evaluación → ficha → especialista → comprobación
      </h2>
      <p className="mt-2 text-sm text-ink-soft">
        Tres preguntas orientan la elección; no son un diagnóstico ni una medida de capacidad. El
        progreso y las revisiones se guardan solo en este navegador y cuenta de demostración.
      </p>
      {storageError && (
        <p role="alert" className="mt-3 text-sm">
          No se puede guardar en este navegador. El recorrido funciona en memoria; exporta el
          registro antes de salir.
        </p>
      )}
      {error && (
        <p role="alert" className="mt-3 text-sm">
          {error}
        </p>
      )}
      {!state.answers ? (
        <div className="mt-5 space-y-5">
          <h3 className="font-semibold">1. Evaluación inicial</h3>
          {activityCatalog.map((a) => (
            <fieldset key={a.id} className="rounded-xl border p-4">
              <legend className="px-1 text-sm font-medium">{a.initial.prompt}</legend>
              <div className="flex flex-wrap gap-4">
                {a.initial.options.map((value, i) => (
                  <label
                    key={value}
                    className="flex cursor-pointer items-center gap-2 py-2 text-sm"
                  >
                    <input
                      type="radio"
                      name={`initial-${a.id}`}
                      value={i}
                      checked={answers[a.id] === i}
                      onChange={() => setAnswers((p) => ({ ...p, [a.id]: i }))}
                    />
                    {value}
                  </label>
                ))}
              </div>
            </fieldset>
          ))}
          <Button onClick={initial} disabled={!initialAnswersSchema.safeParse(answers).success}>
            Ver fichas propuestas
          </Button>
        </div>
      ) : (
        <div className="mt-5 space-y-5">
          <h3 className="font-semibold">2. Elegir ficha y especialista</h3>
          <div className="grid gap-3 sm:grid-cols-3">
            {recommendActivities(state.answers).map((r, i) => {
              const a = catalogActivity(r.activityId);
              return (
                <button
                  key={a.id}
                  type="button"
                  disabled={busy || locked || state.entries.length >= 95}
                  aria-pressed={selected === a.id}
                  onClick={() => {
                    setSelected(a.id);
                    setAgentId(a.agentId);
                  }}
                  className={`rounded-xl border p-4 text-left disabled:opacity-60 ${selected === a.id ? "border-primary bg-primary/5" : "border-border"}`}
                >
                  <span className="text-xs text-ink-soft">
                    {i === 0 ? "Primera propuesta" : "También disponible"} · ficha propia
                  </span>
                  <span className="mt-2 block font-semibold">{a.title}</span>
                  <span className="mt-2 block text-sm">{r.reason}</span>
                  <span className="mt-2 block text-xs">
                    Apoyo propuesto: {agentName(a.agentId)}. Elección pedagógica, no perfil del
                    alumno.
                  </span>
                </button>
              );
            })}
          </div>
          <p className="text-sm text-ink-soft">
            Objetivo: {catalogActivity(selected).objective}. Prerrequisitos:{" "}
            {catalogActivity(selected).prerequisite}.
          </p>
          <label className="block text-sm font-medium">
            Especialista para esta ficha
            <select
              className="mt-2 block w-full rounded-lg border bg-background p-3"
              value={agentId}
              disabled={busy || locked}
              onChange={(e) => setAgentId(e.target.value as EducationAgentId)}
            >
              {educationAgents.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name.es}
                </option>
              ))}
            </select>
          </label>
          <div className="flex flex-wrap gap-2">
            <Button
              disabled={busy || locked || state.entries.length >= 95}
              onClick={() => void generate("guided")}
            >
              Preparar apoyo programado
            </Button>
            <Button
              variant="outline"
              disabled={busy || locked || state.entries.length >= 95}
              onClick={() => void generate("ai")}
            >
              {busy ? "Preparando…" : "Solicitar borrador a la IA"}
            </Button>
          </div>
          <aside className="rounded-xl bg-muted p-4 text-sm">
            <a
              className="font-medium underline"
              href={newtonIndex.url}
              target="_blank"
              rel="noopener noreferrer"
              referrerPolicy="no-referrer"
            >
              Consultar el índice Genially de Proyecto Newton ↗
            </a>
            <p className="mt-2">
              Autor mostrado: pepvidalg · fuente G01. Contenido externo. Las fichas de esta prueba
              son propias; las actividades individuales de Genially están pendientes de
              catalogación. Abrir el índice no registra un resultado.
            </p>
          </aside>
          {proposal && active && (
            <section className="rounded-xl border p-4" aria-labelledby="proposal-title">
              <h3 id="proposal-title" className="font-semibold">
                3. Revisión docente · {active.title}
              </h3>
              <p className="mt-1 text-sm text-ink-soft">
                {agentName(proposal.draft.agentId)} ·{" "}
                {proposal.source === "ai" ? "Borrador generado por IA" : "Apoyo programado, sin IA"}{" "}
                ·{" "}
                {proposal.review === "pending"
                  ? "Pendiente"
                  : proposal.review === "approved"
                    ? "Aprobado"
                    : "Rechazado"}
              </p>
              <p className="mt-3 whitespace-pre-wrap text-sm">{proposal.draft.guidance}</p>
              <p className="mt-2 text-sm">{proposal.draft.question}</p>
              <p className="mt-2 text-xs text-ink-soft">
                Fuente de la actividad: {proposal.draft.sourceId}. Revisar exactitud y adecuación
                antes de aprobar.
              </p>
              {proposal.review === "pending" && (
                <div className="mt-3 flex gap-2">
                  <Button onClick={() => dispatch({ type: "review", decision: "approved" })}>
                    Aprobar y usar ficha
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => dispatch({ type: "review", decision: "rejected" })}
                  >
                    Rechazar
                  </Button>
                </div>
              )}
              {proposal.review === "approved" && (
                <div className="mt-5 border-t pt-4">
                  <h4 className="font-semibold">4. Usar ficha y comprobar</h4>
                  <p className="my-3 text-sm">{active.instruction}</p>
                  <fieldset disabled={!!state.evidence}>
                    <legend className="text-sm font-medium">{active.check.prompt}</legend>
                    <div className="flex flex-wrap gap-4">
                      {active.check.options.map((value, i) => (
                        <label className="flex items-center gap-2 py-3 text-sm" key={value}>
                          <input
                            type="radio"
                            name="check-answer"
                            checked={(state.evidence?.option ?? option) === i}
                            onChange={() => setOption(i)}
                          />
                          {value}
                        </label>
                      ))}
                    </div>
                  </fieldset>
                  {!state.evidence && (
                    <Button
                      disabled={option === null}
                      onClick={() => {
                        if (option !== null) dispatch({ type: "answer", option });
                      }}
                    >
                      Registrar respuesta
                    </Button>
                  )}
                  {state.evidence && (
                    <div className="mt-3 text-sm" aria-live="polite">
                      <p>
                        {state.evidence.correct
                          ? "Respuesta correcta en esta tarea."
                          : "Respuesta incorrecta en esta tarea."}{" "}
                        No acredita dominio ni explica la causa.
                      </p>
                      {state.evidence.review === "pending" ? (
                        <div className="mt-3 flex flex-wrap gap-2">
                          <Button
                            onClick={() =>
                              dispatch({ type: "evidence_review", decision: "confirmed" })
                            }
                          >
                            Confirmar observación
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() =>
                              dispatch({ type: "evidence_review", decision: "needs_review" })
                            }
                          >
                            Requiere revisión docente
                          </Button>
                        </div>
                      ) : (
                        <p className="mt-2">
                          {state.evidence.review === "confirmed"
                            ? "Observación confirmada."
                            : "Observación marcada para revisión; no se cuenta como validada."}{" "}
                          Puedes elegir otra ficha arriba.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </section>
          )}
        </div>
      )}
      <details className="mt-5 border-t pt-4">
        <summary className="cursor-pointer text-sm font-medium">
          Registro del recorrido ({state.entries.length} eventos)
        </summary>
        <p className="my-2 text-xs text-ink-soft">
          Registro local editable desde el navegador; no es un expediente oficial ni una auditoría
          central. Conserva propuestas, decisiones, respuestas, fechas y fuentes.
        </p>
        <ol className="my-3 space-y-2 text-xs">
          {state.entries.map((entry) => (
            <li key={entry.id}>
              {entry.at} ·{" "}
              {
                {
                  initial: "Evaluación inicial",
                  proposal: "Propuesta de ficha y especialista",
                  review: "Revisión de propuesta",
                  answer: "Respuesta de comprobación",
                  evidence_review: "Revisión de evidencia",
                }[entry.action.type]
              }
            </li>
          ))}
        </ol>
        <Button
          variant="outline"
          disabled={!state.entries.length}
          onClick={() => {
            const blob = new Blob(
              [
                JSON.stringify(
                  { version: 1, organizationId, actorId, entries: state.entries },
                  null,
                  2,
                ),
              ],
              { type: "application/json" },
            );
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "neuroaula-recorrido-demo.json";
            a.click();
            URL.revokeObjectURL(url);
          }}
        >
          Exportar registro
        </Button>
      </details>
      {state.entries.length >= 95 && (
        <p role="status" className="mt-3 text-sm">
          Has alcanzado el límite de fichas de este recorrido de prueba. Exporta el registro para
          conservarlo.
        </p>
      )}
    </section>
  );
}
