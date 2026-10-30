# Agente LLM de Evaluación: primer piloto ejecutable

**Estado:** implementación propuesta en rama de desarrollo, desactivada por defecto. No es un despliegue ni un piloto con menores.

## Caso de uso fijo

- Problema: «Cuatro cuadernos cuestan 12 €. ¿Cuánto cuestan siete cuadernos?»
- Resultado exacto: 21 € (validación determinista, no depende del LLM).
- Entrada: número ficticio, sin nombres ni texto libre. Ejemplo para probar el agente: `15`.
- Salida: categoría orientativa de error, observación y pista, siempre con revisión docente pendiente.
- No se guardan respuestas, perfiles, datos personales, calificaciones ni eventos de Learning Twin.
- No hay LangGraph, multiagente, RAG o persistencia educativa en este piloto.

## Archivos

- `src/lib/evaluation-agent.ts`: contrato numérico, categorías y reconciliación determinista.
- `src/lib/evaluation-agent.server.ts`: adaptador exclusivo del servidor a Responses API.
- `src/lib/evaluation-agent.functions.ts`: función POST, autenticación Supabase, rol docente y límite básico por proceso.
- `src/routes/demo.actividades.tsx`: interfaz experimental dentro de la demo para docentes.
- `src/lib/evaluation-agent.test.ts`: casos de prueba sin gasto de API.
- `src/start.ts`: middleware CSRF para llamadas a funciones de servidor.

## Encendido deliberado

1. Configurar en el **servidor** `OPENAI_API_KEY` (nunca `VITE_OPENAI_API_KEY`).
2. Seleccionar `NEUROAULA_EVAL_MODEL` compatible con Structured Outputs; la plantilla propone `gpt-4.1-mini`.
3. Configurar `NEUROAULA_AGENT_DEMO_ENABLED=true` únicamente en entorno controlado.
4. Iniciar sesión con una cuenta de docente cuya membresía esté activa en Supabase.
5. Abrir `/demo/actividades`, escribir una respuesta **ficticia** y pulsar «Ejecutar agente LLM».

Sin la clave y la activación, la interfaz muestra un mensaje de falta de disponibilidad. No existe una salida falsa presentada como generado por IA.

## Controles de esta primera versión

- Entrada numérica acotada. El cliente no puede seleccionar prompt, modelo, actividad, usuario ni identificador de alumno.
- La respuesta correcta se decide mediante código: el LLM no puede cambiarla.
- Respuesta del modelo con esquema JSON estricto, validación posterior y error explícito si falta o es inválida.
- `store: false`, timeout, límite de tokens y desactivación por defecto.
- Autenticación verificada con `auth.getUser()` y membresía activa por centro/rol antes de realizar la llamada.
- CSRF de origen para funciones de servidor.
- Hasta cinco llamadas por minuto por usuario **en una instancia**. Este límite no es distribuido y **no protege un despliegue horizontal**; implementar un cupo persistente y presupuestos por organización antes de producción.
- Sin almacenamiento de texto ni difusión a terceros, salvo el envío del enunciado fijo y respuesta sintética al proveedor configurado.

## Pruebas y límites

Ejecutar `bun run check` en el repositorio y probar manualmente al menos: 21, 15, valor vacío, dato inválido, usuario no docente, agente apagado, fallo/red lenta y salida incorrecta del modelo.

**No probado en vivo durante esta propuesta:** sin credenciales ni acceso al entorno desplegado no hay validación real de la API. La nueva funcionalidad no debe considerarse operativa hasta que pase compilación, pruebas y una ejecución autorizada con la clave del servidor.

## Siguientes pasos (no incluidos)

- Revisión docente con aprobación, modificación y rechazo persistidos.
- Cuota robusta por centro, registros de coste/latencia sin datos identificables.
- Persistencia de evidencias y RLS para tablas educativas.
- Un flujo de tutoría y segunda oportunidad, más pruebas de calidad pedagógica frente a rúbricas humanas.
- Incorporar LangGraph **solo cuando la orquestación lo justifique**.
