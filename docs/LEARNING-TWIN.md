# Learning Twin v1

El gemelo representa evidencias de aprendizaje en tareas y condiciones concretas. No describe quién es el alumno, no calcula un porcentaje de conocimiento y no diagnostica AACC, TDAH u otras condiciones.

## Implementación y alcance

- `src/lib/learning-twin.ts`: contrato validado, configuración, motor determinista, patrones, ayudas, estrategias, evolución e informe docente en español/inglés.
- `src/lib/learning-twin-demo.ts`: Evaluation Agent por reglas para la ecuación del laboratorio. Cada respuesta nueva genera una evidencia con fecha, identificador y ayuda registrada en ese momento.
- `src/components/learning-twin-summary.tsx`: resumen pedagógico en `/demo/actividades`. No muestra mastery ni confidence numéricos.
- `src/lib/learning-twin-store.server.ts`: lectura autorizada y punto de integración de evaluaciones reales con persistencia transaccional.
- `supabase/migrations/20260921074103_learning_twin_v1.sql`: esquema aplicado a `Neuroaula-ai-dev`, el proyecto configurado en este repositorio. La migración se creó con la CLI y se alineó con la versión asignada por Supabase al aplicarla.

El flujo activo del laboratorio es respuesta ficticia → evaluación por reglas → evidencia → motor → resumen docente determinista. Las pistas de IA y los ocho especialistas existentes conservan su revisión docente. Su salida no modifica el gemelo. El resumen nuevo no requiere una llamada a IA.

**El laboratorio sigue siendo ficticio, por pestaña.** Reiniciarlo borra esa prueba. No guarda sus respuestas en Supabase, ni las asigna a un alumno real. Los registros antiguos sin identificador y fecha no se convierten retroactivamente en evidencia. La persistencia para alumnos reales está implementada como integración interna de servidor, pero no hay todavía una pantalla/endpoint de actividad real que la invoque. No se ha publicado el frontend.

## Evidencia y cálculo

La evidencia incluye centro, alumno, actividad, criterio, materia, acierto, razonamiento, ayuda, transferencia, intentos, error observado, estrategias, fiabilidad del evaluador y fecha. `null` significa **no observado**, no cero. Una opción seleccionada permite comprobar el acierto; no permite inventar razonamiento, causas del error ni estrategias.

Escalas de ayuda: 0 sin ayuda, 1 reformulación, 2 pista conceptual, 3 ejemplo análogo, 4 procedimiento guiado, 5 solución dirigida. Transferencia: 0 reproducción, 1 tarea similar, 2 contexto diferente, 3 problema nuevo, 4 espontánea. La transferencia agregada usa solo respuestas correctas con transferencia observada.

La primera pista programada se registra como conceptual; la segunda, como procedimiento guiado. Una pista de IA sin clasificación de ayuda se registra como nivel desconocido. La ayuda se congela al responder; revisar una pista después no reescribe el pasado.

Toda la configuración del cálculo está en `LEARNING_TWIN_CONFIG`:

```text
quality = 0.30 × acierto + 0.25 × razonamiento
        + 0.20 × independencia + 0.15 × transferencia normalizada
        + 0.10 × fiabilidad
alpha = 0.25 × fiabilidad / sqrt(intentos)
mastery = mastery_anterior × (1 - alpha) + quality × alpha
```

El estado inicial es cero con confianza cero. Las dimensiones desconocidas no aportan crédito; esta es una decisión conservadora explícita, no una evaluación negativa del alumno. La fiabilidad cero no cambia mastery. Los pesos son heurísticos pendientes de validación pedagógica; no son probabilidades calibradas. No se añade dificultad porque el MVP aún no dispone de una escala validada de dificultad por tarea.

La confianza usa cantidad de actividades distintas (objetivo 20), diversidad (objetivo 8), consistencia, fiabilidad, completitud y recencia de esas actividades. Solo la última evidencia de cada actividad cuenta como muestra independiente. Tres actividades no alcanzan confianza alta, por muchos reintentos que haya. La semivida de confianza es 90 días por evidencia. Leer meses después reduce confianza sin cambiar el dominio histórico. El adaptador de lectura recalcula el estado; `learning_twin_state` es una caché fechada, no una fuente actualizada continuamente.

Las tendencias comparan dos grupos de tres actividades distintas dentro de 56 días. Con menos datos se devuelve `insufficient_evidence`. Se conservan recuentos de 14 días, 56 días y todo el historial registrado. Este último no se presenta como «curso escolar»: aún no se filtra por calendario de curso.

