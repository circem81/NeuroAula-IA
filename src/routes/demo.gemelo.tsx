import { createFileRoute, Link } from "@tanstack/react-router";
import { Brain } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { demoT } from "@/lib/demo-i18n";
import { students } from "@/lib/demo-data";

export const Route = createFileRoute("/demo/gemelo")({
  component: TwinIndex,
});

function TwinIndex() {
  const { lang } = useLang();
  const t = demoT[lang];
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">{t.twin.title}</h1>
        <p className="text-sm text-ink-soft">{t.twin.subtitle}</p>
      </header>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {students.map((s) => (
          <li key={s.id}>
            <Link
              to="/demo/alumno/$id"
              params={{ id: s.id }}
              className="card-soft block p-5 transition hover:shadow-glow"
            >
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-brand text-xs font-semibold text-white">
                  {s.name
                    .split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")}
                </span>
                <div>
                  <div className="text-sm font-semibold">{s.name}</div>
                  <div className="text-[11px] text-ink-soft">{t.profiles[s.profileKey]}</div>
                </div>
                <Brain className="ml-auto h-4 w-4 text-[oklch(0.55_0.2_265)]" />
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-center text-[11px]">
                <Mini label={t.twin.dims.attention} value={s.cognitive.attention} />
                <Mini label={t.twin.dims.workingMemory} value={s.cognitive.workingMemory} />
                <Mini label={t.twin.dims.pace} value={s.cognitive.pace} />
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Mini({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl bg-muted/60 p-2">
      <div className="truncate text-[10px] text-ink-soft">{label}</div>
      <div className="text-sm font-semibold">{value}</div>
    </div>
  );
}
