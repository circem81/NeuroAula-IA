export type InterventionStatus = "open" | "follow-up" | "resolved";

export type Intervention = {
  alertId: string;
  status: InterventionStatus;
  owner: string | null;
  note: string;
  updatedAt: string | null;
};

export const DEMO_INTERVENTION_STORAGE_KEY = "neuroaula.demo.interventions";

export function createInitialInterventions(alertIds: readonly string[]): Intervention[] {
  return alertIds.map((alertId) => ({
    alertId,
    status: "open",
    owner: null,
    note: "",
    updatedAt: null,
  }));
}

export function mergeStoredInterventions(
  alertIds: readonly string[],
  stored: unknown,
): Intervention[] {
  const initial = createInitialInterventions(alertIds);
  if (!Array.isArray(stored)) return initial;

  return initial.map((fallback) => {
    const candidate = stored.find(
      (item): item is Partial<Intervention> =>
        typeof item === "object" && item !== null && item.alertId === fallback.alertId,
    );
    if (!candidate) return fallback;
    const validStatus = ["open", "follow-up", "resolved"].includes(candidate.status ?? "");
    return {
      alertId: fallback.alertId,
      status: validStatus ? (candidate.status as InterventionStatus) : fallback.status,
      owner: typeof candidate.owner === "string" ? candidate.owner : null,
      note: typeof candidate.note === "string" ? candidate.note.slice(0, 500) : "",
      updatedAt: typeof candidate.updatedAt === "string" ? candidate.updatedAt : null,
    };
  });
}

export function updateIntervention(
  interventions: readonly Intervention[],
  alertId: string,
  patch: Partial<Omit<Intervention, "alertId">>,
  updatedAt: string,
) {
  return interventions.map((intervention) =>
    intervention.alertId === alertId ? { ...intervention, ...patch, updatedAt } : intervention,
  );
}
