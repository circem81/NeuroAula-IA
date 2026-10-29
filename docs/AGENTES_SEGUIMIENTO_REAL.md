# NeuroAula-IA · Agente tutor, decisión docente y seguimiento longitudinal

**Especificación de integración**. Última revisión: 29 de octubre de 2026. Documento de diseño, **no despliegue funcional de IA**.

## Decisión de producto

El prototipo por reglas `/tutor` constituye una prueba de interfaz y secuenciación, **no la solución final**. El producto objetivo debe disponer de:

1. **Agente tutor IA** que consulte el objetivo y las evidencias pedagógicas disponibles de un alumno autenticado y proponga la próxima actividad.
2. **RAG** sobre una biblioteca curada, versionada y autorizada; debe devolver el identificador, la licencia, el autor, la versión y la procedencia de cada recurso sugerido.
3. **Agente de evaluación** que produzca una hipótesis de error, evidencias y recomendación de siguiente paso, con incertidumbre explícita.
4. **Human-in-the-loop**: el docente asignado aprueba, modifica o rechaza actividades, cambios de itinerario y evaluaciones relevantes. El sistema no interpreta la ausencia de revisión como autorización.
5. **Seguimiento longitudinal** basado en intentos, apoyos, progresión y evidencias observables, no en diagnósticos ni pseudoevaluaciones psicológicas.
6. Acceso del alumno restringido a su plan aprobado y sus propios ejercicios; tutorías y datos de otros alumnos son inaccesibles.
7. Modalidad offline para centros con acceso restringido a internet, con servidor/modelo local autorizado o sincronización segura diferida únicamente si el centro lo permite.

## Estado comprobado de Supabase Neuroaula-ai-dev

Se inspeccionó la estructura de la base del proyecto `bofrtxjpyzfbbnyklkid` el 29/10/2026 mediante consultas de solo lectura.

Ya hay tablas con RLS para `organizations`, `organization_memberships`, `classrooms`, `classroom_teachers`, `learners`, `learning_activities`, `learning_activity_items`, `learning_attempts`, `learning_evidence`, `learning_assessments`, `learning_recommendations`, `learning_twin_state`, `learning_twin_evidence`, `learning_twin_reviews`, `agent_interactions` y recursos educativos.

En el momento de la comprobación había 1 organización, 1 alumno identificado por la tabla `learners`, 1 membresía, y **0 intentos, 0 recomendaciones, 0 evaluaciones, 0 interacciones de agentes y 0 estados Learning Twin**. El carácter real o sintético del registro de alumno no se ha verificado. No se ha leído ni expuesto su identidad.

**La existencia de tablas no equivale a funcionalidad operativa.** El frontend público continúa simulando las rutas de actividades y progresos. No hay orquestador conectado, ni inferencia IA, ni persistencia funcional de ejercicios.

## Contratos de flujo propuestos

### Entrada de orquestador

```ts
type TutorTurn = {
  organizationId: string; // verificado desde sesión, no desde datos confiados al cliente
  classroomId: string;    // el acceso debe comprobarse mediante membresía y clase
  learnerId: string;      // pseudónimo asociado a identidad autorizada
  approvedPlanId: string;
  activityId: string;
  previousAttemptId?: string;
  answer?: { itemId: string; value: string };
};
```

### Salida de recuperación RAG

```ts
type RetrievedResource = {
  resourceId: string;
  version: number;
  title: string;
  source: string;
  author: string;
  licenseStatus: "approved" | "unverified" | "restricted";
  curriculumCriterionIds: string[];
  learningPrerequisites: string[];
  approvedForLearner: boolean;
  excerpt: string;
};
```

Solo puede pasar a la inferencia un `RetrievedResource` aprobado y con permiso explícito para el uso previsto. Los materiales de Genially quedan como **referencia externa** hasta autorización documentada. No se indexan automáticamente.

### Salida propuesta de agente (no decisión ejecutiva)

```ts
type AgentProposal = {
  proposalId: string;
  learnerId: string;
  learningObjectiveId: string;
  evidenceIds: string[];
  nextActivityId: string;
  pedagogicalRationale: string;
  recommendedSupport: string[];
  potentialLimitations: string[];
  requiresHumanApproval: true;
  state: "pending_teacher_review";
  sourceResourceIds: string[];
  modelVersion: string;
};
```

