# Revisión pedagógica: `harness/propuestas/capitulo-ecuaciones.md`

> Nota del coordinador (2026-11-12): informe guardado íntegro, tal como lo devolvió el subagente
> `revisor-pedagogico`. Solo se ha dejado relativa a la raíz del proyecto la ruta del archivo revisado.

Archivo revisado: `harness/propuestas/capitulo-ecuaciones.md`
Consultas de apoyo, sin modificar nada:
- `src/lib/learning-twin.ts`: la escala de ayudas tiene 6 niveles, del 0 al 5. Son: sin ayuda, reformulación, pista conceptual, ejemplo análogo, procedimiento guiado y solución dirigida.
- `src/lib/mvp-learning-cycle.ts`: el ejercicio actual es 2x + 3 = 11, con las opciones 2, 3, 4 y 6 y dos pistas, de nivel 2 y de nivel 4.

Este informe es una propuesta. Nada de lo que contiene está aprobado hasta que lo decidas tú.

---

## Resumen

- **Exactitud matemática.** He resuelto y comprobado a mano los 5 ejemplos, los 6 ejercicios y las 18 pistas. **No hay ningún error de cálculo.** En cada ejercicio hay exactamente una opción correcta: he sustituido las cuatro opciones en la ecuación.
- **Errores que conviene corregir.** Son tres, y ninguno es un fallo de cálculo:
  - El enunciado de E6 se puede leer de dos maneras (OP11).
  - La pista de nivel 2 de E6 da la ecuación completa, que es justo lo nuevo que pide ese ejercicio (OP16).
  - E6 no tiene antes un ejemplo resuelto del mismo tipo (OP3).
- **Distractores.**
  - E5 es el ejercicio mejor construido.
  - En E1, E2, E3, E4 y E6 hay al menos una opción poco verosímil.
  - En E3 y E4 falta el distractor más útil: quedarse a mitad de camino (8 y 15).
  - La respuesta correcta nunca es la menor ni la mayor de las cuatro opciones (OP13).
- **Pistas.** Son correctas y casi siempre ayudan más a cada nivel.
  - Algunas de nivel 1 no son reformulaciones, sino estrategia (E4, E6).
  - Varias de nivel 4 dejan un solo cálculo trivial (E3, E5, E6).
- **Balanza.** La idea es correcta. Falta definir qué pasa con los movimientos válidos pero inútiles, las fracciones, los números negativos y el cero, y cómo se relaciona con la respuesta de opción múltiple.

---

## Ejemplos resueltos (R1-R5)

### Comprobación paso a paso

| N.º | Mi resolución | Sustitución | Veredicto |
| --- | --- | --- | --- |
| R1 | x + 5 − 5 = 12 − 5 → x = 7 | 7 + 5 = 12 ✓ | **Correcto** |
| R2 | 3x : 3 = 15 : 3 → x = 5 | 3 · 5 = 15 ✓ | **Correcto** |
| R3 | 3x = 14 − 2 = 12 → x = 4 | 3 · 4 + 2 = 14 ✓ | **Correcto** |
| R4 | 4x − 2x − 3 = 7 → 2x − 3 = 7 → 2x = 10 → x = 5 | 20 − 3 = 17 y 10 + 7 = 17 ✓ | **Correcto** |
| R5 | 2x + 6 = 14 → 2x = 8 → x = 4 | 2 · (4 + 3) = 2 · 7 = 14 ✓ | **Correcto** |

### Observaciones

| ID | Elemento | Gravedad | Tipo | Problema | Propuesta |
| --- | --- | --- | --- | --- | --- |
| OP1 | R4 | Mejora | Didáctica | R4 trae dos novedades a la vez: la incógnita en los dos lados y el primer término que se resta (−3). R1-R3 solo suman. «Deshacer una resta sumando» aparece por primera vez sin ejemplo propio. | Opción A: añadir un ejemplo intermedio con resta, como 2x − 5 = 9. Opción B: cambiar R4 a una versión con sumas, como 4x + 3 = 2x + 13 (x = 5), y dejar la resta para E4. |
| OP2 | R4 y R5 | Sugerencia | Didáctica | Es una opinión. R5 (paréntesis y luego dos pasos) suele resultar más fácil que R4 (incógnita en ambos lados). El orden actual pone lo más difícil antes. | Valorar el orden R5 → R4 y, en paralelo, E5 → E4. |
| OP3 | Falta un ejemplo para E6 | **Error** (criterio de progresión) | Didáctica | No hay ningún ejemplo resuelto que traduzca un enunciado a ecuación. E6 pide algo que no se ha mostrado antes. | Añadir un R6, por ejemplo: «Si al doble de un número le sumas 5, obtienes 17» → 2x + 5 = 17 → x = 6. Comprobación: 2 · 6 + 5 = 17. |
| OP4 | R5 | Sugerencia | Didáctica | «Quitar paréntesis» no dice cómo. Además, R5 tiene el signo + dentro del paréntesis y E5 tiene −. Que 3 · (−2) = −6 es una pequeña novedad. | Escribir: «Multiplicar el 2 por cada término del paréntesis: 2 · x + 2 · 3 = 2x + 6». También se puede mencionar que se puede dividir primero entre 2, el camino alternativo que propone la pista de E5. |
| OP5 | R1-R5 | Sugerencia | Didáctica | Los pasos no muestran la línea intermedia: x + 5 − 5 = 12 − 5. | En al menos R1 y R3, mostrar la operación escrita en los dos lados antes de simplificar. Así se enlaza con la «regla de la balanza» de la página 2 y con lo que escribirá la balanza manipulable. |

