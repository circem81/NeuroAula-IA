import { Link, createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Brain,
  Play,
  FlaskConical,
  BookOpen,
  Zap,
  Database,
  Network,
  Bot,
  Sparkles,
  LineChart,
  Users,
  GraduationCap,
  Target,
  Trophy,
  Map as MapIcon,
  Activity,
  ShieldCheck,
  Eye,
  Ear,
  Languages,
  Contrast,
  Sun,
  MicIcon,
  Globe2,
  Building2,
  Microscope,
  School,
  Lightbulb,
  Mail,
  Twitter,
  Github,
  Linkedin,
  ChevronRight,
} from "lucide-react";
import { NeuralNetwork } from "@/components/neural-network";
import { BrainVisualization } from "@/components/brain-visualization";
import { LivingCognitiveMap } from "@/components/living-cognitive-map";
import { LanguageProvider, useLang, type Lang } from "@/lib/i18n";
import { translations } from "@/lib/translations";

export const Route = createFileRoute("/")({
  component: LandingPage,
});

/* ─────────────────────────────  primitives  ───────────────────────────── */

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-white/60 px-3 py-1 text-xs font-medium text-ink-soft backdrop-blur">
      <span className="h-1.5 w-1.5 rounded-full bg-gradient-brand" />
      {children}
    </div>
  );
}

function GradientButton({
  children,
  variant = "primary",
  href,
  onClick,
}: {
  children: React.ReactNode;
  variant?: "primary" | "ghost";
  href?: string;
  onClick?: () => void;
}) {
  const base =
    "group inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all";
  const styles =
    variant === "primary"
      ? "bg-gradient-brand text-white shadow-glow hover:brightness-110 hover:scale-[1.02]"
      : "glass text-ink hover:bg-white/80";
  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={`${base} ${styles}`}>
        {children}
      </button>
    );
  }

  return href === "/demo" ? (
    <Link to="/demo" className={`${base} ${styles}`}>
      {children}
    </Link>
  ) : (
    <a href={href ?? "#platform"} className={`${base} ${styles}`}>
      {children}
    </a>
  );
}

/* ─────────────────────────────  language toggle  ───────────────────────────── */

