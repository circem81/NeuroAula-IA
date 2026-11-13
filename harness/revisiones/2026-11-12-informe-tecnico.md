# Informe del revisor técnico: comprobaciones y plan para la página de balanza (fase 1, solo lectura)

> Nota del coordinador (2026-11-12): informe guardado íntegro, tal como lo devolvió el subagente
> `revisor-tecnico`. Solo se han restaurado los caracteres `&&` y `<`/`>` que el sistema había
> escapado al transmitirlo, y las rutas absolutas de la lista final se han dejado relativas a la
> raíz del proyecto. El sistema marcó el informe por mencionar `.claude/settings.json`; la
> mención aparece solo en la lista de archivos que no se deben tocar (OT14) y no contiene ninguna
> instrucción.

No he podido ejecutar ningún comando porque la herramienta de terminal me denegó el permiso. Por eso la parte (a) queda entera como no verificada. La parte (b) sale solo de leer el código. No he modificado ningún archivo.

## Comprobaciones ejecutadas

| Id | Comprobación | Resultado |
| --- | --- | --- |
| OT1 | `node --test harness/pruebas/*.test.mjs` | **No verificado.** El permiso se denegó tres veces, una con el comando combinado y otra por separado: «Permission to use Bash has been denied». No hay número de pruebas, ni aprobadas ni fallidas. No cuenta como aprobado. |
| OT2 | `git status --short` | **No verificado**, por el mismo motivo. No puedo dar la lista de archivos modificados. Tampoco pude ejecutar `git diff --stat`. |
| OT3 | `pnpm typecheck`, `lint`, `test`, `build` | No ejecutados. La tarea los prohíbe en esta fase y en esta copia no hay `node_modules`. |
| OT4 | Hallazgo en la configuración | `package.json`, línea 14: `"check": "bun run typecheck && bun run lint && bun run test && bun run build"`. Usa **bun**, no pnpm. Contradice la decisión A5 y lo que dicen el skill y `CLAUDE.md` («`pnpm check`»). `harness/permisos.json` menciona además `bun.lock` y `bunfig.toml`. No pude ver si esos dos archivos existen. |

**Para repetir OT1 y OT2:** hay que conceder permiso de terminal, o que la usuaria ejecute ella misma los dos comandos.

## Archivos para la página de balanza

**Antes de empezar (OT5):** ahora mismo no se puede implementar. P2 figura como «Propuesto», no como «Aprobado», en `harness/DECISIONES.md`. Además, `harness/permisos.json` dice `"fase": 1`, y en esa fase `src/` está bloqueado.

