# Segunda revisión pedagógica de la especificación «cajas y fichas», versión 1 (F1-T7b)

> Nota del coordinador (2026-11-13): revisión independiente lanzada desde una sesión bifurcada.
> Al guardarla sobrescribió por error el informe OC1-OC20, que se ha restaurado en
> `2026-11-13-revision-cajas-fichas.md`. Esta se conserva con este nombre. Su numeración OC no
> coincide con la del informe original: A26 se refiere al original.

> Nota de Claude (sesión principal), 2026-11-13: informe guardado íntegro, tal como lo devolvió el
> subagente que actuó con las instrucciones del rol `revisor-pedagogico`
> (`harness/para-instalar/dot-claude/agents/revisor-pedagogico.md`), porque `.claude/` aún no está
> instalado. Sus conclusiones son propuestas hasta que la usuaria las apruebe.

- Fecha: 2026-11-13
- Rol: revisor-pedagogico. Solo he leído archivos; no he modificado, creado ni borrado nada.
- Documento revisado: `harness/propuestas/cajas-y-fichas.md` (versión 1, «Propuesto»).
- He consultado: `harness/DECISIONES.md` (A13/P9, A14, A17, A18, A20, A21, A23, A24, A25, D17-D20), `harness/propuestas/maqueta-cajas-fichas.html` (he leído el JavaScript, no la he abierto en el navegador), las dos revisiones de la balanza, `supportLabel` en `src/lib/learning-twin.ts` (0 sin ayuda, 1 reformulación, 2 pista conceptual, 3 ejemplo análogo, 4 procedimiento guiado, 5 solución dirigida) y los textos de envío de `src/components/mvp-learning-cycle.tsx`.
- No he podido ver el Genially ni el PDF de pepvidalg. Lo que digo del método viene solo de la descripción del encargo.
- Las decisiones aprobadas no se cuestionan. Todo lo que propongo es una propuesta hasta que la usuaria lo apruebe.

## Resumen

Las cuentas están bien: las 9 ecuaciones y todos los ejemplos de las secciones 6, 7 y 12 son correctos y tienen solución entera (A24). El modelo de cajas y fichas es sólido. Con los pasos permitidos nunca aparece una situación que el dibujo no pueda mostrar, y nunca se llega a un punto sin salida antes del estado final.

Hay que corregir 6 puntos antes de aprobarla:

1. **La respuesta final se copia.** La conclusión dice «La solución es x = 4» y el campo de respuesta solo aparece después. Así el envío evaluado es una copia (OC1).
2. **En los niveles 1 y 2 la tabla deja resolver sin dar ningún paso.** Se puede probar valores hasta que salga «iguales» y enviar (OC2).
3. **En el nivel 0 la tabla enseña la ecuación** («3 · (2) + 2») antes de que el alumno la escriba. Eso se salta «Ver la ecuación», que sí queda anotado para el profesor (OC3).
4. **No hay ningún ejemplo resuelto** antes de pedir cada tipo de tarea (OC4).
5. **A23 se aplica a medias**: falta el decimal con punto (`x = 4.0`) (OC5).
6. **Falta todo el texto en inglés** (A20) (OC6).

Además, la justificación del nivel de ayuda del nivel 0 (D17) no se cumple, porque la tabla hace las cuentas (OC7). Puede chocar también con P9, aprobada en A13: «la comprobación la escribe el alumno».

## 1. Exactitud

### 1.1 Las 9 ecuaciones de la sección 4

| Nivel · ej. | Ecuación | Resolución | Comprobación | Veredicto |
| --- | --- | --- | --- | --- |
| 0·1 | 2x + 3 = 11 | 2x = 8 → x = 4 | 8 + 3 = 11 | **Correcto** |
| 0·2 | 3x + 2 = x + 10 | 2x + 2 = 10 → 2x = 8 → x = 4 | 14 = 14 | **Correcto** |
| 0·3 | 4x + 1 = 2x + 7 | 2x + 1 = 7 → 2x = 6 → x = 3 | 13 = 13 | **Correcto** |
| 1·1 | 2x + 3 = 11 | igual que 0·1 → x = 4 | 11 = 11 | **Correcto** |
| 1·2 | 5x + 2 = 2x + 14 | 3x + 2 = 14 → 3x = 12 → x = 4 | 22 = 22 | **Correcto** |
| 1·3 | 3x + 9 = 6x + 3 | 9 = 3x + 3 → 6 = 3x → x = 2 | 15 = 15 | **Correcto** |
| 2·1 | 4x + 5 = x + 17 | 3x + 5 = 17 → 3x = 12 → x = 4 | 21 = 21 | **Correcto** |
| 2·2 | 6x + 1 = 2x + 13 | 4x + 1 = 13 → 4x = 12 → x = 3 | 19 = 19 | **Correcto** |
| 2·3 | 2x + 15 = 5x + 3 | 15 = 3x + 3 → 12 = 3x → x = 4 | 23 = 23 | **Correcto** |

