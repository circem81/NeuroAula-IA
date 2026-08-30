import type { ReactNode } from "react";
import type { Lang } from "./i18n";

type Dict = {
  nav: {
    platform: string;
    twin: string;
    agents: string;
    science: string;
    research: string;
    signIn: string;
    demo: string;
  };
  hero: {
    eyebrow: string;
    title: ReactNode;
    subtitle: ReactNode;
    exploreCta: string;
    demoCta: string;
    researchCta: string;
    chips: { label: string; value: string }[];
    trustLine: string;
    trustList: string;
  };
  problem: {
    eyebrow: string;
    title: ReactNode;
    subtitle: string;
    items: { title: string; body: string }[];
  };
  solution: {
    eyebrow: string;
    title: ReactNode;
    subtitle: string;
    layers: { name: string; desc: string }[];
    layerLabel: string;
  };
  twin: {
    eyebrow: string;
    title: ReactNode;
    subtitle: string;
    stateBadge: string;
    dims: string[];
  };
  personalized: {
    eyebrow: string;
    title: ReactNode;
    subtitle: string;
  };
  agents: {
    eyebrow: string;
    title: ReactNode;
    subtitle: string;
    list: { name: string; state: string }[];
    states: Record<string, string>;
  };
  teacherDash: {
    eyebrow: string;
    title: ReactNode;
    subtitle: string;
    cards: string[];
    live: string;
  };
  studentDash: {
    eyebrow: string;
    title: ReactNode;
    subtitle: string;
    tiles: { label: string; value: string }[];
    now: string;
  };
  science: {
    eyebrow: string;
    title: ReactNode;
    subtitle: string;
    items: { t: string; d: string }[];
    pillar: string;
  };
  accessibility: {
    eyebrow: string;
    title: ReactNode;
    subtitle: string;
    modes: string[];
    active: string;
  };
  research: {
    eyebrow: string;
    title: ReactNode;
    subtitle: string;
    partners: string[];
    partnerSub: string;
    liveLabel: string;
    activeSuffix: string;
  };
  cta: {
    eyebrow: string;
    title: ReactNode;
    demo: string;
    partner: string;
    contact: string;
  };
  footer: {
    tagline: string;
    groups: { title: string; links: string[] }[];
    rights: string;
    compliance: string;
  };
  map: {
    title: string;
    live: string;
    nodes: Record<string, string>;
    legend: Record<string, string>;
  };
};

const gradient = (s: string) => <span className="text-gradient">{s}</span>;

