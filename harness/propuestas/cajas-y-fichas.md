# Especificación: ecuaciones con cajas y fichas por niveles (F1-T6b, versión 4)

Estado: **Propuesto**. Sustituye a `harness/propuestas/balanza-2x3-11.md` (A25).
- Versión 1: redactada por Claude el 2026-11-13.
- Versión 2: el mismo día, con los errores y las sugerencias de la revisión pedagógica
  `harness/revisiones/2026-11-13-revision-cajas-fichas.md` (OC1-OC20), según A26.
- Versión 3: el mismo día, según A27. En el nivel 1 el alumno tacha para quitar y reparte él las
  fichas entre las cajas (sección 6.1). El nivel 2 no cambia.
- Versión 4: el mismo día, con D18, D19 y D20 resueltas (A28, A29 y A30). D17 sigue pendiente.

Falta la aprobación expresa de la usuaria (F1-T8b). Hasta entonces no se toca `src/`.

La maqueta `harness/propuestas/maqueta-cajas-fichas.html` (versión 4) aplica esta especificación y
está comprobada en el navegador. Las decisiones que la usuaria todavía no ha tomado van marcadas con
**[pendiente]**.

## 1. Base metodológica y origen

- El método viene de las sesiones de cajas y fichas del material de álgebra de pepvidalg: el Genially
  «Álgebra presentaciones y ejercicios» y el PDF «Presentación ecuaciones con cajas y positivos,
  primera sesión». Lo aportó la usuaria (P12, A25).
- Se toma el método, no el material: dibujos, ecuaciones y textos son propios (A4). La caja es un
  dibujo propio, sin marcas comerciales.
- **Cita de la fuente (A28).** La página y los créditos del libro dicen: «Método inspirado en los
  materiales de álgebra de Pepe Vidal (Proyecto Newton).» / «Method inspired by Pepe Vidal's algebra
  materials (Proyecto Newton).». Sin logotipos ni material copiado. La licencia no está comprobada;
  la usuaria considera que el método se puede usar.

## 2. Alcance

- Una página nueva, `boxes`, dentro del libro existente y sin ruta nueva. Dentro de la página hay un
  selector de tres niveles (sección 4).
- Solo enteros positivos. Nunca se quita lo que no hay ni se parte una ficha, así que no aparecen
  fracciones ni negativos. Todas las soluciones son enteras (A24).
- Desde cualquier estado hay un camino hasta el final. Por eso no hay callejones sin salida, y
  Deshacer solo sirve para acortar el camino (revisión, sección «Por qué no hay atascos»).
- Negativos, paréntesis y sistemas quedan para niveles posteriores, fuera de esta especificación.
- Español e inglés (A20): todo texto de la página tiene su pareja en inglés.

## 3. Representación

- Dos miembros separados por una línea vertical: «1.er miembro» y «2.º miembro».
- **Caja** = la incógnita.
  - En el nivel 0 lleva «?».
  - Cuando el alumno ha escrito la ecuación, lleva «x».
  - Cuando un ensayo da iguales, lleva ese número.
- **Ficha** = una unidad. Las fichas se agrupan de 5 en 5, como en un dado, para poder contarlas.
- Debajo de cada miembro va el recuento en texto: «3 cajas y 2 fichas», «Ninguna caja y 11 fichas»
  (OC16).
- Lo que se acaba de quitar se ve tachado y en gris hasta el paso siguiente, en grupos aparte de lo
  que queda.
- La ecuación tiene la forma a·x + b = c·x + d, con a, b, c y d enteros entre 0 y 20.

## 4. Niveles y ejercicios

| Nivel | Qué hace el alumno | Ejercicios (solución) |
| --- | --- | --- |
| 0 · Dibujo y ensayo | Escribe la ecuación del dibujo (o pide verla). Después prueba valores en la tabla hasta que los dos miembros tengan el mismo número de fichas. | 2x + 3 = 11 (4); 3x + 1 = x + 11 (5); 4x + 1 = 2x + 7 (3) |
| 1 · Tachar y repartir | Tacha lo mismo en los dos miembros y lo quita. Cuando quedan cajas solas frente a fichas, reparte él las fichas entre las cajas y dice cuántas hay en cada una. Cada paso se escribe en álgebra. Al final comprueba en la tabla. | 2x + 3 = 11 (4); 3x + 1 = x + 11 (5); 3x + 9 = 6x + 3 (2) |
| 2 · Solo símbolos | Lo mismo que el nivel 1, sin dibujo y con los pasos nombrados también como operaciones. | 4x + 5 = x + 20 (5); 6x + 1 = 2x + 13 (3); 2x + 15 = 5x + 3 (4) |