---

## Ejercicios y distractores (E1-E6)

Las causas que doy para cada opción incorrecta son **hipótesis de diseño**: el desliz que podría producir ese número. No son un diagnóstico de quien la elija. Elegir una opción solo dice si la respuesta es correcta, no cómo ha razonado el alumno (así lo indica también el comentario del código en `mvp-learning-cycle.ts`).

### E1: x + 7 = 15 (correcta: 8) · **Mejorable**

Comprobación: 8 + 7 = 15 ✓. No sirven 7 (14), 9 (16) ni 22 (29).

| Opción | Desliz que podría producirla | Valoración |
| --- | --- | --- |
| 7 | Copiar el número que aparece junto a x | Verosímil |
| 9 | Fallo de resta (15 − 7) | Poco verosímil, casi arbitraria |
| 22 | Sumar 7 en vez de restar (15 + 7) | Muy verosímil |

**OP6 (Mejora).** Cambiar 9 por 15 (dar como respuesta el lado derecho, sin operar). Opciones: 7, 8, 15, 22.

### E2: 4x = 28 (correcta: 7) · **Mejorable**

Comprobación: 4 · 7 = 28 ✓.

| Opción | Desliz que podría producirla | Valoración |
| --- | --- | --- |
| 6 | Fallo de cálculo en 28 : 4 | Poco verosímil |
| 24 | Leer 4x como x + 4 y restar 4 | Muy verosímil |
| 32 | Sumar 4 | Verosímil |

**OP7 (Mejora).** Cambiar 6 por 112: multiplicar por 4 en vez de dividir. Es la operación contraria, igual que hace 22 en E1. Opciones: 7, 24, 32, 112.

### E3: 2x + 3 = 11 (correcta: 4) · **Mejorable**

Comprobación: 2 · 4 + 3 = 11 ✓. No sirven 2 (7), 3 (9) ni 6 (15).

| Opción | Desliz que podría producirla | Valoración |
| --- | --- | --- |
| 2 | Copiar el coeficiente | Poco verosímil |
| 3 | Intercambiar coeficiente y término: (11 − 2) : 3 | Verosímil |
| 6 | Restar 2 en vez de dividir: 11 − 3 − 2 | Verosímil |

**OP8 (Mejora).** Falta el distractor más útil, **8**: restar 3 y no dividir (2x = 8). También sería buena opción 7, que sale de (11 + 3) : 2. Se podría cambiar 2 por 8. Ojo: es el ejercicio que ya existe en el código. Cambiar sus opciones afecta a lo que ya está hecho, así que la decisión es tuya y la parte técnica es del revisor técnico.

### E4: 5x − 4 = 2x + 11 (correcta: 5) · **Mejorable**

Comprobación: 25 − 4 = 21 y 10 + 11 = 21 ✓. No sirven 1 (1 frente a 13), 3 (11 frente a 17) ni 7 (31 frente a 25).

| Opción | Desliz que podría producirla | Valoración |
| --- | --- | --- |
| 1 | Ninguno identificable | **Arbitraria** |
| 3 | Dar el coeficiente de 3x = 15 como respuesta | Poco verosímil |
| 7 | Error de signo con el −4 (3x = 11 − 4 = 7) y no dividir | Verosímil |

**OP9 (Mejora).**
- Cambiar 1 por **15**: llegar a 3x = 15 y no dividir. Opciones: 3, 5, 7, 15.
- Además, la serie 1, 3, 5, 7 parece puesta a propósito y permite adivinar.

### E5: 3(x − 2) = 12 (correcta: 6) · **Correcto**

Comprobación: 3 · (6 − 2) = 12 ✓. No sirven 2 (0), 4 (6) ni 14 (36).

