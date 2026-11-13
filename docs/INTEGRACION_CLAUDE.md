# Claude + NeuroAula-IA — prototipo de libros interactivos

Estado: **implementación aislada en rama de revisión; pendiente de credenciales, pruebas de despliegue y fusión.** No se ha conectado ninguna cuenta de Claude del usuario ni se ha activado ningún cargo a la API.

## Qué se implementa

- Un taller de libros interactivos en `/demo/actividades` para perfiles docentes autorizados.
- Petición de **tema anónimo**, etapa y opción bilingüe español–árabe.
- TanStack Start envía esa entrada a un servidor que autentica la sesión con Supabase Auth y verifica una membresía docente activa.
- El servidor llama a la **Claude Messages API**, con `output_config.format` y un esquema JSON cerrado. La respuesta se valida también con Zod.
- El navegador representa tres páginas con ilustraciones geométricas SVG construidas de forma segura a partir de datos, tres preguntas de opción múltiple y retroalimentación.
- Las respuestas no se guardan en Supabase, no se asocian a alumnos ni tienen valor de calificación oficial.
- Una barrera temporal en memoria limita a cinco solicitudes por usuario y quince minutos **en cada instancia**; no es un límite distribuido ni un mecanismo de facturación.

## Activación en un servidor de pruebas (no en el navegador)

1. Crear una clave en [Claude Console](https://platform.claude.com/settings/keys). La suscripción de Claude como chat y el uso facturado de la API son productos diferentes.
2. Guardarla como secreto privado `ANTHROPIC_API_KEY` en el servicio que ejecute el backend de TanStack Start.
3. Opcionalmente, establecer `ANTHROPIC_MODEL=claude-sonnet-5-5`.
4. Configurar `CLAUDE_MATERIALS_ENABLED=true` solo cuando se haya aprobado el gasto previsto.
5. Verificar el despliegue SSR, la autenticación y las pruebas. No se usa ninguna variable `VITE_*` para los secretos.
6. Probar con un docente habilitado y **datos completamente sintéticos**, y comprobar que una sesión familiar, de orientación y una sesión anónima no pueden generar contenidos.

Sin clave o sin activación, la interfaz mostrará un error de configuración controlado; no consume tokens de la API.

## Límites de alcance

- **No es una conexión entre cuentas de ChatGPT y Claude.** Es una integración técnica entre un servidor de NeuroAula y la API de Anthropic.
- **No importa automáticamente Artifacts ya creados en la cuenta de Claude.** Publicar/insertar un Artifact requiere gestionar explícitamente el enlace y el dominio permitido; no se ha habilitado esa vía porque los materiales escolares pueden requerir privacidad y una política de revisión.
- Los dibujos del prototipo son **figuras geométricas SVG derivadas de datos estructurados**, no ilustraciones pictóricas generadas directamente por Claude ni código de Artifacts ejecutado en el navegador.
- No hay persistencia, biblioteca de libros definitiva, audio, actividades LOMLOE verificadas, RAG, personalización por alumno ni conexión con el Learning Twin.
- La revisión humana de textos, traducciones, accesibilidad y ciencia sigue siendo obligatoria antes de usar el material con estudiantes.

## Seguridad y requisitos antes de producción

- Mantener claves en servidor (secret manager), rotación y control de costes.
- Añadir un límite de gasto, cuotas globales persistentes, registro de uso por centro y alertas de abuso.
- Validar de forma estricta autorización por centro también para **cualquier nueva escritura o lectura**. Esta versión no escribe datos educativos.
- Usar solo temas anónimos; no enviar expedientes, evaluaciones, nombres ni diagnósticos de menores a APIs externas sin análisis de protección de datos y base jurídica adecuada.
- Fijar el modelo y la versión de API tras pruebas de integración con la cuenta real.
- Verificar la salida estructurada y el contenido pedagógico con una batería de casos evaluados por docentes.
- La aprobación o publicación de un libro debe ser una acción explícita del profesorado, nunca automática.

## Comprobaciones

```bash
bun install
bun run typecheck
bun run lint
bun run test
bun run build
```

Las llamadas a Claude requieren clave y habilitación, por lo que los tests del repositorio solo validan el contrato local; no constituyen una prueba extremo a extremo de la API.

## Recursos de referencia

- https://platform.claude.com/docs/en/api/overview
- https://platform.claude.com/docs/en/build-with-claude/structured-outputs
- https://support.claude.com/en/articles/9547008-publish-and-share-artifacts
