# Libros interactivos dentro de NeuroAula

Revisión: 29 de octubre de 2026. Primera integración en el recorrido existente de
`/demo/actividades`, accesible a docentes. No se crea otra aplicación, cuenta,
backend, ruta pública de alumnos ni proyecto Supabase.

## Auditoría del repositorio externo

Origen: https://github.com/csepulvedai/libro-3d-interactivo

Árbol de origen inspeccionado: `69b81fe00aaa261cce510f30bd9b32fb40e1b619`.
Identidad del blob original `book.js`: `10883600fb84f7b425db6f2532f4f2eb75abfae6`.
Licencia verificada por su texto completo: MIT, copyright 2026 Cristian
Sepúlveda-Irribarra. Permite uso, copia y adaptación conservando el aviso y la
licencia. Se incluyen ambos en `src/lib/interactive-book/LICENSE`, cabecera del
motor y `public/licenses/libro-3d-interactivo.txt`, enlazado desde la interfaz.
Las futuras imágenes, fuentes, audios o documentos requieren revisión individual;
la licencia del motor no concede derechos sobre cualquier contenido añadido.

Es una skill con plantilla, no un paquete React. La raíz contiene README, LICENSE,
SKILL, `assets/plantilla`, `scripts/nuevo-libro.mjs`, `references`, `evals` y el
ejemplo chileno `examples/ondas-y-sismos`. No se instala la skill ni se ejecutan sus
instrucciones para crear un proyecto separado.

La plantilla usa JavaScript ESM, Three.js `^0.170.0`, Vite `^5.4.11`,
`vite-plugin-singlefile ^2.0.3`, Source Serif 4 y Caveat de Fontsource `^5.1.0`.
Incluye package-lock. `core/` separa libro, escena, tinta, páginas HTML, progreso,
sonido, narración, cursor, rótulos, animaciones e interfaz. `spreads/` contiene
portada, ejemplo y cuestionario; `libro.config.js` configura título y apariencia.
La escena combina WebGL, CSS3D y CSS2D. La plantilla toma el tamaño de ventana y
usa estado global; no está preparada directamente para montajes React repetidos.
`page.js` construye HTML interpolado: no se usa con contenido generado o RAG.

Ejecución original documentada: Node 18+, `npm ci` dentro de la plantilla,
`npm run dev` en puerto 5174, `npm run build`, `npm run preview` en 4174.
El build original produce HTML autocontenido. Requiere WebGL 2 para 3D.
Narración opcional: herramientas con Gemini y ffmpeg. No se ejecutó ese servicio
ni se transfirió contenido educativo a Gemini. El ejemplo OA 13 chileno no se
presenta como currículo LOMLOE validado.

## Qué se reutiliza y adapta

| Pieza                                | Decisión                                                                                                                    |
| ------------------------------------ | --------------------------------------------------------------------------------------------------------------------------- |
| `core/book.js`                       | Reutilizado y adaptado: tapas, textura procedural, hojas, lomo, cinta, CSS3D y giro de página.                              |
| `scene.js:canvasTex`                 | Extracto adaptado a TypeScript con comprobación de contexto.                                                                |
| Configuración global del libro       | Parámetro por instancia; no se importa el config educativo original.                                                        |
| Escena y animaciones                 | Adaptador propio al contenedor React, carga dinámica cliente, ResizeObserver, movimiento reducido y liberación de recursos. |
| Páginas y actividades                | React y datos de NeuroAula; texto plano, sin `innerHTML` ni código recibido de IA.                                          |
| Progreso y sellos externos           | No se importan; se conserva el circuito MVP y Learning Twin. Pasar página nunca acredita aprendizaje.                       |
| Narración, cursor, sonidos y fuentes | Pendientes; no se añaden dependencias, API keys ni cargas externas para ellos.                                              |
| Vite independiente y singlefile      | No se incorporan: el módulo usa el build de NeuroAula.                                                                      |

Se añaden Three.js y sus tipos en versión exacta 0.170.0 para conservar la API
revisada. Se actualiza `pnpm-lock.yaml`. Three.js es MIT y su paquete mantiene su
licencia. No se copian el lockfile ni las versiones antiguas de Vite del origen.
El lockfile Bun previo no se regenera en esta sesión: para reproducir esta
integración utilizar **pnpm install --frozen-lockfile**. Unificar el gestor antes
de un despliegue que actualmente instale con Bun.

## Capacidad implementada

`interactive-book.ts` define un primer libro sintético versionado de álgebra:
predicción conceptual, exploración con ayuda y desafío. Está unido a la actividad
ALG-01 que ya corrige el MVP; no se crea un segundo evaluador.

La lectura HTML funciona sin WebGL. El docente puede activar una visualización 3D
complementaria, desactivarla o seguir leyendo si falla. Todos los controles y la
actividad permanecen en HTML accesible. La versión inicial tiene contenido en
español también cuando la interfaz general está en inglés; traducción pendiente.

Abrir la página de ayuda eleva la ayuda observada a nivel conceptual (2), sin
rebajar ayudas previas. El envío congela la ayuda, añade contexto del libro
(ID, versión, página de actividad, fuente y presentación) al intento y enlaza con
la evaluación/evidencia existente. El contexto sobrevive al almacenamiento y
restauración locales. Los intentos anteriores sin contexto siguen siendo válidos.