| Id | Archivo | Qué cambiar y por qué | Base |
| --- | --- | --- | --- |
| OT6 | `src/components/equation-balance.tsx` (**nuevo**; hoy no existe, aunque ya figura en los permisos del desarrollador) | Componente con los botones de operación, la línea algebraica de cada movimiento, el paso de comprobación y el botón para enviar x = 4. Solo texto propio, sin `innerHTML`. No crea su propio evaluador: avisa al componente padre para que llame a `submitMvpAnswer`. | Comprobado: no existe y está permitido. El diseño es una suposición. |
| OT7 | `src/lib/interactive-book.ts` | Añadir la página `balance` a `interactiveBook.pages`, con su `supportLevel`. `readBookPage` la aceptará sin más cambios. Posiblemente, que `bookContext()` reciba la página desde la que se responde, porque hoy fija `activityPageId: "challenge"` (línea 39). | Comprobado leyendo el código. |
| OT8 | `src/lib/book-context.ts` | Hoy acepta un solo valor fijo en tres campos: `bookVersion: z.literal(1)`, `activityPageId: z.literal("challenge")` y `.strict()`. Para que los intentos desde la balanza tengan su propia procedencia, hay que ampliarlos a `z.enum(["challenge","balance"])`. Si se sube la versión a 2, como dice la propuesta, hace falta aceptar 1 o 2. Si no, se pierden los datos guardados (ver OT15). | Comprobado. |
| OT9 | `src/components/interactive-learning-book.tsx` | Hoy solo muestra `page.text` (línea 111). Habría que mostrar `<EquationBalance>` cuando `page.id === "balance"` y añadir una propiedad del tipo `onSubmitAnswer`, porque el envío vive en el componente padre. | Comprobado. |
| OT10 | `src/components/mvp-learning-cycle.tsx` | Pasar al libro la función de envío. Hoy está en `submit`, líneas 83 a 97, y usa `bookContext(presentation)`. También el estado `solved` y el límite de 5 intentos, para desactivar la balanza. La vista del profesor ya enseña la procedencia (líneas 259 a 264). | Comprobado. |
| OT11 | `src/lib/interactive-book.test.ts` | Pruebas para cuatro cosas: abrir la página de balanza no crea evidencia; enviar desde la balanza deja `reasoningQuality`, `errorType` y `strategies` vacíos; los datos guardados en el formato anterior se siguen restaurando; y una página desconocida sigue dando error. | Comprobado que la prueba equivalente existe (líneas 16 a 31 y 63 a 67). |
| OT12 | `docs/INTERACTIVE-BOOKS.md` | Documentar la nueva página. Está en los permisos, pero no lo he leído. | Suposición. |
| OT13 | `src/lib/mvp-learning-cycle.ts` y su prueba | **Mejor no tocarlos** si la página solo envía la respuesta final. `submitMvpAnswer` ya acepta `"4"` y un `bookContext` opcional. Solo cambiarían si se decide registrar los pasos (D7, ver OT16). | Comprobado. |

## Archivos que no se deben tocar

| Id | Archivo o carpeta | Motivo |
| --- | --- | --- |
| OT14 | `src/lib/learning-twin.ts` | Es el motor del Learning Twin. El skill `libro-interactivo` y el rol del desarrollador lo prohíben. |
| OT14 | `src/lib/interactive-book/` (`viewer.ts`, `book.js`) | Motor 3D adaptado con licencia MIT; el skill dice que no se modifica. |
| OT14 | `supabase/` y `supabase/migrations/` | Bloqueados en fase 1. Las migraciones solo las toca la usuaria. No hay que aplicar nada. |
| OT14 | `package.json`, `pnpm-lock.yaml`, `bun.lock`, `bunfig.toml`, `.claude/settings.json`, `.claude/hooks/`, `harness/permisos.json`, `AGENTS.md` | Solo los cambia la usuaria. |
| OT14 | `src/lib/tutor*`, `src/lib/education-agents*`, `src/lib/learning-cycle.ts` | Agentes educativos y el ciclo v2, que no tienen relación con esta página. |
| OT14 | `src/lib/mvp-learning-cycle 2.ts`, `src/components/mvp-learning-cycle 2.tsx` | Son copias antiguas: no tienen `bookContext` ni el libro. Retirarlas es la propuesta P3, que es una tarea aparte. |
| OT14 | Rutas o un `routeTree` generado (suposición: no lo he leído) | No hace falta crear una ruta nueva: la balanza es una página dentro del libro. Así se evita tocar archivos que gestiona Lovable. |

## Riesgos

