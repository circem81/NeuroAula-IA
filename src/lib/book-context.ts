import { z } from "zod";

export const bookContextSchema = z
  .object({
    bookId: z.literal("neuroaula-algebra-book"),
    bookVersion: z.literal(1),
    activityPageId: z.literal("challenge"),
    sourceId: z.literal("NEUROAULA.ALG-01.v1"),
    presentation: z.enum(["reading", "3d"]),
  })
  .strict();
export type BookContext = z.infer<typeof bookContextSchema>;
