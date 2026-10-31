// Sample observations for the protected demo only. No educational records or AI inferences.
export type FormativeStatus = "developing" | "pending_review" | "teacher_validated";
export type EvidenceContext = "assisted_unverified" | "supervised";

export type FormativeCriterion = {
  id: string;
  title: string;
  competency: string;
  status: FormativeStatus;
  context: EvidenceContext;
  evidence: string;
  support: string;
  nextStep: string;
};

export type FormativeLearnerSnapshot = {
  strengths: string[];
  opportunities: string[];
  criteria: FormativeCriterion[];
};

export const formativeDashboardDemo: Partial<Record<string, FormativeLearnerSnapshot>> = {
  "lucia-fernandez": {
    strengths: [
      "Explica la conservación de una igualdad con un ejemplo propio.",
      "Revisa sus procedimientos antes de dar una respuesta definitiva.",
    ],
    opportunities: [
      "Comprobar transferencia a ecuaciones con una incógnita a ambos lados.",
    ],
    criteria: [
      {
        id: "DEMO-MAT-01",
        title: "Explica transformaciones que mantienen una igualdad.",
        competency: "Razonamiento y argumentación matemática",
        status: "teacher_validated",
        context: "supervised",
        evidence: "En una actividad ficticia supervisada, justificó por qué se retira lo mismo a ambos lados.",
        support: "Apoyo de acceso: enunciado visual; sin pista conceptual.",
        nextStep: "Proponer ecuaciones con términos en ambos miembros.",
      },
      {
        id: "DEMO-MAT-02",
        title: "Transfiere una estrategia a una ecuación nueva.",
        competency: "Resolución de problemas",
        status: "pending_review",
        context: "assisted_unverified",
        evidence: "Resolvió una variante, pero la actividad de práctica no verificó autonomía.",
        support: "Una pregunta orientadora conceptual.",
        nextStep: "Solicitar una variante supervisada antes de validar.",
      },
    ],
  },
  "mateo-ruiz": {
    strengths: [
      "Representa cantidades y relaciones mediante fichas visuales.",
      "Prueba otra estrategia cuando se le permite manipular los objetos.",
    ],
    opportunities: [
      "Necesita practicar cómo explicar la igualdad sin depender de pistas conceptuales.",
    ],
    criteria: [
      {
        id: "DEMO-MAT-01",
        title: "Explica transformaciones que mantienen una igualdad.",
        competency: "Razonamiento y argumentación matemática",
        status: "developing",
        context: "assisted_unverified",
        evidence: "En una escena ficticia de balanza, retiró fichas correctamente tras una pregunta.",
        support: "Una pregunta orientadora; representación de balanza.",
        nextStep: "Pedir que anticipe qué sucede antes de mover las fichas.",
      },
      {
        id: "DEMO-MAT-02",
        title: "Transfiere una estrategia a una ecuación nueva.",
        competency: "Resolución de problemas",
        status: "pending_review",
        context: "assisted_unverified",
        evidence: "Aún no existe comprobación independiente en este escenario ficticio.",
        support: "No determinado.",
        nextStep: "Ofrecer una variante nueva y revisar la explicación con el docente.",
      },
    ],
  },
};
