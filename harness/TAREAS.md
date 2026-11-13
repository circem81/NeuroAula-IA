# Tablero de tareas

Estados: Por hacer · En curso · En revisión · Hecha · Bloqueada. Una tarea solo pasa a «Hecha»
cuando el revisor técnico ha informado de las comprobaciones. Lo mantiene el coordinador.

## Petición (2026-11-12)

Mejorar el libro de álgebra y ecuaciones de Matemáticas de 2.º de ESO (A1, A2). Fase 1:
planificación y revisión, sin tocar `src/` ni `supabase/` (A9). Fase 2: una sola página, el
ejercicio de balanza manipulable para 2x + 3 = 11 (P2), solo cuando la usuaria lo apruebe.

Informes de referencia:
- Pedagógico: `harness/revisiones/2026-11-12-capitulo-ecuaciones.md` (OP1-OP25).
- Técnico: `harness/revisiones/2026-11-12-informe-tecnico.md` (OT1-OT25).

## Estado en la carpeta real (2026-11-12, revisión de Claude)

- Comprobado: el paso de bun a pnpm está completo en `package.json` (script `check`), `README.md`,
  `docs/TUTOR.md` y `docs/LEARNING-TWIN.md`; no quedan instrucciones `bun run`/`bun install` en la
  documentación. Sin confirmar en Git.
- Comprobado: `.claude/` no existe; los roles y la guardia siguen en `harness/para-instalar/` y no
  están activos (instalación que hace la usuaria, ver `harness/README.md`).
- Sin repetir: `node --test harness/pruebas/*.test.mjs` (OT1) y `pnpm check`, porque en el terminal
  de esta sesión no hay `node` ni `pnpm` disponibles. Los resultados de 9/9 y 76/76 son de la copia
  de prueba.

## Estado en la carpeta real (2026-11-13, revisión de Claude)

- Sin cambios en los cinco archivos modificados desde el 2026-11-12 (paso de bun a pnpm y
  `_respaldo/` en `.gitignore`). Siguen sin confirmar en Git.
- Sigue sin poder repetirse `pnpm check` ni OT1: en este Mac no hay `node` ni `pnpm` en el PATH
  (sí hay `node_modules`).
- `.claude/` sigue sin existir: la guardia que cita `CLAUDE.md` no está activa.

## Fase 1 · Planificación y revisión

| Id | Rol | Archivos que puede tocar | Criterio de aceptación | Estado |
| --- | --- | --- | --- | --- |
| F1-T1 | revisor-pedagogico | Ninguno (solo lectura) | Informe con R1-R5, E1-E6 y sus opciones, las 18 pistas y la balanza, con observaciones identificadas. Guardado íntegro por el coordinador. | En revisión (informe entregado y guardado; falta que la usuaria lo lea) |
| F1-T2 | revisor-tecnico | Ninguno (solo lectura) | Resultado real de `node --test harness/pruebas/*.test.mjs` y `git status --short`, más lista de archivos y riesgos para la página de balanza. | Bloqueada en la parte (a), ahora solo por OT1: OT2 se comprobó en F1-T3 (2026-11-12); OT1 sigue sin ejecutarse. Parte (b) entregada y guardada. |
| F1-T3 | revisor-tecnico (o la usuaria) | Ninguno | Ejecutar de nuevo los dos comandos de F1-T2 y anotar número de pruebas, aprobadas, fallidas y salida de `git status --short`. | Bloqueada (2026-11-12): ejecutada por revisor-tecnico. OT2 comprobado (` M harness/TAREAS.md`, nada fuera de `harness/`). OT1 no se ejecutó: «This command requires approval». Falta que la usuaria ejecute o apruebe `node --test harness/pruebas/*.test.mjs`. Ver «Repetición de OT1 y OT2» en el informe técnico. Actualización (Claude, sesión principal): OT1 ejecutado con la autorización en vigor, 9 de 9 aprobadas; ver «Tercera ejecución» en el informe técnico. Hecha en la copia de prueba. |
| F1-T4 | coordinador | `harness/TAREAS.md`, `harness/DECISIONES.md` | Plan escrito y decisiones nuevas anotadas como Propuesto o Pendiente, sin ningún Aprobado nuevo. | En revisión. `git status` ya comprobado en F1-T3: solo `harness/TAREAS.md` modificado, sin Aprobados nuevos. No pasa a Hecha mientras F1-T3 siga abierta por OT1. |
| F1-T5 | usuaria | — | Respuesta a D6, D7 y D9-D15 de `harness/DECISIONES.md`. | Casi hecha (2026-11-12): resueltas D7, D9, D10, D11, D12 y D13 (A13-A20). Siguen pendientes D6 y D14, que no bloquean la balanza. |
| F1-T6 | coordinador | `harness/propuestas/balanza-2x3-11.md` (nuevo) | Especificación de la página de balanza que recoja lo que decida la usuaria en F1-T5: lista fija de botones sin el 0 (OP24), operación aplicada a todos los términos con línea escrita y simplificada (OP20), tratamiento de fracciones (OP21), deshacer y empezar de nuevo con mensajes neutros (OP22), estado final y comprobación (OP25), nivel de ayuda (OT17), qué pasa si la actividad ya está resuelta (OT18), accesibilidad y vista 3D (OT20, OT21), idioma (OT23). | En revisión (2026-11-12): redactada en `harness/propuestas/balanza-2x3-11.md`. Conflicto de su sección 0 resuelto en A21. Lista para F1-T7. |
| F1-T7 | revisor-pedagogico | Ninguno (solo lectura) | Revisión de la especificación de F1-T6 sin errores matemáticos abiertos. | En revisión (2026-11-12): informe en `harness/revisiones/2026-11-12-revision-balanza.md` (OB1-OB27). Las seis filas de la tabla son correctas. Los 8 errores (OB2, OB3, OB4, OB5, OB11, OB18, OB20, OB22) y las sugerencias se aplicaron en la versión 2 de la especificación (A22); las seis filas nuevas y el límite de 100/8 se comprobaron con fracciones exactas. Sin una segunda revisión pedagógica de la versión 2. Actualización 2026-11-13 (Claude): versión 2 comprobada en `harness/revisiones/2026-11-13-revision-balanza-v2.md` (OV1-OV7); filas 7-12 correctas; corregido el límite de las secciones 7 y 12 (versión 3); OV6 resuelto en A23 (decimales comparados por su valor). |
| F1-T8 | usuaria | — | Aprobación expresa de la especificación de la balanza (convertiría P2 en Aprobado) y cambio de fase en `harness/permisos.json`, que solo hace ella. | Sustituida por F1-T8b (A25, 2026-11-13): la balanza no se implementa. |

