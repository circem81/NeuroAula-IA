# Especificación: balanza manipulable para 2x + 3 = 11 (F1-T6)

> **Sustituida el 2026-11-13 (A25).** No se implementa. La sustituye
> `harness/propuestas/cajas-y-fichas.md`. Se conserva como registro.

Estado: **Propuesto**. Redactada por Claude (sesión principal) el 2026-11-12 a partir de A13-A21.
Versión 2, corregida el mismo día con la revisión pedagógica
`harness/revisiones/2026-11-12-revision-balanza.md` (OB1-OB27), según A22. Falta la aprobación
expresa de la usuaria (F1-T8). Hasta entonces no se toca `src/`.

Versión 3 (2026-11-13): comprobación de la versión 2 por Claude, con una sola corrección en el
límite de las secciones 7 y 12. Ver `harness/revisiones/2026-11-13-revision-balanza-v2.md`.

Las opciones que eligió la usuaria a partir de la recomendación del revisor llevan la marca
**[A22: se puede cambiar]**.

## 0. Conflicto con P10 (resuelto en A21)

> Resuelto el 2026-11-12: la usuaria eligió «Permitir el cambio» (A21). Se mantiene el texto
> original para que se entienda el motivo.

A18 («actividad separada») choca con A13, en la parte que aprueba P10 («sin tocar
`mvp-learning-cycle.ts`»), y con la lista de archivos de F2-T1:

- Hoy hay una sola actividad (`mvpActivity`) con un solo identificador, un solo nivel de ayuda y un
  solo contador de 5 intentos (`submitMvpAnswer`, líneas 207-215).
- Las respuestas admitidas están fijadas a las opciones `"2" | "3" | "4" | "6"`
  (`mvpCycleSchema.attempts.answer`). La balanza termina con una igualdad escrita por el alumno
  («x = 4» o «4 = x»), que ese esquema no admite.

Por eso se permite un cambio acotado en `src/lib/mvp-learning-cycle.ts`: parametrizar la actividad
y guardar el estado de la balanza aparte, sin cambiar el formato de la actividad de opciones ni el
Learning Twin.

## 1. Alcance

- Una página nueva, `balance`, dentro del libro existente, sin ruta nueva (P10).
- Ecuación fija: 2x + 3 = 11. No se generaliza a otras ecuaciones en esta fase.
- Español e inglés (A20). El resto del libro sigue solo en español; la traducción de la página se
  hace con el mismo mecanismo `tr` de `mvp-learning-cycle.tsx`. Todo texto de esta especificación
  tiene su pareja en inglés (OB18).
- Diseño propio: sin personajes, cartas, monstruos ni la estética de productos comerciales (OT25).
  Se vuelve a revisar con la primera captura (OB26).

## 2. Actividad propia (A18)

- Nueva actividad sintética `balanceActivity` con identificador UUID propio, el mismo
  `criterionId` (`NEUROAULA.ALG-01.v1`) y `source` «NeuroAula · actividad sintética ALG-01-B · v1».
- Estado guardado aparte: clave de `localStorage` distinta de la actual. El estado de la actividad
  de opciones no cambia de formato, así que los datos guardados se siguen restaurando (OT15).
- Máximo 5 envíos de respuesta final, igual que la actividad de opciones. Los movimientos de la
  balanza y las comprobaciones no son envíos y no cuentan.
- Resolver una actividad no bloquea ni desbloquea la otra.

## 3. Nivel de ayuda (A17)

- Abrir la página `balance` **no** sube el `supportLevel` de la actividad de opciones:
  `readBookPage` no debe aplicarle el nivel de esta página.
- La evidencia de la balanza declara un nivel fijo propio: **4 (procedimiento guiado)**, porque
  los botones aplican la operación por el alumno (OT17). El revisor lo da por bueno (OB12).
- La vista del profesor no muestra solo el número (OB12). Etiqueta:
  «Balanza: los botones hacen el cálculo (ayuda 4/5)» /
  «Scale: the buttons do the calculation (support 4/5)».

## 4. Evidencia (A14 = P11)