Los coeficientes de la maqueta (`EXERCISES`) coinciden con la tabla de la especificación.

### 1.2 Ejemplos de las secciones 6, 7 y 12

| Sección | Línea escrita / ejemplo | Lo que sale | Veredicto |
| --- | --- | --- | --- |
| 6, quitar cajas | `5x + 2 − 2x = 2x + 14 − 2x` | 3x + 2 = 14 (x = 4: 14 = 14) | **Correcto**. La maqueta escribe la misma línea. |
| 6, quitar fichas | `3x + 2 − 2 = 14 − 2` | 3x = 12 | **Correcto** |
| 6, repartir | `3x : 3 = 12 : 3` | x = 4 | **Correcto** |
| 6, repartir con paréntesis | `(4x + 6) : 2 = 22 : 2` | 2x + 3 = 11 | **Mejorable**. La cuenta está bien, pero 4x + 6 = 22 no sale de ningún ejercicio. Propuesta: usar uno alcanzable que además tenga cajas en los dos miembros: `(3x + 9) : 3 = (6x + 3) : 3` → x + 3 = 2x + 1 (con x = 2: 5 = 5). |
| 7, fila de ensayo | `3 · (2) + 2 = 8`, `(2) + 10 = 12`, distintos | correcto | **Mejorable**. «(2) + 10» lleva un paréntesis que no hace falta. Cuando hay una sola caja, mejor «2 + 10». |
| 7, conclusión | «…tendrían 14 fichas. La solución es x = 4.» | 3·4 + 2 = 14 = 4 + 10 | La cuenta está bien. La redacción hay que corregirla: ver OC1. |
| 12, pasos | 3x + 9 = 6x + 3 → `3x + 9 − 3x = 6x + 3 − 3x` → 9 = 3x + 3 → `9 − 3 = 3x + 3 − 3` → 6 = 3x → `6 : 3 = 3x : 3` → 2 = x | todas las líneas | **Correcto**. Con x = 2: 9 = 9, 6 = 6, 2 = 2. |
| 12, ensayos | 2 → 8 y 12; 5 → 17 y 15; 4 → 14 y 14 | | **Correcto** |
| 12, escritura | `3x+2=x+10`, `2+3x = 10 + x`, `x+10=3x+2`, `3·x+2=x+10` se aceptan; `3x+2=10` no coincide; `hola` no se entiende | | **Correcto** según `readWritten` de la maqueta. |

### 1.3 ¿Los pasos pueden llevar a algo que el dibujo no muestra?

He revisado todos los estados con números enteros positivos y solución única:

- Nunca se queda un miembro vacío.
- Nunca se llega a un punto sin salida: siempre se puede quitar o repartir hasta el estado final.
- Nunca aparecen fracciones ni negativos.

El modelo está bien cerrado.

## 2. Progresión

| Elemento | Veredicto | Problema | Propuesta |
| --- | --- | --- | --- |
| Nivel 0: 2x + 3 = 11 → 3x + 2 = x + 10 → 4x + 1 = 2x + 7 | **Correcto** | Primero la incógnita en un solo miembro. Luego en los dos con una sola caja a la derecha. Luego con dos. Cada ejercicio añade una sola dificultad. | — |
| Nivel 0, inicio | **Mejorable** | El primer ejercicio ya mezcla varias cajas y fichas. | Si la usuaria lo quiere, uno previo aún más sencillo (x + 5 = 9 o 3x = 12). |
| Nivel 1, ejercicio 1 | **Mejorable** | Es el mismo dibujo que en el nivel 0. Como puente es un acierto, pero el alumno estrena dos pasos a la vez (quitar fichas y repartir). | Decirlo en pantalla: «Es el dibujo del nivel 0: ahora, en vez de probar, quita y reparte». O poner antes un ejercicio de un solo paso. |
| Nivel 1, ejercicios 2 y 3 | **Correcto** | El 2 añade «quitar cajas». El 3 añade que la x se queda sola a la derecha, y permite repartir antes de quitar. | — |
| Nivel 2 | **Correcto** | Repite los mismos tipos que el nivel 1 sin dibujo. Es coherente. | — |
| Ejemplo resuelto antes de pedirlo | **Corregir** | No hay ninguno en ningún nivel (OC4). | — |
| Variedad de soluciones | **Mejorable** | En 6 de los 9 ejercicios x = 4, y en ninguno hay solución mayor que 4. En el ensayo se aprende a probar «4» o números pequeños. | Variar las soluciones (por ejemplo 2, 5, 6, 7) sin salir de 0-20 ni de A24. |

