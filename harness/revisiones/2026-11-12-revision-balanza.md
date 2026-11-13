# Revisión pedagógica de la especificación de la balanza 2x + 3 = 11 (F1-T7)

> Nota de Claude (sesión principal), 2026-11-12: informe guardado íntegro, tal como lo devolvió el
> subagente que actuó con las instrucciones del rol `revisor-pedagogico`
> (`harness/para-instalar/dot-claude/agents/revisor-pedagogico.md`), porque `.claude/` aún no está
> instalado. Sus conclusiones son propuestas hasta que la usuaria las apruebe.

- Fecha: 2026-11-12
- Rol: revisor-pedagogico (solo lectura; no se ha modificado ningún archivo)
- Documento revisado: `harness/propuestas/balanza-2x3-11.md` (estado «Propuesto»)
- Contexto consultado: `harness/DECISIONES.md` (A13-A21, P9, P11, D10-D14), `harness/revisiones/2026-11-12-capitulo-ecuaciones.md` (OP20-OP25), `harness/revisiones/2026-11-12-informe-tecnico.md` (OT17, OT25), `harness/propuestas/capitulo-ecuaciones.md` y la escala de ayuda de `src/lib/learning-twin.ts` (`supportLabel`: 0 sin ayuda, 1 reformulación, 2 pista conceptual, 3 ejemplo análogo, 4 procedimiento guiado, 5 solución dirigida).
- Las decisiones A13-A21 no se cuestionan. Solo se señala dónde la especificación las aplica de forma incompleta o dónde generan un problema didáctico.
- Todas las conclusiones son propuestas hasta que la usuaria, que es docente, las apruebe.

## Resumen

La matemática de las seis filas de la sección 6 es correcta. Hay que corregir seis puntos antes de aprobar la especificación:

1. **La regla de comprobación (sección 9) acepta cualquier igualdad que sea cierta**, como «11 = 11» o «1 + 1 = 2». No exige que sea la ecuación original con x sustituida.
2. **El camino «dividir primero» no puede terminar con los cinco botones**. Desde x + 3/2 = 11/2 hay que multiplicar por 2 (que equivale a deshacer) o dar un rodeo largo. Este hueco viene de mi propia propuesta OP24.
3. **Faltan reglas de escritura** para el coeficiente fraccionario (x/2), para el signo de los términos negativos y para leer bien «5/2 · 2».
4. **La versión inglesa está incompleta**, y el signo «:» no se usa para dividir en inglés.
5. **La respuesta final** da como incorrectas respuestas válidas («x = 8/2») y trata «4=x» de forma distinta que «x=4».
6. **Faltan los mensajes de la comprobación** y del estado final.

El nivel de ayuda 4 es razonable. El límite 1000 / 64 funciona, pero es generoso para 13-14 años: decide la usuaria.

## 1. Exactitud matemática

### 1.1 Las seis filas de la sección 6, rehechas a mano

| Fila | Desde | Botón | Línea escrita (comprobada) | Simplificada (comprobada) | Veredicto |
| --- | --- | --- | --- | --- | --- |
| 1 | 2x + 3 = 11 | Restar 3 | 2x + 3 − 3 = 11 − 3 | 2x = 8 | **Correcto** |
| 2 | 2x = 8 | Dividir entre 2 | 2x : 2 = 8 : 2 | x = 4 | **Correcto** |
| 3 | 2x + 3 = 11 | Dividir entre 2 | (2x + 3) : 2 = 11 : 2 | x + 3/2 = 11/2 | **Correcto**: aplica bien OP20 |
| 4 | x + 3/2 = 11/2 | Restar 3 | x + 3/2 − 3 = 11/2 − 3 | x − 3/2 = 5/2 (3/2 − 3 = −3/2; 11/2 − 3 = 5/2) | **Correcto** |
| 5 | 2x = 8 | Restar 3 | 2x − 3 = 8 − 3 | 2x − 3 = 5 | **Correcto** |
| 6 | 2x + 3 = 11 | Multiplicar por 2 | (2x + 3) · 2 = 11 · 2 | 4x + 6 = 22 | **Correcto** |

En todas las simplificadas, x = 4 cumple la igualdad. Por ejemplo, en la fila 4: 4 − 3/2 = 5/2.

