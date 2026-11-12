# NeuroAula AI

Prototipo web de una futura plataforma educativa adaptativa. El proyecto conserva una landing pública y una zona navegable identificada expresamente como **Demo con datos simulados**.

## Estado actual

### Funciones reales

- Landing responsive en español e inglés.
- Navegación por las pantallas de la demo.
- Visualizaciones y gráficas construidas con datos locales simulados.
- Selector de idioma persistido en el navegador.
- Interacción local para mostrar pistas y explicaciones de ejemplo.
- Autenticación por correo y contraseña con Supabase, sesión SSR en cookies y zona `/demo` protegida.
- Autorización por perfiles usando las membresías activas protegidas por RLS de `organization_memberships`.
- Confirmación de correo y recuperación segura de contraseña mediante enlaces de Supabase Auth.
- Flujo local de intervención sobre alertas: asignación, estado y notas simuladas.
- Formulario de contacto simulado que no envía ni guarda información.
- Gestión básica de errores de renderizado.
- Laboratorio del tutor en `/demo/actividades` para docentes: ecuación de prueba,
  corrección determinista, pistas programadas progresivas y revisión antes de mostrar la ayuda.
- Registro de hasta cinco intentos ficticios en la pestaña actual, separado por cuenta,
  centro e idioma; no se guarda en Supabase ni constituye un expediente educativo.
- Recorrido MVP sintético en `/demo/actividades`: alumno, actividad, respuesta,
  evaluación estructurada, evidencia, Learning Twin y revisión del profesor.
- Corrección humana trazable: conserva la evidencia original y crea una evidencia
  correctiva para recalcular el estado efectivo.
- Conector de IA de servidor con autenticación, validación de entradas/salidas y manejo
  de errores. Preparado para `OPENAI_MODEL=gpt-6-astra`, con razonamiento bajo y límites configurables.
  Solo se activa al configurar `OPENAI_API_KEY` y `OPENAI_MODEL`; el acceso real sigue pendiente de validar.

### Funciones simuladas

- Alumnado, perfiles educativos, progreso, alertas y actividades.
- Paneles generales del antiguo gemelo cognitivo y sus indicadores.
- Recomendaciones y adaptación del aprendizaje.
- Informe LOMLOE.
- Estados y coordinación de agentes educativos.
- Paneles descritos como datos en tiempo real.
- Configuración del centro e integraciones LMS.

Los datos simulados se encuentran en `src/lib/demo-data.ts`. No deben sustituirse por datos personales reales.

## Funciones que todavía no existen

- Persistencia de información educativa.
- Acción de servidor que conecte el recorrido visual del MVP con el nuevo contrato
  persistente de Supabase; la demo integrada conserva su estado solo en el navegador.
- IA activada y validada con un proveedor real (el conector está implementado, falta configurar y probar).
- Coordinación autónoma entre agentes, RAG o generación automática sin revisión.
- Integraciones con plataformas educativas.
- Envío real del formulario de contacto.

## Tecnologías

- React 19 y TypeScript.
- TanStack Start, Router y Query.
- Vite y Nitro.
- Tailwind CSS 4, Radix UI y Motion.
- Recharts para visualizaciones.
- Runner nativo de Node.js para pruebas básicas.
- Bun para dependencias y scripts.

## Desarrollo

```bash
bun install
bun run dev
```

Copia `.env.example` a `.env.local` y configura la URL y la clave pública del proyecto. Nunca uses una clave `service_role` ni `sb_secret_*` en estas variables. En Supabase Auth debe estar habilitado el proveedor Email. Solo pueden acceder las cuentas con una membresía activa; los roles deben asignarse desde un entorno administrativo seguro. La arquitectura, el flujo y el límite de confianza se describen en [`docs/AUTHENTICATION.md`](docs/AUTHENTICATION.md).

La aplicación usa rutas por archivos en `src/routes`. `src/routeTree.gen.ts` es un archivo generado y no debe editarse manualmente.

El primer flujo del tutor, su configuración y los límites de esta prueba se describen
en [`docs/TUTOR.md`](docs/TUTOR.md).

## Comprobaciones

```bash
bun run typecheck
bun run lint
bun run test
bun run build
```

También se pueden ejecutar todas en orden con:

```bash
bun run check
```

## Límites de esta fase

Las tablas actuales de Supabase tienen RLS y separación por centro. Antes de trabajar con información educativa real, cada tabla y operación nueva debe ampliar ese modelo y superar pruebas de aislamiento entre centros. La protección de rutas del cliente y del servidor mejora el flujo de acceso, pero la autorización de datos se impone siempre en PostgreSQL mediante RLS.

## Flujo con Lovable y Git

El proyecto procede de Lovable. No se debe reescribir el historial publicado mediante `push --force`, rebase, amend o squash. Los cambios deben revisarse y validarse antes de cualquier commit o push.


## Equipo de agentes educativos

El laboratorio docente de `/demo/actividades` reúne al tutor de pistas y ocho
especialistas: currículo, evaluación, analítica, funciones ejecutivas, asistente
docente, asistente familiar, accesibilidad e investigación. Cada especialista tiene
una salida propia y revisión docente. Los ejemplos programados están disponibles
sin IA; las llamadas reales necesitan configurar la API y validar el modelo.
No hay envío automático a familias ni decisiones sobre alumnos reales.
Ver [funcionamiento y límites](docs/TUTOR.md#ocho-especialistas-educativos).

## Learning Twin v1

El laboratorio convierte cada respuesta nueva en evidencia y calcula un estado de
aprendizaje determinista con un resumen docente. El esquema de Supabase conserva
las evidencias previas y añade persistencia transaccional para integrar actividades
reales. La prueba del laboratorio sigue siendo ficticia y local a la pestaña.
Ver [algoritmo, tablas, validación y límites](docs/LEARNING-TWIN.md).

El [MVP end-to-end](docs/MVP-END-TO-END.md) documenta el recorrido integrado, el
contrato de datos, la revisión humana y la selección de repositorios externos.

El [plan Mesias + Leonardo](docs/INTEGRACION_MESIAS_LEONARDO.md) se conserva como
referencia de arquitectura. El [estado de implementación](docs/ESTADO-INTEGRACION.md)
detalla el adaptador de modelos conectado y la memoria temporal experimental.


## Libros interactivos

El recorrido MVP de `/demo/actividades` incorpora un libro sintético con lectura
HTML y vista 3D opcional, adaptada del motor MIT de Cristian Sepúlveda-Irribarra.
Las respuestas usan la evaluación, evidencias, Learning Twin y revisión docente
existentes, conservando versión y procedencia del libro.
La publicación de libros, RAG y persistencia real siguen pendientes.
Ver [integración, licencia y límites](docs/INTERACTIVE-BOOKS.md).
Para esta integración usar `pnpm install --frozen-lockfile`; el lockfile Bun
anterior todavía no incluye Three.js.
