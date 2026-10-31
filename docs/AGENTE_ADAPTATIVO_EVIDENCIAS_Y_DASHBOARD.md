# NeuroAula-IA — Tutor adaptativo, trazabilidad formativa y panel de evidencias

**Estado:** especificación pedagógica y funcional. La aplicación actual es una demo con datos simulados. NO existen todavía agentes IA ejecutables, registro longitudinal real, evaluación automatizada ni adaptación en producción.

## 1. Decisión de diseño

NeuroAula adopta el siguiente ciclo:
**actividad manipulativa / pregunta → acción o respuesta → evidencia con procedencia → apoyo o ajuste prudente → nueva tarea → verificación supervisada → revisión del equipo educativo → siguiente ciclo.**

No confundir:
- una **respuesta correcta**, con **comprensión**;
- el **desempeño con ayuda**, con el **dominio autónomo demostrado**;
- una **hipótesis del agente**, con una **decisión profesional**;
- una **competencia curricular** con una supuesta **característica clínica o cognitiva** del alumno.

Los criterios curriculares LOMLOE determinan *qué* se pretende desarrollar y evaluar; la evaluación formativa, *qué evidencias recoger y qué hacer a continuación*; el diseño manipulativo/visual, *cómo crear oportunidades para comprender*.

## 2. Roles y responsabilidad final

| Rol | Acciones permitidas o propuestas | Límites |
| --- | --- | --- |
| **Alumno** | Resolver, manipular, explicar, revisar, solicitar apoyos y ofrecer autoevaluaciones | Nunca obligado a revelar información clínica para usar una actividad |
| **Tutor/agente de alumno** | Presentar retos, formular preguntas orientadoras, variar representación y dificultad dentro de límites docentes, registrar eventos mínimos | No atribuir autonomía, hacer diagnósticos ni emitir notas |
| **Motor de evidencias / agente evaluador** | Relacionar intentos y apoyos con criterios curriculares; generar hipótesis de error y propuestas explicables | No declarar adquirido un criterio sin la regla institucional y validación correspondiente |
| **Profesorado responsable** | Establecer criterios/rúbricas, validar o rechazar evidencias, intervenir y adoptar decisiones de evaluación/calificación según normativa | Siempre puede corregir o descartar inferencias automáticas |
| **PT y orientación** | Colaborar en medidas de apoyo, barreras de acceso, ajustes y seguimiento en el ámbito de sus funciones y permisos | Acceso limitado por necesidad y normativa; no sustituye automáticamente al docente responsable de la calificación |

**Human Gate:** la IA propone. El profesional autorizado revisa antes de decisiones de alto impacto (cambios de nivel relevantes, intervenciones significativas, informes oficiales y calificaciones). Deben quedar registrados persona/rol, fecha, acción, modificación y fundamento, con posibilidad de rectificación.

## 3. Qué registra la interacción y para qué

Un evento pedagógico futuro puede contener, como mínimo:
- organización/centro y referencia seudónima del alumno, actividad y versión;
- criterio curricular y competencia que la actividad pretende movilizar, con fuente y versión;
- acción del alumno, respuesta o explicación (con minimización/retención de contenido);
- intento y secuencia, sin confundir tiempo de respuesta con capacidad;
- modalidad (visual, escrita, audio si legalmente habilitada, manipulación, accesibilidad);
- tipo de apoyo: **de acceso** (lectura, teclado, mayor tiempo) frente a **de contenido** (pista conceptual, ejemplo, regla, solución);
- contexto **práctica no verificada**, **práctica supervisada** o **comprobación autónoma supervisada**;
- observación por rúbrica, incertidumbre y procedencia, evitando confianza inventada del LLM;
- propuesta del agente y eventual validación o corrección profesional.

No conservar transcripciones, grabaciones de voz ni datos sensibles por defecto. Determinar base jurídica, autorización, RLS por centro, retención, control por rol y registros de acceso antes de tratar datos reales de menores.

## 4. Regulación prudente de la dificultad

El tutor debe poder escoger entre:
1. **Consolidar**: mismo concepto, nueva representación para errores conceptuales recurrentes.
2. **Cambiar modalidad**: pasar de símbolo a fichas/balanza/recta; dar acceso sin reducir objetivos de forma injustificada.
3. **Andamiar**: una pregunta, un contraejemplo, una tarea más pequeña.
4. **Mantener y verificar**: cuando hay aciertos pero falta justificación o se sospecha dependencia de ayudas.
5. **Avanzar**: cuando varias evidencias consistentes justifican mayor complejidad.
6. **Solicitar revisión humana**: errores persistentes, barreras no aclaradas, información insuficiente o posible intervención significativa.

No fijar reglas universales tipo «tres aciertos → nivel superior» o «tres errores → nivel inferior». En MVP, el docente define límites; la decisión de paso depende de rúbrica, diversidad de tareas, ayudas y transferencia. Una secuencia sin supervisión externa jamás certifica que no se usó otra IA.

### Ejemplo: ecuaciones
1. Construye `x + 3 = 7` con caja y fichas.
2. Antes de quitar fichas: «¿Qué debe permanecer igual?».
3. Si retira 3 solo de un lado: mostrar desequilibrio y preguntar qué lo produjo; permitir deshacer.
4. Si retira 3 de ambos lados: pedir explicación breve.
5. Nueva representación `x + 5 = 9`; después introducir un cambio de estructura `2x + 4 = 10` si hay evidencia suficiente.
6. Proponer al docente una verificación independiente supervisada; la nota no se calcula aquí.

## 5. Dashboard del alumno — diseño