### 1.2 Secuencias exploradas a partir de 2x + 3 = 11

Cada movimiento se da como escrita → simplificada.

| N.º | Secuencia | Líneas | Observación |
| --- | --- | --- | --- |
| S1 | −3, :2 | 2x + 3 − 3 = 11 − 3 → 2x = 8; 2x : 2 = 8 : 2 → x = 4 | Camino canónico. Correcto. |
| S2 | :2, −3, ·2, +3, :2 | (2x + 3) : 2 = 11 : 2 → x + 3/2 = 11/2; x + 3/2 − 3 = 11/2 − 3 → x − 3/2 = 5/2; (x − 3/2) · 2 = 5/2 · 2 → 2x − 3 = 5; 2x − 3 + 3 = 5 + 3 → 2x = 8; → x = 4 | Correcto, pero «5/2 · 2» se puede leer como 5/(2·2) (ver OB4). |
| S3 | :2, :2 | (x + 3/2) : 2 = 11/2 : 2 → **x/2 + 3/4 = 11/4** | Aparece el coeficiente 1/2. La sección 6 no dice cómo se escribe (OB3). |
| S4 | ·2, −3, −3, :2, :2 | 4x + 6 = 22 → 4x + 3 = 19 → 4x = 16 → 2x = 8 → x = 4 | Camino largo válido, de cinco movimientos. Correcto. |
| S5 | ·2, :2 | (4x + 6) : 2 = 22 : 2 → 2x + 3 = 11 | Vuelve al inicio. Correcto. |
| S6 | −3, −3, −3, −3, −3 | 2x = 8 → 2x − 3 = 5 → 2x − 6 = 2 → 2x − 9 = −1 → 2x − 12 = −4 (escrita: 2x − 9 − 3 = −1 − 3) | Restar de más produce negativos a la derecha. Correcto si el signo se escribe como operador (OB5). |
| S7 | −3, −3, −3, −2 | … 2x − 6 − 2 = 2 − 2 → **2x − 8 = 0** | Lado derecho igual a 0: se escribe «0». Correcto. |
| S8 | (desde S7) :2, +3, +3, −2 | (2x − 8) : 2 = 0 : 2 → x − 4 = 0; → x − 1 = 3; → x + 2 = 6; → x = 4 | No hay botón «+4»: el alumno llega a x − 4 = 0 y necesita tres movimientos más. Es válido y conviene saberlo. |
| S9 | +3, :2, −3 | 2x + 3 + 3 = 11 + 3 → 2x + 6 = 14; (2x + 6) : 2 = 14 : 2 → x + 3 = 7; x + 3 − 3 = 7 − 3 → x = 4 | Camino alternativo válido que empieza por «sumar 3». Correcto. |
| S10 | −2, −2, :2 | 2x + 1 = 9 → 2x − 1 = 7 → (2x − 1) : 2 = 7 : 2 → x − 1/2 = 7/2 | Correcto. «Restar 2» enseña que restar el coeficiente no quita el 2 de 2x. Es un buen distractor manipulativo. |
| S11 | −3, −2, :2, +3, −2 | 2x = 8 → 2x − 2 = 6 → x − 1 = 3 → x + 2 = 6 → x = 4 | Correcto. |
| S12 | −3, :2, :2 | 2x = 8 → x = 4 → x : 2 = 4 : 2 → **x/2 = 2** | Si los botones siguen activos después de x = 4, se puede salir del estado final. No está definido (OB13). |
| S13 | :2 ×6 | x + 3/2 = 11/2 → x/2 + 3/4 = 11/4 → … → x/32 + 3/64 = 11/64 → el séptimo (x/64 + 3/128) se bloquea | El límite actúa sobre las constantes y sobre el **coeficiente**. Hay que decirlo (OB8). |
| S14 | :2, −3, −3, −3 | x − 3/2 = 5/2 → x − 9/2 = −1/2 → x − 15/2 = −7/2 | Fracción negativa a la derecha: «−1/2», signo delante y denominador positivo. Correcto. |

Hechos que se deducen de los cinco botones (comprobados a mano):