## Cambio de rumbo (2026-11-13, A25)

La balanza de botones se sustituye por el modelo de cajas y fichas por niveles (P12). La
especificación anterior queda como registro y no se implementa.

| Id | Rol | Archivos que puede tocar | Criterio de aceptación | Estado |
| --- | --- | --- | --- | --- |
| F1-T6b | coordinador | `harness/propuestas/cajas-y-fichas.md` (nuevo) | Especificación de cajas y fichas a partir de la maqueta y de las decisiones que siguen en vigor (A14, A17, A18, A20, A21, A23, A24). | En revisión (2026-11-13): versión 2 con la revisión aplicada (A26). Pendientes D17-D20. |
| F1-T7b | revisor-pedagogico | Ninguno (solo lectura) | Revisión de `cajas-y-fichas.md` y de la maqueta sin errores matemáticos abiertos. | En revisión (2026-11-13): informe en `harness/revisiones/2026-11-13-revision-cajas-fichas.md` (OC1-OC20). Sin errores matemáticos: las nueve ecuaciones y los ejemplos son correctos. Aplicados todos (OC1-OC20) en la versión 2 de la especificación y de la maqueta (A26, 2026-11-13); la maqueta v2 se comprobó en el navegador. Sin una segunda revisión pedagógica de la versión 2. |
| F1-T8b | usuaria | — | Aprobación de `cajas-y-fichas.md`, respuesta a D17-D20 y cambio en `harness/permisos.json` (archivos `equation-boxes`). | Casi hecha (2026-11-13): aprobación (A36, A37) y `permisos.json` en fase 2 con los archivos nuevos. Falta volver a añadir `src/components/interactive-learning-book.tsx`, que se borró al editar, decidir D17 e instalar `node` y `pnpm`. |

2026-11-13 (A27): especificación y maqueta en versión 3, con tachar y repartir a mano en el nivel 1. Maqueta comprobada en el navegador (tachar desigual bloqueado, quitar, reparto desigual, pregunta «¿cuántas fichas hay en cada caja?», deshacer, caso con las cajas a la derecha, nivel 2 sin cambios). Sin revisión pedagógica de la versión 3.

2026-11-13 (A28-A30): D18, D19 y D20 resueltas; especificación y maqueta en versión 4 (cita de Pepe Vidal / Proyecto Newton, niveles en orden, el alumno sabe si acierta). Maqueta comprobada en el navegador. Para F1-T8b solo queda D17 y la aprobación.

- 2026-11-13: revisión pedagógica de la versión 4 en `harness/revisiones/2026-11-13-revision-cajas-fichas-v4.md` (OV4-1 a OV4-16). Sin errores matemáticos; siete errores de diseño o de documento (OV4-1 a OV4-7), dos de ellos con decisión de la usuaria (OV4-2 salida de A29, OV4-4 P9). Sin aplicar.