- **Comprobación de las soluciones.** Las nueve están comprobadas sustituyendo en los dos miembros,
  por el revisor y en la maqueta: 11, 16, 13 / 11, 16, 15 / 25, 19, 23.
- **Variedad (OC9).** Las soluciones ya no se repiten tanto: 4, 5, 3 / 4, 5, 2 / 5, 3, 4.
- **Progresión (OC10).** Los dos primeros ejercicios del nivel 1 son los dos primeros del nivel 0.
  Así, la única novedad al cambiar de nivel es el método. 3x + 9 = 6x + 3 aporta una sola novedad
  más: la caja queda a la derecha (`2 = x`) (OC11).
- **Orden de los niveles (A29).** Los niveles se abren en orden. **[A29: se puede cambiar]** Cada
  nivel se abre al resolver (respuesta correcta enviada) un ejercicio del nivel anterior. Mientras
  tanto, el botón del nivel se ve desactivado y dice: «Se abre al resolver un ejercicio del nivel
  0.» (o «del nivel 1»). Dentro de un nivel, los tres ejercicios están abiertos.
- El puente al nivel 1 de la sección 7 aparece al resolver un ejercicio del nivel 0.

## 5. Escribir la ecuación (nivel 0)

- Se escribe en un campo de texto. Se ignoran los espacios y las mayúsculas, y también `·`, `*` y `×`
  entre número y x.
- Se acepta si coinciden las cajas y las fichas de cada miembro, en cualquier orden de términos y
  con los miembros cambiados: `3x+1=x+11`, `1+3x = 11 + x`, `x+11=3x+1`, `x+x+x+1=x+11`.
- Mensajes:
  - Coincide: «Eso es lo que muestra el dibujo: 3x + 1 = x + 11.»
  - Está bien escrita pero no coincide: «Esa ecuación no tiene las mismas cajas y fichas que el
    dibujo. Cuenta otra vez las cajas y las fichas de cada miembro.» (OC19)
  - No se entiende: «Escríbela con x para las cajas, números para las fichas y un signo =. Por
    ejemplo: 4x + 2 = x + 8.» El ejemplo no es ninguna de las nueve ecuaciones.
- «Ver la ecuación» la muestra sin que el alumno la escriba. Queda anotado para el profesor
  (sección 9).
- La tabla de ensayo no se abre hasta que el alumno escribe la ecuación o pulsa «Ver la ecuación»
  (OC1).

## 6. Pasos (niveles 1 y 2)

### 6.1 Nivel 1: tachar y repartir a mano (A27)

En el nivel 1 no hay listas ni botones que hagan la cuenta. El alumno actúa sobre el dibujo.

- **Tachar.** Cada caja y cada ficha del tablero es un botón. Al tocarlo se tacha; al tocarlo otra
  vez se destacha. Debajo se ve lo tachado en cada miembro: «Tachado: 1.er miembro, 1 caja y 1
  ficha; 2.º miembro, 1 caja y 1 ficha.».
- **Quitar lo tachado.** El botón solo funciona si lo tachado es igual en los dos miembros (mismas
  cajas y mismas fichas). Si no: «Tacha lo mismo en los dos miembros para poder quitarlo.». Se
  pueden quitar cajas y fichas en el mismo paso.
  - Línea escrita: `3x + 1 − x − 1 = x + 11 − x − 1` → queda `2x = 10`.
  - Cuaderno: «Tachar y quitar 1 caja y 1 ficha de cada miembro».
- **Repartir.** Se activa cuando en un miembro quedan 2 o más cajas solas y en el otro solo fichas
  (por ejemplo, 2 cajas frente a 10 fichas). Sustituye a «hacer grupos» en este nivel.
  - Texto: «Hay 2 cajas frente a 10 fichas. Reparte las fichas: toca una caja para meter una ficha
    dentro.».
  - Cada toque mete una ficha en esa caja. La caja muestra cuántas lleva y el montón de fichas baja:
    «Quedan 3 fichas por repartir.». «Volver a repartir» las devuelve todas.
  - Si se terminan las fichas y las cajas no tienen lo mismo: «Las cajas no tienen el mismo número
    de fichas, y todas las cajas tienen dentro lo mismo. Vuelve a repartir.».
  - Si todas tienen lo mismo, la pregunta: «¿Cuántas fichas hay en cada caja?». Si el número no es
    el de una caja: «Cuenta las fichas que hay dentro de una de las cajas.».
  - Con la respuesta correcta se escribe `2x : 2 = 10 : 2` → `x = 5` (o `6 : 3 = 3x : 3` → `2 = x` si
    las cajas están a la derecha). Cuaderno: «Repartir 10 fichas entre 2 cajas: 5 en cada caja».
