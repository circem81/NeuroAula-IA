/**
 * Motor determinista de demostración para NeuroAula-IA.
 *
 * No usa LLM, no envía datos a un servicio externo y no toma decisiones
 * educativas de alto impacto. Su único caso de uso es una actividad sintética.
 * La revisión docente es una puerta pendiente, NO una aprobación implementada.
 */
export const PLAYBOOK_VERSION = "0.1.0";
export const PLAYBOOK_DEMO_ACTIVITY_ID = "demo-enteros-2eso-01";
export const PLAYBOOK_DEMO_CRITERION = "DEMO-ENTEROS-2ESO-01"; // NO es un código LOMLOE oficial.

export type PlaybookCheck = {
  id: string;
  label: string;
  passed: boolean;
  detail: string;
};

export type PlaybookResult = {
  version: string;
  activityId: string;
  status: "needs_input" | "pending_teacher_review";
  observedAnswer: number | null;
  comparison: "correct" | "incorrect" | "unavailable";
  feedbackProposal: string | null;
  nextActivityProposal: string | null;
  evidenceRefs: string[];
  checks: PlaybookCheck[];
  corrections: string[];
  review: {
    required: true;
    status: "pending";
    publicationEnabled: false;
  };
};

function parseIntegerAnswer(value: string): number | null {
  if (!/^[+-]?\d{1,4}$/.test(value)) return null;
  const number = Number(value);
  return Number.isSafeInteger(number) ? number : null;
}

/** Ejecuta, comprueba y bloquea por defecto una propuesta educativa sintética. */
export function runPlaybookAgent(input: {
  activityId: string;
  answer: string;
}): PlaybookResult {
  const recognized = input.activityId === PLAYBOOK_DEMO_ACTIVITY_ID;
  const normalized = input.answer.trim().replace(/[−–]/g, "-");
  const corrections =
    input.answer !== normalized
      ? ["Se han normalizado los espacios externos y el signo menos antes de validar."]
      : [];
  const observedAnswer = recognized ? parseIntegerAnswer(normalized) : null;
  const expectedAnswer = -8 + -5 - -3;
  const hasValidAnswer = observedAnswer !== null;
  const comparison =
    !recognized || !hasValidAnswer
      ? "unavailable"
      : observedAnswer === expectedAnswer
        ? "correct"
        : "incorrect";

  // No se atribuye una causa cognitiva a una respuesta aislada.
  const feedbackProposal =
    comparison === "correct"
      ? "El resultado coincide con la operación. Explica qué ocurre al restar un número negativo."
      : comparison === "incorrect"
        ? "El resultado no coincide. Comprueba primero que restar (−3) equivale a sumar 3. Después, vuelve a calcular."
        : null;
  const nextActivityProposal =
    comparison === "correct"
      ? "Proponer otra operación con enteros y solicitar una explicación del procedimiento."
      : comparison === "incorrect"
        ? "Proponer una operación breve con resta de negativos y una pista visual."
        : null;
  const evidenceRefs = recognized
    ? ["demo-data:adaptiveActivity", PLAYBOOK_DEMO_CRITERION]
    : [];

  const checks: PlaybookCheck[] = [
    {
      id: "activity",
      label: "La actividad corresponde a la rúbrica prevista",
      passed: recognized,
      detail: recognized
        ? PLAYBOOK_DEMO_ACTIVITY_ID
        : "Actividad no reconocida: se detiene la evaluación.",
    },
    {
      id: "source",
      label: "La referencia curricular está identificada y marcada como simulada",
      passed: recognized && evidenceRefs.includes(PLAYBOOK_DEMO_CRITERION),
      detail: "Referencia DEMO; no se declara equivalencia con un criterio LOMLOE oficial.",
    },
    {
      id: "input",
      label: "La respuesta es un número entero interpretable",
      passed: hasValidAnswer,
      detail: hasValidAnswer
        ? "Entrada validada sin ejecutar código ni expresiones."
        : "Introduce un entero, por ejemplo −10.",
    },
    {
      id: "arithmetic",
      label: "El resultado de referencia está comprobado",
      passed: expectedAnswer === -10,
      detail: "−8 + (−5) − (−3) = −8 − 5 + 3 = −10.",
    },
    {
      id: "comparison",
      label: "La comparación se apoya en la respuesta observada",
      passed: comparison !== "unavailable",
      detail:
        comparison === "unavailable"
          ? "Sin comparación válida."
          : `Comparación: ${comparison} (respuesta esperada: −10).`,
    },
    {
      id: "feedback",
      label: "La ayuda explica una regla sin inventar causas del error",
      passed: feedbackProposal !== null,
      detail: feedbackProposal ?? "No se genera retroalimentación sin respuesta válida.",
    },
    {
      id: "privacy",
      label: "La ejecución no necesita datos identificativos del alumnado",
      passed: true,
      detail: "Solo actividad sintética y respuesta; sin almacenamiento ni red.",
    },
    {
      id: "human_gate",
      label: "La propuesta queda retenida para supervisión docente",
      passed: true,
      detail: "Este prototipo no publica notas, cambia niveles ni actualiza el gemelo de aprendizaje.",
    },
  ];

  return {
    version: PLAYBOOK_VERSION,
    activityId: input.activityId,
    status: checks.every((check) => check.passed)
      ? "pending_teacher_review"
      : "needs_input",
    observedAnswer,
    comparison,
    feedbackProposal,
    nextActivityProposal,
    evidenceRefs,
    checks,
    corrections,
    review: { required: true, status: "pending", publicationEnabled: false },
  };
}
