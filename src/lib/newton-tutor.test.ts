import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { catalogoNewton, fasesNewton } from "./newton-catalogo.ts";
import {
  crearEstadoTutor,
  estadisticasTutor,
  obtenerPreguntaTutor,
  responderTutor,
  solicitarPistaTutor,
} from "./newton-tutor.ts";

describe("mapa Newton",()=>{
  it("incorpora todas las grandes áreas observables en el índice sin inventar ejercicios disponibles",()=>{
    const ids=catalogoNewton.map((bloque)=>bloque.id);
    assert.equal(new Set(ids).size,ids.length);
    assert.ok(ids.length>=18);
    assert.ok(catalogoNewton.some((b)=>b.id==="fracciones"));
    assert.ok(catalogoNewton.some((b)=>b.id==="geometria"));
    assert.ok(catalogoNewton.some((b)=>b.id==="proporcionalidad"&&b.estado==="prototipo"));
    assert.ok(catalogoNewton.filter((b)=>b.estado==="prototipo").length===1);
    assert.deepEqual(fasesNewton,["comprender","pensar","ejecutar","responder"]);
  });
});

describe("tutor determinista por fases",()=>{
  it("empieza en comprender y avanza tras una respuesta válida",()=>{
    const inicial=crearEstadoTutor();
    const pregunta=obtenerPreguntaTutor(inicial);
    assert.ok(pregunta);
    assert.equal(pregunta.fase,"comprender");
    const resultado=responderTutor(inicial,pregunta.correcta);
    assert.equal(resultado.correcta,true);
    assert.equal(resultado.estado.faseIndex,1);
    assert.equal(resultado.decision,"avanzar");
    assert.equal(estadisticasTutor(resultado.estado).fasesRevisadas,1);
  });
  it("ofrece pista y después un problema puente ante dos errores",()=>{
    let estado=crearEstadoTutor();
    const pregunta=obtenerPreguntaTutor(estado);
    assert.ok(pregunta);
    const fallo=(pregunta.correcta+1)%pregunta.opciones.length;
    const primer=responderTutor(estado,fallo);
    assert.equal(primer.decision,"pista");
    estado=solicitarPistaTutor(primer.estado);
    assert.equal(estado.pistasUtilizadas,1);
    const segundo=responderTutor(estado,fallo);
    assert.equal(segundo.decision,"refuerzo");
    assert.equal(segundo.estado.tipo,"refuerzo");
    const puente=obtenerPreguntaTutor(segundo.estado);
    assert.ok(puente);
    const refuerzo=responderTutor(segundo.estado,puente.correcta);
    assert.equal(refuerzo.decision,"reintentar");
    assert.equal(refuerzo.estado.tipo,"principal");
    assert.equal(refuerzo.estado.faseIndex,0);
    assert.equal(refuerzo.estado.historial.length,3);
  });
  it("detiene el refuerzo difícil para revisión humana",()=>{
    let estado=crearEstadoTutor();
    let pregunta=obtenerPreguntaTutor(estado);
    assert.ok(pregunta);
    const fallo=(pregunta.correcta+1)%3;
    estado=responderTutor(estado,fallo).estado;
    estado=responderTutor(estado,fallo).estado;
    pregunta=obtenerPreguntaTutor(estado);
    assert.ok(pregunta);
    const falloPuente=(pregunta.correcta+1)%3;
    estado=responderTutor(estado,falloPuente).estado;
    const ultimo=responderTutor(estado,falloPuente);
    assert.equal(ultimo.decision,"revision-docente");
    assert.equal(ultimo.estado.bloqueoRevision,true);
    assert.deepEqual(responderTutor(ultimo.estado,pregunta.correcta).estado,ultimo.estado);
  });
  it("recorre las 4 fases de los 3 retos sin RAG ni llamadas externas",()=>{
    let estado=crearEstadoTutor();
    for(let paso=0;paso<12;paso++){
      const pregunta=obtenerPreguntaTutor(estado);
      assert.ok(pregunta);
      estado=responderTutor(estado,pregunta.correcta).estado;
    }
    assert.equal(estado.terminado,true);
    assert.equal(estadisticasTutor(estado).fasesRevisadas,12);
    assert.equal(obtenerPreguntaTutor(estado),null);
  });
});
