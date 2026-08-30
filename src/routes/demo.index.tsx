import { createFileRoute, Link } from "@tanstack/react-router";
import { Users, AlertTriangle, ClipboardList, TrendingUp, ArrowRight } from "lucide-react";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  CartesianGrid,
} from "recharts";
import { useLang } from "@/lib/i18n";
import { demoT } from "@/lib/demo-i18n";
import {
  students,
  weeklyProgress,
  masteryDistribution,
  recentAlerts,
  latestActivities,
  pendingActivities,
} from "@/lib/demo-data";

export const Route = createFileRoute("/demo/")({
  component: Dashboard,
});

function Dashboard() {
  const { lang } = useLang();
  const t = demoT[lang];
  const total = students.length;
  const needSupport = students.filter((s) => s.status !== "stable").length;
  const avgProgress = Math.round(students.reduce((a, s) => a + s.progress, 0) / total);

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">{t.dashboard.title}</h1>
        <p className="text-sm text-ink-soft">{t.dashboard.subtitle}</p>
      </header>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Kpi icon={Users} label={t.dashboard.totalStudents} value={total.toString()} />
        <Kpi
          icon={AlertTriangle}
          label={t.dashboard.needSupport}
          value={needSupport.toString()}
          tone="warn"
        />
        <Kpi
          icon={ClipboardList}
          label={t.dashboard.pending}
          value={pendingActivities.toString()}
        />
        <Kpi
          icon={TrendingUp}
          label={t.dashboard.avgProgress}
          value={`${avgProgress}%`}
          tone="ok"
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="card-soft p-5 lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold">{t.dashboard.weeklyEvolution}</h2>
            <span className="text-xs text-ink-soft">Últimos 7 días</span>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyProgress}>
                <defs>
                  <linearGradient id="gArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.62 0.19 262)" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="oklch(0.62 0.19 262)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.01 260)" />
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 11, fill: "oklch(0.5 0.02 265)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "oklch(0.5 0.02 265)" }}
                  axisLine={false}
                  tickLine={false}
                  domain={[40, 100]}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid oklch(0.92 0.01 260)",
                    fontSize: 12,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="oklch(0.62 0.19 262)"
                  strokeWidth={2}
                  fill="url(#gArea)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card-soft p-5">
          <h2 className="mb-3 text-sm font-semibold">{t.dashboard.masteryDist}</h2>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={masteryDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.01 260)" />
                <XAxis
                  dataKey="level"
                  tick={{ fontSize: 11, fill: "oklch(0.5 0.02 265)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "oklch(0.5 0.02 265)" }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid oklch(0.92 0.01 260)",
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]} fill="oklch(0.58 0.22 285)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="card-soft p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold">{t.dashboard.recentAlerts}</h2>
            <Link to="/demo/alertas" className="text-xs text-ink-soft hover:text-ink">
              {t.dashboard.viewAll}
            </Link>
          </div>
          <ul className="flex flex-col divide-y divide-border/60">
            {recentAlerts.map((a) => {
              const s = students.find((x) => x.id === a.studentId)!;
              return (
                <li key={a.studentId} className="flex items-center justify-between gap-3 py-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <span
                      className={`grid h-8 w-8 place-items-center rounded-full text-xs font-semibold text-white ${a.severity === "danger" ? "bg-destructive" : "bg-amber-500"}`}
                    >
                      {s.name
                        .split(" ")
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join("")}
                    </span>
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium">{s.name}</div>
                      <div className="truncate text-xs text-ink-soft">
                        {t.strings[a.messageKey]}
                      </div>
                    </div>
                  </div>
                  <Link
                    to="/demo/alumno/$id"
                    params={{ id: s.id }}
                    className="inline-flex items-center gap-1 text-xs font-medium text-[oklch(0.55_0.2_265)] hover:underline"
                  >
                    {t.students.openProfile} <ArrowRight className="h-3 w-3" />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="card-soft p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold">{t.dashboard.latestActivities}</h2>
            <Link to="/demo/actividades" className="text-xs text-ink-soft hover:text-ink">
              {t.dashboard.viewAll}
            </Link>
          </div>
          <ul className="flex flex-col divide-y divide-border/60">
            {latestActivities.map((a) => {
              const pct = Math.round((a.completed / a.total) * 100);
              return (
                <li key={a.title} className="py-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium">{a.title}</div>
                      <div className="text-xs text-ink-soft">
                        {a.type} · {a.completed}/{a.total} {t.dashboard.completed}
                      </div>
                    </div>
                    <div className="text-xs font-semibold">{pct}%</div>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                    <div className="h-full bg-gradient-brand" style={{ width: `${pct}%` }} />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </div>
  );
}

function Kpi({
  icon: Icon,
  label,
  value,
  tone = "neutral",
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  tone?: "neutral" | "ok" | "warn";
}) {
  const toneClass =
    tone === "ok"
      ? "text-emerald-600 bg-emerald-50"
      : tone === "warn"
        ? "text-amber-600 bg-amber-50"
        : "text-[oklch(0.55_0.2_265)] bg-[oklch(0.96_0.03_275)]";
  return (
    <div className="card-soft flex items-center gap-3 p-4">
      <div className={`grid h-10 w-10 place-items-center rounded-xl ${toneClass}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <div className="text-[11px] uppercase tracking-wider text-ink-soft">{label}</div>
        <div className="text-lg font-semibold">{value}</div>
      </div>
    </div>
  );
}
