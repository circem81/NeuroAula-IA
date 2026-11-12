import { z } from "zod";

const scopeSchema = z
  .object({
    organizationId: z.string().uuid(),
    actorId: z.string().uuid(),
    studentId: z.string().uuid(),
    role: z.enum(["teacher", "student"]),
    conversationId: z.string().uuid(),
    criterionId: z.string().min(1).max(100),
  })
  .strict();
export type ConversationScope = z.infer<typeof scopeSchema>;

// Bounded task facts, not chat transcripts, generated interpretations or learner traits.
const factSchema = z
  .object({
    activityCode: z.string().regex(/^[A-Za-z0-9._-]{1,100}$/),
    attempts: z.number().int().min(1).max(100),
    outcome: z.enum(["correct", "incorrect", "unobserved"]),
    supportLevel: z.number().int().min(0).max(5).nullable(),
  })
  .strict();
export type ConversationFact = z.infer<typeof factSchema>;
export const CONVERSATION_MEMORY_CONFIG = {
  ttlMs: 30 * 60_000,
  maxFacts: 6,
  maxScopes: 200,
} as const;

/** Process-local experimental memory. Call only after verifying the request's authorization.
 * The scope's IDs come from the authorized session/assignment, never a model response.
 * Expiry is fixed from creation, not extended by reads or writes.
 */
export function createConversationMemory(clock = Date.now) {
  const entries = new Map<string, { expiresAt: number; facts: ConversationFact[] }>();
  const key = (scope: ConversationScope) => {
    const s = scopeSchema.parse(scope);
    return JSON.stringify([
      s.organizationId,
      s.actorId,
      s.studentId,
      s.role,
      s.conversationId,
      s.criterionId,
    ]);
  };
  const sweep = () => {
    const now = clock();
    for (const [id, entry] of entries) if (entry.expiresAt <= now) entries.delete(id);
  };
  return {
    read(scope: ConversationScope, consent: boolean): ConversationFact[] {
      const id = key(scope);
      sweep();
      if (!consent) {
        entries.delete(id);
        return [];
      }
      return (entries.get(id)?.facts ?? []).map((fact) => ({ ...fact }));
    },
    append(scope: ConversationScope, consent: boolean, input: ConversationFact): boolean {
      const id = key(scope);
      sweep();
      if (!consent) {
        entries.delete(id);
        return false;
      }
      const fact = factSchema.parse(input);
      const entry = entries.get(id);
      // Fail closed at capacity instead of growing without a bound.
      if (!entry && entries.size >= CONVERSATION_MEMORY_CONFIG.maxScopes) return false;
      entries.set(id, {
        expiresAt: entry?.expiresAt ?? clock() + CONVERSATION_MEMORY_CONFIG.ttlMs,
        facts: [...(entry?.facts ?? []), fact].slice(-CONVERSATION_MEMORY_CONFIG.maxFacts),
      });
      return true;
    },
    forget(scope: ConversationScope) {
      entries.delete(key(scope));
    },
    forgetActor(actorId: string) {
      z.string().uuid().parse(actorId);
      for (const id of entries.keys()) if (JSON.parse(id)[1] === actorId) entries.delete(id);
    },
  };
}