- Los movimientos no se registran como evidencia ni se interpretan como errores o estrategias.
- Solo el envío final crea evidencia, con `reasoningQuality`, `errorType` y `strategies` vacíos y
  `requiresHumanReview: true`, igual que hoy.
- Abrir la página no crea evidencia (OT11).

## 5. Botones (P9, OP24, OB2, OB9)

Lista fija, sin el 0 y sin «restar x». Mismo patrón de redacción en los seis (OB9)
**[A22: se puede cambiar]**:

| Botón (ES) | Button (EN) | Operación |
| --- | --- | --- |
| Restar 3 a los dos lados | Subtract 3 from both sides | − 3 |
| Sumar 3 a los dos lados | Add 3 to both sides | + 3 |
| Restar 2 a los dos lados | Subtract 2 from both sides | − 2 |
| Restar 3/2 a los dos lados | Subtract 3/2 from both sides | − 3/2 |
| Dividir los dos lados entre 2 | Divide both sides by 2 | : 2 |
| Multiplicar los dos lados por 2 | Multiply both sides by 2 | · 2 |

«Restar 3/2» se añade para que el camino «dividir primero» se pueda terminar (OB2, opción a)
**[A22: se puede cambiar]**. Desde 2x + 3 = 11 no acerca a la solución, así que no la revela.

Más «Deshacer» / «Undo» y «Empezar de nuevo» / «Start again» (P9, OP22).

## 6. Regla matemática y escritura de cada movimiento (OP20, OB3-OB7, OB11)

Toda operación se aplica a **cada lado completo**. Cada movimiento añade dos líneas:

1. La operación escrita: `(2x + 3) : 2 = 11 : 2`.
2. La forma simplificada, con la operación repartida en todos los términos: `x + 3/2 = 11/2`.

### 6.1 Reglas de escritura

- **Aritmética exacta.** Fracciones con numerador y denominador enteros, siempre simplificadas,
  con el denominador positivo. Fracciones impropias (11/2), nunca números mixtos ni decimales
  (OB7).
- **Términos nulos (OB6).** Los términos que valen 0 se eliminan: `2x + 0` → `2x`. Si un lado se
  queda sin términos, se escribe `0`.
- **Coeficiente de x (OB3).** Coeficiente 1 → `x`. Coeficiente fraccionario → `x/2`, `x/4`, `x/8`;
  nunca `1/2x`. Con estos seis botones el coeficiente es siempre una potencia de 2 positiva, así
  que `−x` y `0x` no aparecen.
- **Signos (OB5).** Un término negativo se escribe con «−» como operador: `x − 3/2`, nunca
  `x + −3/2`. Un lado que es un solo número negativo lleva el signo delante: `−1`. Se usa siempre el
  signo menos tipográfico «−».
- **Paréntesis en la línea escrita (OB4, OB5).** Al multiplicar o dividir, el lado va entre
  paréntesis si tiene más de un término, si es una fracción o si es un número negativo:
  `(2x + 3) : 2`, `(11/2) : 2`, `(5/2) · 2`, `(−1) · 2`. Un lado que es un único entero positivo o
  un único término en x no lleva paréntesis: `11 : 2`, `2x : 2`. Al sumar o restar no se ponen
  paréntesis: `x + 3/2 − 3`.
- **Presentación.** Si la pantalla lo permite, las fracciones se muestran en vertical; el texto
  para lector de pantalla y las pruebas usan la forma con barra de esta tabla.
- **Signos según idioma (OB11).** En español: `:` para dividir y `·` para multiplicar. En inglés:
  `÷` y `×`. Ejemplo: `(2x + 3) ÷ 2 = 11 ÷ 2`, `(2x + 3) × 2 = 11 × 2`. La línea simplificada es
  igual en los dos idiomas.

### 6.2 Ejemplos obligatorios para las pruebas

Filas 1-6 comprobadas por el revisor (OB1). Filas 7-12 añadidas en la versión 2 y comprobadas a
mano por Claude.

