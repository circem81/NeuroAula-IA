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
