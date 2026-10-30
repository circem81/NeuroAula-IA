# Contrato de evaluación formativa y metacognición — NeuroAula AI

**Estado:** propuesta de Etapa 0, documentada; NO implementada, NO desplegada, NO probada con alumnado real.  
**Fecha:** 30/10/2026.  
**Alcance:** transversal a Matemáticas (Newton), inglés, ciencias y español como lengua adicional.  
**Dependencias:** [primer agente de evaluación](AGENTE_EVALUACION_MVP.md) (PR #6) y [tutor Newton](TUTOR_NEWTON_RAG.md) (PR #2), ambos todavía en ramas de borrador. Este contrato no afirma que esos desarrollos estén fusionados.

## 1. Problema educativo observable

En una práctica de gramática inglesa B2 una persona puede: (a) acertar porque sabe explicar la regla; (b) acertar por familiaridad o intuición; (c) acertar tras descartar opciones; (d) equivocarse a pesar de conocer el contenido, o (e) aplicar de forma indiscriminada una regla a otra situación. Una única respuesta correcta no demuestra dominio estable; una incorrecta no demuestra, por sí sola, déficit conceptual, ejecutivo, dislexia ni ninguna condición clínica.

**Hipótesis de producto (no resultado validado):** una tutoría que recoja la respuesta y, de forma opcional, una breve autoexplicación de cómo se eligió, puede ofrecer refuerzo más pertinente que una secuencia fija de acierto/error.

No inferir una causa cognitiva a partir de tiempo, errores ortográficos, vacilaciones o resultados. Las estrategias autodeclaradas son lo que dice el alumno, no mediciones directas de procesos mentales.

## 2. Contrato pedagógico de una interacción

### Entrada y experiencia
1. Mostrar **una tarea por pantalla**, objetivo claro, dificultad graduable, opciones de apoyo accesibles y sin cronómetro por defecto.
2. Recoger respuesta; si es apropiado, pedir *opcionalmente* «¿Cómo llegaste a la respuesta?» con: `regla`, `intuicion`, `descarte`, `adivine`, `no_se`, `prefiero_no_decirlo`. No hacer obligatoria esta pregunta en cada intento.
3. Ofrecer autoevaluación *opcional* de seguridad: `alta`, `media`, `baja`, `omitida`.
4. Registrar pistas solicitadas, número de intentos y el criterio de corrección. Nunca convertir la velocidad por sí sola en nota o indicador clínico.
5. Mostrar feedback que explique el **porqué**, con una mejora concreta y trato no estigmatizante. Cuando el ejercicio sea abierto, permitir revisión humana.
6. Decidir el siguiente paso según evidencia suficiente, no por una etiqueta fija de alumno.

### Salidas posibles
- `avanzar`: acierto con evidencia suficiente y nuevo contexto.
- `transferir`: acierto con dudas o por descarte → problema análogo en otro contexto para verificar generalización.
- `contrastar`: respuesta que parece seguir una regla demasiado amplia → dos ejemplos breves que distingan casos.
- `pista`: duda o error → apoyo gradual sin revelar inmediatamente la respuesta.
- `puente`: errores persistentes → versión simplificada y vuelta al objetivo original.
- `revisar_docente`: baja confianza de la evaluación, intentos inconclusos, dificultades persistentes o riesgo de sesgo/adecuación pedagógica.

La política exacta y los umbrales se calibrarán con tareas ficticias y revisión de profesorado. No presentar una hipótesis de patrón como hecho demostrado.

## 3. Separar tres tipos de estado

- **Estado de ejecución (sesión):** tarea actual, fase Newton (`comprender → pensar → ejecutar → responder`), intentos, ayuda desplegada, siguiente acción y checkpoint. Puede vivir en el orquestador cuando exista.
- **Evidencia persistente (Supabase, futura):** eventos educativos mínimos con origen, versión y permisos por organización. La sesión no equivale al Learning Twin.
- **Learning Twin (futuro):** resumen longitudinal de *competencias educativas observadas*, actualizado solo desde evidencias validadas y con trazabilidad; conserva `insuficiente_evidencia` cuando proceda. Nunca diagnostica TDAH, TEA, dislexia, daño por sustancias ni «estilos de aprendizaje» inmutables.

### Contrato JSON orientativo (datos enteramente sintéticos)

```json
{
  "schema_version": "0.1.0",
  "event_id": "evt-ficticio-001",
  "organization_id": "centro-ficticio",
  "learner_ref": "alumno-sintetico-01",
  "session_id": "sesion-demo-01",
  "activity_id": "b2-past-perfect-001",
  "skill_id": "english.past_perfect.temporal_order",
  "source_revision": "ejercicios-originales-v1",
  "response": {"choice": "B"},
  "strategy_self_report": "intuicion",
  "confidence_self_report": "media",
  "supports_used": [],
  "evaluation": {
    "is_correct": true,
    "method": "answer_key",
    "feedback": "La acción anterior requiere past perfect.",
    "error_hypothesis": null,
    "evidence_status": "observed_single_attempt"
  },
  "next_action_proposal": "transferir",
  "human_review": {"status": "not_requested"},
  "persisted": false
}
```

Este esquema es un **contrato de diseño**, no una API existente ni una tabla creada. En un producto real, evitar guardar respuesta literal si basta un código, y excluir datos identificativos o sensibles no necesarios. Versionar el contrato y las rúbricas.

## 4. Reglas de decisión de un primer motor determinista (propuesto)

| Evidencia | Lo que se puede decir | Respuesta pedagógica sugerida |
| --- | --- | --- |
| Acierto + seguridad baja o descarte | Acertó; todavía falta comprobar transferencia | Nuevo ejemplo equivalente con contexto distinto |
| Acierto + explicación correcta | Hay evidencia de conocimiento en ese ítem | Espaciar y mezclar con otros contenidos |
| Error + autoexplicación de regla | La regla expresada puede contrastarse con el ítem | Ejemplo y contraejemplo; respuesta de nuevo |
| Error sin pasos ni explicación | Solo se ha observado una respuesta incorrecta | Pista y oportunidad de explicar; causa **no concluyente** |
| Errores reiterados en diferentes ítems | Posible dificultad de la competencia evaluada | Problema puente y propuesta revisable por docente |
| Evidencia ambigua o respuesta abierta | No hay evaluación automática sólida | Derivar a revisión humana |

**Criterio de seguridad:** ni el LLM ni la UI pueden convertir `intuicion`, `descarte`, tiempos de respuesta o faltas en una atribución clínica o rasgo permanente. No premiar ni penalizar una estrategia autodeclarada; sirve para decidir qué verificar después.

## 5. Integración con la arquitectura prevista

```text
Actividad original/licenciada (Newton, inglés, ciencias, español)
   ↓
Tutor Alumno: un paso + apoyos opcionales
   ↓
Respuesta + estrategia autodeclarada (opcional)
   ↓
Evaluador: comprobación determinista o rúbrica + incertidumbre
   ↓
Planificador pedagógico: avanzar / transferir / contrastar / pista / puente
   ↓
[Human Gate: docente aprueba/modifica/rechaza cuando procede]
   ↓
Evidencia validada → Supabase con RLS → Learning Twin longitudinal
```

- **Orquestador / LangGraph:** posterior y solo si la complejidad de estados lo justifica; los pasos iniciales pueden implementarse como funciones puras comprobables.
- **RAG:** recupera exclusivamente contenidos pedagógicos revisados, con licencia y nivel adecuados. El RAG no determina por sí mismo si una respuesta matemática o de opción múltiple es correcta.
- **Agente Evaluación:** la comprobación de ítems objetivos permanece en código (clave o cálculo). El modelo puede sugerir feedback y preguntas de seguimiento mediante esquema estricto; la causa del error se marca `no_concluyente` sin evidencias suficientes.
- **Agente Profesor:** recibe propuestas trazables y puede vetarlas. No se actualiza el Learning Twin con supuestos no validados.

## 6. Ejemplo de aplicación

**Inglés:** `By the time we arrived at the station, the train ___`. Respuesta correcta `had already left`, estrategia declarada `intuicion`. Se registra **un acierto**; el tutor propone después un ejemplo distinto para comprobar si distingue orden temporal de condicional hipotético. No concluye «domina el inglés B2».

**Newton:** problema de proporcionalidad de cuatro cuadernos por 12 € y siete por 21 €. Si alguien responde 15 €, solo consta «respuesta distinta a la solución». Si no hay pasos, **no se infiere** que confundió razón/proporción o cálculo. Dar pista, pedir procedimiento o proponer problema puente según contexto.

**Español como lengua adicional:** mismo contrato, con apoyos lingüísticos, visuales y lectura graduada; traducciones revisadas por docentes competentes y materiales autorizados.

## 7. Accesibilidad y salvaguardas

- Modo tranquilo, instrucciones breves y opción de escuchar/leer; una tarea cada vez; ayudas graduadas y control del usuario para pedir pistas.
- Ajustes de presentación según necesidades funcionales observadas y preferencias, **sin asignar condiciones clínicas**.
- Interacciones con alumnado menor requieren base jurídica, minimización, limitación de acceso, retención definida, permisos por rol y RLS probada por centro; no usar perfiles reales en demos.
- En centros sin conectividad, el motor determinista puede funcionar localmente si se valida su distribución offline; no prometer que el RAG o LLM en nube funcionarán sin red.

## 8. Pruebas sintéticas de aceptación (Etapa 0)

1. **Correcto por intuición:** registra acierto + estrategia declarada; ofrece transferencia, no diagnóstico.
2. **Correcto por regla:** explicación aportada y correcta; propone revisión espaciada sin concluir dominio definitivo.
3. **Incorrecto sin pasos:** etiqueta no concluyente; no inventa causa.
4. **Mismo error en varios contextos:** sugiere contraste/puente; deja hipótesis pendiente de evidencia adicional.
5. **Autoinforme ausente:** funciona sin obligar a declarar estrategia ni seguridad.
6. **Pista utilizada:** queda como evidencia de apoyo, no como fracaso.
7. **Corrección automática conflictiva:** no sobreescribe clave determinista; se bloquea salida dudosa y solicita revisión.
8. **Cambios de edad, idioma o presentación:** no cambian la corrección del contenido sin criterio curricular.
9. **Aislamiento RLS entre centros:** lectura/escritura cruzada prohibida; acceso solo por rol y pertenencia.
10. **Human Gate:** docente modifica o rechaza; evento queda trazado y ninguna hipótesis se convierte automáticamente en perfil.

## 9. Secuencia de implementación sin abrir demasiados frentes

1. **Primero:** aprobar este contrato pedagógico con una rúbrica y datos ficticios.
2. **Después:** incorporar `strategy_self_report`, `confidence_self_report` y `next_action_proposal` como datos **locales de prueba** del tutor de PR #2 o evaluador de PR #6, sin persistir información de alumnado y sin fusionar borradores sin revisión.
3. **Luego:** crear pruebas sintéticas y verificar que evaluación objetiva y clasificación de incertidumbre se mantienen separadas.
4. **Más adelante:** autorización de datos, tablas con RLS, revisión docente persistente y actualizaciones justificadas de Learning Twin.
5. **Finalmente:** RAG, adaptación multiárea y orquestación multiagente tras validar calidad de recomendaciones en el flujo mínimo.

**Definición de terminado para esta etapa:** contrato revisado y pruebas de ejemplo diseñadas. No equivale a funcionalidad en la web ni a un sistema adaptativo validado.