| N.º | Desde | Botón | Línea escrita (ES) | Línea simplificada |
| --- | --- | --- | --- | --- |
| 1 | 2x + 3 = 11 | Restar 3 | 2x + 3 − 3 = 11 − 3 | 2x = 8 |
| 2 | 2x = 8 | Dividir entre 2 | 2x : 2 = 8 : 2 | x = 4 |
| 3 | 2x + 3 = 11 | Dividir entre 2 | (2x + 3) : 2 = 11 : 2 | x + 3/2 = 11/2 |
| 4 | x + 3/2 = 11/2 | Restar 3 | x + 3/2 − 3 = 11/2 − 3 | x − 3/2 = 5/2 |
| 5 | 2x = 8 | Restar 3 | 2x − 3 = 8 − 3 | 2x − 3 = 5 |
| 6 | 2x + 3 = 11 | Multiplicar por 2 | (2x + 3) · 2 = 11 · 2 | 4x + 6 = 22 |
| 7 | x + 3/2 = 11/2 | Restar 3/2 | x + 3/2 − 3/2 = 11/2 − 3/2 | x = 4 |
| 8 | x + 3/2 = 11/2 | Dividir entre 2 | (x + 3/2) : 2 = (11/2) : 2 | x/2 + 3/4 = 11/4 |
| 9 | x = 4 | Dividir entre 2 | x : 2 = 4 : 2 | x/2 = 2 |
| 10 | x − 3/2 = 5/2 | Multiplicar por 2 | (x − 3/2) · 2 = (5/2) · 2 | 2x − 3 = 5 |
| 11 | 2x − 9 = −1 | Multiplicar por 2 | (2x − 9) · 2 = (−1) · 2 | 4x − 18 = −2 |
| 12 | 2x − 6 = 2 | Restar 2 | 2x − 6 − 2 = 2 − 2 | 2x − 8 = 0 |

Más una fila en inglés: desde 2x + 3 = 11, «Divide both sides by 2» → `(2x + 3) ÷ 2 = 11 ÷ 2`,
`x + 3/2 = 11/2`.

## 7. Fracciones y negativos en la balanza (A19, OP21, OP23, OB13-OB16)

- Se permiten en la línea algebraica y en el dibujo.
- Dibujo: cada platillo muestra sus términos como etiquetas de texto (`2x`, `3/2`, `−3`), no como
  pesas que haya que contar. Los términos negativos llevan un estilo distinto y su signo escrito;
  el color nunca es la única señal.
- La primera vez que aparece un número negativo, aviso neutro para el alumno (OB14):
  «Los números con − se muestran con su signo.» / «Numbers with − are shown with their sign.»
- Nota para el docente, visible en la vista del profesor (OB14):
  «La balanza indica que los dos lados valen lo mismo. Una balanza real no puede tener pesos
  negativos; aquí los números negativos y las fracciones se muestran como etiquetas con su signo.
  11 : 2 y 11/2 son el mismo número.» /
  «The scale shows that both sides have the same value. A real scale cannot hold negative weights;
  here negative numbers and fractions are shown as labels with their sign. 11 ÷ 2 and 11/2 are the
  same number.»
- **Límite (OB15)** **[A22: se puede cambiar]**: se aplica al coeficiente de x y a las constantes,
  a numeradores y denominadores. Ningún numerador puede superar 100 en valor absoluto y ningún
  denominador puede superar 8. Un botón que lo superaría se desactiva. Con este límite caben todos
  los caminos útiles. Desde 2x + 3 = 11 caben tres divisiones o tres multiplicaciones seguidas;
  desde otros estados el número cambia (desde x + 3/2 = 11/2 caben cuatro multiplicaciones y dos
  divisiones; desde 2x = 8, tres y cuatro). Lo que manda es el límite, no el número de pasos
  (corrección de la versión 3, 2026-11-13).
- El botón desactivado explica por qué, también al lector de pantalla (OB16):
  «Este paso daría números demasiado complicados para esta balanza. Puedes deshacer.» /
  «This step would make the numbers too complicated for this scale. You can undo.»

## 8. Mensajes (P9, OP22, OB17, OB19)

| Cuándo | ES | EN |
| --- | --- | --- |
| Tras cada operación que no deja x sola | La balanza sigue equilibrada. ¿Te acerca a dejar la x sola? | The scale is still balanced. Does this bring you closer to getting x on its own? |
| Tras 8 operaciones sin dejar x sola (una sola vez) | Puedes deshacer o empezar de nuevo cuando quieras. | You can undo or start again whenever you like. |
| La línea simplificada queda como «x = número» | Has dejado la x sola en un lado. Ahora comprueba ese valor en la ecuación del principio. | You have x on its own on one side. Now check that value in the original equation. |