Los errores pasan a patrón emergente con al menos 3 observaciones en 2 actividades; a consistente con al menos 6 en 3 actividades durante 14 días. Se evalúan sobre la ventana de 56 días para que un patrón antiguo no se afirme como actual. Las categorías son configurables por materia mediante `ERROR_TYPES` o una taxonomía explícita en el motor. `requires_human_review` está reservado para revisión humana, sin automatismos diagnósticos.

La respuesta a ayudas compara pares explícitos de intentos consecutivos de la misma actividad. Un par no puede usarse dos veces. Se guarda el cambio observado de acierto, que puede ser negativo; sin par, la mejora es desconocida. No se afirma causalidad. Las estrategias se guardan ligadas a evidencias concretas, nunca como estilos permanentes.

## Supabase y trazabilidad

La base ya contenía `learning_evidence` con notas porcentuales y observaciones. Se conserva íntegra. El contrato nuevo vive en `learning_twin_evidence`, con vínculo opcional a una evidencia previa del mismo alumno, centro y actividad. No se convierte una nota anterior en razonamiento ni en dominio.

Tablas normalizadas:

- `learning_twin_criteria`: catálogo por centro con código, materia y etiqueta. Los códigos internos del laboratorio no afirman alineación LOMLOE.
- `learning_twin_evidence`: hechos inmutables; un trigger impide actualización y borrado ordinarios, incluso mediante el escritor. La rectificación/retención administrativa requerirá un flujo específico posterior.
- `learning_twin_state`: un estado por centro, alumno y criterio.
- `error_patterns`, `strategy_observations`, `support_effectiveness`: agregados y observaciones separados.
- `learning_twin_agent_events`: un evento por evidencia incorporada, con versión del motor y número de evidencias.

Las claves foráneas compuestas validan centro, alumno, actividad y matrícula. RLS permite lectura a docentes activos del centro y deniega acceso a otros centros, alumnado, anónimos y otros roles. No se abre un flujo de orientación en esta versión. Esta autorización es por centro, como el MVP; no hay todavía asignación de docentes a aulas.

Ningún navegador tiene permisos para escribir evidencia o estado. `commit_learning_twin_v1` es `SECURITY INVOKER`, ejecutable solo por `service_role`. Revalida la membresía docente, adquiere un bloqueo transaccional y compara el número esperado de evidencias. Evidencia, estado, patrones y evento se confirman en una sola transacción. Ante conflicto, el servidor recarga y recalcula hasta tres veces. Reenviar el mismo ID y contenido es idempotente; cambiarlo se rechaza.

### Integración con actividades reales

1. Crear el criterio y su materia desde un entorno administrativo autorizado y vincular la actividad real al alumno matriculado.
2. El servidor de la actividad debe recuperar la asignación y rúbrica, derivar el alumno y criterio autorizados y evaluar la respuesta. No aceptar estos datos ni la confianza del evaluador como verdad enviada por el navegador.
3. Llamar a `recordEvaluatedEvidence(requestClient, writer, evidence, classroomId)`. `requestClient` lleva la sesión validada por `auth.getUser()`; `writer` es un cliente Supabase de servicio exclusivamente de servidor. La función verifica membresía y acceso a recursos con el cliente de petición antes de usar el escritor.
4. El escritor privilegiado solo se usa para la transacción del motor. Es una excepción acotada al acceso general mediante cliente de petición descrito en `AUTHENTICATION.md`; los demás accesos siguen sujetos a RLS. No se ha añadido ninguna clave de servicio al repositorio ni al frontend.
5. Leer con `readLearningTwin(requestClient, scope)` y producir `twinTeacherReport`. Una futura narración por IA podrá consumir este informe como hechos, sin recibir permisos de actualización.

El modelo de lenguaje puede proponer evidencia estructurada, pero validarla sintácticamente no verifica su veracidad. El endpoint futuro deberá cotejar la rúbrica y las señales observadas. Esta versión conecta una evaluación determinista para la actividad ya disponible; no añade una evaluación libre de razonamientos por IA.

## Verificación

`bun run test` incluye los ocho escenarios solicitados, decaimiento temporal, aislamiento lógico, orden temporal, idempotencia, validación y pruebas del adaptador de servidor. `bun run typecheck`, `bun run lint` y `bun run build` verifican la aplicación.

`supabase/tests/learning_twin_v1.sql` se ejecutó en el proyecto de desarrollo, antes de aplicar la migración y después. Usa una transacción con rollback: prueba la escritura de servicio, reintentos, conflicto de concurrencia, inmutabilidad, auditoría, rollback de escritura parcial, acceso docente y denegación entre centros, alumnado y anónimos. No deja alumnos ni respuestas de prueba.

El asesor de seguridad no detectó nuevos avisos del Learning Twin. Sigue el aviso previo de Auth sobre [protección contra contraseñas filtradas](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection), ajeno a esta migración.