| Opción | Desliz que podría producirla | Valoración |
| --- | --- | --- |
| 2 | Dividir entre 3 y luego restar 2 en vez de sumarlo | Muy verosímil |
| 4 | Quedarse en x − 2 = 4 | Muy verosímil |
| 14 | Multiplicar solo la x (3x − 2 = 12 → 3x = 14) y no dividir. También ignorar el 3 (12 + 2). | Muy verosímil |

Es el mejor conjunto de opciones del capítulo.

### E6: «El triple de un número menos 4 es 17» (correcta: 7) · **Corregir**

Comprobación: 3 · 7 − 4 = 17 ✓. No sirven 5 (11), 13 (35) ni 21 (59).

| Opción | Desliz que podría producirla | Valoración |
| --- | --- | --- |
| 5 | Calcular 17 − 3 · 4 (dudoso) | Casi arbitraria |
| 13 | Restar 4 en vez de sumar (17 − 4) y no dividir | Verosímil |
| 21 | Llegar a 3x = 21 y no dividir | Muy verosímil |

| ID | Gravedad | Tipo | Problema | Propuesta |
| --- | --- | --- | --- | --- |
| OP10 | Mejora | Didáctica | La opción 5 apenas responde a un desliz razonable. | Cambiarla por 63: multiplicar por 3 en vez de dividir, (17 + 4) · 3. |
| OP11 | **Error** | Lenguaje (ambigüedad) | «El triple de un número menos 4» puede leerse como 3x − 4 o como 3(x − 4). Con la segunda lectura, 3(x − 4) = 17 da x = 29/3, que no está entre las opciones. Quien la haga quedará desconcertado sin haber hecho nada mal. | Reescribir: «Si al triple de un número le restas 4, obtienes 17. ¿Qué número es?». |

### Observaciones comunes a los ejercicios

| ID | Gravedad | Tipo | Problema | Propuesta |
| --- | --- | --- | --- | --- |
| OP12 | Mejora | Lenguaje | E1-E5 son solo la ecuación, sin una orden. «(el ejercicio actual)» en E3 es una nota interna. | Empezar cada uno con «Resuelve:» o «¿Cuánto vale x?», como ya hace el código actual. Comprobar que la nota interna no llegue al alumno. |
| OP13 | Sugerencia | Didáctica | Las opciones van de menor a mayor y la correcta está siempre en 2.ª o 3.ª posición. Nunca es la menor ni la mayor. Un alumno atento puede descartar los extremos sin resolver. | Elegir los distractores de modo que en algún ejercicio la correcta sea la menor o la mayor. Con OP6, en E1 ya no sería así (7, 8, 15, 22). Con OP9, en E4 tampoco (3, 5, 7, 15). |
| OP14 | Sugerencia | Didáctica | Todas las soluciones son números naturales pequeños. | Para más adelante, no en este capítulo: incluir alguna solución negativa o fraccionaria. Así no se refuerza la idea de que «la solución siempre es un número natural». |

---

## Pistas (18 = 3 niveles × 6 ejercicios)

Escala del código: 1 reformulación, 2 pista conceptual, 3 ejemplo análogo, 4 procedimiento guiado, 5 solución dirigida. La propuesta usa los niveles 1, 2 y 4. Todas las pistas son **matemáticamente exactas**: he comprobado las ecuaciones intermedias 2x = 8, 3x − 4 = 11, x − 2 = 4, 3x − 4 = 17 y 3x = 21.

| Ej. | Nivel 1 | Nivel 2 | Nivel 4 | ¿Ayuda más a cada nivel? | Veredicto |
| --- | --- | --- | --- | --- | --- |
| E1 | Buena reformulación | Conceptual, no revela nada | Deja solo 15 − 7 | Sí | **Correcto** (ver OP17) |
| E2 | Buena reformulación | Conceptual, no revela nada | Deja solo 28 : 4 | Sí | **Correcto** (ver OP17) |
| E3 | Buena reformulación | Conceptual, no revela nada | Da 2x = 8 y deja solo 8 : 2 | Sí | **Mejorable** (OP17) |
| E4 | No es reformulación, es estrategia | Correcta, aunque más bien de procedimiento | Da 3x − 4 = 11. Quedan dos pasos. | Sí, pero el nivel 1 se solapa con el 2 | **Mejorable** (OP15) |
| E5 | Buena reformulación | Muy buena: ofrece dos caminos | Da x − 2 = 4 y deja solo 4 + 2 | Sí | **Mejorable** (OP17, OP18) |
| E6 | Ya traduce parte del enunciado | **Da la ecuación completa** | Da 3x = 21 y deja solo 21 : 3 | Sí, pero el nivel 2 revela lo esencial | **Corregir** (OP16) |

