import { motion } from "motion/react";
import { useMemo } from "react";

type Node = { x: number; y: number; r: number; d: number };

export function NeuralNetwork({
  className = "",
  density = 26,
  seed = 7,
}: {
  className?: string;
  density?: number;
  seed?: number;
}) {
  const { nodes, links } = useMemo(() => {
    // deterministic pseudo-random
    let s = seed;
    const rnd = () => {
      s = (s * 9301 + 49297) % 233280;
      return s / 233280;
    };
    const nodes: Node[] = Array.from({ length: density }).map(() => ({
      x: rnd() * 100,
      y: rnd() * 100,
      r: 1 + rnd() * 2.6,
      d: rnd() * 4,
    }));
    const links: { a: number; b: number; d: number }[] = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.hypot(dx, dy);
        if (dist < 22) links.push({ a: i, b: j, d: dist });
      }
    }
    return { nodes, links };
  }, [density, seed]);

  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      aria-hidden
    >
      <defs>
        <linearGradient id="nnLine" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="oklch(0.62 0.19 262)" stopOpacity="0.7" />
          <stop offset="100%" stopColor="oklch(0.62 0.24 305)" stopOpacity="0.7" />
        </linearGradient>
        <radialGradient id="nnDot">
          <stop offset="0%" stopColor="oklch(0.62 0.19 262)" />
          <stop offset="100%" stopColor="oklch(0.62 0.24 305)" />
        </radialGradient>
      </defs>
      {links.map((l, i) => {
        const a = nodes[l.a];
        const b = nodes[l.b];
        const op = Math.max(0.05, 0.35 - l.d / 80);
        return (
          <motion.line
            key={i}
            x1={a.x}
            y1={a.y}
            x2={b.x}
            y2={b.y}
            stroke="url(#nnLine)"
            strokeWidth={0.12}
            strokeOpacity={op}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: [0, 1, 1, 0] }}
            transition={{
              duration: 6 + (i % 5),
              repeat: Infinity,
              delay: (i % 10) * 0.3,
              ease: "easeInOut",
            }}
          />
        );
      })}
      {nodes.map((n, i) => (
        <motion.circle
          key={i}
          cx={n.x}
          cy={n.y}
          r={n.r * 0.28}
          fill="url(#nnDot)"
          initial={{ opacity: 0.3 }}
          animate={{ opacity: [0.25, 1, 0.25], scale: [1, 1.4, 1] }}
          transition={{
            duration: 3 + (i % 4),
            repeat: Infinity,
            delay: n.d,
            ease: "easeInOut",
          }}
        />
      ))}
    </svg>
  );
}