- **Mensaje inicial del nivel 1:** «Tacha lo que quieras quitar. Se quitará de los dos miembros a la
  vez.».
- Con los tres ejercicios del nivel 1 siempre se llega a cajas solas frente a fichas, así que no
  hace falta «hacer grupos» con cajas y fichas en el mismo miembro.

### 6.2 Nivel 2: pasos con listas


| Paso (nombre en el nivel 1 hasta la versión 2 · nombre en el nivel 2) | Cuándo se puede | Línea escrita | Ejemplo |
| --- | --- | --- | --- |
| Quitar k cajas de cada miembro · Quitar cajas (restar x) | k ≤ cajas de cada miembro | `3x + 1 − x = x + 11 − x` | queda `2x + 1 = 11` |
| Quitar k fichas de cada miembro · Quitar fichas (restar un número) | k ≤ fichas de cada miembro | `2x + 1 − 1 = 11 − 1` | queda `2x = 10` |
| Hacer n grupos iguales en cada miembro y quedarse con un grupo · Hacer grupos iguales y quedarse con uno (dividir) | n ≥ 2 divide a todas las cantidades | `2x : 2 = 10 : 2`; con dos términos, entre paréntesis: `(4x + 6) : 2 = 22 : 2` | queda `x = 5` |

- **Nombres de los pasos (OC7, OC12, OC20).** El control y el cuaderno usan el mismo nombre. En el
  nivel 2, el cuaderno añade la operación entre paréntesis: «(restar x)», «(restar 5)», «(dividir
  entre 3)».
- **Valores posibles.** El número k o n se elige de una lista que solo contiene valores posibles. Si
  no hay ninguno, el paso se desactiva y explica por qué, también al lector de pantalla:
  - «Hace falta que haya cajas en los dos miembros.»
  - «Hace falta que haya fichas en los dos miembros.»
  - «Ahora no se pueden hacer grupos iguales sin abrir una caja ni partir una ficha.»
- **Estado final.** Una caja sola frente a fichas, en cualquiera de los dos miembros (`x = 5` o
  `2 = x`). Entonces se desactivan los pasos y, en lugar de las tres explicaciones, aparece una
  sola: «Ya está la caja sola.» (nivel 2: «Ya está la x sola.») (OC6).
- **Escritura.** «x» con coeficiente 1 se escribe `x`. En inglés se usa `÷` en lugar de `:`. Un
  miembro vacío no puede darse con estos ejercicios, porque exigiría x = 0.
- **Deshacer y Empezar de nuevo**, como en la especificación anterior.
- **Mensajes.** No califican y no dicen qué paso dar:
  - Antes del primer paso: «Elige un paso. Se hará en los dos miembros a la vez.»
  - Tras cada paso: «Los dos miembros siguen teniendo el mismo número de fichas, contando las que
    hay dentro de las cajas. ¿Te acerca a saber cuántas hay en una caja?» (OC4)
  - Tras 8 pasos sin llegar al final: «Puedes deshacer o empezar de nuevo cuando quieras.»
  - Estado final, nivel 1: «Ha quedado una caja sola frente a 5 fichas. Ahora comprueba ese valor en
    la ecuación del principio.»
  - Estado final, nivel 2: «Ha quedado x sola frente a 5. Ahora comprueba ese valor en la ecuación
    del principio.» (OC8)

## 7. Tabla de ensayo y comprobación (todos los niveles)

- **Cuándo se abre (OC1, OC2).**
  - En el nivel 0, tras escribir la ecuación o pulsar «Ver la ecuación». Antes muestra: «Primero
    escribe el dibujo en lenguaje algebraico.»
  - En los niveles 1 y 2, solo en el estado final. Antes muestra: «La comprobación se abre cuando la
    caja queda sola en un miembro.»
- **Qué se escribe.** «Si hubiera [n] fichas en cada caja…», con n entero de 0 a 30. Si no, aparece
  en pantalla y se anuncia: «Escribe un número entero de fichas, de 0 a 30.» (OC5)
