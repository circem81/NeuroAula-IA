import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Sparkles, CheckCircle2, XCircle, Info } from "lucide-react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  PolarRadiusAxis,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { useState } from "react";
import { useLang } from "@/lib/i18n";
import { demoT } from "@/lib/demo-i18n";
import { students, adaptiveActivity } from "@/lib/demo-data";

export const Route = createFileRoute("/demo/alumno/$id")({
  component: StudentProfile,
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl py-16 text-center">
      <h1 className="text-xl font-semibold">Alumno no encontrado</h1>
      <Link
        to="/demo/alumnado"
        className="mt-4 inline-block text-sm text-[oklch(0.55_0.2_265)] hover:underline"
      >
        Volver al alumnado
      </Link>
    </div>
  ),
});

function StudentProfile() {
  const { id } = Route.useParams();
  const student = students.find((s) => s.id === id);
  const { lang } = useLang();
  const t = demoT[lang];
  if (!student) {
    return (
      <div className="mx-auto max-w-2xl py-16 text-center">
        <h1 className="text-xl font-semibold">Alumno no encontrado</h1>
        <Link
          to="/demo/alumnado"
          className="mt-4 inline-block text-sm text-[oklch(0.55_0.2_265)] hover:underline"
        >
          {t.profile.backToList}
        </Link>
      </div>
    );
  }

  const radarData = [
    { dim: t.twin.dims.attention, v: student.cognitive.attention },
    { dim: t.twin.dims.workingMemory, v: student.cognitive.workingMemory },
    { dim: t.twin.dims.verbal, v: student.cognitive.verbal },
    { dim: t.twin.dims.logic, v: student.cognitive.logic },
    { dim: t.twin.dims.selfRegulation, v: student.cognitive.selfRegulation },
    { dim: t.twin.dims.persistence, v: student.cognitive.persistence },
    { dim: t.twin.dims.pace, v: student.cognitive.pace },
  ];

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      <Link
        to="/demo/alumnado"
        className="inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" /> {t.profile.backToList}
      </Link>

      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-brand text-lg font-semibold text-white shadow-glow">
            {student.name
              .split(" ")
              .map((n) => n[0])
              .slice(0, 2)
              .join("")}
          </span>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{student.name}</h1>
            <p className="text-sm text-ink-soft">
              {t.profiles[student.profileKey]} · {t.mastery[student.masteryLevel]} ·{" "}
              {t.profile.attention}: {student.cognitive.attention}%
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs uppercase tracking-wider text-ink-soft">{t.twin.bestHelp}</div>
          <div className="text-sm font-semibold">{t.twin.helpTypes[student.bestHelpKey]}</div>
        </div>
      </header>

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="card-soft p-5 lg:col-span-2">
          <div className="mb-2 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[oklch(0.55_0.2_265)]" />
            <h2 className="text-sm font-semibold">{t.twin.title}</h2>
          </div>
          <p className="mb-3 text-xs text-ink-soft">{t.twin.subtitle}</p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} outerRadius="75%">
                <PolarGrid stroke="oklch(0.9 0.01 260)" />
                <PolarAngleAxis
                  dataKey="dim"
                  tick={{ fontSize: 10, fill: "oklch(0.35 0.02 265)" }}
                />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar
                  dataKey="v"
                  stroke="oklch(0.58 0.22 285)"
                  fill="oklch(0.58 0.22 285)"
                  fillOpacity={0.35}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-ink-soft">
            <Info className="h-3 w-3" /> {t.twin.disclaimer}
          </div>
        </div>

        <div className="card-soft p-5">
          <h2 className="mb-3 text-sm font-semibold">{t.profile.competencies}</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={student.competencies} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.01 260)" />
                <XAxis
                  type="number"
                  domain={[0, 100]}
                  tick={{ fontSize: 11, fill: "oklch(0.5 0.02 265)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fontSize: 11, fill: "oklch(0.35 0.02 265)" }}
                  axisLine={false}
                  tickLine={false}
                  width={80}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid oklch(0.92 0.01 260)",
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="value" radius={[0, 8, 8, 0]} fill="oklch(0.62 0.19 262)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <ChipList
          title={t.profile.strengths}
          tone="ok"
          items={student.strengthsKeys.map((k) => t.strings[k] ?? k)}
          icon={CheckCircle2}
        />
        <ChipList
          title={t.profile.difficulties}
          tone="warn"
          items={student.difficultiesKeys.map((k) => t.strings[k] ?? k)}
          icon={XCircle}
        />
        <ChipList
          title={t.profile.frequentErrors}
          tone="warn"
          items={student.frequentErrorsKeys.map((k) => t.strings[k] ?? k)}
          icon={XCircle}
        />
        <ChipList
          title={t.profile.strategies}
          tone="brand"
          items={student.strategiesKeys.map((k) => t.strings[k] ?? k)}
          icon={Sparkles}
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="card-soft p-5">
          <h2 className="mb-3 text-sm font-semibold">{t.profile.recent}</h2>
          <ul className="divide-y divide-border/60">
            {student.recentActivities.map((a) => (
              <li key={a.title} className="flex items-center justify-between py-3 text-sm">
                <div>
                  <div className="font-medium">{a.title}</div>
                  <div className="text-xs text-ink-soft">{a.date}</div>
                </div>
                <div className="text-sm font-semibold">{a.result}</div>
              </li>
            ))}
          </ul>
        </div>
        <div className="card-soft p-5">
          <h2 className="mb-3 text-sm font-semibold">{t.profile.recommendations}</h2>
          <ul className="flex flex-col gap-2 text-sm">
            {student.recommendationsKeys.map((k) => (
              <li
                key={k}
                className="flex items-start gap-2 rounded-xl bg-[oklch(0.97_0.02_275)] p-3 text-[13px]"
              >
                <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[oklch(0.55_0.2_265)]" />
                {t.strings[k] ?? k}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <AdaptiveActivityDemo />
    </div>
  );
}

function ChipList({
  title,
  items,
  tone,
  icon: Icon,
}: {
  title: string;
  items: string[];
  tone: "ok" | "warn" | "brand";
  icon: React.ComponentType<{ className?: string }>;
}) {
  const cls =
    tone === "ok"
      ? "bg-emerald-50 text-emerald-700"
      : tone === "warn"
        ? "bg-amber-50 text-amber-700"
        : "bg-[oklch(0.96_0.03_275)] text-[oklch(0.4_0.15_275)]";
  return (
    <div className="card-soft p-5">
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink-soft">{title}</h3>
      <ul className="flex flex-wrap gap-2">
        {items.map((it) => (
          <li
            key={it}
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs ${cls}`}
          >
            <Icon className="h-3 w-3" /> {it}
          </li>
        ))}
      </ul>
    </div>
  );
}

function AdaptiveActivityDemo() {
  const { lang } = useLang();
  const t = demoT[lang];
  const a = adaptiveActivity;
  const [step, setStep] = useState<0 | 1 | 2 | 3>(0);

  return (
    <section className="card-soft p-6">
      <div className="mb-4 flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-[oklch(0.55_0.2_265)]" />
        <h2 className="text-sm font-semibold">{t.adaptive.title}</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl bg-muted/50 p-4 text-sm">
          <div className="text-[11px] uppercase tracking-wider text-ink-soft">
            {t.adaptive.subject}
          </div>
          <div className="mb-2 font-semibold">
            {a.subject} · {a.topic}
          </div>
          <div className="text-[11px] uppercase tracking-wider text-ink-soft">
            {t.adaptive.statement}
          </div>
          <div className="mb-3 rounded-lg bg-white p-3 font-mono text-sm">{a.statement}</div>
          <div className="text-[11px] uppercase tracking-wider text-ink-soft">
            {t.adaptive.studentAnswer}
          </div>
          <div className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-1.5 font-mono text-sm text-red-700">
            <XCircle className="h-4 w-4" /> {a.studentAnswer}
          </div>
        </div>
        <div className="flex flex-col gap-3 text-sm">
          <div className="rounded-2xl bg-amber-50 p-4">
            <div className="text-[11px] uppercase tracking-wider text-amber-700">
              {t.adaptive.detectedError}
            </div>
            <div className="mt-1 text-sm text-amber-900">{a.detectedError}</div>
            <div className="mt-2 inline-flex rounded-full bg-white/70 px-2 py-0.5 text-[11px] font-medium text-amber-800">
              {a.errorClass}
            </div>
          </div>

          {step >= 1 && (
            <div className="rounded-2xl bg-[oklch(0.97_0.02_275)] p-4">
              <div className="text-[11px] uppercase tracking-wider text-[oklch(0.4_0.15_275)]">
                {t.adaptive.hint1}
              </div>
              <div className="mt-1">{a.hint1}</div>
            </div>
          )}
          {step >= 2 && (
            <div className="rounded-2xl bg-[oklch(0.97_0.02_275)] p-4">
              <div className="text-[11px] uppercase tracking-wider text-[oklch(0.4_0.15_275)]">
                {t.adaptive.hint2}
              </div>
              <div className="mt-1">{a.hint2}</div>
            </div>
          )}
          {step >= 3 && (
            <div className="rounded-2xl bg-emerald-50 p-4">
              <div className="text-[11px] uppercase tracking-wider text-emerald-700">
                {t.adaptive.stepByStep}
              </div>
              <ol className="mt-1 flex flex-col gap-1 font-mono text-sm text-emerald-900">
                {a.stepByStep.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ol>
              <div className="mt-3 flex items-start gap-2 rounded-xl bg-white p-3 text-[13px]">
                <Sparkles className="mt-0.5 h-4 w-4 text-[oklch(0.55_0.2_265)]" />
                <span>{a.nextActivity}</span>
              </div>
            </div>
          )}

          <div className="flex gap-2">
            {step < 2 && (
              <button
                type="button"
                onClick={() => setStep((s) => (s < 3 ? ((s + 1) as 0 | 1 | 2 | 3) : s))}
                className="rounded-full bg-white px-4 py-2 text-xs font-medium shadow-soft hover:bg-muted"
              >
                {t.adaptive.showHint}
              </button>
            )}
            {step < 3 && (
              <button
                type="button"
                onClick={() => setStep(3)}
                className="rounded-full bg-gradient-brand px-4 py-2 text-xs font-medium text-white shadow-glow"
              >
                {t.adaptive.showSteps}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