## 3. El modelo «repartir en n grupos iguales y quedarse con uno»

| Elemento | Veredicto | Problema | Propuesta |
| --- | --- | --- | --- |
| Que sea correcto | **Correcto** | n tiene que dividir las cuatro cantidades. Entonces cada grupo tiene las mismas cajas y las mismas fichas, y los dos miembros siguen valiendo lo mismo. En 3x + 9 = 6x + 3 repartido en 3, a la izquierda salen 3 grupos de «1 caja y 3 fichas» y a la derecha 3 grupos de «2 cajas y 1 ficha». Queda x + 3 = 2x + 1, que es correcto. | — |
| Que se entienda en el dibujo | **Mejorable** | Al quitar, lo quitado se ve en gris. Al repartir no se ve nada: las cantidades encogen sin más (en la maqueta, `lastRemoved = null`). Es el paso más abstracto y no tiene apoyo visual. | Rodear los n grupos y poner en gris los n − 1 que se dejan. Y decir en el texto: «cada grupo con las mismas cajas y las mismas fichas». |
| Mensaje «Ahora no se puede repartir…» | **Correcto** | Explica por qué no se puede, sin dar el paso. | — |
| Nombres de los pasos en el nivel 2 | **Mejorable** | El nivel se llama «Solo símbolos», pero los botones siguen diciendo «Quitar cajas», «Quitar fichas» y «Repartir». | En el nivel 2: «Restar … a los dos miembros» y «Dividir los dos miembros entre …». Así el nivel hace de puente hacia la notación formal. Decide la usuaria. |

## 4. La tabla de ensayo

| Elemento | Veredicto | Problema | Propuesta |
| --- | --- | --- | --- |
| Límite 0-30 | **Correcto** | Cubre todas las soluciones, y el 0 (caja vacía) tiene sentido. **Diferencia con la maqueta**: la maqueta acepta cualquier número entero (`/^\d+$/`), también 45. Y el aviso «Escribe un número entero de fichas.» solo va al lector de pantalla: quien ve la pantalla no recibe nada. | La especificación debe decir que el aviso se ve en pantalla y qué se responde a un número mayor de 30. |
| Ensayo sin estrategia | **Mejorable** | Con soluciones de 2 a 4 y la cuenta automática, se llega probando 1, 2, 3… sin pensar. | Pista opcional, sin indicar qué número probar. Por ejemplo, tras 3 ensayos: «Fíjate en qué miembro tiene más fichas y en cómo cambia al probar un número mayor». Con soluciones más variadas (sección 2), probar al azar sirve menos. |
| Quién hace la cuenta | **Corregir** | La tabla calcula los dos miembros sola. La sección 9 justifica el nivel 2 diciendo que «el alumno calcula cada ensayo», y no es verdad. Además, P9 (aprobada en A13) dice «la comprobación la escribe el alumno». A25 no la retira de forma expresa. | Elegir una: (a) el alumno escribe el valor de cada miembro y la tabla dice si es «iguales» o «distintos»; o (b) se mantiene la cuenta automática y se cambia el nivel de ayuda (OC7). Que la usuaria confirme si P9 sigue en vigor para esta actividad. |
| Paso del nivel 0 al 1 | **Mejorable** | Lo conecta bien que el primer ejercicio sea el mismo, pero no se dice. | El texto puente de la sección 2 (fila del nivel 1, ejercicio 1). |
| Uso en los niveles 1 y 2 | **Corregir** | La especificación dice que en estos niveles sirve «para comprobar el estado final», pero no dice que esté cerrada antes de llegar a él. En la maqueta está abierta siempre (OC2). | — |

## 5. Mensajes

