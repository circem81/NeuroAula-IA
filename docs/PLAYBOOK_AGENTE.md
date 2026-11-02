# Agente con playbook — evaluación formativa (MVP de reglas)

**Estado:** prototipo ejecutable en la demo, con datos sintéticos. No es un agente LLM,
no accede a Supabase, no realiza diagnósticos ni evalúa oficialmente al alumnado.

## Objetivo y entrada

Primer proceso vertical de `docs/WORKSHOP_AI_ENGINEER_PRO_2026-10-27.md`:
comprobar una respuesta de matemáticas, preparar ayuda y retener la propuesta
para revisión del profesorado.

Entrada tipada: `{ activityId, answer }`. Solo se admite
`demo-enteros-2eso-01`, asociado al ejercicio simulado
`−8 + (−5) − (−3)` (solución comprobable: `−10`).
La referencia `DEMO-ENTEROS-2ESO-01` es **ficticia**;
no sustituye los criterios curriculares oficiales de la LOMLOE.

## Playbook y criterio de «trabajo terminado»

El motor realiza ocho comprobaciones expresadas mediante verdadero/falso,
una explicación por punto y una salida tipada:

1. Existe una actividad registrada para esta rúbrica.
2. La referencia curricular está explícitamente etiquetada como DEMO.
3. La respuesta admite una lectura segura como entero.
4. La solución de referencia es matemáticamente consistente.
5. La comparación está anclada en la respuesta aportada.
6. La retroalimentación se basa en una regla comprobable, sin inferir
   diagnósticos, intenciones ni perfiles psicológicos.
7. No se necesitan ni recopilan datos identificativos del alumnado.
8. La propuesta no puede publicarse sin una revisión docente posterior.

**Regla de entrega:** si algún punto no se supera, la ejecución devuelve
`needs_input` y no prepara ayuda educativa no fundamentada.
Si todos se superan, devuelve `pending_teacher_review`, **nunca**
`published` ni `graded`. `publicationEnabled` permanece `false`.

La única corrección automática actual es inocua: normalización del signo
menos Unicode y de espacios exteriores antes de validar. Si la respuesta
no se interpreta con seguridad, el agente **se abstiene**, en lugar de
inventar un número o una causa del error. Respuesta incorrecta no
equivale a un diagnóstico de por qué se equivocó el alumno.

## Dónde probarlo

La pantalla protegida `/demo/adaptativo` contiene la caja
«Agente con playbook · prueba interactiva».
Puede escribirse `−10` (correcta), `−16` (incorrecta) o `dos`
(no interpretable) y pulsar «Ejecutar y revisar».
La lista visible muestra los ocho estados, la evidencia disponible,
las correcciones inocuas aplicadas y la puerta docente pendiente.

La ejecución es local y efímera: **no hay persistencia**, llamadas a
un modelo, RAG ni aprobación humana reanudable. El botón de la demo
no representa un consentimiento o revisión docente real.

## Contratos en código

- `src/lib/playbook-agent.ts`: contrato, motor y ocho verificaciones.
- `src/lib/playbook-agent.test.ts`: casos correctos, incorrectos,
  malformados, actividad desconocida y normalización.
- `src/components/playbook-agent-demo.tsx`: interfaz local.
- `src/routes/demo.adaptativo.tsx`: integración.

## Para avanzar del prototipo a un agente real

1. Introducir rúbricas y criterios oficiales versionados y validados;
   no utilizar códigos DEMO como si fueran LOMLOE reales.
2. Ejecutar en el backend con autenticación, separación por centro,
   comprobaciones de rol y pruebas de aislamiento con RLS.
3. Añadir un clasificador o LLM tras un contrato de salida y evidencias
   consultadas, límites de coste y abstención ante incertidumbre.
4. Sustituir la puerta visual de revisión por un **human gate real**
   que pause, guarde, autorice y audite las decisiones docentes.
5. Registrar evidencias anonimizadas o seudonimizadas autorizadas,
   comparar con rúbricas de profesionales y medir errores, sesgos,
   efectividad del refuerzo y seguridad antes del piloto.

Pruebas previstas en la raíz del repositorio:
`bun run typecheck`, `bun run lint`, `bun run test`, `bun run build`.
