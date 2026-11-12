# Primer flujo del tutor

## Estado comprobable

El laboratorio se encuentra en `/demo/actividades` y requiere perfil docente.
Trabaja exclusivamente con una ecuación y respuestas ficticias predefinidas.
No utiliza los expedientes ni los nombres de la demo.

1. Seleccionar una respuesta a `2x + 3 = 11`.
2. Comprobarla mediante reglas independientes del modelo.
3. Preparar una pista programada o solicitar una propuesta al proveedor de IA.
4. Revisar la pista, las observaciones y el siguiente paso.
5. Aprobar o rechazar. Solo una pista aprobada aparece en la vista del alumno.
6. Reintentar: el nuevo intento necesita una nueva propuesta y revisión.

El resumen de intentos es determinista; no se presenta como un agente de IA.
La referencia `ALG-01 · v1` es material escrito para esta prueba, no una cita
curricular oficial ni una búsqueda RAG. Un acierto no acredita dominio y una
respuesta incorrecta no permite diagnosticar su causa.

## Configuración posterior

Añadir `OPENAI_API_KEY` y `OPENAI_MODEL` a `.env.local` y reiniciar el servidor.
Usar `OPENAI_MODEL=gpt-6-astra`. El conector solicita razonamiento `low` y
procesamiento Standard (`service_tier: "default"`). El acceso de la cuenta a Astra
debe verificarse con una respuesta real. Sin clave o modelo, la IA sigue desactivada.
El acceso del entorno de desarrollo no se reutiliza como credencial de la aplicación.
No pegar claves en conversaciones ni utilizar prefijos `VITE_` para secretos.

En alojamiento, configurar ambos valores como variables de servidor; la clave debe
ser un secreto. Las variables locales no se transfieren automáticamente a Sites.
La disponibilidad indica configuración presente, no una conexión verificada.
La primera respuesta real debe comprobarse antes de anunciar que la IA está activa.

El conector usa `POST https://api.openai.com/v1/responses`, `store: false`, un esquema
JSON estricto y un límite de salida. La petición contiene la ecuación, su referencia,
las respuestas predefinidas y observaciones; nunca la cuenta, el centro ni nombres.
`store: false` no equivale a una garantía de retención cero del proveedor.
Ver [Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs).

## Límites y permisos

- Cada generación valida la identidad en Supabase Auth y consulta las membresías
  activas. El servidor exige rol docente en el centro solicitado, sin confiar en
  el rol enviado por el navegador ni en `user_metadata`.
- No se usan claves privilegiadas de Supabase ni se modifican sus tablas o RLS.
- Solo se aceptan respuestas enumeradas; no hay campo para introducir datos reales
  ni instrucciones arbitrarias. El modelo no dispone de herramientas ni escritura.
- Máximo cinco peticiones por usuario y minuto por proceso, una simultánea, con
  tiempo límite inicial de 45 segundos para Astra y sin reintentos automáticos.
- Este límite no es una cuota distribuida: antes de un piloto, implementar límites
  compartidos, presupuesto de proveedor y observabilidad sin datos personales.
- Rechazos, respuestas incompletas o inválidas, desconexiones y errores de proveedor
  se muestran como fallo. Nunca se presenta una respuesta programada como generada.
- La revisión es una interacción local del laboratorio, no una autorización durable
  para mostrar contenido a un alumno real. El navegador puede modificar su propio
  registro; no es una prueba de auditoría.

## Persistencia de la prueba

`sessionStorage`, con versión y validación, conserva el ejercicio al recargar la
pestaña y separa cuenta, centro e idioma. Cerrar la pestaña normalmente lo elimina,
aunque la restauración de sesiones del navegador puede conservarlo. Reiniciar borra
el ejercicio de ese contexto. Si no hay almacenamiento disponible se informa al usuario.
No se escriben datos de aprendizaje ni aprobaciones en Supabase.

## Verificación y siguientes pasos

Las pruebas de `src/lib/tutor.test.ts` cubren permisos, entradas manipuladas,
corrección, revisión, reintentos, restauración, límites y errores HTTP con proveedor
simulado. No acreditan calidad pedagógica del modelo ni conectividad real.

Pendiente: configurar y probar la API; persistencia de servidor con aislamiento por
centro y revisión docente verificable; flujo real de alumnado; RAG con documentos
autorizados y evaluación pedagógica con el proveedor real. Los ocho especialistas
ya tienen flujos locales de borrador y revisión; la landing publicada todavía
muestra la representación conceptual anterior.


## Migración a GPT-6 Astra