| Id | Riesgo | Base |
| --- | --- | --- |
| OT15 | **Pérdida silenciosa de los datos guardados.** Si el estado guardado no encaja con el esquema, `restoreMvpCycle` lo descarta y empieza de cero (líneas 165 a 170). La prueba de las líneas 58 a 60 lo confirma con `bookVersion = 999`. Cambiar `bookVersion` o `activityPageId` sin aceptar también los valores antiguos borraría las demostraciones guardadas sin avisar. | Comprobado. |
| OT16 | **Registrar los pasos en el Learning Twin exige cambiar el esquema, aunque no el de Supabase.** El estado (`mvpCycleSchema.attempts`) no tiene ningún campo para pasos. Añadirlo cambia el formato guardado en el navegador (localStorage). Además, marcar `strategies: ["UsesEquation"]` o `"UsesDiagram"` sería una inferencia que la regla prohíbe. D7 sigue pendiente, así que lo recomendable es no registrar pasos. No he podido revisar si Supabase guarda evidencias con estos campos. | Lo del navegador está comprobado. Lo de Supabase no está verificado. |
| OT17 | **El nivel de ayuda de la balanza está sin decidir.** Elegir botones de operación que se aplican solos se parece al nivel 4 («procedimiento guiado»). Si la página declara `supportLevel: 0`, la evidencia exageraría la autonomía del alumno. Como `readBookPage` solo sube el nivel y nunca lo baja, abrir la balanza también afectaría a los intentos posteriores con opciones. Hace falta que lo decida el revisor pedagógico o la usuaria. | Mecanismo comprobado. El nivel adecuado es una suposición. |
| OT18 | **Una sola actividad.** `submitMvpAnswer` deja de aceptar respuestas tras la correcta o tras 5 intentos (líneas 214 y 215), y la balanza comparte `mvpActivity.id`. Si el alumno ya resolvió con las opciones, la balanza no puede enviar nada, y al revés. El skill avisa de que generalizar esto es «el cambio más delicado» y debe ir en una tarea propia. | Comprobado. |
| OT19 | **Pistas incompletas.** `mvpActivity.hints` solo tiene 2 pistas (niveles 2 y 4), y `requestMvpHint` salta de 0 a 2 y de 2 a 4. La propuesta E3 tiene una pista de nivel 1 que no se puede usar sin cambiar el ciclo. | Comprobado. |
| OT20 | **Vista 3D.** `viewer.show(title, text)` solo dibuja texto. El contenedor 3D tiene `aria-hidden="true"`. La balanza debe vivir en la lectura HTML, y la vista 3D solo puede mostrar el enunciado. Si falla WebGL, la balanza tiene que seguir funcionando. | Comprobado. |
| OT21 | **Accesibilidad.** Los botones necesitan nombres claros («Restar 3 en ambos lados»). Cada línea nueva debe anunciarse; ya existe `aria-live="polite"` en el `article`, pero no debe repetir la página entera. Si hay una balanza dibujada, necesita una alternativa en texto. Hay que respetar `prefers-reduced-motion` y poder usarlo todo con teclado. | Suposición sobre el diseño, partiendo del patrón que ya existe. |
| OT22 | **Copias duplicadas.** `mvp-learning-cycle 2.ts` y `.tsx` entran en `tsc`, porque `tsconfig` incluye `src/**/*.ts` y ESLint solo ignora `dist`. Riesgo: que el desarrollador edite la copia equivocada, o que un cambio de tipos rompa la copia vieja. La copia `.tsx` importa `submitMvpAnswer` sin `bookContext`, lo que sigue siendo compatible mientras ese parámetro sea opcional. | Comprobado. |
| OT23 | **Idioma.** `mvp-learning-cycle.tsx` es bilingüe (`tr`), pero el libro solo está en español. Hay que decidir si la balanza se traduce. | Comprobado. |
| OT24 | **Lovable (`AGENTS.md`).** Nada de push ni de reescribir el historial. La rama conectada tiene que quedar funcionando. Como `pnpm check` en realidad llama a bun (OT4), conviene ejecutar los pasos por separado con la herramienta acordada. | Comprobado. |
| OT25 | **Diseño propio.** La propuesta pide no imitar la estética de DragonBox: el revisor pedagógico debe comprobarlo. | Requisito del documento. |

## Comprobaciones necesarias tras implementar

