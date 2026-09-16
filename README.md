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

### Funciones simuladas

- Alumnado, perfiles educativos, progreso, alertas y actividades.
- Gemelo cognitivo y sus indicadores.
- Recomendaciones y adaptación del aprendizaje.
- Informe LOMLOE.
- Estados y coordinación de agentes educativos.
- Paneles descritos como datos en tiempo real.
- Configuración del centro e integraciones LMS.

Los datos simulados se encuentran en `src/lib/demo-data.ts`. No deben sustituirse por datos personales reales.

## Funciones que todavía no existen

- Persistencia de información educativa.
- Llamadas a modelos de inteligencia artificial.
- Agentes ejecutables, RAG o generación automática.
- Integraciones con plataformas educativas.
- Envío real del formulario de contacto.

## Arquitectura prevista

El gemelo de aprendizaje se plantea como **estado longitudinal consultable**, no como un prompt acumulativo con todo el historial del alumno. Para la futura capa de agentes se adopta como referencia el patrón RLM: contexto externo, recuperación selectiva y procesamiento por agentes especializados. La propuesta y sus límites se describen en [`docs/RLM_ARCHITECTURE.md`](docs/RLM_ARCHITECTURE.md).

## Línea de investigación

El repositorio incorpora una línea separada de I+D en [`research/`](research/) para explorar neurociencia computacional, ciencia de datos, modelos cognitivos y funciones ejecutivas aplicadas al diseño educativo. Incluye referencias de trabajo para Healthy Brain Network, Human Connectome Project y OpenNeuro, además de áreas para modelos cognitivos, funciones ejecutivas y notebooks reproducibles.

Esta línea de investigación no convierte NeuroAula AI en una herramienta clínica: sus resultados deben utilizarse para formular hipótesis educativas, variables observables y propuestas de apoyo sujetas a supervisión humana, no para realizar diagnósticos automatizados.

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