| Mensaje | Veredicto | Problema | Propuesta |
| --- | --- | --- | --- |
| Escritura: coincide / no coincide / no se entiende | **Correcto** | No califican. El ejemplo (3x + 1 = x + 5) no es ninguno de los ejercicios. | — |
| «Elige un paso. Se hará en los dos miembros a la vez.» | **Correcto** | — | — |
| «Los dos miembros siguen teniendo las mismas fichas…» | **Mejorable** | «Las mismas fichas» puede entenderse como «las fichas no han cambiado». | «…siguen teniendo el mismo número de fichas, contando las de dentro de las cajas». |
| Tras 8 pasos | **Correcto** | En la maqueta, Deshacer no descuenta pasos: se cuentan también los deshechos. | Decir en la especificación si se cuentan. |
| Estado final | **Correcto** | Indica que hay que comprobar, no qué paso dar. En la maqueta saldría «1 fichas» si la solución fuera 1; ahora no ocurre en ningún ejercicio. | Concordar singular y plural. |
| Conclusión con «La solución es x = 4» | **Corregir** | Da la solución antes del envío evaluado (OC1). | — |
| D20 (después de enviar) | Ver la sección 6 | — | — |

## 6. D17-D20 (decide la usuaria)

- **D17, nivel de ayuda.**
  - Niveles 1 y 2: el 4 (procedimiento guiado) me parece adecuado. El alumno elige el paso y el sistema hace la cuenta.
  - Nivel 0: el 2 solo se sostiene si el alumno escribe él mismo el valor de cada miembro (opción a de la sección 4). Si la tabla calcula sola, propongo el 4.
  - Si la conclusión sigue diciendo «La solución es x = 4», cualquier nivel correspondería en la práctica al 5 (solución dirigida). Por eso también hay que corregir OC1.
- **D18, citar la fuente.** Recomiendo citarla, por honestidad y para no presentar como propio un método ajeno. Basta una línea breve, en español y en inglés, visible en la página o en los créditos del libro, por ejemplo: «Método inspirado en el material de álgebra de pepvidalg (Genially)». Sin logotipos y sin copiar su material (A4). No he podido comprobar la licencia ni lo que prefiere el autor; conviene que la usuaria lo confirme.
- **D19, niveles abiertos u ordenados.** Estoy de acuerdo con la propuesta: abiertos, con el nivel 0 seleccionado. El docente puede querer empezar en el nivel 1 con un grupo que ya conoce el método, y bloquear niveles frustra sin aportar nada. Propongo añadir «recomendado: empieza por el nivel 0».
- **D20, texto tras enviar.** Es coherente con la actividad de opciones, que ya muestra «Intentos n / 5» y «Resuelta» o «En curso». Hay que tener en cuenta dos cosas:
  - «Resuelta» le dice al alumno que ha acertado, y «Respuesta enviada. Intento n de 5» le hace deducir que no.
  - Es aceptable si se quiere lo mismo que en las opciones, pero hay que decidirlo a sabiendas.

  Con OC1 y OC2 tal como están, el envío casi nunca puede fallar, y los 5 intentos pierden sentido.

## 7. Texto en inglés (A20)

La especificación no da ningún texto en inglés, y la maqueta está solo en español. Falta todo lo siguiente:

- Títulos y descripciones de los niveles.
- Encabezado y pregunta inicial.
- Rótulos de los miembros. Ojo: «miembro» no se traduce por *member*; en inglés escolar se dice *left side* / *right side*.
- Recuentos: «3 cajas y 2 fichas», con «caja» → *box* y «ficha» → *counter*.
- Escritura de la ecuación: etiqueta, botón «Ver la ecuación» y sus tres mensajes con el ejemplo.
- Nombres de los pasos, etiquetas de las listas y los tres motivos de bloqueo.
- Deshacer y Empezar de nuevo.
- Los cuatro mensajes de pasos.
- La tabla:
  - cabeceras;
  - «iguales» y «distintos» → *equal* / *not equal*;
  - ordinales («1.º» → *1st*);
  - la frase «Si hubiera…»;
  - la conclusión;
  - el aviso de número entero.
- Texto alternativo y «En gris, lo que se acaba de quitar».
- Campo «Tu respuesta» y sus avisos («Simplifica…», «Escribe tu respuesta como x = …»).
- Los textos de D20.
- Signos: el `÷` ya está previsto. Falta decidir el signo de multiplicar en la tabla y aceptar `x = 4.0` con punto.

## Observaciones

### Errores (hay que corregirlos)