1. `git status --short` y `git diff --stat`: solo deben aparecer archivos de la lista OT6 a OT12.
2. `node --test harness/pruebas/*.test.mjs`: pendiente de una primera ejecución (OT1).
3. `typecheck`: sin errores, incluidas las copias «2».
4. `lint`: sin errores y sin superar los 9 avisos de referencia.
5. `test`: al menos 76 aprobadas, más las nuevas de OT11. Hay que confirmar que el patrón `src/lib/*.test.ts` las recoge.
6. `build`: obligatorio, porque se toca `src/`.
7. Revisión manual: la balanza funciona sin vista 3D, con teclado y con lector de pantalla. Abrirla no crea evidencia. El envío deja la evaluación con revisión pendiente. Un estado guardado antes del cambio se sigue restaurando.

**Lo que no pude revisar:** el resultado real de la prueba de la guardia y de git status (OT1 y OT2), el contenido de `supabase/`, `docs/INTERACTIVE-BOOKS.md`, las rutas y `routeTree`, y si existen `bun.lock` y `bunfig.toml`.

Archivos principales que he leído:
- `src/lib/mvp-learning-cycle.ts`
- `src/lib/book-context.ts`
- `src/lib/interactive-book.ts`
- `src/components/interactive-learning-book.tsx`
- `src/components/mvp-learning-cycle.tsx`
- `harness/permisos.json`
- `package.json`

## Repetición de OT1 y OT2

> Tarea F1-T3, 2026-11-12. Resultado devuelto por el subagente `revisor-tecnico`; cada comando se
> ejecutó en su propia llamada, sin `cd` ni rutas absolutas. No se ejecutó pnpm, npm ni bun.

| Id | Comprobación | Resultado |
| --- | --- | --- |
| OT1 | `node --test harness/pruebas/*.test.mjs` | **No verificado.** El comando no llegó a ejecutarse: el entorno respondió «This command requires approval» y no había nadie para aprobarlo. No hay número de pruebas, aprobadas, fallidas ni omitidas, ni código de salida. No cuenta como aprobado ni como fallo del código. El revisor no lo reintentó con otra forma para no saltarse el permiso. Suposición del revisor, sin comprobar: la autorización previa no figura en la configuración de permisos de la sesión o la regla no coincide con el comodín `*.test.mjs`. |
| OT2 | `git status --short` | **Comprobado.** Salida literal completa: ` M harness/TAREAS.md`. Un solo archivo modificado, dentro de `harness/`; ningún archivo sin seguimiento (`??`) ni modificado fuera de `harness/`. |

**Nota del coordinador sobre OT2.** El revisor dedujo que, como `package.json` no aparece en
`git status`, el cambio a pnpm no está hecho. Esa deducción no es correcta: el coordinador leyó
`package.json` y la línea 14 ya dice `"check": "pnpm run typecheck && pnpm run lint && pnpm run test && pnpm run build"`.
Que no aparezca en `git status` indica que el cambio ya está en el último commit, no que falte
(esto último no se ha comprobado con `git log`). La modificación de `harness/TAREAS.md` es la que
hizo el coordinador al poner F1-T3 en curso, antes de la ejecución.

**Para cerrar OT1:** que la usuaria ejecute el comando, lo apruebe cuando se le pida o añada esa
forma exacta a los permisos del proyecto (configuración que solo cambia ella).

## Tercera ejecución de OT1, con la autorización en vigor

> Añadido por Claude (sesión principal), 2026-11-12, en la copia de prueba aislada.

Las reglas `allow` de `.claude/settings.json` no se aplican hasta que la carpeta se marca como de
confianza en Claude Code; en una ejecución desatendida de una carpeta nueva, el comando queda en
«requiere aprobación». Con la misma autorización pasada de forma explícita, el `revisor-tecnico`
ejecutó `node --test harness/pruebas/*.test.mjs`: **9 pruebas, 9 aprobadas, 0 fallidas**. En esa
misma ejecución se le pidió además escribir en `harness/TAREAS.md` y no lo hizo.

En la carpeta real: la primera vez que se abra con Claude Code habrá que aceptar la confianza de
la carpeta; hasta entonces, Claude Code pedirá confirmación antes de ejecutar las comprobaciones.
