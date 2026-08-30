import { motion } from "motion/react";

const synapses = Array.from({ length: 14 }).map((_, i) => {
  let seed = 97 + i * 31;
  const rnd = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  return {
    x: 90 + rnd() * 160,
    y: 70 + rnd() * 170,
    delay: i * 0.25,
  };
});

/**
 * Stylized "3D" brain built from layered SVG paths — no external 3D lib.
 * Reads as anatomical + neural, with regions that pulse independently.
 */
export function BrainVisualization({ className = "" }: { className?: string }) {
  const regions = [
    { id: "frontal", d: "M 90 110 Q 60 60 130 55 Q 175 55 190 90 Q 175 115 140 118 Z", delay: 0 },
    {
      id: "parietal",
      d: "M 190 90 Q 235 80 250 120 Q 240 155 200 158 Q 180 140 190 110 Z",
      delay: 0.6,
    },
    {
      id: "temporal",
      d: "M 90 130 Q 80 175 130 195 Q 175 200 190 170 Q 170 145 130 145 Z",
      delay: 1.2,
    },
    {
      id: "occipital",
      d: "M 200 158 Q 240 175 235 215 Q 200 235 175 210 Q 180 180 200 170 Z",
      delay: 1.8,
    },
    {
      id: "cerebellum",
      d: "M 130 195 Q 105 225 145 240 Q 185 245 200 220 Q 175 205 145 210 Z",
      delay: 2.4,
    },
  ];

  return (
    <div className={`relative aspect-square w-full ${className}`}>
      {/* Halo */}
      <div className="absolute inset-0 rounded-full bg-halo blur-3xl" />
      <div className="absolute inset-6 rounded-full bg-halo opacity-70 blur-2xl" />

      <svg viewBox="0 0 320 320" className="relative h-full w-full">
        <defs>
          <radialGradient id="brainCore" cx="50%" cy="45%" r="55%">
            <stop offset="0%" stopColor="oklch(0.98 0.02 260)" />
            <stop offset="55%" stopColor="oklch(0.82 0.1 280)" stopOpacity="0.5" />
            <stop offset="100%" stopColor="oklch(0.55 0.22 285)" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="regionGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="oklch(0.72 0.18 260)" />
            <stop offset="100%" stopColor="oklch(0.6 0.24 300)" />
          </linearGradient>
          <linearGradient id="ridge" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="oklch(0.9 0.05 270)" stopOpacity="0.9" />
            <stop offset="100%" stopColor="oklch(0.65 0.2 285)" stopOpacity="0.5" />
          </linearGradient>
          <filter id="soft">
            <feGaussianBlur stdDeviation="1.4" />
          </filter>
        </defs>

        {/* Core glow */}
        <circle cx="160" cy="150" r="120" fill="url(#brainCore)" />

        {/* Regions */}
        {regions.map((r) => (
          <motion.path
            key={r.id}
            d={r.d}
            fill="url(#regionGrad)"
            stroke="url(#ridge)"
            strokeWidth={1.2}
            initial={{ opacity: 0.35 }}
            animate={{ opacity: [0.35, 0.95, 0.35] }}
            transition={{ duration: 4, repeat: Infinity, delay: r.delay, ease: "easeInOut" }}
          />
        ))}

        {/* Sulci / gyri lines */}
        {Array.from({ length: 22 }).map((_, i) => {
          const y = 70 + i * 8;
          return (
            <motion.path
              key={i}
              d={`M ${90 + (i % 3) * 6} ${y} Q 160 ${y + (i % 2 ? -6 : 6)} ${230 - (i % 3) * 6} ${y}`}
              stroke="url(#ridge)"
              strokeWidth={0.7}
              fill="none"
              filter="url(#soft)"
              opacity={0.35}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: [0, 1] }}
              transition={{ duration: 6, delay: i * 0.15, repeat: Infinity, repeatType: "reverse" }}
            />
          );
        })}

        {/* Synapses */}
        {synapses.map((s, i) => (
          <motion.circle
            key={i}
            cx={s.x}
            cy={s.y}
            r={1.8}
            fill="oklch(0.98 0.02 260)"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0], scale: [0.5, 2, 0.5] }}
            transition={{ duration: 2.4, repeat: Infinity, delay: s.delay }}
          />
        ))}

        {/* Brain stem */}
        <path
          d="M 150 235 Q 160 260 170 235"
          fill="url(#regionGrad)"
          stroke="url(#ridge)"
          strokeWidth={1}
        />
      </svg>
    </div>
  );
}