La vista docente conserva aprobación y corrección append-only. Solo después de
una revisión se propone repaso o explicación, usando la corrección efectiva. El
docente abre expresamente la propuesta; no hay publicación ni adaptación
autónoma. Es una regla local, no una decisión de un LLM ni una adaptación basada
en diagnósticos. Las dimensiones no observadas de la evidencia quedan vacías.

## Encaje con la arquitectura actual y siguiente contrato

1. **Alumno**: el mismo recorrido de actividad recoge respuesta y ayuda. En esta
   fase es una simulación docente; no hay nuevas autorizaciones para alumnos reales.
2. **Evaluación**: se reutiliza `submitMvpAnswer`; respuesta → evaluación → evidencia
   → Learning Twin. La procedencia del libro queda en el intento, unido a la
   evaluación por `attemptId` y de ahí a la evidencia por `evidenceId`.
3. **Learning Twin**: el libro no escribe dominio ni confianza; utiliza el motor
   actual. La corrección conserva la evidencia original y recalcula el estado efectivo.
4. **Profesor**: revisión existente obligatoria, historial y propuesta explícita.
   La revisión del contenido del libro antes de publicar requiere un flujo futuro
   distinto de la revisión de las respuestas, y no se afirma implementada.
5. **RAG curricular (diseño, no conectado)**: recuperar solo fuentes autorizadas
   para centro/materia/curso. Cada fragmento deberá conservar documento, versión,
   hash, localizador/página, criterio curricular y permisos. Producir datos
   estructurados para páginas y actividades, nunca HTML/JS ejecutable. Una nueva
   versión del libro conserva citas e IDs de fragmento; el docente comprueba
   citas y adecuación antes de publicarla. El ejemplo actual cita su fuente
   sintética interna y no atribuye al RAG una generación que no ha sucedido.
6. **Supabase (diseño, no desplegado)**: conservar Auth, organizaciones,
   `learning_activities`, ítems, evaluaciones, revisiones y Learning Twin existentes.
   Añadir en una migración futura versiones inmutables de libros, páginas,
   referencias a fragmentos y asignaciones a actividades del mismo centro.
   Reutilizar criterios y currículum existentes; no crear otro catálogo paralelo.
   RLS debe verificar centro, membresía activa, aula/asignación y publicación;
   las claves de respuesta y documentos restringidos nunca se sirven al alumno.

El endpoint futuro deriva alumno, centro, versión publicada y rúbrica desde sesión
y asignación autorizada. Acepta respuesta e ID idempotente, no la evaluación ni
los identificadores de otro alumno como autoridad. Debe confirmar intento,
evaluación, evidencia, procedencia y evento en una transacción, ampliando el
contrato persistente del MVP y su gestión de correcciones. No encadenar escrituras
independientes de cliente que puedan dejar media evaluación guardada.
`recordEvaluatedEvidence` es una referencia del escritor de Twin actual, no una
solución completa para la publicación/versionado de libros.

Antes de habilitarlo: probar acceso cruzado entre centros y aulas, roles,
contenido no publicado, idempotencia, rollback, correcciones y permisos de
lectura de las fuentes. No se modifican esquemas ni datos de Supabase en este corte.

## Pendientes explícitos

- Editor docente de libros y generador de páginas/actividades arbitrarias; el
  primer catálogo se define en código dentro de NeuroAula.
- RAG real, revisión de citas, publicación docente y asignación a alumnos reales.
- Persistencia transaccional del recorrido y procedencia de libro en Supabase.
- Medir rendimiento y accesibilidad con dispositivos/lectores de pantalla reales;
  no interpretar el 3D como una mejora de aprendizaje demostrada.
- Validar narración, licencias de contenidos adicionales, traducciones y pruebas
  pedagógicas antes de extender a otras unidades.

## Ejecución y validación

En el mismo repositorio: `pnpm install --frozen-lockfile`, `pnpm dev`, entrar con
una cuenta docente autorizada y visitar `/demo/actividades`. El libro forma parte
del ciclo MVP; no se necesita otro servidor. `pnpm typecheck`, `pnpm lint`,
`pnpm test` y `pnpm build` comprueban la integración.

Pruebas nuevas: lectura sin evidencia, ayudas acumuladas y congeladas, contexto
versionado, revisión/corrección sin borrar evidencia, propuesta que respeta la
corrección, restauración compatible y rechazo de procedencia inválida.
El registro sigue siendo sintético/local, editable por quien controla el navegador;
no equivale a auditoría segura ni expediente persistente de producción.

### Resultado de las comprobaciones de esta sesión

- TypeScript: sin errores. ESLint: sin errores, nueve avisos en componentes anteriores.
- Pruebas automáticas: 76 aprobadas, ninguna fallida (incluidas tres nuevas del libro).
- Compilación cliente/servidor completada; el visor se carga como módulo separado
  (aproximadamente 123 kB gzip) al activar la vista 3D.
- Prueba del componente en Chrome headless con datos sintéticos: lectura, ayuda,
  cambio de páginas, tres montajes/desmontajes, ancho móvil, movimiento reducido
  y recuperación cuando WebGL no está disponible. Sin excepciones no controladas.
- La prueba visual usa un arnés temporal, sin alterar la autenticación de NeuroAula.
  No sustituye una prueba del recorrido autenticado con una cuenta docente ni
  una validación en hardware móvil real. No se ha desplegado ni publicado.
