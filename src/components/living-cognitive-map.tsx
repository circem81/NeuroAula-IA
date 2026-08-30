import { motion } from "motion/react";
import { useMemo } from "react";
import { useLang } from "@/lib/i18n";
import { translations } from "@/lib/translations";

type Concept = {
  id: string;
  x: number;
  y: number;
  strength: number;
  group: "math" | "language" | "science" | "logic" | "arts";
};

const groupColor: Record<Concept["group"], string> = {
  math: "oklch(0.62 0.19 262)",
  language: "oklch(0.62 0.24 305)",
  science: "oklch(0.7 0.16 195)",
  logic: "oklch(0.72 0.18 250)",
  arts: "oklch(0.75 0.17 340)",
};

export function LivingCognitiveMap({ className = "" }: { className?: string }) {
  const { lang } = useLang();
  const t = translations[lang].map;

  const concepts: Concept[] = useMemo(
    () => [
      { id: "n1", x: 22, y: 30, strength: 0.9, group: "math" },
      { id: "n2", x: 34, y: 46, strength: 0.75, group: "math" },
      { id: "n3", x: 48, y: 30, strength: 0.6, group: "math" },
      { id: "n4", x: 60, y: 48, strength: 0.4, group: "math" },
      { id: "n5", x: 20, y: 68, strength: 0.85, group: "language" },
      { id: "n6", x: 33, y: 78, strength: 0.7, group: "language" },
      { id: "n7", x: 46, y: 70, strength: 0.55, group: "language" },
      { id: "n8", x: 58, y: 82, strength: 0.35, group: "language" },
      { id: "n9", x: 72, y: 30, strength: 0.65, group: "science" },
      { id: "n10", x: 84, y: 44, strength: 0.5, group: "science" },
      { id: "n11", x: 75, y: 60, strength: 0.4, group: "science" },
      { id: "n12", x: 50, y: 15, strength: 0.7, group: "logic" },
      { id: "n13", x: 66, y: 18, strength: 0.55, group: "logic" },
      { id: "n14", x: 84, y: 76, strength: 0.6, group: "arts" },
      { id: "n15", x: 72, y: 88, strength: 0.45, group: "arts" },
    ],
    [],
  );

  const links = useMemo(() => {
    const out: { a: Concept; b: Concept; w: number }[] = [];
    for (let i = 0; i < concepts.length; i++) {
      for (let j = i + 1; j < concepts.length; j++) {
        const dx = concepts[i].x - concepts[j].x;
        const dy = concepts[i].y - concepts[j].y;
        const dist = Math.hypot(dx, dy);
        if (dist < 24) {
          const w = Math.min(concepts[i].strength, concepts[j].strength);
          out.push({ a: concepts[i], b: concepts[j], w });
        }
      }
    }
    return out;
  }, [concepts]);

  return (
    <div className={`relative overflow-hidden rounded-3xl ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-white" />
      <div className="grid-bg absolute inset-0 opacity-60" />
      <div className="absolute inset-0 bg-halo opacity-70" />

      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="relative h-full w-full">
        <defs>
          <linearGradient id="lcmLink" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="oklch(0.62 0.19 262)" />
            <stop offset="100%" stopColor="oklch(0.62 0.24 305)" />
          </linearGradient>
          <radialGradient id="lcmHalo">
            <stop offset="0%" stopColor="oklch(0.62 0.19 262)" stopOpacity="0.55" />
            <stop offset="100%" stopColor="oklch(0.62 0.19 262)" stopOpacity="0" />
          </radialGradient>
        </defs>

        {links.map((l, i) => (
          <motion.line
            key={i}
            x1={l.a.x}
            y1={l.a.y}
            x2={l.b.x}
            y2={l.b.y}
            stroke="url(#lcmLink)"
            strokeWidth={0.12 + l.w * 0.28}
            strokeOpacity={0.15 + l.w * 0.55}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: [0, 1, 1, 0.4, 1] }}
            transition={{ duration: 8 + (i % 5), repeat: Infinity, delay: (i % 7) * 0.4 }}
          />
        ))}

        {links
          .filter((l) => l.w > 0.55)
          .slice(0, 8)
          .map((l, i) => (
            <motion.circle
              key={`p-${i}`}
              r={0.5}
              fill="oklch(0.98 0.02 260)"
              initial={{ cx: l.a.x, cy: l.a.y, opacity: 0 }}
              animate={{ cx: [l.a.x, l.b.x], cy: [l.a.y, l.b.y], opacity: [0, 1, 0] }}
              transition={{ duration: 2.5 + (i % 3), repeat: Infinity, delay: i * 0.6 }}
            />
          ))}

        {concepts.map((c, i) => (
          <g key={c.id}>
            <motion.circle
              cx={c.x}
              cy={c.y}
              r={2 + c.strength * 4}
              fill="url(#lcmHalo)"
              animate={{ opacity: [0.4, 0.9, 0.4], scale: [1, 1.15, 1] }}
              transition={{ duration: 4 + (i % 3), repeat: Infinity, delay: i * 0.2 }}
            />
            <circle
              cx={c.x}
              cy={c.y}
              r={0.9 + c.strength * 1.1}
              fill={groupColor[c.group]}
              opacity={0.5 + c.strength * 0.5}
            />
          </g>
        ))}
      </svg>

      <div className="pointer-events-none absolute inset-0">
        {concepts.map((c) => (
          <div
            key={c.id}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${c.x}%`, top: `${c.y}%` }}
          >
            <div
              className="glass rounded-full px-2.5 py-1 text-[10px] font-medium sm:text-xs"
              style={{
                opacity: 0.4 + c.strength * 0.6,
                transform: `translateY(${14 + c.strength * 6}px)`,
                color: "var(--ink)",
              }}
            >
              {t.nodes[c.id] ?? c.id}
            </div>
          </div>
        ))}
      </div>

      <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
        {Object.entries(groupColor).map(([k, v]) => (
          <div
            key={k}
            className="glass flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px]"
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: v }} />
            <span className="capitalize text-ink-soft">{t.legend[k] ?? k}</span>
          </div>
        ))}
      </div>

      <div className="glass absolute right-4 top-4 rounded-full px-3 py-1 text-[10px] font-mono uppercase tracking-widest text-ink-soft">
        {t.title}
      </div>
    </div>
  );
}
