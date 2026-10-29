# Tutor Newton y biblioteca RAG educativa — diseño incremental

## Origen y metodología

- Índice público de pepvidalg, Genially: https://view.genially.com/5f7e09dd1b2b330d2efa2489
- Proyecto Newton de Matemáticas para la Vida: cuatro fases `comprender → pensar → ejecutar → responder`.
- Inspiración de arquitectura (workshop AI Engineer PRO, 27/10/2026, Antonio Pérez Cano y Álvaro Moya): grafo de nodos y aristas, estado compartido, servicio IA encapsulado tras API, memoria persistente fuera de modelos, puntos de validación docente.

La bibliografía vinculada no implica que se hayan copiado o importado actividades de sus autores. Se respeta la autoría; toda reproducción o distribución del contenido del Genially requerirá verificar permisos/licencia.

## Etapa implementada: motor tutor por reglas (sin IA)

- `src/lib/newton-catalogo.ts`: 21 bloques de contenido o recursos observados en el índice. Su estado diferencia "prototipo" y "pendiente": actualmente solo **Proporcionalidad** tiene actividades propias.
- `src/lib/newton-tutor.ts`: estado del alumno ficticio en memoria, una tarea por turno y transiciones deterministas.
- `src/routes/tutor.tsx`: demo pública sin identificación y sin persistencia, un enunciado por pantalla, traducción árabe opcional, control de tamaño y modo tranquilo.
- `src/lib/newton-actividades.ts`: tres problemas originales de proporcionalidad; cuatro fases por problema = 12 decisiones evaluables. Se añaden problemas puente para refuerzo.
- El flujo es: respuesta correcta → siguiente fase o problema; primer error → pista; segundo error en la tarea → problema puente simplificado; si el puente se resuelve → se vuelve a la tarea principal; si hay dos errores en el puente → revisión docente recomendada.
- El historial solo incluye respuestas acertadas o no, apoyos utilizados y fases del problema; se mantiene temporalmente en la memoria de la página. No existen cuentas reales de alumnado ni almacenamiento.
- `src/lib/newton-tutor.test.ts`: pruebas de fases, catálogo, selección de problemas puente, bloqueo para intervención y finalización.

**No es un agente LLM**, y los datos mostrados no constituyen una medición científica del aprendizaje.

## Integración futura del índice completo

Cada recurso o actividad propia necesitará metadatos:
- `tema`, `subtema`, `etapa` (curricular y fase Newton), `nivel`, `habilidad`, `prerrequisito`, `formato`, `idioma`, `tipoDeApoyo`.
- `fuente`, `autor`, `licencia`, `version`, `revisadoPor`, `fechaRevision`, `disponibilidadOffline`.
- `respuestaEsperada`, `evidencias`, `erroresComunes`, `pistasGraduadas`, `criteriosDeProgreso`.

No debemos confundir la taxonomía de Genially con sus ejercicios internos: el índice da nombres de bloques, pero para incorporar cada actividad hay que conocer su contenido, nivel y permiso de reutilización. La indexación de materias no equivale a su integración.

## Arquitectura objetivo (pendiente)

1. **Acceso del alumno:** cuenta/rol de estudiante independiente de los roles de familia, permisos por centro, control de edad y acceso restringido. No habilitar acceso real hasta revisar permisos y RLS.
2. **Estado de ejecución:** grafo LangGraph, con `sesionId`, `actividadId`, `fase`, `intentos`, `apoyo`, `feedback` y `decisionSiguiente`, más checkpoints.
3. **Recuperador RAG:** busca solo material revisado, autorizado y de la etapa correcta; no incorpora automáticamente páginas externas. Vector/SQL y referencias documentales verificables; preferir ejercicios originales.
4. **Agente alumno/tutor:** explica, devuelve una tarea de la biblioteca y adapta la forma de presentación según evidencia sin hacer diagnósticos.
5. **Agente evaluación:** analiza la respuesta, clasifica errores de forma revisable y produce propuestas en JSON versionado, con criterios y grado de confianza.
6. **Agente docente:** recibe recomendaciones, puede aprobar, cambiar o bloquear una actividad, y fijar límites de dificultad y tiempo de pantalla.
7. **Learning Twin:** estado pedagógico longitudinal separado del historial de mensajes del LLM. No inferir TDAH, TEA ni daño por sustancias a partir de respuestas.
8. **Persistencia:** Supabase con RLS por centro, historial educativo mínimo, trazabilidad de decisiones, políticas de retención y evaluaciones de protección de datos antes de uso real.

En espacios sin internet, el RAG y las inferencias LLM de nube no funcionarán: sería necesario un servidor local autorizado, biblioteca y modelos locales o una versión determinista que opere sin conexión. Nunca abrir internet al alumnado para este propósito.

## Criterios antes de considerar el producto listo

- Completar contenidos originales o autorizados para todas las áreas.
- Validación de traducciones español/árabe con profesorado competente.
- Pruebas de carga cognitiva, accesibilidad, comprensión y apoyos con alumnado en contexto seguro.
- Pruebas de rutas, build, reglas pedagógicas y aislamiento por centro.
- Supervisión humana, evaluación de riesgos, consentimiento/legitimación, transparencia y seguridad.
- Validar las recomendaciones con docentes; no atribuir causalidad clínica a antecedentes de consumo de drogas.