- El coeficiente de x siempre es una potencia de 2 positiva (…, 1/4, 1/2, 1, 2, 4, …). **Nunca sale −x ni 0x.** La regla «coeficiente −1 → −x» no se usa nunca. Es inofensiva, pero no hace falta probarla.
- x siempre queda en el lado izquierdo. **La balanza nunca produce «número = x»**, así que esa condición de la sección 9 no se da nunca.
- Todos los movimientos conservan la equivalencia. Por eso, cualquier línea «x = número» que aparezca será siempre **x = 4**.
- No hay doble signo con estos botones: el botón siempre añade «− 3», «+ 3» o «− 2» al final del lado. «− −3» solo aparecería si el programa uniera mal un término negativo («+ −3») (OB5).
- El lado izquierdo nunca queda en 0, porque siempre tiene el término en x. Solo el derecho puede valer 0 (S7).

### 1.3 Observaciones de exactitud y escritura

| Id | Veredicto | Problema | Corrección propuesta |
| --- | --- | --- | --- |
| OB1 | **Correcto** | Las seis filas de la tabla son exactas (1.1). | Mantenerlas como pruebas obligatorias. |
| OB2 | **Corregir** | El camino «dividir primero», que OP21 consideraba válido, no se puede terminar de forma natural. Desde x + 3/2 = 11/2 habría que restar 3/2, y ese botón no existe. Con −3, +3 y −2 la constante cambia en números enteros, así que nunca llega a 0. El alumno solo puede multiplicar por 2 (que es deshacer) o dar un rodeo largo (S2). La causa es mi propia lista de OP24. | Que decida la usuaria entre tres opciones: (a) añadir a la lista fija «Restar 3/2 en ambos lados», que no revela nada desde el inicio porque desde 2x + 3 = 11 no ayuda; (b) dejarlo así y avisar al docente en su nota de que dividir primero obliga a deshacer; (c) un botón «restar __» con número a elegir, que contradice la lista fija de P9 y no lo recomiendo. Mi opinión: (a). |
| OB3 | **Corregir** | Falta la regla de los coeficientes fraccionarios (S3, S12, S13). «1/2x» se lee como 1/(2x). | Escribir el coeficiente 1/2 como «x/2»; 1/4 como «x/4»; en general «x/2ⁿ». Añadir una fila de prueba: «x : 2 = 4 : 2 → x/2 = 2». Si se dibujan fracciones apiladas, que sea «½x» con fracción vertical. |
| OB4 | **Corregir** | Con la barra inclinada, «5/2 · 2» y «11/2 : 2» se pueden leer como 5/(2·2) o como 11/(2:2). También conviven dos signos de dividir en líneas seguidas: «11 : 2» en la escrita y «11/2» en la simplificada. | Poner paréntesis a las fracciones que se operan: «(5/2) · 2», «(11/2) : 2». Mejor aún, mostrarlas como fracción vertical. Añadir a la nota del docente que «11 : 2» y «11/2» son el mismo número. |
| OB5 | **Corregir** | Falta la regla de signos al escribir. El texto «− −3» que preguntabas no sale de los botones. El riesgo es «x + −3/2» al unir términos. | Regla: un término negativo se escribe con «−» como operador («x − 3/2», nunca «x + −3/2»). Un número negativo solo en un lado lleva el signo delante («−1»). Si se multiplica o divide un lado que es un solo número negativo, va entre paréntesis: «(−1) · 2», «(−4) : 2». Usar siempre el signo menos tipográfico «−», el mismo en todo el libro. |
| OB6 | **Mejorable** | «Se escriben los términos nulos como se eliminan» es una frase confusa. | «Los términos que valen 0 se eliminan: 2x + 0 → 2x. Si un lado se queda sin términos, se escribe 0.» |
| OB7 | **Mejorable** | No se dice que las fracciones se escriben impropias (11/2) y no como número mixto. | Añadir «fracciones impropias, nunca números mixtos ni decimales». |

## 2. Botones (sección 5)