**Regla de bloqueo:** ningún agente ni función cliente puede asignar una actividad distinta al plan aprobado o persistir una valoración definitiva sin un registro de `teacher_decision` de una persona autorizada. En la interfaz del alumno solo se presentan tareas preaprobadas por el docente. Se admiten pistas inmediatas de bajo impacto dentro de dicho plan.

### Decisión humana

```ts
type TeacherDecision = {
  proposalId: string;
  decision: "approved" | "modified" | "rejected";
  reviewedBy: string; // auth.uid() del profesorado autorizado
  reviewedAt: string;
  notes?: string;
  approvedActivityId?: string;
  traceId: string;
};
```

Las decisiones quedan auditadas con base legal, política de retención y controles de acceso aprobados por el centro; no se toman como datos clínicos.

## Revisión de seguridad pendiente antes de habilitar menores

- Las políticas RLS de algunas tablas permiten lecturas a docentes a nivel de organización: verificar restricción por **aula realmente asignada** y probar accesos cruzados.
- `src/lib/demo-session.ts` mapea actualmente la membresía `student` a perfil de demostración `family`; debe existir **rol de alumno real separado** antes de asignar cuentas individuales.
- Verificar que los roles de orientación y tutoría no reciben datos innecesarios de otras aulas o centros.
- Los alumnos no deben poder insertar ni modificar evaluaciones, decisiones docentes o `agent_interactions` directas; las escrituras de intentos deben hacerse por servicio autenticado con reglas verificables y auditoría.
- Evitar claves de servicio o proveedores IA en el navegador. Minimizar contexto enviado a modelos, evitar nombre, DNI, salud, antecedentes judiciales o consumo de sustancias en prompts.
- Comprobar autorización del centro, responsable y encargado de tratamiento, base jurídica, contrato y transferencias, EIPD cuando corresponda, periodo de retención, acceso, rectificación y eliminación.
- **Evaluación del Reglamento Europeo de IA**: el Anexo III incluye evaluación de resultados de aprendizaje cuando orienta la enseñanza; hacer clasificación jurídica y controles de sistemas de alto riesgo antes de puesta en servicio.
- Los apoyos para TDAH, TEA o dificultades cognitivas deben derivarse de ajustes pedagógicos observados y criterios profesionales, nunca de diagnósticos inferidos por la IA.

## Entregas necesarias

### Etapa A · Seguridad y contenidos autorizados
- Auditar y probar RLS aula/organización/alumno, definir roles.
- Obtener permisos de uso, adaptación, traducción, RAG y offline para materiales Newton; hasta entonces solo ejercicios propios.
- Revisar y aprobar glosarios e instrumentos con docentes y especialistas.

### Etapa B · Agente real con datos sintéticos
- Servidor con clave de IA protegida, orquestación LangGraph y estado separado de los datos personales.
- Retriever RAG con repositorio aprobado, referencias y control de versiones.
- Evaluación con modelos de resultados verificados y supervisión humana.
- Pruebas de prompts adversarios, recursos no autorizados, alucinaciones, errores matemáticos y trazabilidad.

### Etapa C · Centro piloto y persistencia real
- Decisiones docentes en `learning_recommendations`; registrar estado, autor y fecha.
- Persistir `learning_attempts`, `learning_evidence` y estados de `learning_twin_state` solo para estudiantes autorizados y con roles probados.
- Panel del docente con evolución temporal real y posibilidad de corregir/invalidar resultados.
- Prueba con alumnado del centro solo después de autorización institucional y revisión de privacidad; no cargar alumnos sin ella.

### Etapa D · Offline supervisado
- Paquete local de actividades autorizadas, API e indexación en red cerrada.
- Modelo local o servicio interno con recursos controlados y capacidad de auditar recomendaciones.
- Sin transferencia de identificadores a proveedores externos y con mecanismos de respaldo seguros.

## Criterios de aceptación (bloqueantes)

1. El alumno A no puede leer ninguna evidencia del alumno B ni de otra organización.
2. El docente no puede revisar alumnos de aulas a las que no está adscrito.
3. Un agente no puede activar un itinerario sin aprobación humana.
4. El RAG rechaza recursos con permiso no verificado y conserva trazabilidad.
5. Los ejercicios matemáticos se comprueban por procedimientos verificables además de la inferencia IA.
6. Un proveedor de IA caído no bloquea contenidos ya aprobados.
7. La respuesta incorrecta activa una estrategia pedagógica, no etiquetas clínicas.
8. Los paneles distinguen claramente datos simulados de información educativa real.