function LanguageToggle() {
  const { lang, setLang } = useLang();
  const options: { code: Lang; label: string }[] = [
    { code: "es", label: "ES" },
    { code: "en", label: "EN" },
  ];
  return (
    <div
      role="group"
      aria-label="Language"
      className="hidden items-center gap-0.5 rounded-full border border-border/70 bg-white/70 p-0.5 text-xs font-medium backdrop-blur sm:inline-flex"
    >
      {options.map((o) => {
        const active = lang === o.code;
        return (
          <button
            key={o.code}
            type="button"
            onClick={() => setLang(o.code)}
            aria-pressed={active}
            className={`rounded-full px-2.5 py-1 transition ${
              active ? "bg-gradient-brand text-white shadow-glow" : "text-ink-soft hover:text-ink"
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

/* ─────────────────────────────  nav  ───────────────────────────── */

function Nav({ onRequestDemo }: { onRequestDemo: () => void }) {
  const { lang } = useLang();
  const t = translations[lang].nav;
  return (
    <header className="fixed inset-x-0 top-4 z-50 flex justify-center px-4">
      <nav className="glass-strong flex w-full max-w-6xl items-center justify-between rounded-full px-4 py-2.5">
        <div className="flex items-center gap-2 pl-2">
          <div className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-brand">
            <Brain className="h-4 w-4 text-white" />
          </div>
          <span className="text-sm font-semibold tracking-tight">NeuroAula AI</span>
        </div>
        <div className="hidden items-center gap-7 text-sm text-ink-soft md:flex">
          <a href="#platform" className="hover:text-ink">
            {t.platform}
          </a>
          <a href="#twin" className="hover:text-ink">
            {t.twin}
          </a>
          <a href="#agents" className="hover:text-ink">
            {t.agents}
          </a>
          <a href="#science" className="hover:text-ink">
            {t.science}
          </a>
          <a href="#research" className="hover:text-ink">
            {t.research}
          </a>
        </div>
        <div className="flex items-center gap-2">
          <LanguageToggle />
          <Link
            to="/demo"
            className="hidden rounded-full px-3 py-1.5 text-sm text-ink-soft hover:text-ink sm:inline"
          >
            {t.signIn}
          </Link>
          <button
            type="button"
            onClick={onRequestDemo}
            className="inline-flex items-center gap-1.5 rounded-full bg-gradient-brand px-3.5 py-1.5 text-sm font-medium text-white shadow-glow"
          >
            {t.demo} <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </nav>
    </header>
  );
}

/* ─────────────────────────────  hero  ───────────────────────────── */

function Hero({ onRequestDemo }: { onRequestDemo: () => void }) {
  const { lang } = useLang();
  const t = translations[lang].hero;
  return (
    <section className="relative isolate overflow-hidden pb-28 pt-40 sm:pt-48">
      <div className="absolute inset-0 -z-10 bg-gradient-soft" />
      <div className="grid-bg absolute inset-0 -z-10" />
      <div className="absolute inset-0 -z-10">
        <NeuralNetwork density={34} />
      </div>
      <div className="absolute left-1/2 top-0 -z-10 h-[600px] w-[900px] -translate-x-1/2 bg-halo" />

      <div className="mx-auto max-w-6xl px-6 text-center">
        <Reveal>
          <SectionLabel>{t.eyebrow}</SectionLabel>
        </Reveal>

        <Reveal delay={0.05}>
          <h1 className="mx-auto mt-6 max-w-4xl text-balance text-5xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-6xl md:text-7xl">
            {t.title}
          </h1>
        </Reveal>

        <Reveal delay={0.15}>
          <p className="mx-auto mt-6 max-w-2xl text-balance text-lg leading-relaxed text-ink-soft">
            {t.subtitle}
          </p>
        </Reveal>

        <Reveal delay={0.25}>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <GradientButton onClick={onRequestDemo}>
              {translations[lang].nav.demo}{" "}
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </GradientButton>
            <GradientButton variant="ghost" href="/demo">
              <Play className="h-4 w-4" /> {t.demoCta}
            </GradientButton>
            <GradientButton variant="ghost" href="#platform">
              {t.exploreCta} <ChevronRight className="h-4 w-4" />
            </GradientButton>

            <GradientButton variant="ghost" href="#science">
              <FlaskConical className="h-4 w-4" /> {t.researchCta}
            </GradientButton>
          </div>
        </Reveal>

        <Reveal delay={0.35}>
          <div className="relative mx-auto mt-20 flex max-w-3xl items-center justify-center">
            <div className="absolute inset-0 bg-halo blur-3xl" />
            <div className="relative w-72 animate-float-slow sm:w-96">
              <BrainVisualization />
            </div>
            {t.chips[0] && (
              <ChipFloating
                className="left-[6%] top-[15%]"
                delay={0.4}
                label={t.chips[0].label}
                value={t.chips[0].value}
              />
            )}
            {t.chips[1] && (
              <ChipFloating
                className="right-[4%] top-[20%]"
                delay={0.6}
                label={t.chips[1].label}
                value={t.chips[1].value}
              />
            )}
            {t.chips[2] && (
              <ChipFloating
                className="left-[2%] bottom-[10%]"
                delay={0.8}
                label={t.chips[2].label}
                value={t.chips[2].value}
              />
            )}
            {t.chips[3] && (
              <ChipFloating
                className="right-[6%] bottom-[14%]"
                delay={1.0}
                label={t.chips[3].label}
                value={t.chips[3].value}
              />
            )}
          </div>
        </Reveal>

        <Reveal delay={0.5}>
          <div className="mt-16 flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-xs uppercase tracking-[0.2em] text-ink-soft/70">
            <span>{t.trustLine}</span>
            <span className="font-mono text-ink/60">{t.trustList}</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function ChipFloating({
  className = "",
  delay = 0,
  label,
  value,
}: {
  className?: string;
  delay?: number;
  label: string;
  value: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.8 }}
      className={`glass-strong absolute hidden rounded-2xl px-3 py-2 text-left shadow-glow sm:block ${className}`}
    >
      <div className="text-[10px] uppercase tracking-widest text-ink-soft">{label}</div>
      <div className="text-sm font-semibold text-ink">{value}</div>
    </motion.div>
  );
}

/* ─────────────────────────────  section wrapper  ───────────────────────────── */

function Section({
  id,
  eyebrow,
  title,
  subtitle,
  children,
  className = "",
}: {
  id?: string;
  eyebrow?: React.ReactNode;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`relative mx-auto max-w-6xl px-6 py-28 ${className}`}>
      {(eyebrow || title || subtitle) && (
        <div className="mx-auto mb-16 max-w-3xl text-center">
          {eyebrow && (
            <Reveal>
              <SectionLabel>{eyebrow}</SectionLabel>
            </Reveal>
          )}
          {title && (
            <Reveal delay={0.05}>
              <h2 className="mt-5 text-balance text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
                {title}
              </h2>
            </Reveal>
          )}
          {subtitle && (
            <Reveal delay={0.1}>
              <p className="mt-4 text-balance text-lg leading-relaxed text-ink-soft">{subtitle}</p>
            </Reveal>
          )}
        </div>
      )}
      {children}
    </section>
  );
}

/* ─────────────────────────────  problem  ───────────────────────────── */

function ProblemSection() {
  const { lang } = useLang();
  const t = translations[lang].problem;
  const icons = [Users, ShieldCheck, Activity, Bot];
  return (
    <Section id="problem" eyebrow={t.eyebrow} title={t.title} subtitle={t.subtitle}>
      <div className="grid gap-5 md:grid-cols-2">
        {t.items.map((it, i) => {
          const Icon = icons[i] ?? Users;
          return (
            <Reveal key={it.title} delay={i * 0.05}>
              <div className="card-soft group relative h-full overflow-hidden p-7 transition hover:-translate-y-1 hover:shadow-glow">
                <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-halo opacity-0 transition group-hover:opacity-100" />
                <div className="relative flex items-start gap-4">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-brand text-white shadow-glow">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg font-semibold text-ink">{it.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{it.body}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}

/* ─────────────────────────────  solution  ───────────────────────────── */

function SolutionSection() {
  const { lang } = useLang();
  const t = translations[lang].solution;
  const icons = [Database, BookOpen, Network, Zap, Brain];
  return (
    <Section id="platform" eyebrow={t.eyebrow} title={t.title} subtitle={t.subtitle}>
      <div className="relative">
        <div className="pointer-events-none absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-[color:var(--brand-2)]/40 to-transparent md:block" />
        <div className="grid gap-6 md:grid-cols-5">
          {t.layers.map((l, i) => {
            const Icon = icons[i] ?? Brain;
            return (
              <Reveal key={l.name} delay={i * 0.08}>
                <div className="glass-strong relative flex h-full flex-col rounded-3xl p-6 transition hover:-translate-y-2 hover:shadow-glow">
                  <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-gradient-brand text-white shadow-glow">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="text-[10px] font-mono uppercase tracking-widest text-ink-soft/70">
                    {t.layerLabel} {String(i + 1).padStart(2, "0")}
                  </div>
                  <h3 className="mt-1 text-lg font-semibold text-ink">{l.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">{l.desc}</p>
                  <div className="mt-5 flex items-center gap-1 text-xs font-medium text-ink-soft">
                    <div className="h-1 flex-1 overflow-hidden rounded-full bg-secondary">
                      <div className="animate-shimmer h-full w-full" />
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </Section>
  );
}

/* ─────────────────────────────  cognitive twin  ───────────────────────────── */

function CognitiveTwinSection() {
  const { lang } = useLang();
  const t = translations[lang].twin;
  return (
    <Section id="twin" eyebrow={t.eyebrow} title={t.title} subtitle={t.subtitle}>
      <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_1fr]">
        <Reveal>
          <div className="glass-strong relative aspect-square overflow-hidden rounded-[2rem] p-6">
            <div className="absolute inset-0 bg-halo" />
            <BrainVisualization className="relative" />
            <div className="glass absolute left-4 top-4 rounded-full px-3 py-1 text-[10px] font-mono uppercase tracking-widest text-ink-soft">
              {t.stateBadge}
            </div>
          </div>
        </Reveal>

        <div>
          <div className="grid gap-3 sm:grid-cols-2">
            {t.dims.map((d, i) => (
              <Reveal key={d} delay={i * 0.04}>
                <div className="card-soft flex items-center gap-3 p-4 transition hover:shadow-glow">
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-brand/10">
                    <Sparkles className="h-4 w-4 text-[color:var(--brand-2)]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-ink">{d}</div>
                    <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-secondary">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${40 + ((i * 13) % 55)}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, delay: 0.1 + i * 0.05 }}
                        className="h-full bg-gradient-brand"
                      />
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ─────────────────────────────  personalized learning  ───────────────────────────── */

function PersonalizedLearningSection() {
  const { lang } = useLang();
  const t = translations[lang].personalized;
  return (
    <Section eyebrow={t.eyebrow} title={t.title} subtitle={t.subtitle}>
      <Reveal>
        <div className="glass-strong relative overflow-hidden rounded-[2rem] p-6">
          <div className="relative h-[420px] w-full sm:h-[520px]">
            <LivingCognitiveMap className="absolute inset-0" />
          </div>
        </div>
      </Reveal>
    </Section>
  );
}

/* ─────────────────────────────  agents  ───────────────────────────── */

function AgentsSection() {
  const { lang } = useLang();
  const t = translations[lang].agents;
  const icons = [BookOpen, Target, LineChart, Zap, GraduationCap, Users, Eye, FlaskConical];
  const stateColor: Record<string, string> = {
    idle: "oklch(0.7 0.02 265)",
    thinking: "oklch(0.62 0.19 262)",
    working: "oklch(0.62 0.24 305)",
    learning: "oklch(0.7 0.16 195)",
    done: "oklch(0.75 0.17 145)",
  };
  return (
    <Section id="agents" eyebrow={t.eyebrow} title={t.title} subtitle={t.subtitle}>
      <Reveal>
        <p className="mb-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {lang === "es"
            ? "Representación conceptual: estos agentes y sus estados son simulados; todavía no ejecutan modelos de IA."
            : "Concept representation: these agents and their states are simulated; they do not run AI models yet."}
        </p>
      </Reveal>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {t.list.map((a, i) => {
          const Icon = icons[i] ?? Bot;
          const stateLabel = t.states[a.state] ?? a.state;
          return (
            <Reveal key={a.name} delay={i * 0.04}>
              <div className="card-soft group relative overflow-hidden p-5 transition hover:-translate-y-1 hover:shadow-glow">
                <div className="flex items-start justify-between">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-brand/10">
                    <Icon className="h-5 w-5 text-[color:var(--brand-2)]" />
                  </div>
                  <div className="flex items-center gap-1.5 rounded-full bg-secondary px-2 py-1 text-[10px] font-medium text-ink">
                    <motion.span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ background: stateColor[a.state] }}
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.15 }}
                    />
                    {stateLabel}
                  </div>
                </div>
                <h3 className="mt-4 text-base font-semibold text-ink">{a.name}</h3>
                <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-secondary">
                  <div className="animate-shimmer h-full w-full" />
                </div>
                <div className="mt-3 font-mono text-[10px] uppercase tracking-widest text-ink-soft/70">
                  {lang === "es" ? "estado simulado" : "simulated state"}
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}

/* ─────────────────────────────  teacher dashboard  ───────────────────────────── */

function TeacherDashboardSection() {
  const { lang } = useLang();
  const t = translations[lang].teacherDash;
  return (
    <Section eyebrow={t.eyebrow} title={t.title} subtitle={t.subtitle}>
      <Reveal>
        <div className="glass-strong overflow-hidden rounded-[2rem] p-4 sm:p-6">
          <div className="grid gap-4 md:grid-cols-3">
            {t.cards.map((c, i) => (
              <div
                key={c}
                className="relative overflow-hidden rounded-2xl border border-border bg-white p-5"
              >
                <div className="flex items-center justify-between text-xs text-ink-soft">
                  <span className="font-medium">{c}</span>
                  <span className="font-mono text-[10px] uppercase tracking-widest">{t.live}</span>
                </div>
                <MiniChart seed={i} />
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </Section>
  );
}

function MiniChart({ seed = 0 }: { seed?: number }) {
  const pts = Array.from({ length: 24 }).map((_, i) => {
    const y = 30 + Math.sin(i * 0.6 + seed) * 12 + i * 0.6 + ((seed * 7 + i * 3) % 11);
    return `${(i / 23) * 100},${100 - y}`;
  });
  return (
    <svg viewBox="0 0 100 100" className="mt-5 h-24 w-full">
      <defs>
        <linearGradient id={`mc${seed}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.62 0.19 262)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="oklch(0.62 0.24 305)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline points={`0,100 ${pts.join(" ")} 100,100`} fill={`url(#mc${seed})`} stroke="none" />
      <polyline points={pts.join(" ")} fill="none" stroke="url(#nnLine)" strokeWidth={1.2} />
      <polyline
        points={pts.join(" ")}
        fill="none"
        stroke="oklch(0.62 0.19 262)"
        strokeWidth={0.9}
      />
    </svg>
  );
}

/* ─────────────────────────────  student dashboard  ───────────────────────────── */

function StudentDashboardSection() {
  const { lang } = useLang();
  const t = translations[lang].studentDash;
  const icons = [Target, Trophy, Brain, MapIcon, Sparkles, Bot, LineChart, Zap, Activity];
  return (
    <Section eyebrow={t.eyebrow} title={t.title} subtitle={t.subtitle}>
      <div className="grid gap-4 md:grid-cols-3">
        {t.tiles.map((tile, i) => {
          const Icon = icons[i] ?? Sparkles;
          return (
            <Reveal key={tile.label} delay={i * 0.04}>
              <div className="card-soft group relative overflow-hidden p-6 transition hover:-translate-y-1 hover:shadow-glow">
                <div className="flex items-center justify-between">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-brand/10">
                    <Icon className="h-5 w-5 text-[color:var(--brand-2)]" />
                  </div>
                  <span className="text-xs font-mono uppercase tracking-widest text-ink-soft/70">
                    {t.now}
                  </span>
                </div>
                <div className="mt-4 text-sm text-ink-soft">{tile.label}</div>
                <div className="text-2xl font-semibold tracking-tight text-ink">{tile.value}</div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}

/* ─────────────────────────────  science  ───────────────────────────── */

function ScienceSection() {
  const { lang } = useLang();
  const t = translations[lang].science;
  return (
    <Section id="science" eyebrow={t.eyebrow} title={t.title} subtitle={t.subtitle}>
      <div className="relative">
        <div className="pointer-events-none absolute left-6 top-0 hidden h-full w-px bg-gradient-to-b from-transparent via-[color:var(--brand-2)]/40 to-transparent md:block" />
        <div className="grid gap-4">
          {t.items.map((it, i) => (
            <Reveal key={it.t} delay={i * 0.03}>
              <div className="glass-strong group relative flex items-start gap-5 rounded-2xl p-5 transition hover:-translate-y-0.5 hover:shadow-glow md:pl-16">
                <div className="absolute left-0 top-1/2 hidden h-3 w-3 -translate-y-1/2 translate-x-[15px] rounded-full bg-gradient-brand shadow-glow md:block" />
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-brand/10 md:hidden">
                  <FlaskConical className="h-5 w-5 text-[color:var(--brand-2)]" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="text-lg font-semibold text-ink">{it.t}</h3>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-ink-soft/70">
                      {t.pillar} · {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <p className="mt-1 text-sm leading-relaxed text-ink-soft">{it.d}</p>
                </div>
                <ChevronRight className="mt-1 hidden h-4 w-4 text-ink-soft transition group-hover:translate-x-1 md:block" />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ─────────────────────────────  accessibility  ───────────────────────────── */

function AccessibilitySection() {
  const { lang } = useLang();
  const t = translations[lang].accessibility;
  const icons = [Zap, Sparkles, BookOpen, Contrast, Sun, Eye, MicIcon, Languages, Ear];
  return (
    <Section id="accessibility" eyebrow={t.eyebrow} title={t.title} subtitle={t.subtitle}>
      <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-3">
        {t.modes.map((label, i) => {
          const Icon = icons[i] ?? Sparkles;
          return (
            <Reveal key={label} delay={i * 0.04}>
              <div className="card-soft group flex items-center gap-4 p-5 transition hover:-translate-y-1 hover:shadow-glow">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-brand text-white shadow-glow">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold text-ink">{label}</div>
                  <div className="mt-0.5 font-mono text-[10px] uppercase tracking-widest text-ink-soft/70">
                    {t.active}
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-ink-soft transition group-hover:translate-x-1" />
              </div>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}

/* ─────────────────────────────  research  ───────────────────────────── */

function ResearchSection() {
  const { lang } = useLang();
  const t = translations[lang].research;
  const icons = [Building2, Microscope, Globe2, School, Lightbulb];
  const points = [
    { x: 46, y: 32 },
    { x: 48, y: 30 },
    { x: 51, y: 27 },
    { x: 44, y: 30 },
    { x: 30, y: 40 },
    { x: 27, y: 44 },
    { x: 152, y: 40 },
    { x: 140, y: 55 },
    { x: 55, y: 40 },
    { x: 60, y: 25 },
  ];
  return (
    <Section id="research" eyebrow={t.eyebrow} title={t.title} subtitle={t.subtitle}>
      <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.2fr]">
        <div className="grid gap-3">
          {t.partners.map((label, i) => {
            const Icon = icons[i] ?? Globe2;
            return (
              <Reveal key={label} delay={i * 0.05}>
                <div className="card-soft flex items-center gap-3 p-4 transition hover:shadow-glow">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-brand/10">
                    <Icon className="h-5 w-5 text-[color:var(--brand-2)]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold text-ink">{label}</div>
                    <div className="text-xs text-ink-soft">{t.partnerSub}</div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-ink-soft" />
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal>
          <div className="glass-strong relative overflow-hidden rounded-[2rem] p-6">
            <div className="absolute inset-0 bg-halo" />
            <svg viewBox="0 0 200 100" className="relative h-72 w-full">
              <defs>
                <radialGradient id="pt">
                  <stop offset="0%" stopColor="oklch(0.62 0.19 262)" />
                  <stop offset="100%" stopColor="oklch(0.62 0.24 305)" stopOpacity="0" />
                </radialGradient>
              </defs>
              {Array.from({ length: 700 }).map((_, i) => {
                const x = (i % 50) * 4 + 2;
                const y = Math.floor(i / 50) * 5 + 6;
                const inLand =
                  (x > 15 && x < 60 && y > 20 && y < 55) ||
                  (x > 55 && x < 75 && y > 22 && y < 45) ||
                  (x > 40 && x < 60 && y > 50 && y < 78) ||
                  (x > 120 && x < 175 && y > 22 && y < 55) ||
                  (x > 135 && x < 170 && y > 55 && y < 80) ||
                  (x > 20 && x < 35 && y > 55 && y < 78);
                if (!inLand) return null;
                return (
                  <circle
                    key={i}
                    cx={x}
                    cy={y}
                    r={0.7}
                    fill="oklch(0.62 0.19 262)"
                    opacity={0.28}
                  />
                );
              })}
              {points.map((p, i) => {
                const q = points[(i + 3) % points.length];
                const midX = (p.x + q.x) / 2;
                const midY = Math.min(p.y, q.y) - 12;
                return (
                  <motion.path
                    key={i}
                    d={`M ${p.x} ${p.y} Q ${midX} ${midY} ${q.x} ${q.y}`}
                    fill="none"
                    stroke="url(#nnLine)"
                    strokeWidth={0.4}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: [0, 1, 1, 0] }}
                    transition={{ duration: 6, repeat: Infinity, delay: i * 0.4 }}
                  />
                );
              })}
              {points.map((p, i) => (
                <g key={`p${i}`}>
                  <motion.circle
                    cx={p.x}
                    cy={p.y}
                    r={3}
                    fill="url(#pt)"
                    animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.6, 1] }}
                    transition={{ duration: 3, repeat: Infinity, delay: i * 0.2 }}
                  />
                  <circle cx={p.x} cy={p.y} r={0.9} fill="oklch(0.62 0.19 262)" />
                </g>
              ))}
            </svg>
            <div className="mt-2 flex items-center justify-between text-xs text-ink-soft">
              <span className="font-mono uppercase tracking-widest">{t.liveLabel}</span>
              <span>
                {points.length} {t.activeSuffix}
              </span>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

/* ─────────────────────────────  CTA  ───────────────────────────── */

function CTASection({ onRequestDemo }: { onRequestDemo: () => void }) {
  const { lang } = useLang();
  const t = translations[lang].cta;
  return (
    <section id="cta" className="relative isolate mx-auto max-w-6xl px-6 py-28">
      <div className="glass-strong relative overflow-hidden rounded-[2.5rem] px-6 py-20 text-center sm:px-12">
        <div className="absolute inset-0 -z-10">
          <NeuralNetwork density={24} seed={11} />
        </div>
        <div className="absolute inset-0 -z-10 bg-halo" />
        <Reveal>
          <SectionLabel>{t.eyebrow}</SectionLabel>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="mx-auto mt-5 max-w-3xl text-balance text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
            {t.title}
          </h2>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <GradientButton onClick={onRequestDemo}>
              {t.demo} <ArrowRight className="h-4 w-4" />
            </GradientButton>
            <GradientButton variant="ghost" href="/demo">
              <Play className="h-4 w-4" /> {translations[lang].hero.demoCta}
            </GradientButton>
            <GradientButton variant="ghost" href="#research">
              <FlaskConical className="h-4 w-4" /> {t.partner}
            </GradientButton>
            <GradientButton variant="ghost" href="mailto:hola@neuroaula.ai">
              <Mail className="h-4 w-4" /> {t.contact}
            </GradientButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function RequestDemoModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { lang } = useLang();
  const copy =
    lang === "es"
      ? {
          title: "Solicitar Demo",
          intro: "Vista previa del formulario de contacto de NeuroAula AI.",
          notice:
            "Formulario simulado: no introduzcas datos reales. La información no se envía ni se guarda.",
          name: "Nombre",
          email: "Email profesional",
          org: "Centro u organización",
          role: "Rol",
          message: "Objetivo de la demo",
          submit: "Simular envío",
          close: "Cerrar",
          success: "Simulación completada. No se ha enviado ni guardado ningún dato.",
        }
      : {
          title: "Request Demo",
          intro: "Preview of the NeuroAula AI contact form.",
          notice: "Simulated form: do not enter real data. Information is neither sent nor stored.",
          name: "Name",
          email: "Work email",
          org: "School or organization",
          role: "Role",
          message: "Demo goal",
          submit: "Simulate submission",
          close: "Close",
          success: "Simulation complete. No information was sent or stored.",
        };
  const [sent, setSent] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;

    previousFocusRef.current = document.activeElement as HTMLElement | null;
    setSent(false);
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab" || !modalRef.current) return;
      const focusable = Array.from(
        modalRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), input:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
        ),
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previousFocusRef.current?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/30 px-4 py-6 backdrop-blur-sm"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={modalRef}
        className="glass-strong w-full max-w-lg rounded-[2rem] p-6 text-left shadow-glow"
        role="dialog"
        aria-modal="true"
        aria-labelledby="request-demo-title"
        aria-describedby="request-demo-description"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="request-demo-title" className="text-2xl font-semibold tracking-tight text-ink">
              {copy.title}
            </h2>
            <p id="request-demo-description" className="mt-2 text-sm leading-relaxed text-ink-soft">
              {copy.intro}
            </p>
            <p className="mt-2 rounded-xl bg-amber-50 px-3 py-2 text-xs font-medium text-amber-900">
              {copy.notice}
            </p>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="rounded-full border border-border bg-white px-3 py-1.5 text-sm text-ink-soft transition hover:text-ink"
          >
            {copy.close}
          </button>
        </div>
        {sent ? (
          <div
            role="status"
            className="mt-6 rounded-2xl border border-[color:var(--brand-3)]/30 bg-white/70 p-4 text-sm font-medium text-ink"
          >
            {copy.success}
          </div>
        ) : (
          <form
            className="mt-6 grid gap-3"
            onSubmit={(event) => {
              event.preventDefault();
              setSent(true);
            }}
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                required
                aria-label={copy.name}
                placeholder={copy.name}
                className="rounded-2xl border border-border bg-white/80 px-4 py-3 text-sm outline-none transition focus:border-[color:var(--brand-2)]"
              />
              <input
                required
                type="email"
                aria-label={copy.email}
                placeholder={copy.email}
                className="rounded-2xl border border-border bg-white/80 px-4 py-3 text-sm outline-none transition focus:border-[color:var(--brand-2)]"
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                required
                aria-label={copy.org}
                placeholder={copy.org}
                className="rounded-2xl border border-border bg-white/80 px-4 py-3 text-sm outline-none transition focus:border-[color:var(--brand-2)]"
              />
              <input
                aria-label={copy.role}
                placeholder={copy.role}
                className="rounded-2xl border border-border bg-white/80 px-4 py-3 text-sm outline-none transition focus:border-[color:var(--brand-2)]"
              />
            </div>
            <textarea
              aria-label={copy.message}
              placeholder={copy.message}
              rows={4}
              className="resize-none rounded-2xl border border-border bg-white/80 px-4 py-3 text-sm outline-none transition focus:border-[color:var(--brand-2)]"
            />
            <button
              type="submit"
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-brand px-5 py-3 text-sm font-medium text-white shadow-glow transition hover:brightness-110"
            >
              {copy.submit} <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────  footer  ───────────────────────────── */

function Footer() {
  const { lang } = useLang();
  const t = translations[lang].footer;
  const footerHref = (label: string) => {
    if (label === "Gemelo Cognitivo" || label === "Cognitive Twin") return "#twin";
    if (label === "Agentes" || label === "Agents") return "#agents";
    if (label === "Partners") return "#research";
    if (label === "Paneles" || label === "Dashboards") return "/demo";
    if (label === "Accesibilidad" || label === "Accessibility") return "#accessibility";
    return null;
  };
  return (
    <footer className="border-t border-border/70 bg-white/60 backdrop-blur">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 md:grid-cols-[1.4fr_repeat(4,1fr)]">
        <div>
          <div className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-brand">
              <Brain className="h-4 w-4 text-white" />
            </div>
            <span className="text-base font-semibold tracking-tight">NeuroAula AI</span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-soft">{t.tagline}</p>
          <div className="mt-6 flex items-center gap-2">
            {[Twitter, Linkedin, Github].map((Icon, i) => (
              <span
                key={i}
                title={lang === "es" ? "Perfil todavía no disponible" : "Profile not available yet"}
                className="grid h-9 w-9 cursor-not-allowed place-items-center rounded-full border border-border bg-white text-ink-soft opacity-60"
              >
                <Icon className="h-4 w-4" />
              </span>
            ))}
          </div>
        </div>
        {t.groups.map((g) => (
          <div key={g.title}>
            <div className="text-sm font-semibold text-ink">{g.title}</div>
            <ul className="mt-4 space-y-2">
              {g.links.map((l) => {
                const href = footerHref(l);
                return (
                  <li key={l}>
                    {href ? (
                      <a href={href} className="text-sm text-ink-soft transition hover:text-ink">
                        {l}
                      </a>
                    ) : (
                      <span
                        title={
                          lang === "es"
                            ? "Sección todavía no disponible"
                            : "Section not available yet"
                        }
                        className="cursor-not-allowed text-sm text-ink-soft/60"
                      >
                        {l}
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border/70">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-6 text-xs text-ink-soft">
          <div>
            © {new Date().getFullYear()} NeuroAula AI. {t.rights}
          </div>
          <div className="font-mono uppercase tracking-widest">{t.compliance}</div>
        </div>
      </div>
    </footer>
  );
}

/* ─────────────────────────────  page  ───────────────────────────── */

function LandingPage() {
  const [requestDemoOpen, setRequestDemoOpen] = useState(false);

  return (
    <LanguageProvider>
      <div className="relative min-h-screen overflow-x-clip bg-background text-ink">
        <Nav onRequestDemo={() => setRequestDemoOpen(true)} />
        <main>
          <Hero onRequestDemo={() => setRequestDemoOpen(true)} />
          <ProblemSection />
          <SolutionSection />
          <CognitiveTwinSection />
          <PersonalizedLearningSection />
          <AgentsSection />
          <TeacherDashboardSection />
          <StudentDashboardSection />
          <ScienceSection />
          <AccessibilitySection />
          <ResearchSection />
          <CTASection onRequestDemo={() => setRequestDemoOpen(true)} />
        </main>
        <Footer />
        <RequestDemoModal open={requestDemoOpen} onClose={() => setRequestDemoOpen(false)} />
      </div>
    </LanguageProvider>
  );
}
