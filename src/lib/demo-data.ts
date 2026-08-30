export type Status = "stable" | "attention" | "intervention";

export type Student = {
  id: string;
  name: string;
  progress: number;
  masteryLevel: "inicial" | "medio" | "avanzado";
  profileKey: "tdah" | "dislexia" | "altas" | "idioma" | "calculo" | "ninguna";
  lastActivity: string;
  status: Status;
  cognitive: {
    attention: number;
    workingMemory: number;
    verbal: number;
    logic: number;
    selfRegulation: number;
    persistence: number;
    pace: number;
  };
  bestHelpKey: "visual" | "auditiva" | "manipulativa" | "escrita";
  competencies: { name: string; value: number }[];
  strengthsKeys: string[];
  difficultiesKeys: string[];
  frequentErrorsKeys: string[];
  strategiesKeys: string[];
  recentActivities: { title: string; result: string; date: string }[];
  recommendationsKeys: string[];
};

export const students: Student[] = [
  {
    id: "lucia-fernandez",
    name: "Lucía Fernández",
    progress: 78,
    masteryLevel: "avanzado",
    profileKey: "ninguna",
    lastActivity: "2026-07-18",
    status: "stable",
    cognitive: {
      attention: 82,
      workingMemory: 80,
      verbal: 85,
      logic: 78,
      selfRegulation: 82,
      persistence: 88,
      pace: 75,
    },
    bestHelpKey: "escrita",
    competencies: [
      { name: "Matemáticas", value: 82 },
      { name: "Lengua", value: 84 },
      { name: "Ciencias", value: 79 },
      { name: "Inglés", value: 76 },
    ],
    strengthsKeys: ["reading", "reasoning", "autonomy"],
    difficultiesKeys: ["speed_calc"],
    frequentErrorsKeys: ["sign_errors"],
    strategiesKeys: ["written_steps", "self_check"],
    recentActivities: [
      { title: "Números enteros", result: "8/10", date: "18 jul" },
      { title: "Comprensión lectora", result: "9/10", date: "16 jul" },
    ],
    recommendationsKeys: ["extend_challenge", "peer_teaching"],
  },
  {
    id: "mateo-ruiz",
    name: "Mateo Ruiz",
    progress: 54,
    masteryLevel: "medio",
    profileKey: "tdah",
    lastActivity: "2026-07-19",
    status: "attention",
    cognitive: {
      attention: 45,
      workingMemory: 55,
      verbal: 70,
      logic: 68,
      selfRegulation: 40,
      persistence: 50,
      pace: 62,
    },
    bestHelpKey: "visual",
    competencies: [
      { name: "Matemáticas", value: 58 },
      { name: "Lengua", value: 62 },
      { name: "Ciencias", value: 55 },
      { name: "Inglés", value: 50 },
    ],
    strengthsKeys: ["creativity", "oral"],
    difficultiesKeys: ["sustained_attention", "task_completion"],
    frequentErrorsKeys: ["skip_steps", "impulsive_answer"],
    strategiesKeys: ["short_tasks", "visual_cues", "breaks"],
    recentActivities: [
      { title: "Números enteros", result: "5/10", date: "19 jul" },
      { title: "Sinónimos", result: "6/10", date: "17 jul" },
    ],
    recommendationsKeys: ["chunk_activities", "movement_breaks", "visual_scaffold"],
  },
  {
    id: "carmen-lopez",
    name: "Carmen López",
    progress: 61,
    masteryLevel: "medio",
    profileKey: "dislexia",
    lastActivity: "2026-07-19",
    status: "attention",
    cognitive: {
      attention: 70,
      workingMemory: 60,
      verbal: 55,
      logic: 74,
      selfRegulation: 72,
      persistence: 78,
      pace: 58,
    },
    bestHelpKey: "auditiva",
    competencies: [
      { name: "Matemáticas", value: 68 },
      { name: "Lengua", value: 52 },
      { name: "Ciencias", value: 64 },
      { name: "Inglés", value: 55 },
    ],
    strengthsKeys: ["reasoning", "persistence"],
    difficultiesKeys: ["decoding", "spelling"],
    frequentErrorsKeys: ["letter_inversion", "reading_speed"],
    strategiesKeys: ["audio_support", "dyslexic_font", "extra_time"],
    recentActivities: [
      { title: "Lectura guiada", result: "audio", date: "19 jul" },
      { title: "Fracciones", result: "7/10", date: "17 jul" },
    ],
    recommendationsKeys: ["multisensory", "text_to_speech", "extra_time"],
  },
  {
    id: "diego-martin",
    name: "Diego Martín",
    progress: 92,
    masteryLevel: "avanzado",
    profileKey: "altas",
    lastActivity: "2026-07-19",
    status: "stable",
    cognitive: {
      attention: 88,
      workingMemory: 92,
      verbal: 90,
      logic: 96,
      selfRegulation: 85,
      persistence: 80,
      pace: 95,
    },
    bestHelpKey: "escrita",
    competencies: [
      { name: "Matemáticas", value: 95 },
      { name: "Lengua", value: 88 },
      { name: "Ciencias", value: 94 },
      { name: "Inglés", value: 90 },
    ],
    strengthsKeys: ["reasoning", "curiosity", "speed"],
    difficultiesKeys: ["boredom", "frustration_tolerance"],
    frequentErrorsKeys: ["skip_steps"],
    strategiesKeys: ["enrichment", "open_projects"],
    recentActivities: [
      { title: "Problemas avanzados", result: "10/10", date: "19 jul" },
      { title: "Debate", result: "excelente", date: "16 jul" },
    ],
    recommendationsKeys: ["enrichment", "mentoring", "open_challenges"],
  },
  {
    id: "amina-el-mansouri",
    name: "Amina El Mansouri",
    progress: 46,
    masteryLevel: "inicial",
    profileKey: "idioma",
    lastActivity: "2026-07-18",
    status: "intervention",
    cognitive: {
      attention: 78,
      workingMemory: 74,
      verbal: 42,
      logic: 80,
      selfRegulation: 82,
      persistence: 85,
      pace: 60,
    },
    bestHelpKey: "visual",
    competencies: [
      { name: "Matemáticas", value: 70 },
      { name: "Lengua", value: 35 },
      { name: "Ciencias", value: 48 },
      { name: "Inglés", value: 55 },
    ],
    strengthsKeys: ["logic", "persistence", "effort"],
    difficultiesKeys: ["vocabulary", "reading_comprehension"],
    frequentErrorsKeys: ["vocab_confusion"],
    strategiesKeys: ["visual_vocab", "bilingual_glossary", "peer_support"],
    recentActivities: [
      { title: "Vocabulario visual", result: "8/10", date: "18 jul" },
      { title: "Números enteros", result: "7/10", date: "17 jul" },
    ],
    recommendationsKeys: ["visual_vocab", "bilingual_support", "cultural_context"],
  },
  {
    id: "javier-santos",
    name: "Javier Santos",
    progress: 38,
    masteryLevel: "inicial",
    profileKey: "calculo",
    lastActivity: "2026-07-19",
    status: "intervention",
    cognitive: {
      attention: 68,
      workingMemory: 45,
      verbal: 72,
      logic: 55,
      selfRegulation: 70,
      persistence: 62,
      pace: 45,
    },
    bestHelpKey: "manipulativa",
    competencies: [
      { name: "Matemáticas", value: 38 },
      { name: "Lengua", value: 68 },
      { name: "Ciencias", value: 55 },
      { name: "Inglés", value: 60 },
    ],
    strengthsKeys: ["oral", "reading"],
    difficultiesKeys: ["number_sense", "calc_procedures"],
    frequentErrorsKeys: ["place_value", "sign_errors", "carry_errors"],
    strategiesKeys: ["manipulatives", "step_by_step", "number_line"],
    recentActivities: [
      { title: "Números enteros", result: "3/10", date: "19 jul" },
      { title: "Comprensión lectora", result: "8/10", date: "17 jul" },
    ],
    recommendationsKeys: ["manipulatives", "small_steps", "concrete_examples"],
  },
];