- El contador de 8 cuenta solo operaciones (no «Deshacer») y vuelve a 0 con «Empezar de nuevo».
- No se califica al alumno ni se dice que un movimiento es malo. Nunca se indica qué botón pulsar.
- Mensajes de comprobación y respuesta: secciones 9.2 y 9.3.

## 9. Final, comprobación y respuesta (P9, OP25, OB19-OB25)

### 9.1 Estado final

- El estado final se detecta cuando la línea simplificada es `x = número`. Con estos botones x
  siempre queda a la izquierda, así que no se busca `número = x` (OB25).
- La balanza no declara que el valor sea la solución; solo pasa al paso de comprobación.
- Las operaciones siguen disponibles. Si el alumno sale de `x = número` (por ejemplo, fila 9), la
  comprobación y la respuesta se ocultan, y reaparecen si vuelve (OB24).

### 9.2 Comprobación (OB20, OB21)

Se comprueba **siempre contra la ecuación original 2x + 3 = 11**.

- Formas aceptadas, donde n es un número: `2 · n + 3 = 11`, `11 = 2 · n + 3`, `n · 2 + 3 = 11`,
  `2(n) + 3 = 11` y sus versiones con lados cambiados. Se ignoran los espacios; para multiplicar
  valen `·`, `*` y `×`. La letra `x` nunca se interpreta como multiplicar.
- Si la forma es correcta, se calcula:
  - Cierta y n es el valor de la balanza: comprobación hecha. Aparece el campo de respuesta.
    «Los dos lados dan lo mismo.» / «Both sides give the same result.»
  - Falsa: «Con ese valor los dos lados no dan lo mismo. Revisa la sustitución.» /
    «With that value the two sides are not equal. Check the substitution.»
  - Cierta pero n no es el valor de la balanza: no ocurre con 2x + 3 = 11; si ocurriera, se trata
    como forma incorrecta.
- Si hay una `x` entre dos números (`2x4+3=11`): «Para multiplicar usa · o *. La letra x es la
  incógnita.» / «To multiply, use × or *. The letter x is the unknown.»
- Cualquier otra forma, incluidas igualdades ciertas que no son la ecuación original (`11 = 11`,
  `2 · 4 = 8`, `24 + 3 = 11`): «Escribe la ecuación del principio cambiando x por el valor que has
  encontrado.» / «Write the original equation, replacing x with the value you found.»
- La comprobación no cuenta como envío y se puede repetir.

### 9.3 Respuesta final (OB22, OB23)

- Se escribe en un campo de texto. Se ignoran espacios y mayúsculas.
- Se aceptan como correctas: `x = 4`, `4 = x`, `x = +4`.
- Igualdad con x y un valor igual a 4 sin simplificar (`x = 8/2`, `x = 4/1`): no cuenta como
  intento. «Simplifica el número antes de enviarlo.» / «Simplify the number before submitting.»
- Igualdad bien escrita con otro valor (`x = 5`, `x = 7/2`): intento incorrecto.
- **Decimales (A23).** Un decimal se lee como número, con coma o con punto (`x = 3,5` y
  `x = 3.5` valen lo mismo), y se compara por su valor con la solución. Si vale lo mismo, es
  correcto (`x = 4,0`, `x = 4.0`); si no, es un intento incorrecto (`x = 3,5`). Solo se aceptan
  decimales exactos: `x = 4,0` se lee como 4, pero un decimal que redondea un valor no exacto no
  se da por igual **[A23: se puede cambiar]**. La balanza sigue mostrando fracciones, nunca
  decimales (sección 6.1).
- Un número solo (`4`) o algo que no se entiende: no cuenta como intento. «Escribe tu respuesta
  como x = …» / «Write your answer as x = …».
- El envío va por la actividad de la balanza (sección 2), no por las opciones.
- La respuesta se escribe después de dejar x sola (OB23, opción a) **[A22: se puede cambiar]**.
  La vista del profesor lo indica junto al envío:
  «Respuesta escrita después de dejar x sola en la balanza.» /
  «Answer written after getting x on its own on the scale.»