- **Cada ensayo** añade una fila con la sustitución en la **ecuación del principio**. Encima de cada
  columna va la expresión de su miembro. Un miembro sin cajas se escribe solo con su número (OC15).
  La última columna dice «iguales» o «distintos», nunca «error» ni «acierto». Si son distintos, dice
  también qué miembro tiene más, sin calificar (OC17 a). Ejemplo con 3x + 1 = x + 11:

  | Ensayo | Fichas por caja | 1.er miembro: 3x + 1 | 2.º miembro: x + 11 | ¿Iguales? |
  | --- | --- | --- | --- | --- |
  | 1.º | x = 2 | 3 · (2) + 1 = 7 | (2) + 11 = 13 | distintos · más en el 2.º miembro |
  | 2.º | x = 6 | 3 · (6) + 1 = 19 | (6) + 11 = 17 | distintos · más en el 1.er miembro |
  | 3.º | x = 5 | 3 · (5) + 1 = 16 | (5) + 11 = 16 | iguales |

- **Con «iguales»**, las cajas muestran el número y aparece el hecho, no la solución (OC3): «Con 5
  fichas en cada caja, los dos miembros tienen 16 fichas.» Después, la tabla se cierra.
- **Puente al nivel 1 (OC17 b).** Al terminar un ejercicio del nivel 0 aparece: «¿Qué podrías quitar
  de los dos miembros sin que dejen de tener el mismo número de fichas? Pruébalo en el nivel 1.»,
  con el botón «Ir al nivel 1».
- **Los ensayos no son envíos** y no cuentan como intentos.

## 8. Respuesta final y actividad propia (A18, A21, A23)

- **Cuándo aparece.** Tras el hecho de la sección 7 aparece el campo «Tu respuesta». El alumno
  escribe él la solución, porque la página no la ha dicho (OC3).
- **Lectura de la respuesta** (A23), para un ejercicio con solución 5:
  - Correctas: `x = 5`, `5 = x`, `x = +5`, `x = 5,0`.
  - No cuentan como intento: `x = 10/2` («Simplifica el número antes de enviarlo.») y `5` («Escribe
    tu respuesta como x = …»).
  - Incorrecta: `x = 4`.
- **Actividad propia.** Cada ejercicio es una actividad propia, con su identificador, sus 5 envíos y
  su estado guardado aparte. La actividad de opciones no cambia (A18, A21).
- **Texto tras enviar (A30).** El alumno sabe si su respuesta es correcta:
  - Correcta: «Respuesta correcta. Tu profesor o profesora la revisará.»
  - Incorrecta: «Esa respuesta no es correcta. Intento n de 5. Compruébala en la tabla.»
  - Incorrecta en el quinto envío: «Esa respuesta no es correcta y has usado los 5 envíos de este
    ejercicio. Tu profesor o profesora lo revisará contigo.»

## 9. Evidencia y nivel de ayuda (A14, A17)

- Solo el envío final crea evidencia, con revisión humana pendiente. Los pasos, los ensayos y la
  ecuación escrita no se registran como evidencia (A14).
- La vista del profesor indica el nivel del ejercicio y si el alumno pidió «Ver la ecuación».
- Nivel de ayuda propio, que no sube el de los intentos con opciones (A17).
- **[pendiente, D17]** Valor declarado. Propuestas:
  - Niveles 1 y 2: 4 (procedimiento guiado). El revisor está de acuerdo.
  - Nivel 0: la propuesta inicial era 2. El revisor indica que la tabla hace las cuentas y propone 3,
    o pedir al alumno los totales y mantener el 2. Subir un punto si se usa «Ver la ecuación».
  - Nivel 1 desde A27: el alumno tacha y reparte él y dice cuántas fichas hay en cada caja. Claude
    propone bajarlo a 3.

## 10. Accesibilidad y vista 3D (A3)

- El tablero tiene una alternativa en texto: «Primer miembro: 2 cajas y 3 fichas. Segundo miembro:
  ninguna caja y 11 fichas.» Cuando corresponde, añade «Tachado y en gris, lo que se acaba de
  quitar.» y, al repartir, «Quedan n fichas por repartir.».
- En el nivel 1, cada caja y cada ficha es un botón con nombre propio («Ficha 2 del 2.º miembro,
  tachada»; al repartir, «Caja 1, con 3 fichas. Meter una ficha.»), que se maneja con teclado.
- Todo se maneja con teclado. Cada paso y cada ensayo se anuncian una vez por la región
  `aria-live="polite"` que ya existe.