export const weeklyProgress = [
  { day: "Lun", value: 62 },
  { day: "Mar", value: 65 },
  { day: "Mié", value: 63 },
  { day: "Jue", value: 68 },
  { day: "Vie", value: 71 },
  { day: "Sáb", value: 69 },
  { day: "Dom", value: 72 },
];

export const masteryDistribution = [
  { level: "Inicial", value: 2 },
  { level: "Medio", value: 2 },
  { level: "Avanzado", value: 2 },
];

export const recentAlerts = [
  {
    id: "alert-attention-mateo",
    studentId: "mateo-ruiz",
    messageKey: "attention_drop",
    severity: "warning" as const,
  },
  {
    id: "alert-math-javier",
    studentId: "javier-santos",
    messageKey: "math_regression",
    severity: "danger" as const,
  },
  {
    id: "alert-language-amina",
    studentId: "amina-el-mansouri",
    messageKey: "language_barrier",
    severity: "warning" as const,
  },
];

export const latestActivities = [
  { title: "Números enteros — 2.º B", type: "Matemáticas", completed: 22, total: 26 },
  { title: "Comprensión lectora", type: "Lengua", completed: 24, total: 26 },
  { title: "Ecosistemas", type: "Ciencias", completed: 18, total: 26 },
];

export const pendingActivities = 4;

export const lomloeReport = {
  competencies: [
    { code: "CE.MAT.1", name: "Resolución de problemas con números enteros" },
    { code: "CE.MAT.3", name: "Razonamiento y argumentación matemática" },
  ],
  criteria: [
    "Aplica operaciones con números enteros en contextos reales.",
    "Justifica el procedimiento seguido para resolver el problema.",
  ],
  evidence: [
    "22 de 26 actividades completadas en la unidad.",
    "3 errores frecuentes detectados por el sistema en operaciones con signos.",
  ],
  achievement: "Adecuado",
  observations:
    "El grupo muestra progreso sostenido. Se recomienda reforzar el razonamiento sobre signos con manipulativos visuales.",
  recommendations: [
    "Añadir actividad adaptativa de refuerzo sobre reglas de signos.",
    "Revisar apoyos individuales para alumnado con perfil de cálculo.",
  ],
};

export const adaptiveActivity = {
  subject: "Matemáticas — 2.º ESO",
  topic: "Números enteros",
  statement: "Calcula el resultado de la operación: −8 + (−5) − (−3)",
  studentAnswer: "−16",
  detectedError: "El alumno aplica el signo negativo también al restar un número negativo.",
  errorClass: "Regla de signos en resta de negativos",
  hint1: "Recuerda: restar un número negativo equivale a sumar su valor positivo.",
  hint2: "Reescribe la expresión sustituyendo − (−3) por + 3 antes de operar.",
  stepByStep: ["Paso 1: −8 + (−5) = −13", "Paso 2: −13 − (−3) = −13 + 3", "Paso 3: −13 + 3 = −10"],
  nextActivity:
    "Nueva actividad adaptada: 5 operaciones cortas con restas de números negativos, con retroalimentación paso a paso.",
};
