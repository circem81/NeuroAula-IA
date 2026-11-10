import { z } from "zod";

// Only teacher-authored, anonymous topics are accepted. Never send student profiles.
export const claudeBookRequestSchema = z.object({
  topic: z.string().trim().min(4).max(120),
  stage: z.enum(["primaria", "eso", "adultos"]),
  bilingual: z.boolean(),
});

export type ClaudeBookRequest = z.infer<typeof claudeBookRequestSchema>;

const drawingObjectSchema = z.object({
  shape: z.enum(["circle", "square", "triangle"]),
  x: z.number().min(8).max(92),
  y: z.number().min(8).max(92),
  size: z.number().min(4).max(25),
  color: z.enum(["blue", "green", "yellow", "orange", "purple", "pink"]),
});

export const claudeBookSchema = z.object({
  title: z.string().min(3).max(120),
  introduction: z.string().min(10).max(700),
  pages: z
    .array(
      z.object({
        heading: z.string().min(3).max(120),
        textEs: z.string().min(20).max(1400),
        textAr: z.string().max(1400),
        illustration: z.object({
          caption: z.string().min(3).max(160),
          objects: z.array(drawingObjectSchema).min(2).max(8),
        }),
        question: z.string().min(10).max(250),
        options: z.array(z.string().min(1).max(180)).length(3),
        correctIndex: z.number().int().min(0).max(2),
        feedback: z.string().min(5).max(400),
      }),
    )
    .length(3),
});

export type ClaudeBook = z.infer<typeof claudeBookSchema>;

// Compatible with Claude JSON structured outputs. More restrictive checks above
// run again after generation (array length, value ranges and string lengths).
const drawingObjectJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: ["shape", "x", "y", "size", "color"],
  properties: {
    shape: { type: "string", enum: ["circle", "square", "triangle"] },
    x: { type: "number" },
    y: { type: "number" },
    size: { type: "number" },
    color: { type: "string", enum: ["blue", "green", "yellow", "orange", "purple", "pink"] },
  },
} as const;

export const claudeBookJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: ["title", "introduction", "pages"],
  properties: {
    title: { type: "string" },
    introduction: { type: "string" },
    pages: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: [
          "heading",
          "textEs",
          "textAr",
          "illustration",
          "question",
          "options",
          "correctIndex",
          "feedback",
        ],
        properties: {
          heading: { type: "string" },
          textEs: { type: "string" },
          textAr: { type: "string" },
          illustration: {
            type: "object",
            additionalProperties: false,
            required: ["caption", "objects"],
            properties: {
              caption: { type: "string" },
              objects: { type: "array", items: drawingObjectJsonSchema },
            },
          },
          question: { type: "string" },
          options: { type: "array", items: { type: "string" } },
          correctIndex: { type: "integer" },
          feedback: { type: "string" },
        },
      },
    },
  },
} as const;