La vista prioritaria es el **mapa de criterios y competencias** con evidencias, estado de verificación y apoyos. Evitar porcentajes de «inteligencia», «atención» o «memoria» deducidos de clics, y semáforos sin rúbrica.

### Tarjeta por criterio
- **Referencia curricular**: territorio, etapa, curso, materia, criterio y versión (no inventar códigos oficiales).
- **Competencia vinculada**.
- **Estado formativo**: `sin_evidencias` | `en_proceso` | `evidencia_pendiente_revision` | `validado_por_docente`.
- **Qué muestra**: evidencia concreta (actividad, fecha, explicación/representación, tipo de ayuda).
- **Contexto**: asistido/no verificado vs supervisado; indicar claramente su procedencia.
- **Observación del agente**: hipótesis explicable, nunca «diagnóstico».
- **Próximo paso recomendado** y **validación** por profesional autorizado.

### Secciones complementarias
- **Evolución temporal del criterio**: intentos, apoyos y verificación; usar serie de eventos, no «progreso = respuestas correctas / total» sin matices.
- **Fortalezas observadas**: conductas concretas, vinculadas a una evidencia reciente («explica verbalmente un procedimiento»).
- **Aspectos a reforzar**: dificultades observadas y situadas («requiere ayuda para conservar la igualdad»), evitando etiquetas fijas tipo «débil en matemáticas».
- **Apoyos que han ayudado**: representación visual, ejemplos, preguntas orientadoras; separar preferencias de eficacia observada.
- **Intervenciones y supervisión**: sugerencias pendientes, cambios aceptados/rechazados, verificaciones programadas y responsables según rol.

**No convertir esos estados en calificaciones de boletín.** El profesorado integra esta información con el resto de evidencias para una valoración profesional contextualizada.

## 6. Modelo de datos conceptual (no implementado en Supabase)

```ts
type EvidenceContext =
  | "practice_unverified"
  | "teacher_supervised_practice"
  | "teacher_supervised_independent_check";

type SupportKind = "none" | "access" | "content_hint" | "content_example" | "full_solution";

type FormativeEvidence = {
  eventId: string;
  organizationRef: string;
  studentRef: string;
  activityId: string;
  activityVersion: string;
  criterionRef: string; // debe tener fuente curricular, curso y versión
  competencyRefs: string[];
  timestamp: string;
  actionRef?: string;
  responseRef?: string;
  context: EvidenceContext;
  supports: SupportKind[];
  observation?: string;
  agentHypothesis?: { text: string; evidenceEventIds: string[] };
};

type CriterionReview = {
  criterionRef: string;
  status:
    | "no_evidence"
    | "developing"
    | "pending_human_review"
    | "teacher_validated";
  supportingEventIds: string[];
  professionalDecision?: {
    action: "approve" | "modify" | "reject";
    reviewerRef: string;
    reviewerRole: "teacher" | "pt" | "guidance";
    scope: "formative_observation" | "support_plan" | "official_assessment";
    rationale: string;
    timestamp: string;
  };
};
```

El modelo es **un contrato de discusión**; en implementación, el backend debe autorizar cada combinación de `role` + `scope` según responsabilidades y normativa del centro, y verificar que las evidencias pertenecen a la misma organización. Nunca asumir que PT/orientación pueden validar cualquier calificación solo por existir su rol.

## 7. Escenarios de prueba y métricas

Pruebas sintéticas obligatorias:
- respuesta correcta con solución externa: registrar práctica no verificada, no certificar autonomía;
- razonamiento acertado con error de cálculo: no reducir todo a incorrecto;
- respuesta breve por barrera lingüística o dificultades de expresión: ofrecer otro modo de demostrar;
- buen resultado con ayuda de contenido: progreso asistido, no autónomo;
- apoyo de acceso (lectura/texto a voz) sin ayuda conceptual: no penalizar competencia;
- varias explicaciones y transferencia supervisada: permitir propuesta de revisión positiva;
- docente/PT/orientación discrepan: mostrar fuentes, permisos y resolución profesional, sin decidirlo el LLM;
- error en código curricular o evidencia incompleta: abstención y solicitud de revisión.

Medir: proporción de evidencias con procedencia completa, calidad de propuestas revisadas por docentes, cambios de nivel improcedentes, adecuación de apoyos, aciertos de abstención, discrepancias con rúbricas humanas, comprensibilidad del dashboard, tiempo ahorrado y perjuicios de accesibilidad. No confundir retención en el juego con aprendizaje.

## 8. Orden de desarrollo

1. Validar con el equipo docente el diseño de criterios, estados y permisos.
2. Mostrar dashboard con **datos ficticios**, sin sugerir que son métricas reales.
3. Construir una escena manipulativa mínima (balanza) y evento local de intento/apoyo.
4. Probar rúbricas y decisiones de adaptación en casos sintéticos; revisión humana.
5. Diseñar persistencia segura, RLS, auditoría y protección de datos antes de cualquier piloto real.
6. Integrar agente IA y RAG curricular con fuentes verificadas, límites y gates.
7. Pilotar con profesionales de forma controlada, evaluar resultados y corregir antes de ampliar.

Documentos relacionados:
- [Preguntas orientadoras](PREGUNTAS_ORIENTADORAS_EVALUACION_FORMATIVA.md)
- [Diseño de juegos manipulativos](JUEGOS_MANIPULATIVOS_INTERACTIVOS.md)
- [Arquitectura de agentes y Human Gates](WORKSHOP_AI_ENGINEER_PRO_2026-10-27.md)

**Principio:** «El agente acompaña y propone; las evidencias muestran; el equipo docente interpreta, valida y decide».
