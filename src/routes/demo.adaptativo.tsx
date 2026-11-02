import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useLang } from "@/lib/i18n";
import { demoT } from "@/lib/demo-i18n";
import { adaptiveActivity } from "@/lib/demo-data";
import { Sparkles, XCircle } from "lucide-react";

export const Route = createFileRoute("/demo/adaptativo")({
  component: Adaptive,
});

function Adaptive() {
  const { lang } = useLang();
  const t = demoT[lang];
  const a = adaptiveActivity;
  const [mode, setMode] = useState<"visual" | "oral" | "manipulative" | "written">("visual");
  const modeLabels = lang === "es"
    ? { visual: "Visual", oral: "Explicación oral", manipulative: "Manipulativa", written: "Escrita" }
    : { visual: "Visual", oral: "Spoken", manipulative: "Hands-on", written: "Written" };
  const modeGuidance = lang === "es"
    ? {
        visual: "Recta numérica: empieza en −8, avanza 5 a la izquierda y 3 a la derecha.",
        oral: "Explica en voz alta qué significa restar un número negativo antes de calcular.",
        manipulative: "Usa fichas positivas y negativas para representar cada operación.",
        written: "Reescribe −(−3) como +3 y desarrolla cada paso.",
      }
    : {
        visual: "Number line: start at −8, move 5 left, then 3 right.",
        oral: "Explain aloud what subtracting a negative number means before calculating.",
        manipulative: "Use positive and negative counters to model each operation.",
        written: "Rewrite −(−3) as +3 and show every step.",
      };
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">{t.adaptive.title}</h1>
        <p className="text-sm text-ink-soft">
          {a.subject} · {a.topic}
        </p>
      </header>

      <div className="card-soft p-6">
        <div className="text-[11px] uppercase tracking-wider text-ink-soft">
          {t.adaptive.statement}
        </div>
        <div className="mb-4 mt-1 rounded-xl bg-muted/60 p-4 font-mono">{a.statement}</div>

        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl bg-red-50 p-4">
            <div className="text-[11px] uppercase tracking-wider text-red-700">
              {t.adaptive.studentAnswer}
            </div>
            <div className="mt-1 inline-flex items-center gap-1.5 font-mono text-sm text-red-800">
              <XCircle className="h-4 w-4" /> {a.studentAnswer}
            </div>
          </div>
          <div className="rounded-2xl bg-amber-50 p-4">
            <div className="text-[11px] uppercase tracking-wider text-amber-700">
              {t.adaptive.detectedError}
            </div>
            <div className="mt-1 text-sm text-amber-900">{a.detectedError}</div>
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-border/70 p-4">
          <h2 className="text-sm font-semibold">
            {lang === "es" ? "Modalidades de apoyo para esta tarea" : "Support modalities for this task"}
          </h2>
          <p className="mt-1 text-xs text-ink-soft">
            {lang === "es"
              ? "Elige cómo explorar el concepto. Es una preferencia contextual, no un estilo fijo ni una evaluación automática."
              : "Choose how to explore the concept. This is a contextual preference, not a fixed learning style or an automated assessment."}
          </p>
          <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label={lang === "es" ? "Modalidad de apoyo" : "Support modality"}>
            {(Object.keys(modeLabels) as Array<keyof typeof modeLabels>).map((key) => (
              <button
                key={key}
                type="button"
                aria-pressed={mode === key}
                onClick={() => setMode(key)}
                className={`rounded-full border px-3 py-1.5 text-xs transition ${mode === key ? "border-indigo-600 bg-indigo-50 text-indigo-800" : "border-border bg-white text-ink-soft"}`}
              >
                {modeLabels[key]}
              </button>
            ))}
          </div>
          <div role="status" className="mt-3 rounded-xl bg-muted/60 p-3 text-sm">
            {modeGuidance[mode]}
          </div>
          <p className="mt-2 text-xs text-ink-soft">
            {lang === "es"
              ? "Demo local sin persistencia. La eficacia de cada apoyo deberá medirse mediante evidencias y revisión docente."
              : "Local demo without persistence. Support effectiveness must be evaluated through evidence and teacher review."}
          </p>
        </div>
        <div className="mt-4 grid gap-3">
          <Card title={t.adaptive.hint1}>{a.hint1}</Card>
          <Card title={t.adaptive.hint2}>{a.hint2}</Card>
          <Card title={t.adaptive.stepByStep}>
            <ol className="flex flex-col gap-1 font-mono text-sm">
              {a.stepByStep.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ol>
          </Card>
          <div className="flex items-start gap-2 rounded-2xl bg-[oklch(0.97_0.02_275)] p-4 text-sm">
            <Sparkles className="mt-0.5 h-4 w-4 text-[oklch(0.55_0.2_265)]" />
            <div>
              <div className="text-[11px] uppercase tracking-wider text-[oklch(0.4_0.15_275)]">
                {t.adaptive.nextActivity}
              </div>
              <div className="mt-1">{a.nextActivity}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-soft ring-1 ring-border/60">
      <div className="text-[11px] uppercase tracking-wider text-ink-soft">{title}</div>
      <div className="mt-1 text-sm">{children}</div>
    </div>
  );
}