- El color nunca es la única señal: «iguales» y «distintos» van escritos.
- Sin animaciones con `prefers-reduced-motion`. La vista 3D solo muestra el título y el enunciado.

## 11. Archivos (sustituye la lista de F2-T1)

Puede tocar:
- `src/components/equation-boxes.tsx` (nuevo).
- `src/lib/equation-boxes.ts` (nuevo): estado, pasos, escritura de líneas y lectura de la ecuación,
  los ensayos y la respuesta, sin React.
- `src/lib/equation-boxes.test.ts` (nuevo).
- `src/lib/interactive-book.ts`.
- `src/lib/book-context.ts`: aceptar la página nueva sin dejar de aceptar los datos antiguos.
- `src/lib/mvp-learning-cycle.ts` y su prueba: solo parametrizar la actividad (A21).
- `src/components/interactive-learning-book.tsx`.
- `src/components/mvp-learning-cycle.tsx`.
- `src/lib/interactive-book.test.ts`.
- `docs/INTERACTIVE-BOOKS.md`.

`harness/permisos.json` todavía nombra `equation-balance.tsx`. La usuaria tendría que cambiarlo por
los tres archivos nuevos.

Prohibido: `src/lib/learning-twin.ts`, `src/lib/interactive-book/`, las copias «2», `supabase/`, la
configuración y las dependencias.

## 12. Pruebas mínimas

- **Soluciones.** Las nueve de la sección 4 son enteras y cumplen su ecuación.
- **Escritura** (sección 5), con 3x + 1 = x + 11:
  - Se aceptan `3x+1=x+11`, `1+3x = 11 + x`, `x+11=3x+1` y `3·x+1=x+11`.
  - No coincide `3x+1=11`.
  - No se entiende `hola`.
- **Tabla cerrada.** En el nivel 0, antes de escribir la ecuación. En los niveles 1 y 2, fuera del
  estado final.
- **Pasos, nivel 2.** 3x + 9 = 6x + 3 → quitar 3 cajas → `9 = 3x + 3` → quitar 3 fichas → `6 = 3x` →
  hacer 3 grupos → `2 = x`, con las líneas escritas de la sección 6.2. Deshacer vuelve a `6 = 3x`.
- **Tachar, nivel 1**, con 3x + 1 = x + 11:
  - Con 1 caja tachada solo a la izquierda, «Quitar lo tachado» no funciona y se ve el aviso.
  - Con 1 caja y 1 ficha tachadas en cada miembro: `3x + 1 − x − 1 = x + 11 − x − 1` → `2x = 10`.
  - Lo quitado se ve tachado, en grupos aparte.
- **Repartir, nivel 1**, desde 2x = 10:
  - 6 y 4 fichas → aviso de que no tienen lo mismo y sin pregunta.
  - 5 y 5 → pregunta. «4» → «Cuenta las fichas…». «5» → `2x : 2 = 10 : 2` → `x = 5`.
  - Deshacer vuelve a `2x = 10` con el reparto vacío.
  - 3x + 9 = 6x + 3 → tachar 3 cajas y 3 fichas en cada miembro → `6 = 3x` → repartir 6 entre 3 →
    «2» → `6 : 3 = 3x : 3` → `2 = x`.
- **Pasos imposibles.** Nunca se ofrece quitar más de lo que hay ni hacer grupos que no salen
  exactos. En el estado final solo se ve «Ya está la caja sola.».
- **Ensayos** en 3x + 1 = x + 11:
  - 2 → 7 y 13, más en el 2.º.
  - 6 → 19 y 17, más en el 1.er.
  - 5 → 16 y 16, iguales.
  - 31 y «hola» se rechazan con su aviso.
- **Respuesta.** Los casos de la sección 8.
- **Sin efectos al abrir.** Abrir la página no crea evidencia y no cambia el nivel de ayuda de las
  opciones.
- **Datos antiguos.** Un estado guardado con el formato anterior se sigue restaurando.
- **Envíos.** Límite de 5 por actividad, independiente de las opciones. Textos de la sección 8.
- **Orden de los niveles.** Al empezar, los niveles 1 y 2 están cerrados con su aviso. Una respuesta
  correcta en el nivel 0 abre el nivel 1 y el puente; una en el nivel 1 abre el nivel 2. Una
  respuesta incorrecta no abre nada.
- **Cita.** La línea de la sección 1 se ve en la página.
- **Idiomas.** Todos los textos tienen versión en español y en inglés.