| Id | Veredicto | Problema | Corrección propuesta |
| --- | --- | --- | --- |
| OB8 | **Correcto** | La lista aplica P9 y OP24: es fija, no tiene el 0 ni «restar x», y tiene deshacer y empezar de nuevo. Permite el camino canónico (S1) y otros válidos (S4, S9, S11). Incluye movimientos inversos o poco útiles (+3, ·2, −2), que son buenos para explorar. | Mantener, con la salvedad de OB2. |
| OB9 | **Mejorable** | Las preposiciones no son uniformes y «Restar 3 en ambos lados» suena poco natural en español de España. | «Restar 3 a los dos lados», «Sumar 3 a los dos lados», «Dividir los dos lados entre 2», «Multiplicar los dos lados por 2». También vale «ambos lados», pero igual en los cuatro. |
| OB10 | **Correcto** | Los nombres en inglés son correctos y naturales. | Ninguna. |
| OB11 | **Corregir** | En inglés, «:» no significa dividir (allí se usa para razones), así que la línea escrita «(2x + 3) : 2» confunde al alumnado anglófono. Lo mismo ocurre, en menor grado, con «·». | En la versión inglesa, escribir «÷» (o una fracción) y «×». Si se decide mantener el mismo signo, que la nota del docente lo explique. Añadir las líneas en inglés a las pruebas de la sección 12. |

## 3. Nivel de ayuda 4 (sección 3)

| Id | Veredicto | Problema | Corrección propuesta |
| --- | --- | --- | --- |
| OB12 | **Correcto** (con matiz) | Aplica bien A17: el nivel es propio y no sube el de las opciones. Es razonable en lo didáctico. Los botones hacen todo el cálculo y reducen la elección a cinco opciones, de las que solo dos llevan directamente a la solución. Declarar 0-2 exageraría la autonomía (OT17). El nivel 5 («solución dirigida») no corresponde, porque el alumno elige la operación. El 3 («ejemplo análogo») no describe lo que pasa. El nivel fijo es coherente con A14: no distingue entre quien usa 2 movimientos y quien usa 10, y así no se infiere nada de los movimientos. | Matiz: en el libro, el «nivel 4» de las opciones es una pista escrita (P7). Para que el docente no confunda las dos cosas, la vista del profesor debería decir algo como «balanza: los botones hacen el cálculo (nivel 4)» y no solo el número. |

## 4. Fracciones y negativos (sección 7, A19)

| Id | Veredicto | Problema | Corrección propuesta |
| --- | --- | --- | --- |
| OB13 | **Correcto** | Aplica A19 y responde a OP21 y OP23. Las etiquetas con signo, sin pesas que contar, y el signo escrito además del color son buena decisión. | Ninguna. |
| OB14 | **Mejorable** | La nota del docente solo habla de negativos. No explica que la balanza representa igualdad de valor y no de peso, ni que las fracciones aparecen como etiquetas, ni lo de OB2 y OB4. Además, el alumno no recibe ninguna explicación cuando aparece la primera etiqueta negativa. Falta su versión inglesa. | Nota propuesta: «La balanza indica que los dos lados valen lo mismo. Una balanza real no puede tener pesos negativos; aquí los números negativos y las fracciones se muestran como etiquetas con su signo. 11 : 2 y 11/2 son el mismo número.» Para el alumno, un aviso neutro la primera vez: «Los números con − se muestran con su signo.» Añadir la traducción inglesa. |
| OB15 | **Mejorable** (sugerencia; decide la usuaria) | El límite de 1000 / 64 funciona: se bloquea la séptima multiplicación (11·2⁷ = 1408) y la séptima división (S13). Pero permite líneas como «x/32 + 3/64 = 11/64», que no aportan nada a 13-14 años. Tampoco dice si el límite cuenta numeradores, denominadores y también el coeficiente. | Precisar que se aplica a coeficientes y constantes, numerador y denominador. Sugerencia: bajar a \|n\| ≤ 100 y denominador ≤ 8 (tres divisiones seguidas). Así siguen cabiendo todos los caminos útiles: el más largo que he visto usa 4x y 22. |
| OB16 | **Mejorable** | El aviso «Este paso haría los números muy grandes» no encaja cuando lo que bloquea es el denominador, porque los números se hacen pequeños. Además, el botón desactivado tiene que explicar por qué lo está, también con lector de pantalla. Falta la versión inglesa. | «Este paso daría números demasiado complicados para esta balanza. Puedes deshacer.» / «This step would make the numbers too complicated for this scale. You can undo.» |

## 5. Mensajes (sección 8)