`OPENAI_MAX_OUTPUT_TOKENS` y `OPENAI_TIMEOUT_MS` son opciones de servidor.
Astra usa inicialmente 4096 tokens y 45000 ms si se omiten; son valores para
una prueba acotada, todavía no calibrados con el proveedor real. Los tokens
incluyen razonamiento y JSON visible. Los rangos admitidos son 256–25000 tokens
y 1000–120000 ms, solo enteros. Una configuración inválida desactiva las llamadas.
El alojamiento debe permitir la duración configurada.

Se mantienen los esquemas y la revisión docente. Una salida incompleta, incluso
con JSON parcial válido, nunca se acepta. No hay reintentos automáticos.
Para otro modelo explícito, se preservan los valores anteriores (1200 tokens,
25000 ms) si no se configuran límites y no se envían opciones exclusivas de Astra.

Validación local: ejecutar `bun run check`. Las pruebas usan respuestas simuladas.
Después de configurar la clave, evaluar tutor y analista en español e inglés:
primer error, pistas progresivas, acierto y cinco intentos incorrectos. Comprobar
que las pistas no revelan la solución antes del acierto, las referencias a intentos
son reales, no se infieren diagnósticos y se exige revisión al agotar los intentos.
Medir coste, tokens y duración antes de un piloto; no hay todavía telemetría de uso
implementada. No anunciar disponibilidad verificada por la mera presencia de variables.

Para revertir, restaurar modelo y límites previamente validados; si no había
proveedor activo, vaciar `OPENAI_API_KEY` y reiniciar para usar el modo programado.

Fuentes: [migración oficial](https://developers.openai.com/api/docs/guides/latest-model)
y [presupuesto de razonamiento](https://developers.openai.com/api/docs/guides/reasoning#controlling-costs).

## Ocho especialistas educativos

El laboratorio de `/demo/actividades` incorpora los ocho especialistas de la
landing, además del tutor de pistas existente. No son ocho procesos autónomos:
el docente selecciona un especialista y el servidor realiza una única llamada.
Todos reciben el mismo ejercicio y hechos calculados a partir de intentos ficticios.

| Especialista | Resultado para revisar |
| --- | --- |
| Currículo | Objetivo, prerrequisitos por comprobar y secuencia; sin alineación curricular oficial |
| Evaluación | Criterios observables, evidencia y pregunta; sin calificaciones automáticas |
| Analítica de aprendizaje | Resumen de intentos, preguntas y siguiente paso validado |
| Funciones ejecutivas | Plan, lista de comprobación y opciones; sin perfiles cognitivos |
| Asistente docente | Intervención, pregunta y observación posterior |
| Asistente familiar | Borrador de mensaje, actividad opcional y límites; sin envío |
| Accesibilidad | Instrucción clara, opciones de presentación y preferencia por consultar |
| Investigación | Pregunta, método y limitaciones; sin búsqueda bibliográfica ni citas inventadas |

Cada rol tiene un contrato de campos específico y referencia al material interno
`NeuroAULA · ALG-01 · v1`. El analista reutiliza su proveedor y validación existentes.
Los otros siete pasan por el mismo conector de Responses, con esquema JSON estricto,
validación de longitud, campos permitidos, referencia interna e intentos citados.
Los textos se muestran como texto, nunca como HTML. La validación estructural no
acredita calidad pedagógica: sigue siendo necesaria la revisión docente.

La autorización exige sesión verificada y membresía docente en el centro. Se
comparte con el tutor el máximo de cinco peticiones por minuto y una simultánea
por usuario/proceso. No se invocan todos los agentes automáticamente. No se envía
el identificador del centro al proveedor. Los ejemplos programados funcionan sin
clave y están etiquetados como tales; un error de IA nunca se convierte en un ejemplo.

Las propuestas de especialistas viven solo en memoria del navegador. Cambiar
intentos o pistas, reiniciar, cambiar de cuenta/centro/idioma o recargar descarta
sus propuestas y aprobaciones. Una respuesta tardía de un panel desmontado se ignora.
Las propuestas aprobadas no se publican en la vista del alumno ni se envían a familias.
No hay acciones externas, expediente persistente, intercambio autónomo entre modelos
ni adaptación automática del sitio. El siguiente paso del ensayo permanece calculado
por reglas, incluyendo el cierre a los cinco intentos fallidos.

`src/lib/education-agents.test.ts` verifica los ocho contratos, ejemplos ES/EN,
enrutamiento, autorización, cuotas compartidas, rechazos, referencias inventadas,
contextos manipulados y revisión. Sigue pendiente la evaluación con una API real.
La publicación de Lovable no se modifica hasta desplegar estos cambios.