Ninguna pista de nivel 1 o 2 da la solución numérica. El problema de E6 es que el nivel 2 resuelve la dificultad propia del ejercicio, que es traducir el enunciado a ecuación.

| ID | Gravedad | Tipo | Problema | Propuesta |
| --- | --- | --- | --- | --- |
| OP15 | Mejora | Didáctica | El nivel 1 de E4 explica una estrategia, no reformula el enunciado. | Nivel 1: «Cinco veces un número, menos 4, da lo mismo que dos veces ese número, más 11». Pasar «el objetivo es dejar las x en un lado y los números en el otro» al nivel 2. |
| OP16 | **Error** (criterio de pistas) | Didáctica | En E6, el nivel 2 da la ecuación 3x − 4 = 17. El nivel 1 ya traduce «el triple de x». Así el alumno no traduce nada por sí mismo. | Nivel 1: «Piensa en un número. Lo multiplicas por 3, le quitas 4 y te sale 17». Nivel 2: «Llama x al número. ¿Cómo se escribe "el triple de x"? ¿Y "menos 4" y "es 17"?». Nivel 4: «La ecuación es 3x − 4 = 17. Deshaz primero la resta en los dos lados y después la multiplicación». |
| OP17 | Mejora | Didáctica | En E3, E5 y E6, el nivel 4 hace el primer paso por el alumno y deja un solo cálculo trivial. Por encima aún queda el nivel 5 («solución dirigida»), así que el 4 debería dejar más trabajo. En E1 y E2 es inevitable, porque son ecuaciones de un solo paso. | Que el nivel 4 diga qué pasos dar sin dar los resultados. Ejemplo para E3: «Paso 1: resta 3 en los dos lados y escribe la ecuación que queda. Paso 2: ¿qué operación deshace multiplicar por 2? Aplícala en los dos lados». Ojo: la pista actual de E3 ya está en el código, así que cambiarla es decisión tuya. |
| OP18 | Sugerencia | Didáctica | El nivel 2 de E5 ofrece dos caminos y el nivel 4 solo sigue uno, el de dividir. Quien haya elegido quitar el paréntesis no recibe guía. | Nivel 4: «Si quitas el paréntesis, queda 3x − 6 = 12. Si divides entre 3, queda x − 2 = 4. Sigue por el camino que hayas elegido». |
| OP19 | No verificable desde la didáctica | — | En el código actual, la ayuda pasa del nivel 0 al 2 y luego al 4. Si se mantiene así, las pistas de nivel 1 nunca se mostrarían. | Lo señalo para el revisor técnico. No lo valoro. |

---

## Balanza manipulable (2x + 3 = 11)

**Lo que está bien.** Aplicar la misma operación a los dos lados es exactamente la «regla de la balanza» de la página 2. Que cada movimiento escriba la línea algebraica une el modelo con la notación. Pedir la comprobación al final encaja con la página 5.

**Qué pasa con cada movimiento posible.** Lo he calculado:

| Movimiento sobre 2x + 3 = 11 | Resultado | ¿Válido? | ¿Útil? |
| --- | --- | --- | --- |
| Restar 3 | 2x = 8 | Sí | Sí, es el camino directo |
| Restar 2 | 2x + 1 = 9 | Sí | No acerca mucho, pero no rompe nada. Después, restar 1 lleva a 2x = 8. |
| Multiplicar por 2 | 4x + 6 = 22 | Sí | No. La ecuación sigue siendo equivalente, pero se aleja de la solución. |
| Dividir entre 2 antes de restar 3 | x + 3/2 = 11/2 → x = 4 | Sí | Sí, aunque con fracciones |
| Restar 12, por ejemplo | 2x − 9 = −1 | Sí | No. Aparecen números negativos que una balanza física no puede mostrar. |
| Multiplicar o dividir por 0 | 0 = 0 o sin sentido | **No** | Hay que impedirlo |

Todos los movimientos de los botones propuestos son **matemáticamente legítimos**. Ninguno es un «error». Que un movimiento no sea útil no significa que esté mal.

