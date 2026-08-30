import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { demoT } from "@/lib/demo-i18n";
import { students } from "@/lib/demo-data";

export const Route = createFileRoute("/demo/alumnado")({
  component: StudentList,
});

function StudentList() {
  const { lang } = useLang();
  const t = demoT[lang];

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">{t.students.title}</h1>
        <p className="text-sm text-ink-soft">{t.students.subtitle}</p>
      </header>

      <div className="card-soft overflow-hidden">
        <div className="hidden grid-cols-[1.4fr_1fr_0.8fr_1fr_0.8fr_0.8fr_auto] gap-3 border-b border-border/70 bg-muted/50 px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-ink-soft md:grid">
          <span>{t.students.name}</span>
          <span>{t.students.progress}</span>
          <span>{t.students.mastery}</span>
          <span>{t.students.profile}</span>
          <span>{t.students.lastActivity}</span>
          <span>{t.students.statusCol}</span>
          <span />
        </div>
        <ul className="divide-y divide-border/60">
          {students.map((s) => (
            <li
              key={s.id}
              className="grid grid-cols-1 gap-2 px-5 py-4 md:grid-cols-[1.4fr_1fr_0.8fr_1fr_0.8fr_0.8fr_auto] md:items-center md:gap-3"
            >
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-brand text-xs font-semibold text-white">
                  {s.name
                    .split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")}
                </span>
                <div className="text-sm font-medium">{s.name}</div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                    <div className="h-full bg-gradient-brand" style={{ width: `${s.progress}%` }} />
                  </div>
                  <span className="w-8 text-right text-xs font-semibold">{s.progress}%</span>
                </div>
              </div>
              <div className="text-xs">{t.mastery[s.masteryLevel]}</div>
              <div className="text-xs text-ink-soft">{t.profiles[s.profileKey]}</div>
              <div className="text-xs text-ink-soft">{s.lastActivity}</div>
              <div>
                <StatusPill status={s.status} label={t.status[s.status]} />
              </div>
              <div className="md:text-right">
                <Link
                  to="/demo/alumno/$id"
                  params={{ id: s.id }}
                  className="inline-flex items-center gap-1 rounded-full bg-gradient-brand px-3 py-1.5 text-xs font-medium text-white shadow-glow"
                >
                  {t.students.openProfile} <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function StatusPill({
  status,
  label,
}: {
  status: "stable" | "attention" | "intervention";
  label: string;
}) {
  const cls =
    status === "stable"
      ? "bg-emerald-50 text-emerald-700"
      : status === "attention"
        ? "bg-amber-50 text-amber-700"
        : "bg-red-50 text-red-700";
  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${cls}`}>
      {label}
    </span>
  );
}
