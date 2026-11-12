import { useEffect, useRef, useState } from "react";
import { Check, LoaderCircle, Sparkles, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  educationAgents,
  educationAgent,
  programmedAgentDraft,
  reviewAgentDraft,
  nextTrialStep,
  type AgentBoard,
  type EducationAgentId,
} from "@/lib/education-agents";
import { generateEducationAgent } from "@/lib/education-agents.server";
import { analyzeEvidence, type AnalystInput } from "@/lib/learning-analyst";

export function EducationAgentWorkbench({
  context,
  available,
  busy,
  onBusyChange,
}: {
  context: AnalystInput;
  available: boolean;
  busy: boolean;
  onBusyChange: (value: boolean) => void;
}) {
  const lang = context.lang;
  const tr = (es: string, en: string) => (lang === "es" ? es : en);
  const [selected, setSelected] = useState<EducationAgentId>("curriculum");
  const [board, setBoard] = useState<AgentBoard>({});
  const [error, setError] = useState("");
  const [running, setRunning] = useState<EducationAgentId | null>(null);
  const alive = useRef(true);
  const inFlight = useRef(false);
  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);
  const agent = educationAgent(selected);
  const current = board[selected];
  const facts = analyzeEvidence(context.attempts);
  const approved = educationAgents.filter(({ id }) => board[id]?.review === "approved");
  const reviewLabel = (review: "pending" | "approved" | "rejected") =>
    review === "pending"
      ? tr("Pendiente de revisión", "Awaiting review")
      : review === "approved"
        ? tr("Aprobado", "Approved")
        : tr("Rechazado", "Rejected");

  async function generate() {
    if (inFlight.current || busy || !available || !context.attempts.length) return;
    const id = selected;
    inFlight.current = true;
    setRunning(id);
    onBusyChange(true);
    setError("");
    try {
      const result = await generateEducationAgent({ data: { agentId: id, context } });
      if (!alive.current) return;
      if (result.ok)
        setBoard((previous) => ({
          ...previous,
          [id]: { draft: result.advice, source: "ai", review: "pending" },
        }));
      else
        setError(
          result.code === "rate_limited"
            ? tr(
                "Límite compartido con el tutor: espera un minuto antes de generar otra propuesta.",
                "Shared tutor limit: wait a minute before generating another draft.",
              )
            : result.code === "unauthorized"
              ? tr(
                  "Necesitas una sesión docente válida en este centro.",
                  "A valid teacher session in this organization is required.",
                )
              : result.code === "not_configured"
                ? tr(
                    "La IA no está configurada. Puedes revisar un ejemplo programado.",
                    "AI is not configured. You can review a programmed example.",
                  )
                : tr(
                    "No se recibió una propuesta válida. Puedes reintentar; no se ha sustituido por un ejemplo.",
                    "No valid draft was received. You can retry; no example has been substituted.",
                  ),
        );
    } catch {
      if (alive.current)
        setError(
          tr(
            "No se pudo conectar. Las propuestas anteriores siguen disponibles.",
            "Connection failed. Previous drafts remain available.",
          ),
        );
    } finally {
      inFlight.current = false;
      if (alive.current) {
        setRunning(null);
        onBusyChange(false);
      }
    }
  }

  return (
    <section
      className="border-t border-border/60 p-5 sm:p-6"
      aria-labelledby="agents-title"
      aria-busy={running !== null}
    >
      <div className="flex items-center gap-2 text-primary">
        <Users className="h-5 w-5" />
        <span className="text-sm font-medium">{tr("Equipo educativo", "Education team")}</span>
      </div>
      <h3 id="agents-title" className="mt-2 text-xl font-semibold">
        {tr("Ocho agentes, una actividad compartida", "Eight agents, one shared activity")}
      </h3>
      <p className="mt-2 max-w-3xl text-sm text-ink-soft">
        {tr(
          "Elige qué especialista necesitas. Cada propuesta usa los intentos ficticios de arriba y requiere revisión docente. Se genera una propuesta cada vez; aprobarla no ejecuta acciones ni envía mensajes.",
          "Choose the specialist you need. Each draft uses the fictional attempts above and requires teacher review. One draft is generated at a time; approval does not execute actions or send messages.",
        )}
      </p>
      <div className="mt-4 rounded-xl bg-muted/60 p-3 text-sm" aria-live="polite">
        {context.attempts.length ? (
          <>
            <strong>
              {facts.total} {tr("intento(s)", "attempt(s)")} · {facts.incorrect}{" "}
              {tr("incorrecto(s)", "incorrect")}
            </strong>
            <p className="mt-1">{nextTrialStep(context, lang)}</p>
          </>
        ) : (
          tr(
            "Registra una respuesta en el ejercicio para dar contexto a los agentes.",
            "Record an answer in the exercise to give the agents context.",
          )
        )}
      </div>
      <div
        className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-4"
        aria-label={tr("Elegir agente", "Choose an agent")}
      >
        {educationAgents.map((item) => (
          <button
            key={item.id}
            type="button"
            disabled={busy}
            aria-pressed={selected === item.id}
            onClick={() => {
              setSelected(item.id);
              setError("");
            }}
            className={`rounded-xl border p-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60 ${selected === item.id ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"}`}
          >
            <span className="block text-sm font-semibold">{item.name[lang]}</span>
            <span className="mt-1 block text-xs leading-relaxed text-ink-soft">
              {item.purpose[lang]}
            </span>
            <span className="mt-3 block text-xs font-medium">
              {running === item.id
                ? tr("Generando…", "Generating…")
                : board[item.id]
                  ? `${board[item.id]?.source === "ai" ? "IA" : tr("Ejemplo", "Example")} · ${reviewLabel(board[item.id]!.review)}`
                  : tr("Sin propuesta", "No draft")}
            </span>
          </button>
        ))}
      </div>
      <div className="mt-5 rounded-2xl border border-border p-4 sm:p-5">
        <h4 className="text-lg font-semibold">{agent.name[lang]}</h4>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button
            variant="outline"
            disabled={busy || !context.attempts.length}
            onClick={() => {
              const draft = programmedAgentDraft({ agentId: selected, context });
              setBoard((previous) => ({
                ...previous,
                [selected]: { draft, source: "guided", review: "pending" },
              }));
              setError("");
            }}
          >
            {tr("Preparar ejemplo sin IA", "Prepare example without AI")}
          </Button>
          <Button
            disabled={busy || !available || !context.attempts.length}
            onClick={() => void generate()}
          >
            {running ? <LoaderCircle className="animate-spin" /> : <Sparkles />}
            {tr("Generar propuesta con IA", "Generate AI draft")}
          </Button>
        </div>
        {!available && (
          <p className="mt-2 text-xs text-ink-soft">
            {tr(
              "Conexión de IA pendiente. Los ejemplos programados permiten probar el flujo.",
              "AI connection pending. Programmed examples let you test the workflow.",
            )}
          </p>
        )}
        {error && (
          <p role="alert" className="mt-3 text-sm text-red-700">
            {error}
          </p>
        )}
        <div aria-live="polite">
          {current ? (
            <>
              <p className="mt-4 text-sm font-medium">
                {current.source === "ai"
                  ? tr("Borrador generado por IA", "AI-generated draft")
                  : tr(
                      "Ejemplo programado · no generado por IA",
                      "Programmed example · not AI-generated",
                    )}{" "}
                · {reviewLabel(current.review)}
              </p>
              <dl className="mt-4 space-y-4">
                {agent.fields.map(({ key, label }) => (
                  <div key={key}>
                    <dt className="text-sm font-semibold">{label[lang]}</dt>
                    <dd className="mt-1 whitespace-pre-line text-sm leading-relaxed">
                      {current.draft.fields[key]}
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="mt-4 text-xs text-ink-soft">
                {tr("Intentos citados", "Cited attempts")}:{" "}
                {current.draft.evidenceAttempts.join(", ")} ·{" "}
                {tr("Material interno", "Internal material")}: {current.draft.sourceId}
              </p>
              {current.review === "pending" && (
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button
                    disabled={busy}
                    onClick={() =>
                      setBoard((previous) => reviewAgentDraft(previous, selected, "approved"))
                    }
                  >
                    <Check />
                    {tr("Aprobar borrador", "Approve draft")}
                  </Button>
                  <Button
                    variant="outline"
                    disabled={busy}
                    onClick={() =>
                      setBoard((previous) => reviewAgentDraft(previous, selected, "rejected"))
                    }
                  >
                    {tr("Rechazar", "Reject")}
                  </Button>
                </div>
              )}
            </>
          ) : (
            <p className="mt-4 text-sm text-ink-soft">
              {tr(
                "Aquí aparecerá la propuesta del especialista seleccionado.",
                "The selected specialist's draft will appear here.",
              )}
            </p>
          )}
        </div>
      </div>
      <div className="mt-4 text-sm">
        <strong>
          {tr("Borradores aprobados para este contexto", "Approved drafts for this context")}:{" "}
          {approved.length}/8
        </strong>
        {approved.length > 0 && (
          <ul className="mt-2 flex flex-wrap gap-2">
            {approved.map(({ id, name }) => (
              <li key={id} className="rounded-full bg-muted px-3 py-1">
                {name[lang]}
              </li>
            ))}
          </ul>
        )}
      </div>
      <p className="mt-3 text-xs leading-relaxed text-ink-soft">
        {tr(
          "Estas propuestas no se guardan al recargar y se descartan al cambiar los intentos o las pistas. La aprobación es solo de esta prueba; no modifica expedientes, no envía contenido a familias y no aplica adaptaciones automáticamente.",
          "These drafts are not saved on reload and are discarded when attempts or hints change. Approval is only for this trial; it does not change learner records, send content to families or apply adaptations automatically.",
        )}
      </p>
    </section>
  );
}