| Id | Veredicto | Problema | Corrección propuesta |
| --- | --- | --- | --- |
| OB17 | **Correcto** | El mensaje tras cada movimiento es neutro, no califica y no revela nada. La versión inglesa es correcta. | Opcional: «dejar la x sola» suena más natural en España que «dejar x sola». |
| OB18 | **Corregir** | Faltan textos en inglés: el de los 8 movimientos, el del límite (OB16), la nota del docente (OB14) y los de la comprobación y la respuesta (OB20). A20 y la sección 12 piden todos los textos en los dos idiomas. | Añadir, por ejemplo: «You can undo or start again whenever you like.» Revisar que cada texto de la especificación tenga su pareja. |
| OB19 | **Mejorable** | Al llegar a x = 4 se mostraría «¿Te acerca a dejar x sola?», que no tiene sentido en ese momento. No se dice si los 8 movimientos incluyen «deshacer», si se reinician con «empezar de nuevo» ni si el aviso se repite. | Mensaje para el estado final que no declara la solución: «Has dejado x sola en un lado. Ahora comprueba ese valor en la ecuación del principio.» / «You have x on its own on one side. Now check that value in the original equation.» Contar solo las operaciones, reiniciar con «empezar de nuevo» y mostrar el aviso una sola vez. |

## 6. Final y comprobación (sección 9)

| Id | Veredicto | Problema | Corrección propuesta |
| --- | --- | --- | --- |
| OB20 | **Corregir** (el error más importante) | «Se acepta si, tras sustituir x por el valor y calcular, los dos lados son iguales» no tiene sentido tal como está: en «2 · 4 + 3 = 11» no hay x que sustituir. Leída literalmente, acepta cualquier igualdad numérica cierta: «11 = 11», «8 + 3 = 11», «4 = 4», «2 · 4 = 8» (que es la sustitución en 2x = 8) o incluso «1 + 1 = 2». Así no se comprueba nada. Con otro valor («2 · 5 + 3 = 11»), los lados no coinciden, pero no se dice qué mensaje sale, si cuenta o si se puede repetir. | Comprobar **siempre contra la ecuación original 2x + 3 = 11**, porque es el hábito que se quiere enseñar, aunque aquí todas las líneas sean equivalentes. Regla: la expresión debe tener la forma de la ecuación original con x cambiada por un número, en el orden «2 · n + 3 = 11» o con los lados cambiados («11 = 2 · n + 3»). Opcional: aceptar «n · 2» y «2(n)». Después se calcula. Si es cierta y n es el valor de la balanza, se acepta. Si tiene la forma correcta pero es falsa, mensaje neutro: «Con ese valor los dos lados no dan lo mismo. Revisa la sustitución.» Si no tiene la forma de la ecuación original: «Escribe la ecuación del principio cambiando x por el valor que has encontrado.» Fijar que la comprobación no cuenta como envío y se puede repetir. Faltan las versiones inglesas. |
| OB21 | **Mejorable** | Muchos alumnos de 13-14 años escriben «2x4» para multiplicar. La especificación lo trata como «no se entiende» (bien, no cuenta como intento), pero no da un mensaje que lo explique. «24 + 3 = 11» (números pegados) debe rechazarse, no interpretarse. | Mensaje: «Para multiplicar usa · o *. La letra x es la incógnita.» Añadir pruebas con «2x4+3=11» y «24+3=11». |
| OB22 | **Corregir** | La respuesta final acepta «x=4» sin espacios, pero no «4=x», y se dijo que los espacios no importan. Respuestas matemáticamente correctas o casi, como «x = 8/2», «X = 4» o «4», contarían como intento incorrecto o no están previstas. | Ignorar espacios y mayúsculas en todos los casos. «x = 8/2» y «x = +4» no cuentan como incorrectas: o se aceptan, o se pide simplificar sin contar el intento. «4» solo se trata como «no se entiende» y se pide «x = …». |
| OB23 | **Mejorable** (problema didáctico que generan A18 y el diseño; decide la usuaria) | Cualquier camino, corto o largo, que llegue a «x = número» llega a x = 4, porque los botones conservan la equivalencia. La comprobación y la respuesta final aparecen después de que la balanza ya muestre «x = 4», así que escribir la respuesta es casi copiar. La evidencia apenas distingue entre alumnos: es lo que ya advertía OP25. El nivel 4 lo compensa en parte. Un camino largo tiene el mismo valor que uno corto, y eso es coherente con A14. | Dos opciones para la usuaria: (a) dejarlo así y que la vista del profesor indique «respuesta escrita tras llegar a x sola en la balanza»; (b) permitir enviar la respuesta en cualquier momento, por ejemplo desde 2x = 8, para recoger algo más de razonamiento propio. Esta segunda opción no cambia A14. |
| OB24 | **Mejorable** | No se define qué pasa después de llegar a x = 4: si los botones siguen activos (S12 sale del estado final), ni qué ocurre con la comprobación al deshacer. | Proponer que, en x = 4, las operaciones sigan disponibles pero el paso de comprobación desaparezca si la línea deja de ser «x = número». Al volver, debe reaparecer. |
| OB25 | **Mejorable** | La condición «número = x» no se da nunca (1.2). | Mantenerla en la respuesta final (aceptar «4 = x»), pero no en la detección del estado final. O decir que se conserva para futuras ecuaciones. |