## 10. Accesibilidad y vista 3D (A3, OT20, OT21, OB27)

- La balanza vive en la lectura HTML. La vista 3D solo muestra el título y el enunciado. Si WebGL
  falla, la balanza funciona igual.
- Todo se maneja con teclado; los botones tienen el nombre completo de la operación.
- Cada línea nueva se anuncia una vez por la región `aria-live="polite"` que ya existe, sin repetir
  la página.
- El dibujo tiene una alternativa en texto con los signos (OB27):
  «Platillo izquierdo: 2x + 3. Platillo derecho: 11.» / «Left pan: 2x + 3. Right pan: 11.»
- Se respeta `prefers-reduced-motion`: sin animación de inclinación.

## 11. Archivos (sustituye la lista de F2-T1, según A21)

Puede tocar: `src/components/equation-balance.tsx` (nuevo), `src/lib/equation-balance.ts` (nuevo:
aritmética, escritura de líneas y lectura de la comprobación y la respuesta, sin React),
`src/lib/equation-balance.test.ts` (nuevo), `src/lib/interactive-book.ts`,
`src/lib/book-context.ts` (aceptar `"challenge" | "balance"` sin dejar de aceptar los datos
antiguos), `src/lib/mvp-learning-cycle.ts` y su prueba (solo lo de la sección 0),
`src/components/interactive-learning-book.tsx`, `src/components/mvp-learning-cycle.tsx`,
`src/lib/interactive-book.test.ts`, `docs/INTERACTIVE-BOOKS.md`.

Los dos archivos nuevos de `src/lib/` no figuran hoy en `harness/permisos.json`; la usuaria tendría
que añadirlos.

Prohibido, igual que antes: `src/lib/learning-twin.ts`, `src/lib/interactive-book/`, copias «2»,
`supabase/`, configuración y dependencias.

## 12. Pruebas mínimas

- Las doce filas de la sección 6.2 y la fila en inglés, más deshacer y empezar de nuevo.
- Fracciones simplificadas, impropias y con denominador positivo; nunca aparece `NaN`, un decimal,
  `+ −` ni `1/2x`.
- Límite de la sección 7: **partiendo de 2x + 3 = 11**, la cuarta multiplicación seguida y la
  cuarta división seguida quedan desactivadas con su aviso; partiendo de x + 3/2 = 11/2, la tercera
  división queda desactivada y la cuarta multiplicación sigue permitida.
- Comprobación: se aceptan `2·4+3=11`, `11 = 2 * 4 + 3` y `4 × 2 + 3 = 11`; se rechazan con su
  mensaje `11 = 11`, `2 · 4 = 8`, `1 + 1 = 2`, `24+3=11`, `2x4+3=11` y `2 · 5 + 3 = 11`; ninguna
  cuenta como envío.
- Respuesta: correctas `x=4`, `4 = x`, `X = 4`, `x = +4`, `x = 4,0` y `x = 4.0`; sin contar
  `x = 8/2` y `4`; incorrectas `x = 5`, `x = 3,5` y `x = 3.5`.
- Estado final: salir de `x = 4` oculta la comprobación y volver la muestra.
- Abrir la página no crea evidencia y no cambia el nivel de ayuda de las opciones.
- Un estado guardado con el formato anterior se sigue restaurando.
- Envío correcto e incorrecto en la balanza: evidencia con nivel 4, revisión pendiente y campos de
  razonamiento vacíos; la actividad de opciones no cambia.
- Límite de 5 envíos en la balanza, independiente del de las opciones.
- Todos los botones, mensajes, avisos y notas tienen texto en español y en inglés.

## Fuera de esta especificación

- D6 (paréntesis, incógnita en ambos lados, lugar de E6) y D14 (pistas de nivel 1) siguen
  pendientes y no afectan a la balanza.
- Las correcciones del capítulo aprobadas en P5-P8 se hacen en una tarea propia, no en F2-T1.
- Público de la versión inglesa (británico, estadounidense o bilingüe): sin indicar; el revisor no
  pudo valorar la naturalidad para un público concreto.
