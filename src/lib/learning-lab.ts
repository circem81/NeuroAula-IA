export type TeachingApproach = "guided" | "direct";
export type ObservedError = "one-sided" | "inverse" | "none";

export type LearningQuestion = {
  prompt: string;
  choices: readonly [string, string, string];
  correctIndex: 0 | 1 | 2;
  feedback: string;
};

export const mathStoryPages = [
  {
    title: "1. La igualdad es una balanza",
    text: "Imagina que una igualdad es una balanza equilibrada. Si quitas tres fichas de un lado, también tienes que quitar tres del otro para conservar el equilibrio.",
    example: "x + 3 = 7",
    question: {
      prompt: "¿Qué operación mantiene la igualdad?",
      choices: [
        "Restar 3 en ambos miembros",
        "Restar 3 solo a la izquierda",
        "Sumar 3 solo a la derecha",
      ],
      correctIndex: 0,
      feedback: "Una transformación equivalente aplica la misma operación a ambos miembros.",
    },
  },
  {
    title: "2. Deshacer una multiplicación",
    text: "Dos cajas iguales representan 2x. Si juntas equivalen a diez fichas, puedes repartir ambos lados entre dos para encontrar el valor de una caja.",
    example: "2x = 10",
    question: {
      prompt: "¿Cómo despejarías x?",
      choices: ["Restando 2", "Dividiendo ambos miembros entre 2", "Sumando 10"],
      correctIndex: 1,
      feedback: "Dividir ambos lados entre el mismo número distinto de cero conserva la igualdad.",
    },
  },
  {
    title: "3. Resuelve por pasos",
    text: "Las expresiones pueden tener más de una operación. Primero retira las tres fichas adicionales de ambos lados; después elimina la división entre dos.",
    example: "x / 2 + 3 = 7",
    question: {
      prompt: "¿Cuál sería el primer paso?",
      choices: ["Multiplicar solo la izquierda por 2", "Sumar 3", "Restar 3 a ambos miembros"],
      correctIndex: 2,
      feedback: "Después de restar 3 en ambos miembros queda x / 2 = 4.",
    },
  },
] as const satisfies ReadonlyArray<{
  title: string;
  text: string;
  example: string;
  question: LearningQuestion;
}>;

export type PuzzleMove = {
  label: string;
  correct: boolean;
  feedback: string;
};

export const algebraPuzzles: ReadonlyArray<{
  title: string;
  steps: readonly {
    equation: string;
    moves: readonly PuzzleMove[];
  }[];
  solution: string;
}> = [
  {
    title: "Nivel 1 · Equilibrio",
    steps: [
      {
        equation: "x + 3 = 7",
        moves: [
          {
            label: "Quitar 3 de ambos miembros",
            correct: true,
            feedback: "¡Bien! Ambos lados siguen equilibrados.",
          },
          {
            label: "Quitar 3 solo de la izquierda",
            correct: false,
            feedback:
              "Eso rompe el equilibrio. Prueba a realizar la misma operación a ambos lados.",
          },
          {
            label: "Añadir 3 al lado derecho",
            correct: false,
            feedback: "Observa qué operación deshace el +3 sin romper la igualdad.",
          },
        ],
      },
    ],
    solution: "x = 4",
  },
  {
    title: "Nivel 2 · Dos cajas",
    steps: [
      {
        equation: "2x = 10",
        moves: [
          {
            label: "Dividir los dos miembros entre 2",
            correct: true,
            feedback: "¡Correcto! Has encontrado el valor de una caja.",
          },
          {
            label: "Dividir solo 10 entre 2",
            correct: false,
            feedback: "Para conservar la igualdad, divide ambos miembros.",
          },
          {
            label: "Restar 2 a ambos lados",
            correct: false,
            feedback: "El 2 multiplica a x: necesitamos la operación inversa.",
          },
        ],
      },
    ],
    solution: "x = 5",
  },
  {
    title: "Nivel 3 · Dos movimientos",
    steps: [
      {
        equation: "x / 2 + 3 = 7",
        moves: [
          {
            label: "Restar 3 en ambos miembros",
            correct: true,
            feedback: "¡Bien! Ahora queda x / 2 = 4.",
          },
          {
            label: "Restar 3 solo a la izquierda",
            correct: false,
            feedback: "La igualdad deja de conservarse. Modifica ambos miembros.",
          },
          {
            label: "Dividir ambos miembros entre 2",
            correct: false,
            feedback: "Antes conviene eliminar el +3 para aislar x / 2.",
          },
        ],
      },
      {
        equation: "x / 2 = 4",
        moves: [
          {
            label: "Multiplicar ambos miembros por 2",
            correct: true,
            feedback: "¡Perfecto! La operación inversa elimina la división entre 2.",
          },
          {
            label: "Multiplicar solo el miembro izquierdo",
            correct: false,
            feedback:
              "Esa operación rompe la igualdad. Aplica la transformación en ambos miembros.",
          },
          {
            label: "Restar 2 a ambos miembros",
            correct: false,
            feedback: "El 2 está dividiendo. Busca la operación inversa.",
          },
        ],
      },
    ],
    solution: "x = 8",
  },
];

/**
 * Deterministic, hand-authored pedagogical lookup for demonstration purposes.
 * This is NOT an operating RAG, a scientific evidence review, or a clinical model.
 */
export function retrieveDemoSupport(error: ObservedError, approach: TeachingApproach) {
  const needs = {
    "one-sided": {
      prerequisite: "Comprender la igualdad y sus transformaciones equivalentes.",
      rule: "Aplicar la misma operación a ambos miembros de una ecuación.",
      evidence: "Principio algebraico de equivalencia (regla matemática, no artículo empírico).",
      limit: "El error en una tarea no demuestra una dificultad estable del estudiante.",
    },
    inverse: {
      prerequisite: "Relacionar las operaciones directas con sus inversas.",
      rule: "La operación inversa permite aislar una incógnita.",
      evidence: "Principio de operaciones inversas (regla matemática, no artículo empírico).",
      limit:
        "No se han recuperado estudios científicos para justificar una intervención individual.",
    },
    none: {
      prerequisite: "Profundizar en el razonamiento y la comprobación de soluciones.",
      rule: "Sustituir la solución para verificar que se conserva la igualdad.",
      evidence: "Comprobación aritmética directa (regla matemática).",
      limit: "Esta simulación no evalúa un perfil educativo real.",
    },
  } as const;
  const pedagogical = {
    guided: "Hacer una pregunta breve y ofrecer una pista gradual antes de mostrar la solución.",
    direct: "Explicar la regla y mostrar un ejemplo resuelto paso a paso.",
  } as const;
  const selected = needs[error];
  return {
    prerequisite: selected.prerequisite,
    educatorPreference:
      approach === "guided" ? "Preguntas y andamiaje gradual" : "Explicación directa",
    recommendation: pedagogical[approach],
    retrievedRule: selected.rule,
    source: selected.evidence,
    uncertainty: selected.limit,
    status: "Borrador didáctico pendiente de revisión docente",
  };
}
