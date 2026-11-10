import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { claudeBookRequestSchema, claudeBookSchema } from "./claude-book.ts";

const validPage = {
  heading: "Un ecosistema cercano",
  textEs: "En los ecosistemas áridos hay plantas y animales adaptados a la escasez de agua.",
  textAr: "",
  illustration: {
    caption: "Representación geométrica de un paisaje",
    objects: [
      { shape: "circle", x: 20, y: 25, size: 12, color: "yellow" },
      { shape: "triangle", x: 55, y: 70, size: 20, color: "green" },
    ],
  },
  question: "¿Qué adaptación puede ayudar a conservar agua?",
  options: ["Hojas pequeñas", "Hojas enormes", "Ausencia de raíces"],
  correctIndex: 0,
  feedback: "La superficie foliar pequeña puede reducir la pérdida de agua.",
};

const validBook = {
  title: "Ecosistemas áridos",
  introduction: "Actividad ilustrada para practicar la comprensión lectora.",
  pages: [validPage, validPage, validPage],
};

describe("Claude book validation", () => {
  it("accepts an anonymous teacher topic", () => {
    assert.equal(
      claudeBookRequestSchema.safeParse({
        topic: "Los ecosistemas áridos",
        stage: "eso",
        bilingual: false,
      }).success,
      true,
    );
  });

  it("rejects overly long topics", () => {
    assert.equal(
      claudeBookRequestSchema.safeParse({
        topic: "x".repeat(121),
        stage: "eso",
        bilingual: false,
      }).success,
      false,
    );
  });

  it("accepts only three-page valid books", () => {
    assert.equal(claudeBookSchema.safeParse(validBook).success, true);
    assert.equal(
      claudeBookSchema.safeParse({ ...validBook, pages: [validPage] }).success,
      false,
    );
  });

  it("rejects out-of-bounds drawing positions and answer indices", () => {
    const invalid = {
      ...validBook,
      pages: [
        {
          ...validPage,
          correctIndex: 4,
          illustration: {
            ...validPage.illustration,
            objects: [
              { ...validPage.illustration.objects[0], x: 1000 },
              validPage.illustration.objects[1],
            ],
          },
        },
        validPage,
        validPage,
      ],
    };
    assert.equal(claudeBookSchema.safeParse(invalid).success, false);
  });

  it("never accepts arbitrary HTML/JS in place of drawing data", () => {
    const invalid = {
      ...validBook,
      pages: [
        {
          ...validPage,
          illustration: "<script>alert(1)</script>",
        },
        validPage,
        validPage,
      ],
    };
    assert.equal(claudeBookSchema.safeParse(invalid).success, false);
  });
});