- **OC1. La conclusión da la solución antes del envío evaluado.** «La solución es x = 4» aparece antes del campo «Tu respuesta», y el campo solo aparece después de la conclusión. Así el envío, que es la única evidencia (A14), se convierte en copiar un texto: no mide nada y además da la solución dirigida.
  - Propuesta: la conclusión dice solo el hecho: «Con 4 fichas en cada caja, los dos miembros tienen 14 fichas».
  - Y que el campo de respuesta esté disponible sin depender de la tabla.
  - Aun así, el número se ve en la fila. Es inevitable en el ensayo y error, y por eso importa el nivel de ayuda declarado (D17).
- **OC2. En los niveles 1 y 2 se puede resolver sin dar ningún paso.** La tabla está abierta desde el principio y la respuesta solo depende de la conclusión, así que el alumno puede resolver probando valores. El docente no lo sabría, porque los pasos no se registran (A14).
  - Propuesta: en los niveles 1 y 2, la tabla se abre al llegar al estado final.
- **OC3. En el nivel 0 la tabla revela la ecuación.** Se puede usar antes de escribir la ecuación, y cada fila muestra la sustitución («3 · (2) + 2 = 8»). Eso se salta el «Ver la ecuación», que sí queda anotado para el profesor.
  - Propuesta: abrir la tabla después de escribir o ver la ecuación.
  - O que, antes de eso, la tabla muestre solo el total de fichas de cada miembro, sin la expresión.
- **OC4. No hay ejemplos resueltos.** Ni para escribir la ecuación de un dibujo, ni para la tabla, ni para quitar y repartir.
  - Propuesta: un ejemplo resuelto por nivel, con una ecuación distinta de las tres del nivel. Por ejemplo, 4x + 1 = x + 10 → 3x + 1 = 10 → 3x = 9 → x = 3. Que se pueda consultar o se muestre antes del ejercicio 1.
- **OC5. A23 está incompleta.** La sección 8 solo acepta `x = 4,0`. A23 dice «con coma o punto».
  - Propuesta: añadir `x = 4.0` como correcta en los dos idiomas, y una prueba en la sección 12.
- **OC6. A20 sin aplicar.** Faltan todas las versiones en inglés (lista de la sección 7). La sección 12 pide comprobarlo, pero no hay textos contra los que comprobar.
- **OC7. D17 y la cuenta automática.** La justificación del nivel 2 para el nivel 0 no se cumple, porque la tabla hace la cuenta. Además, puede chocar con P9 (aprobada en A13).
  - Hay que elegir: que el alumno calcule (y se mantiene el 2), o declarar el 4.
  - Y que la usuaria confirme si P9 sigue en vigor.

### Sugerencias (decide la usuaria)

- **OC8.** Variar las soluciones (6 de 9 son x = 4).
- **OC9.** Un ejercicio previo de un solo paso en el nivel 0 o en el 1.
- **OC10.** Decir en pantalla que el nivel 1, ejercicio 1, es el mismo dibujo del nivel 0.
- **OC11.** Mostrar el reparto en grupos en el dibujo, con los n − 1 grupos que se dejan en gris.
- **OC12.** En el nivel 2, nombrar los pasos con lenguaje algebraico («Restar 2x», «Dividir entre 3»).
- **OC13.** Cambiar el ejemplo `(4x + 6) : 2 = 22 : 2` por `(3x + 9) : 3 = (6x + 3) : 3` y añadirlo a las pruebas. Así se prueba repartir cuando hay cajas y fichas en los dos miembros.
- **OC14.** Pista opcional de estrategia en la tabla tras varios ensayos, sin decir qué número probar.
- **OC15.** «El mismo número de fichas» en lugar de «las mismas fichas». Y quitar el paréntesis en «(2) + 10».
- **OC16.** Escribir en la especificación el comportamiento que ya tiene la maqueta y que ahora no consta:
  - acepta `x + x + 3 = 11` y `2x + 1 + 2 = 11` como coincidentes, porque suma los términos;
  - los pasos deshechos cuentan para el aviso de los 8 pasos;
  - qué hacer con números mayores de 30 en la tabla;
  - el aviso visible de número no válido.
- **OC17.** D18-D20: mis recomendaciones están en la sección 6.

### Diferencias entre la maqueta y la especificación

- La maqueta acepta ensayos mayores de 30.
- El aviso de número no válido solo lo oye el lector de pantalla.
- La tabla está abierta siempre en todos los niveles.
- No tiene campo de respuesta ni inglés (lo dice su pie).

Por lo demás, los textos y las líneas escritas de la maqueta coinciden con la especificación.

### No verificado

- No he visto el material de pepvidalg.
- No he abierto la maqueta en el navegador, solo he leído su código.