2026-11-13 (P13): propuesta de gemelo adaptativo y su maqueta con tres alumnos ficticios, comprobada en el navegador (las decisiones cambian según D21, D22 y D23 como se describe en la propuesta). D21-D23 resueltas como recomendaba Claude (A31-A33). P13 sigue en «Propuesto» hasta que la usuaria la apruebe. Añadidos A34 (principio de NeuroAULA AI) y A35 (base metodológica de Liljedahl); la lista de las 14 prácticas está comprobada con el resumen ejecutivo público del autor. No toca la fase 2 de cajas y fichas.

2026-11-13 (P14): propuesta de ajustes de apoyo de Orientación y PT y alumno ficticio D en la maqueta del gemelo, comprobada en el navegador (vista de profesor sin motivo y vista de Orientación con revisión y comparación con y sin ajustes). D24-D27 resueltas (A38-A41); D28 depende del centro. Versión 3 (A42, A43): se guardan diagnóstico e informe de Orientación con acceso restringido; pendiente D29 (acceso de la IA).

2026-11-13: especificación de cajas y fichas aprobada (A36) y P13 aprobada (A37). Faltan D17, el cambio de fase en `harness/permisos.json` y `node`/`pnpm` en el Mac.

2026-11-13 (P15): propuesta «Cómo aprende cada alumno» y panel de hipótesis en la maqueta del gemelo, comprobado en el navegador. Pendientes D30 y D31; D29 tiene propuesta de cierre.

La fase 2 sigue igual, pero con la lista de archivos de la sección 11 de `cajas-y-fichas.md` en
lugar de la de la balanza.

## Fase 2 · Una sola página: balanza manipulable para 2x + 3 = 11 (sustituida por cajas y fichas, A25)

No se empieza nada de esta fase hasta que F1-T8 esté cumplida.

| Id | Rol | Archivos que puede tocar | Criterio de aceptación | Estado |
| --- | --- | --- | --- | --- |
| F2-T1 | desarrollador-libro | `src/components/equation-balance.tsx` (nuevo), `src/lib/interactive-book.ts`, `src/lib/book-context.ts`, `src/components/interactive-learning-book.tsx`, `src/components/mvp-learning-cycle.tsx`, `src/lib/interactive-book.test.ts`, `docs/INTERACTIVE-BOOKS.md` (OT6-OT12), y según A21 también `src/lib/mvp-learning-cycle.ts` y su prueba (cambio acotado), `src/lib/equation-balance.ts` y `src/lib/equation-balance.test.ts` (nuevos; la usuaria debe añadirlos a `harness/permisos.json`). Lista completa en la sección 11 de la especificación. Prohibido: `src/lib/learning-twin.ts`, `src/lib/interactive-book/`, copias «2», `supabase/`, configuración (OT13, OT14). | La página de balanza existe dentro del libro; aplica cada operación a todos los términos y escribe la línea algebraica; envía la respuesta final por su propia actividad (A18, A21), sin cambiar el formato de la actividad de opciones; los datos guardados antes del cambio se siguen restaurando (OT15); abrir la página no crea evidencia; pruebas nuevas de OT11 añadidas. | Bloqueada por F1-T8 |
| F2-T2 | revisor-tecnico | Ninguno (solo lectura y comprobaciones) | `git status --short` y `git diff --stat` muestran solo archivos de F2-T1; `node --test harness/pruebas/*.test.mjs`, typecheck, lint (sin superar 9 avisos), test (≥ 76 más las nuevas) y build sin errores, con la herramienta que decida la usuaria (D9); revisión manual de teclado, lector de pantalla y funcionamiento sin vista 3D. | Bloqueada por F2-T1 |
| F2-T3 | revisor-pedagogico | Ninguno (solo lectura) | Las líneas algebraicas mostradas son correctas para todos los botones (incluida la división antes de restar, OP20) y los mensajes no califican al alumno. Diseño propio, sin imitar productos comerciales (OT25). | Bloqueada por F2-T1 |
| F2-T4 | coordinador | `harness/TAREAS.md`, `harness/DECISIONES.md` | F2-T1 pasa a Hecha solo con los informes de F2-T2 y F2-T3. Resumen a la usuaria. | Bloqueada por F2-T2 y F2-T3 |

## Fuera de la fase 2 (anotado, sin planificar)

- 2026-11-13: maqueta de cajas y fichas por niveles (P12) en `harness/propuestas/maqueta-cajas-fichas.html`, comprobada en el navegador (9 ecuaciones con solución entera, escritura de la ecuación, tabla de ensayos, quitar y repartir, deshacer). Pendiente D16: cómo encaja con la especificación de la balanza.

- Correcciones al resto del capítulo P1 (OP1-OP18): enunciado y pistas de E6, ejemplo nuevo R6, distractores, nivel 4 de las pistas. Requieren decisión de la usuaria y no forman parte de la página única de la fase 2.
- Pistas de nivel 1, que el ciclo actual no puede mostrar (OP19, OT19).
- Retirar copias duplicadas (P3, OT22).