| ID | Gravedad | Tipo | Problema | Propuesta |
| --- | --- | --- | --- | --- |
| OP20 | **Error** si se implementa mal | Matemático | «Dividir entre 2» antes de restar debe dividir **todos** los términos: (2x + 3) : 2 = 11 : 2, es decir, x + 3/2 = 11/2. Si la línea escribiera x + 3 = 11/2, enseñaría un error clásico. | Definir que toda operación se aplica a cada término. Mostrar dos líneas: primero la operación escrita, (2x + 3) : 2 = 11 : 2, y después la simplificada. |
| OP21 | Mejora | Didáctica | No está definido si se admiten fracciones ni cómo se dibujan en la balanza (pesas de 1,5). | Decidir entre tres opciones: (a) permitirlo y mostrar fracciones; (b) permitirlo solo en la línea algebraica, con un aviso neutro; (c) desactivar «dividir» mientras queden números sueltos que no sean divisibles. Mi opinión: (a) o (b), porque es un camino válido. |
| OP22 | Mejora | Didáctica | Faltan reglas para los movimientos inútiles o los que se alejan de la solución. | Definir un botón de «deshacer» y otro de «empezar de nuevo». Dar respuestas neutras sobre el movimiento («La balanza sigue equilibrada. ¿Te acerca a dejar x sola?»), sin calificar al alumno. Fijar un límite de pasos o una sugerencia tras N movimientos. |
| OP23 | Mejora | Didáctica | El modelo físico de la balanza no sirve para negativos ni para la resta en R4 y E4. Si más adelante se usa con otras ecuaciones, fallará. | Limitar la balanza a ecuaciones con todos los términos positivos, o definir cómo se representan los negativos. Explicar este límite en la nota para el docente. |
| OP24 | Mejora | Didáctica | Falta definir la lista de botones: si es fija o con número a elegir («restar __»), si hay «restar x» y si se excluye el 0. | Fijar la lista y excluir el 0. Para 2x + 3 = 11 bastan: restar 3, restar 2, dividir entre 2, multiplicar por 2 y sumar 3, que da una opción inversa no útil. |
| OP25 | Mejora | Didáctica | Falta definir cuándo termina (¿vale «4 = x»?), cómo es la comprobación (¿el alumno escribe 2 · 4 + 3?) y cómo se envía la respuesta. Si la respuesta final es la opción múltiple 2, 3, 4 o 6, la balanza ya ha mostrado x = 4 y elegir la opción es trivial. | Definir el estado final, que se acepte «x = 4» y «4 = x», y que la comprobación la escriba el alumno. Decidir si usar la balanza cuenta como ayuda en la evidencia. Esto enlaza con D7. |

---

## Adecuación a 2.º de ESO (opinión, no decisión)

No puedo verificar la alineación con el currículo oficial, y la propuesta dice bien que no está validada. Lo que sigue es una opinión didáctica.

- **Paréntesis (R5, E5).** En mi opinión, es razonable en 2.º de ESO, siempre que se explique cómo aplicar la propiedad distributiva (OP4). E5, con resta dentro del paréntesis, es un poco más difícil que R5.
- **Incógnita en los dos lados (R4, E4).** También me parece razonable. Es el paso más grande del capítulo, por las dos novedades de OP1. Conviene ponerlo después de los paréntesis (OP2) o darle un ejemplo intermedio.
- **Problema con enunciado (E6).** Me parece adecuado, pero hoy no tiene ejemplo previo (OP3). Mi opinión: ponerlo en una página propia con un ejemplo resuelto de traducción y quizá dos ejercicios. Traducir un enunciado es una dificultad distinta de resolver la ecuación.

---

## Cuestiones para la usuaria

**Errores que propongo corregir:**
- OP3: añadir un ejemplo resuelto para E6.
- OP11: reescribir el enunciado de E6.
- OP16: rehacer las pistas de E6.
- OP20: si se implementa la balanza, que cada operación se aplique a todos los términos.

**Decisiones tuyas:**
1. **D6.** Si se incluyen ya los paréntesis y la incógnita en los dos lados, en qué orden (OP2), y si E6 va al final o en una página propia.
2. **D7.** Si los pasos de la balanza se registran como evidencia. Si se registran, propongo que un movimiento inútil no se interprete como error ni como señal de nada sobre el alumno. Decidir también si usar la balanza cuenta como nivel de ayuda (OP25).
3. Si se cambian las opciones y la pista de nivel 4 de **E3**, que ya existe en el código (OP8, OP17).
4. Si el nivel 4 debe dejar más de un cálculo al alumno, aunque eso alargue la pista (OP17).
5. Qué hacer con las fracciones en la balanza (OP21) y si se limita a ecuaciones con términos positivos (OP23).
6. Los cambios de distractores OP6, OP7, OP9, OP10 y OP13, y las sugerencias OP4, OP5, OP12, OP14, OP15 y OP18.

**Lo que no he podido verificar:**
- La alineación con el currículo oficial.
- Si las pistas de nivel 1 llegarán a mostrarse con el flujo actual del código (OP19, para el revisor técnico).
