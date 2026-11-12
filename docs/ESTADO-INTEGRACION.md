# Estado de la integración Mesias + Leonardo

Actualizado: 22 de septiembre de 2026.

Se recuperó el plan existente en `docs/INTEGRACION_MESIAS_LEONARDO.md` desde `circem81/NeuroAula-IA`, rama `main`, blob `7b4471d4ce9bf9f9f3862b343689ef8efcd34bc3`. El plan se había trabajado en la tarea «Analizar arquitectura modular». Este archivo distingue lo implementado de la arquitectura objetivo.

## Learning Twin v1

El motor, la evaluación por reglas del laboratorio, el resumen docente y las pruebas están implementados. El esquema está aplicado en Supabase de desarrollo. El laboratorio permanece ficticio y no persiste sus respuestas como alumnos reales. El adaptador interno de persistencia espera la integración de una actividad real autorizada. Véase [Learning Twin](LEARNING-TWIN.md).

No está cerrada toda la fase 1 del plan: quedan la vinculación curricular oficial validada, la revisión/rectificación de evidencias por el docente y el flujo real de actividades. La inmutabilidad actual exige diseñar correcciones mediante nuevas evidencias y trazabilidad, sin sobrescribir el historial.

## Fase 2: primera implementación

### Adaptador de modelos conectado

`src/lib/model-gateway.server.ts` define un contrato propio `EducationalModelAdapter`. El tutor, el analista y los especialistas lo utilizan. El adaptador disponible envuelve el proveedor OpenAI ya existente, conservando su configuración, límites de tokens, timeout, cuota por usuario y validación de salidas.

La interfaz añade límites de entrada (16 KiB de hechos y 8 KiB de instrucciones), copia los hechos para que un adaptador no pueda mutar las evidencias originales y valida su salida. No cambia automáticamente a otro modelo o servicio si falla. No añade herramientas externas ni da al modelo permisos de escritura sobre el Twin.

No hay todavía un motor local instalado ni un segundo proveedor implementado. Un futuro proveedor deberá cumplir y probar este contrato. Tampoco se ha añadido un cálculo monetario de costes: el control actual limita tokens y frecuencia, no euros.

### Memoria temporal implementada, todavía sin activar en la interfaz

`src/lib/conversation-memory.server.ts` ofrece un almacén experimental en memoria del proceso:

- Clave compuesta por centro, usuario autorizado, alumno, rol, conversación y criterio.
- Activación explícita; al revocarla se borra ese ámbito.
- Máximo 6 observaciones por ámbito y 200 ámbitos por proceso.
- Caducidad fija de 30 minutos desde su creación. Leer o añadir no prolonga la caducidad. Los datos caducados dejan de ser accesibles y se purgan en la siguiente operación; reiniciar el proceso también borra el almacén.
- Almacena únicamente código de actividad, intentos, resultado observado y nivel de ayuda. No admite conversaciones completas ni campos de texto libre.
- Borrado por conversación y por usuario para su integración con cierre de sesión.

Es un componente interno de servidor. No autoriza usuarios por sí mismo: el futuro manejador debe comprobar sesión, membresía y asignación antes de usarlo, y construir la clave con esos datos verificados. Un UUID enviado por el navegador no acredita autorización. Esta memoria no se ha conectado aún a endpoints ni a la UI; no existe ahora una recopilación adicional de conversaciones.

La memoria no escribe ni sustituye evidencia del Learning Twin. No es persistente ni distribuida y no debe presentarse como memoria longitudinal de producción.

## Verificación y siguientes pasos

Las pruebas cubren separación por los seis componentes de la clave, consentimiento, caducidad sin renovación, capacidad, borrado y referencias inmutables. Las pruebas del adaptador comprueban validación de salida, límites de entrada, protección de los hechos y ausencia de fallback automático. Se mantienen los tests de los agentes existentes.

Los siguientes incrementos son: activar la memoria mediante un flujo autorizado y revisable; implementar la actividad real que produce evidencia; definir rectificaciones trazables; y después abordar recuperación curricular con fuentes. El RAG y la inferencia local siguen pendientes. Todo el código nuevo de esta fase es propio: no se han importado módulos, prompts, pesos ni datos de los repositorios de referencia.