export const translations: Record<Lang, Dict> = {
  es: {
    nav: {
      platform: "Plataforma",
      twin: "Gemelo Cognitivo",
      agents: "Agentes",
      science: "Ciencia",
      research: "Investigación",
      signIn: "Ver demo",
      demo: "Solicitar Demo",
    },
    hero: {
      eyebrow: "Inteligencia Educativa Adaptativa · v1.0",
      title: <>La primera IA que aprende {gradient("cómo aprende cada estudiante")}</>,
      subtitle: (
        <>
          Ve más allá de los ejercicios adaptativos. NeuroAula AI presenta un{" "}
          <span className="font-medium text-ink">Gemelo Cognitivo Digital</span> que modela de forma
          continua la atención, la memoria, las funciones ejecutivas, las estrategias de aprendizaje
          y la evolución del conocimiento — personalizando la educación en tiempo real.
        </>
      ),
      exploreCta: "Explorar Plataforma",
      demoCta: "Ver demo interactiva",
      researchCta: "Investigación",
      chips: [
        { label: "Atención", value: "92%" },
        { label: "Memoria de trabajo", value: "+8,2%" },
        { label: "Funciones ejecutivas", value: "estable" },
        { label: "Razonamiento", value: "creciendo" },
      ],
      trustLine: "Con la confianza de docentes e investigadores en",
      trustList: "MIT · Stanford · Sorbonne · TU Delft · UPC · Karolinska",
    },
    problem: {
      eyebrow: "El Problema",
      title: <>La educación trata a cada estudiante {gradient("igual que a los demás")}.</>,
      subtitle:
        "La diversidad cognitiva es la norma, no la excepción. Los sistemas que usamos fingen lo contrario.",
      items: [
        {
          title: "Un modelo único para todos",
          body: "Las plataformas tradicionales entregan el mismo contenido a cada estudiante, ignorando la diversidad cognitiva y los perfiles de aprendizaje.",
        },
        {
          title: "Alumnado neurodivergente desatendido",
          body: "Estudiantes con TDAH, autismo, dislexia o altas capacidades reciben el mismo material que el resto.",
        },
        {
          title: "Docentes sin tiempo",
          body: "Personalizar a escala de aula es manualmente imposible — la verdadera diferenciación se derrumba bajo la carga de trabajo.",
        },
        {
          title: "IA que responde, no que entiende",
          body: "Los tutores de IA actuales responden preguntas pero nunca modelan al estudiante — sin memoria, sin teoría de la mente detrás de la consulta.",
        },
      ],
    },
    solution: {
      eyebrow: "Nuestra Solución",
      title: <>Cinco capas inteligentes — {gradient("un sistema vivo")}</>,
      subtitle:
        "Cada capa alimenta a la siguiente, formando un bucle cognitivo cerrado que aprende a medida que el estudiante aprende.",
      layers: [
        { name: "Memoria", desc: "Representación persistente de cada evento de aprendizaje." },
        { name: "Conocimiento", desc: "Currículo, literatura, recursos y documentos del centro." },
        {
          name: "Procedimientos",
          desc: "Pedagogía basada en evidencia adaptada a cada estudiante.",
        },
        { name: "Automatización", desc: "Planificación, evaluación, informes e intervenciones." },
        { name: "Motor de aprendizaje", desc: "Actualiza continuamente el modelo cognitivo." },
      ],
      layerLabel: "Capa",
    },
    twin: {
      eyebrow: "Gemelo Cognitivo Digital",
      title: <>Un modelo vivo de {gradient("cómo aprende cada mente")}</>,
      subtitle:
        "Diez dimensiones cognitivas, actualizadas de forma continua. El gemelo piensa junto al estudiante — nunca en su lugar.",
      stateBadge: "Visualización conceptual",
      dims: [
        "Memoria de trabajo",
        "Atención",
        "Funciones ejecutivas",
        "Velocidad de procesamiento",
        "Razonamiento",
        "Lenguaje",
        "Aprendizaje visual",
        "Regulación emocional",
        "Motivación",
        "Confianza en el aprendizaje",
      ],
    },
    personalized: {
      eyebrow: "Aprendizaje Personalizado",
      title: <>El conocimiento crece como una {gradient("red neuronal")}</>,
      subtitle:
        "Las respuestas correctas refuerzan las conexiones. Los errores conceptuales las debilitan. El sistema reorganiza el camino futuro automáticamente.",
    },
    agents: {
      eyebrow: "Arquitectura Multi-Agente",
      title: <>Ocho agentes de IA, {gradient("una cognición compartida")}</>,
      subtitle:
        "Agentes especializados que coordinan razonamiento sobre el estudiante, el contenido y el aula — en tiempo real.",
      list: [
        { name: "Agente de Currículo", state: "working" },
        { name: "Agente de Evaluación", state: "thinking" },
        { name: "Analítica de Aprendizaje", state: "learning" },
        { name: "Funciones Ejecutivas", state: "working" },
        { name: "Asistente Docente", state: "idle" },
        { name: "Asistente Familiar", state: "done" },
        { name: "Agente de Accesibilidad", state: "working" },
        { name: "Agente de Investigación", state: "thinking" },
      ],
      states: {
        idle: "En espera",
        thinking: "Pensando",
        working: "Trabajando",
        learning: "Aprendiendo",
        done: "Completado",
      },
    },
    teacherDash: {
      eyebrow: "Panel del Docente",
      title: <>Cada insight que un docente desearía {gradient("tener tiempo de ver")}</>,
      subtitle: "Analítica cognitiva pensada al ritmo del aula — decisiones, no tableros.",
      cards: [
        "Estudiantes que necesitan apoyo",
        "Indicadores de función ejecutiva",
        "Dominio de conceptos",
        "Progresión del aprendizaje",
        "Mapas de calor del aula",
        "Detección de errores conceptuales",
        "Predicción de riesgo",
        "Intervenciones personalizadas",
        "Evolución en el tiempo",
      ],
      live: "datos simulados",
    },
    studentDash: {
      eyebrow: "Panel del Estudiante",
      title: <>Un espacio de aprendizaje que {gradient("se siente como en casa")}</>,
      subtitle:
        "Claridad. Impulso. Una IA personal que celebra el progreso y se adapta a cómo te sientes.",
      tiles: [
        { label: "Objetivos de hoy", value: "3 / 5" },
        { label: "Logros", value: "12 nuevos" },
        { label: "Evolución cerebral", value: "+6% sem" },
        { label: "Ruta de aprendizaje", value: "Unidad 4" },
        { label: "Recomendados", value: "8 tareas" },
        { label: "Tutor IA personal", value: "en línea" },
        { label: "Progreso semanal", value: "82%" },
        { label: "Motivación", value: "alta" },
        { label: "Función ejecutiva", value: "estable" },
      ],
      now: "ahora",
    },
    science: {
      eyebrow: "Fundamento Científico",
      title: <>Construido sobre {gradient("los hombros de la investigación")}</>,
      subtitle:
        "No es un envoltorio sobre un chatbot — es un sistema fundamentado en décadas de ciencia del aprendizaje y neurociencia.",
      items: [
        {
          t: "Ciencias del aprendizaje",
          d: "Carga cognitiva, práctica de recuperación, espaciado, intercalado.",
        },
        { t: "Neurociencia educativa", d: "Memoria de trabajo, plasticidad, redes atencionales." },
        {
          t: "Funciones ejecutivas",
          d: "Inhibición, actualización, cambio — modeladas por estudiante.",
        },
        {
          t: "Diseño Universal para el Aprendizaje",
          d: "Múltiples formas de representación y expresión.",
        },
        { t: "Aprendizaje adaptativo", d: "Bayesian knowledge tracing, deep knowledge tracing." },
        {
          t: "Inteligencia Artificial",
          d: "LLMs, sistemas multi-agente, uso de herramientas, RAG.",
        },
        {
          t: "Learning Analytics",
          d: "Trazas conductuales, minería de secuencias, análisis causal.",
        },
        {
          t: "IA explicable",
          d: "Modelos interpretables en los que los docentes pueden confiar y auditar.",
        },
        {
          t: "Reglamento europeo de IA",
          d: "Diseñado desde el día uno para cumplir con IA de alto riesgo en educación.",
        },
        {
          t: "Educación basada en evidencia",
          d: "Cada intervención trazable a investigación revisada por pares.",
        },
      ],
      pillar: "pilar",
    },
    accessibility: {
      eyebrow: "Accesibilidad",
      title: <>Cada estudiante. {gradient("Cada perfil.")}</>,
      subtitle:
        "La adaptabilidad para la neurodiversidad y la discapacidad está integrada — no añadida al final.",
      modes: [
        "Modo TDAH",
        "Modo Autismo",
        "Modo Dislexia",
        "Alto contraste",
        "Baja estimulación",
        "Asistente de lectura",
        "Voz",
        "Traducción",
        "Lectura fácil",
      ],
      active: "demo conceptual",
    },
    research: {
      eyebrow: "Investigación e Innovación",
      title: <>Una {gradient("red global de investigación")}</>,
      subtitle:
        "Construimos junto a las instituciones que están definiendo el futuro de la educación.",
      partners: [
        "Universidades",
        "Centros de investigación",
        "Proyectos europeos",
        "Centros educativos",
        "Laboratorios de innovación",
      ],
      partnerSub: "Nodos de colaboración activos",
      liveLabel: "Nodos de colaboración · simulación visual",
      activeSuffix: "activos",
    },
    cta: {
      eyebrow: "Empezar",
      title: <>La educación debería adaptarse al estudiante — {gradient("no al revés.")}</>,
      demo: "Solicitar Demo",
      partner: "Ser partner de investigación",
      contact: "Contáctanos",
    },
    footer: {
      tagline:
        "Inteligencia Educativa Adaptativa. Construyendo el Gemelo Cognitivo Digital para cada estudiante.",
      groups: [
        { title: "Empresa", links: ["Sobre nosotros", "Empleo", "Prensa", "Blog"] },
        { title: "Investigación", links: ["Publicaciones", "Whitepapers", "Partners", "Ayudas"] },
        { title: "Plataforma", links: ["Gemelo Cognitivo", "Agentes", "Paneles", "Integraciones"] },
        { title: "Confianza", links: ["Privacidad", "Ética de IA", "Accesibilidad", "Seguridad"] },
      ],
      rights: "Todos los derechos reservados.",
      compliance: "Prototipo en evaluación · sin datos reales ni IA activa",
    },
    map: {
      title: "Mapa Cognitivo · simulación visual",
      live: "simulated",
      nodes: {
        n1: "Fracciones",
        n2: "Razones",
        n3: "Álgebra",
        n4: "Geometría",
        n5: "Lectura",
        n6: "Vocabulario",
        n7: "Gramática",
        n8: "Escritura",
        n9: "Biología",
        n10: "Física",
        n11: "Química",
        n12: "Deducción",
        n13: "Patrones",
        n14: "Creatividad",
        n15: "Composición",
      },
      legend: {
        math: "matemáticas",
        language: "lenguaje",
        science: "ciencia",
        logic: "lógica",
        arts: "artes",
      },
    },
  },
  en: {
    nav: {
      platform: "Platform",
      twin: "Cognitive Twin",
      agents: "Agents",
      science: "Science",
      research: "Research",
      signIn: "View demo",
      demo: "Request Demo",
    },
    hero: {
      eyebrow: "Adaptive Educational Intelligence · v1.0",
      title: <>The first AI that learns {gradient("how every student learns")}</>,
      subtitle: (
        <>
          Go beyond adaptive exercises. NeuroAula AI presents a{" "}
          <span className="font-medium text-ink">Digital Cognitive Twin</span> that continuously
          models attention, memory, executive function, learning strategies and the evolution of
          knowledge — personalizing education in real time.
        </>
      ),
      exploreCta: "Explore Platform",
      demoCta: "Try interactive demo",
      researchCta: "Research",
      chips: [
        { label: "Attention", value: "92%" },
        { label: "Working memory", value: "+8.2%" },
        { label: "Executive function", value: "stable" },
        { label: "Reasoning", value: "growing" },
      ],
      trustLine: "Trusted by educators and researchers at",
      trustList: "MIT · Stanford · Sorbonne · TU Delft · UPC · Karolinska",
    },
    problem: {
      eyebrow: "The Problem",
      title: <>Education treats every student {gradient("the same as everyone else")}.</>,
      subtitle:
        "Cognitive diversity is the norm, not the exception. The systems we use pretend otherwise.",
      items: [
        {
          title: "One-size-fits-all model",
          body: "Traditional platforms deliver the same content to every student, ignoring cognitive diversity and learning profiles.",
        },
        {
          title: "Neurodivergent learners underserved",
          body: "Students with ADHD, autism, dyslexia or gifted profiles get the same material as everyone else.",
        },
        {
          title: "Teachers without time",
          body: "Classroom-scale personalization is manually impossible — real differentiation collapses under workload.",
        },
        {
          title: "AI that answers, not that understands",
          body: "Today's AI tutors answer questions but never model the student — no memory, no theory of mind behind the query.",
        },
      ],
    },
    solution: {
      eyebrow: "Our Solution",
      title: <>Five intelligent layers — {gradient("one living system")}</>,
      subtitle:
        "Each layer feeds the next, forming a closed cognitive loop that learns as the student learns.",
      layers: [
        { name: "Memory", desc: "Persistent representation of every learning event." },
        { name: "Knowledge", desc: "Curriculum, literature, resources and school documents." },
        { name: "Procedures", desc: "Evidence-based pedagogy adapted to each student." },
        { name: "Automation", desc: "Planning, assessment, reporting and interventions." },
        { name: "Learning Engine", desc: "Continuously updates the cognitive model." },
      ],
      layerLabel: "Layer",
    },
    twin: {
      eyebrow: "Digital Cognitive Twin",
      title: <>A living model of {gradient("how every mind learns")}</>,
      subtitle:
        "Ten cognitive dimensions, continuously updated. The twin thinks with the student — never for them.",
      stateBadge: "Concept visualization",
      dims: [
        "Working memory",
        "Attention",
        "Executive function",
        "Processing speed",
        "Reasoning",
        "Language",
        "Visual learning",
        "Emotional regulation",
        "Motivation",
        "Learning confidence",
      ],
    },
    personalized: {
      eyebrow: "Personalized Learning",
      title: <>Knowledge grows like a {gradient("neural network")}</>,
      subtitle:
        "Correct answers reinforce connections. Misconceptions weaken them. The system reorganizes the future path automatically.",
    },
    agents: {
      eyebrow: "Multi-Agent Architecture",
      title: <>Eight AI agents, {gradient("one shared cognition")}</>,
      subtitle:
        "Specialized agents coordinating reasoning about the student, the content and the classroom — in real time.",
      list: [
        { name: "Curriculum Agent", state: "working" },
        { name: "Assessment Agent", state: "thinking" },
        { name: "Learning Analytics", state: "learning" },
        { name: "Executive Function", state: "working" },
        { name: "Teacher Assistant", state: "idle" },
        { name: "Family Assistant", state: "done" },
        { name: "Accessibility Agent", state: "working" },
        { name: "Research Agent", state: "thinking" },
      ],
      states: {
        idle: "Idle",
        thinking: "Thinking",
        working: "Working",
        learning: "Learning",
        done: "Done",
      },
    },
    teacherDash: {
      eyebrow: "Teacher Dashboard",
      title: <>Every insight a teacher would love {gradient("to have time to see")}</>,
      subtitle: "Cognitive analytics designed at classroom pace — decisions, not dashboards.",
      cards: [
        "Students needing support",
        "Executive function indicators",
        "Concept mastery",
        "Learning progression",
        "Classroom heatmaps",
        "Misconception detection",
        "Risk prediction",
        "Personalized interventions",
        "Evolution over time",
      ],
      live: "simulated data",
    },
    studentDash: {
      eyebrow: "Student Dashboard",
      title: <>A learning space that {gradient("feels like home")}</>,
      subtitle:
        "Clarity. Momentum. A personal AI that celebrates progress and adapts to how you feel.",
      tiles: [
        { label: "Today's goals", value: "3 / 5" },
        { label: "Achievements", value: "12 new" },
        { label: "Brain evolution", value: "+6% wk" },
        { label: "Learning path", value: "Unit 4" },
        { label: "Recommended", value: "8 tasks" },
        { label: "Personal AI tutor", value: "online" },
        { label: "Weekly progress", value: "82%" },
        { label: "Motivation", value: "high" },
        { label: "Executive function", value: "stable" },
      ],
      now: "now",
    },
    science: {
      eyebrow: "Scientific Foundation",
      title: <>Built on {gradient("the shoulders of research")}</>,
      subtitle:
        "Not a wrapper around a chatbot — a system grounded in decades of learning science and neuroscience.",
      items: [
        { t: "Learning sciences", d: "Cognitive load, retrieval practice, spacing, interleaving." },
        { t: "Educational neuroscience", d: "Working memory, plasticity, attentional networks." },
        { t: "Executive function", d: "Inhibition, updating, shifting — modeled per student." },
        {
          t: "Universal Design for Learning",
          d: "Multiple means of representation and expression.",
        },
        { t: "Adaptive learning", d: "Bayesian knowledge tracing, deep knowledge tracing." },
        { t: "Artificial Intelligence", d: "LLMs, multi-agent systems, tool use, RAG." },
        { t: "Learning Analytics", d: "Behavioral traces, sequence mining, causal analysis." },
        { t: "Explainable AI", d: "Interpretable models teachers can trust and audit." },
        { t: "EU AI Act", d: "Designed from day one to comply with high-risk AI in education." },
        {
          t: "Evidence-based education",
          d: "Every intervention traceable to peer-reviewed research.",
        },
      ],
      pillar: "pillar",
    },
    accessibility: {
      eyebrow: "Accessibility",
      title: <>Every student. {gradient("Every profile.")}</>,
      subtitle: "Adaptability for neurodiversity and disability is built in — not tacked on.",
      modes: [
        "ADHD Mode",
        "Autism Mode",
        "Dyslexia Mode",
        "High contrast",
        "Low stimulation",
        "Reading assistant",
        "Voice",
        "Translation",
        "Easy read",
      ],
      active: "concept demo",
    },
    research: {
      eyebrow: "Research & Innovation",
      title: <>A {gradient("global research network")}</>,
      subtitle: "We build alongside the institutions defining the future of education.",
      partners: [
        "Universities",
        "Research centers",
        "European projects",
        "Schools",
        "Innovation labs",
      ],
      partnerSub: "Active collaboration nodes",
      liveLabel: "Collaboration nodes · visual simulation",
      activeSuffix: "active",
    },
    cta: {
      eyebrow: "Get started",
      title: <>Education should adapt to the student — {gradient("not the other way around.")}</>,
      demo: "Request Demo",
      partner: "Become a research partner",
      contact: "Contact us",
    },
    footer: {
      tagline:
        "Adaptive Educational Intelligence. Building the Digital Cognitive Twin for every student.",
      groups: [
        { title: "Company", links: ["About", "Careers", "Press", "Blog"] },
        { title: "Research", links: ["Publications", "Whitepapers", "Partners", "Grants"] },
        { title: "Platform", links: ["Cognitive Twin", "Agents", "Dashboards", "Integrations"] },
        { title: "Trust", links: ["Privacy", "AI Ethics", "Accessibility", "Security"] },
      ],
      rights: "All rights reserved.",
      compliance: "Prototype under evaluation · no real data or active AI",
    },
    map: {
      title: "Cognitive Map · visual simulation",
      live: "simulated",
      nodes: {
        n1: "Fractions",
        n2: "Ratios",
        n3: "Algebra",
        n4: "Geometry",
        n5: "Reading",
        n6: "Vocabulary",
        n7: "Grammar",
        n8: "Writing",
        n9: "Biology",
        n10: "Physics",
        n11: "Chemistry",
        n12: "Deduction",
        n13: "Patterns",
        n14: "Creativity",
        n15: "Composition",
      },
      legend: {
        math: "math",
        language: "language",
        science: "science",
        logic: "logic",
        arts: "arts",
      },
    },
  },
};

export function useT() {
  // Consumers import useLang directly if they need setter; this is a shorthand.
  // Kept as a thin re-export site to avoid circular deps.
  throw new Error("Use `useLang()` and `translations[lang]` directly.");
}
