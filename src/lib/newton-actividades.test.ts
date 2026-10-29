import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { NEWTON_GENIALLY_INDEX_URL, retosNewton } from "./newton-actividades.ts";

describe("práctica matemática Newton", () => {
  it("referencia el índice original aportado por la docente", () => {
    assert.equal(
      NEWTON_GENIALLY_INDEX_URL,
      "https://view.genially.com/5f7e09dd1b2b330d2efa2489",
    );
  });

  it("contiene retos completos con claves válidas", () => {
    assert.equal(retosNewton.length, 3);
    assert.equal(new Set(retosNewton.map((reto) => reto.id)).size, retosNewton.length);
    for (const reto of retosNewton) {
      assert.equal(reto.pasos.length, 3);
      assert.ok(reto.situacion.length > 20);
      assert.ok(reto.apoyoArabe.length > 20);
      for (const paso of reto.pasos) {
        assert.equal(paso.opciones.length, 3);
        assert.ok(paso.correcta >= 0 && paso.correcta < 3);
        assert.ok(paso.pista.length > 0 && paso.explicacion.length > 0);
      }
    }
  });
});