## 7. Diseño propio (OT25)

| Id | Veredicto | Problema | Corrección propuesta |
| --- | --- | --- | --- |
| OB26 | **Correcto** (en el texto) | La especificación excluye personajes, cartas, monstruos y estética comercial. Usa etiquetas de texto y no tiene animación obligatoria. No imita ningún producto comercial. | Volver a revisarlo cuando exista una maqueta o una captura. |
| OB27 | **Mejorable** | El texto alternativo «Platillo izquierdo: 2x, 3.» pierde el signo de la suma, y con negativos queda «2x, −9». Falta la versión inglesa. | «Platillo izquierdo: 2x + 3. Platillo derecho: 11.» / «Left pan: 2x + 3. Right pan: 11.» |

## Errores (hay que corregirlos antes de aprobar)

- **OB20**: la regla de comprobación acepta cualquier igualdad cierta. Hay que comprobar contra 2x + 3 = 11 y definir los mensajes.
- **OB2**: el camino de dividir primero no se puede terminar con los botones. La usuaria tiene que elegir una opción.
- **OB3**: falta la regla de escritura de los coeficientes fraccionarios (x/2).
- **OB4**: «5/2 · 2» se puede leer de dos maneras. Hacen falta paréntesis o fracción vertical.
- **OB5**: falta la regla de signos («x − 3/2», nunca «+ −»).
- **OB11**: «:» y «·» en la versión inglesa.
- **OB18**: faltan textos en inglés.
- **OB22**: incoherencias en las respuestas finales aceptadas.

## Sugerencias (decide la usuaria)

OB6, OB7, OB9, OB14, OB15 (bajar el límite), OB16, OB17, OB19, OB21, OB23 (cuándo se puede enviar la respuesta), OB24, OB25, OB27. OB12 (nivel 4) se da por bueno con un matiz en la etiqueta de la vista del profesor.

## Aplicación de las decisiones aprobadas

| Decisión | ¿Se aplica bien? |
| --- | --- |
| A14 / P11 | Sí (sección 4). |
| A17 | Sí (sección 3). |
| A18 | Sí. Genera el problema didáctico de OB23. |
| A19 | Sí. Quedan pendientes los detalles de escritura de OB3-OB5. |
| A20 | Incompleta (OB11, OB18). |
| A21 | Sí, en lo que toca a esta revisión. |
| P9 | Sí. El hueco de OB2 viene de mi lista de OP24, no de la especificación. |

## Lo que no he podido verificar

- El aspecto visual real de la balanza y si se diferencia de productos comerciales: no hay maqueta ni capturas (OB26).
- Cómo se ven en pantalla las fracciones (barra inclinada o vertical) y los signos.
- Si los textos en inglés suenan naturales para el alumnado al que van dirigidos (británico, estadounidense o bilingüe español): no se indica a quién van.
- Si el contenido está alineado con el currículo oficial: no lo afirmo. El contenido es propio y no está validado.
- No he explorado todas las secuencias posibles, solo 14 secuencias de 2 a 6 movimientos. Las propiedades generales de 1.2 (coeficiente siempre potencia de 2 positiva, x siempre a la izquierda, solución siempre x = 4) están deducidas a mano, no probadas con código.
- La implementación técnica queda fuera de mi rol.
