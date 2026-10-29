import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { librosBilingues, nivelesLibros, resumenLibro } from "./libros-bilingues.ts";

describe("libros bilingües español-árabe", () => {
  it("ofrece tres niveles con páginas y ejercicios completos", () => {
    assert.deepEqual(nivelesLibros, ["A1", "A2", "B1"]);
    for (const nivel of nivelesLibros) {
      assert.equal(librosBilingues[nivel].length, 3);
      for (const pagina of librosBilingues[nivel]) {
        assert.ok(pagina.textoEspanol.length > 20);
        assert.ok(pagina.textoArabe.length > 20);
        assert.ok(pagina.vocabulario.length > 0);
        assert.ok(pagina.preguntas.length > 0);
      }
    }
  });

  it("no repite identificadores y valida las opciones correctas", () => {
    const preguntas = nivelesLibros.flatMap((nivel) =>
      librosBilingues[nivel].flatMap((pagina) => pagina.preguntas),
    );
    assert.equal(new Set(preguntas.map((pregunta) => pregunta.id)).size, preguntas.length);
    for (const pregunta of preguntas) {
      assert.equal(pregunta.opciones.length, 3);
      assert.ok(pregunta.correcta >= 0 && pregunta.correcta < pregunta.opciones.length);
      assert.ok(pregunta.pista.length > 5 && pregunta.explicacion.length > 5);
    }
  });

  it("calcula el progreso solo con las respuestas locales", () => {
    const inicio = resumenLibro("A1", {});
    assert.deepEqual(inicio, { total: 6, correctas: 0 });
    assert.deepEqual(resumenLibro("A1", { "a1-1a": 0, "a1-1b": 0 }), {
      total: 6,
      correctas: 1,
    });
  });
});
