# Cómo usar esta entrega desde la carpeta vinculada

Esta guía se ha añadido a la carpeta original para que puedas leerla junto con el código, sin ZIP ni fragmentos de texto. Empieza por AGENTS.md, README.md y esta guía; después revisa la documentación en docs/ y los archivos pertinentes en src/ y supabase/.

La guía de abajo se preparó al crear una copia ZIP. Cuando menciona el ZIP o su manifiesto, describe aquella copia: esos archivos de entrega no tienen por qué estar dentro de esta carpeta. Para el trabajo actual utiliza los archivos presentes aquí y comprueba el estado de Git antes de editar. No restaures una versión de GitHub sobre los cambios locales.

## Alcance de la transferencia

- Disponible en esta carpeta: código local, documentación, pruebas, configuraciones y recursos que realmente estén presentes y accesibles. La carpeta artifacts/ contiene además material audiovisual local que se excluyó del ZIP.
- GitHub: https://github.com/circem81/NeuroAula-IA
- Esta guía recoge el contexto conocido de este chat y la documentación revisada; no es un historial completo del proyecto.
- Pendiente de incorporar: conversaciones e instrucciones del proyecto de ChatGPT no facilitadas, decisiones no documentadas y archivos que existan únicamente en ese proyecto.
- No leas ni reproduzcas credenciales, archivos .env locales ni datos personales para elaborar el resumen. Usa .env.example para conocer la configuración.
- No acceder a Drive o Gmail para completar los huecos. Identifica lo que falta y pídelo a la usuaria.

## Primera tarea

Confirma los archivos que puedes consultar. Entrega un inventario breve, el estado comprobable del proyecto y una lista de contexto pendiente. Distingue funciones verificadas, afirmaciones de la documentación y supuestos. No modifiques código, apliques migraciones, publiques cambios ni actives servicios de pago en esta primera revisión.

---

# NeuroAULA AI — entrega para Claude

Preparado el 12 de noviembre de 2026 a partir de la carpeta local de código.

## Repositorio y copia de trabajo

GitHub: https://github.com/circem81/NeuroAula-IA
Rama local: main.
Último commit local observado: 6e22244 — Configure NeuroAula Sites hosting.
Carpeta original: /Users/circemonzoncaballero/Documents/Proyecto NeuroAULA AI Codigo

El ZIP contiene una copia de los archivos actuales, incluidas modificaciones y archivos nuevos sin commit. No es una descarga de GitHub: el enlace por sí solo puede no contener estas novedades. No se ha consultado el estado remoto actual ni se han publicado cambios. No se incluye el historial .git.

## Qué es el proyecto

Según README.md, es un prototipo web de plataforma educativa adaptativa con landing en español e inglés y demo identificada como datos simulados. Usa React 19, TypeScript, TanStack Start/Router/Query, Vite/Nitro, Tailwind CSS, componentes Radix, Recharts y Supabase para autenticación y permisos por organización.

El código y la documentación incluyen tutor con pistas, especialistas educativos, evaluación determinista, Learning Twin, revisión docente trazable, un recorrido MVP y libros interactivos con vista 3D opcional. Hay un adaptador de proveedor de IA de servidor, pendiente de configuración y validación real según el README. La presencia de una función en el código no demuestra que esté desplegada o funcionando en producción.

## Límites y pendientes documentados

- La demo usa información sintética. No introducir datos personales reales del alumnado.
- El flujo visual del MVP todavía debe conectarse a una operación de servidor persistente y autorizada.
- RAG, integraciones LMS y publicación de libros siguen pendientes según la documentación.
- Algunas notas, como docs/ESTADO-INTEGRACION.md, pueden corresponder a etapas anteriores. Contrastar cada afirmación con el código actual y con pruebas.
- En esta entrega solo se inspeccionaron archivos y se empaquetó el proyecto. No se ejecutaron pruebas, compilación, migraciones ni despliegues.

## Contexto aportado en este chat

La usuaria utiliza un MacBook M1 de 8 GB y quiere explorar herramientas para desarrollar NeuroAULA AI sin activar servicios de pago por accidente. Ollama está instalado; descargó qwen3:0.6b y obtuvo una respuesta local. Esto no significa que Ollama esté integrado en la aplicación. No activar proveedores ni gastar créditos sin una decisión explícita.

No se han leído las conversaciones del proyecto original de ChatGPT. Esta guía no sustituye sus decisiones ni instrucciones: pedir el resumen o los documentos si falta contexto.

## Instrucciones para Claude

1. Confirma qué archivos de esta entrega puedes leer. Lee AGENTS.md, README.md y los documentos relevantes antes de proponer cambios.
2. Explica el estado del proyecto en español sencillo, separando lo implementado, lo simulado y lo pendiente de validar.
3. Respeta la conexión con Lovable: no hacer force push ni rebase/amend/squash de commits publicados. Los commits enviados a la rama conectada se sincronizan con Lovable.
4. Conserva los cambios locales y los archivos nuevos; no sobrescribirlos con una clonación anterior del repositorio. Hay archivos con sufijo « 2» que deben revisarse antes de asumir que son duplicados prescindibles.
5. No conectar Drive ni Gmail para esta revisión. Trabajar con los archivos entregados.
6. Propón un siguiente paso pequeño y revisable antes de cambiar código, publicar o aplicar migraciones.

## Archivos iniciales de lectura

- AGENTS.md y README.md
- package.json y pnpm-lock.yaml
- docs/AUTHENTICATION.md
- docs/TUTOR.md
- docs/LEARNING-TWIN.md
- docs/MVP-END-TO-END.md
- docs/INTERACTIVE-BOOKS.md
- docs/INTEGRACION_MESIAS_LEONARDO.md y docs/ESTADO-INTEGRACION.md
- src/routes/demo.actividades.tsx
- src/lib/model-gateway.server.ts

El README indica que la integración de libros requiere pnpm install --frozen-lockfile, porque bun.lock aún no incluye Three.js. Revisar esta indicación antes de instalar dependencias.

## Contenido y exclusiones

Se incluyen código, documentación, pruebas, migraciones y recursos del proyecto presentes en los archivos seguidos por Git y los archivos nuevos no ignorados. Se excluyen dependencias, archivos ignorados, historial Git, credenciales locales y la carpeta artifacts de vídeos/locuciones. En .env.example se sustituyen los valores de claves y URL por ejemplos, manteniendo las variables de configuración. El código original no se modifica.

El paquete incluye un manifiesto con tamaños y hashes SHA-256 y el estado local de Git. La comprobación automatizada de patrones comunes de credenciales no encontró coincidencias en los archivos incluidos; no equivale a una auditoría de seguridad completa.
