# Revisión pedagógica F1-T7b: cajas y fichas (especificación v1 y maqueta)

Hecha por el rol revisor-pedagogico el 2026-11-13, solo leyendo. Guardada por el coordinador.
Comprobaciones del coordinador: las tres ecuaciones de OC9 verificadas por sustitución (16 = 16,
32 = 32, 25 = 25); OC1 y OC2 confirmados en el código de la maqueta (la tabla de ensayo solo se
desactiva tras un «iguales», en todos los niveles). Las conclusiones son propuestas hasta que la
usuaria las apruebe.

> Restaurado el 2026-11-13: una sesión bifurcada sobrescribió este archivo por error. Su informe
> está en `2026-11-13-revision-cajas-fichas-segunda.md`. A26 se refiere a este (OC1-OC20).

## Resumen

Las nueve ecuaciones y todos los ejemplos de las secciones 6, 7 y 12 son correctos. Con los pasos
permitidos no se puede llegar a fracciones, negativos ni a un callejón sin salida. Cuatro errores que
corregir (OC1-OC4).

## Exactitud

- Nueve ecuaciones resueltas y sustituidas a mano: 2x + 3 = 11 (4); 3x + 2 = x + 10 (4);
  4x + 1 = 2x + 7 (3); 5x + 2 = 2x + 14 (4); 3x + 9 = 6x + 3 (2); 4x + 5 = x + 17 (4);
  6x + 1 = 2x + 13 (3); 2x + 15 = 5x + 3 (4). Todas correctas, enteras y en el rango 0-20.
- Líneas escritas de las secciones 6 y 12, ensayos (2 → 8 y 12; 5 → 17 y 15; 4 → 14 y 14) y casos de
  escritura de la ecuación: correctos.

## Por qué no hay atascos

- Cada paso conserva la solución, que es un entero positivo.
- La diferencia de cajas entre miembros no llega nunca a 0, y el miembro con más cajas tiene siempre
  menos fichas.
- Desde cualquier estado se puede quitar lo menor de cada tipo y queda «m cajas = d fichas», con m
  divisor de d: repartir en m siempre está disponible.
- Un miembro vacío exigiría x = 0: la regla «se escribe 0» es inalcanzable con estos ejercicios.
- Hay rodeos (quitar de uno en uno) y caminos alternativos (repartir primero en 3x + 9 = 6x + 3:
  x + 3 = 2x + 1 → 3 = x + 1 → 2 = x), pero no bloqueos.

## Errores (corregir)

| N.º | Elemento | Problema | Corrección propuesta |
| --- | --- | --- | --- |
| OC1 | Nivel 0, tabla de ensayo | Disponible antes de escribir la ecuación y muestra los coeficientes (`2 · (1) + 3 = 5`), lo que revela la ecuación. | En el nivel 0, la tabla se activa tras escribir la ecuación o pulsar «Ver la ecuación». Antes: «Primero escribe el dibujo en lenguaje algebraico.» |
| OC2 | Niveles 1 y 2, tabla siempre activa | Se puede resolver por tanteo sin dar ningún paso; contradice la sección 7. | Activar la tabla solo en el estado final; añadirlo a las pruebas. |
| OC3 | Conclusión «La solución es x = 4.» | Da la respuesta que luego se envía; la evidencia pierde valor. | «Con 4 fichas en cada caja, los dos miembros tienen 14 fichas.» El alumno escribe «x = 4». |
| OC4 | Mensaje tras cada paso | «Siguen teniendo las mismas fichas» puede leerse como «las mismas que antes». | «Los dos miembros siguen teniendo el mismo número de fichas, contando las que hay dentro de las cajas. ¿Te acerca a saber cuántas hay en una caja?» |

## Diferencias entre maqueta y especificación

| N.º | Elemento | Problema | Corrección propuesta |
| --- | --- | --- | --- |
| OC5 | Rango del ensayo | La maqueta acepta más de 30 y el aviso solo se anuncia, no se ve. | Rechazar más de 30 y mostrar el aviso en pantalla. |
| OC6 | Estado final | Aparecen a la vez las tres explicaciones de pasos desactivados. | Ocultarlas en el estado final o poner una sola: «Ya está la caja sola.» |
| OC7 | Nombre de repartir | El control y el cuaderno no dicen lo mismo. | Igualar textos (ver OC12). |
| OC8 | Mensaje final en el nivel 2 | Habla de «caja» sin dibujo. | «Ha quedado x sola frente a 4. Ahora comprueba ese valor en la ecuación del principio.» |

## Sugerencias (decide la usuaria)

| N.º | Elemento | Propuesta |
| --- | --- | --- |
| OC9 | Variedad de soluciones (6 de 9 son x = 4) | Cambiar 0·2 por 3x + 1 = x + 11 (x = 5), 1·2 por 5x + 2 = 2x + 20 (x = 6) y 2·1 por 4x + 5 = x + 20 (x = 5). Si cambia 0·2, rehacer los ensayos de la sección 12. |
| OC10 | Progresión del nivel 1 | Opcional: en 1·2, una ecuación ya resuelta por ensayo en el nivel 0, para que la única novedad sea el método. |
| OC11 | 3x + 9 = 6x + 3 (x a la derecha) | Correcto: llega en buen momento y aporta una sola novedad. |
| OC12 | «Repartir en n grupos iguales y quedarse con uno» | «Hacer n grupos iguales en cada miembro y quedarse con un grupo.» En el nivel 2, añadir «(dividir entre n)». |
| OC13 | Línea al quitar cajas | Correcto. |
| OC14 | `:` y paréntesis al repartir | Correcto. |
| OC15 | `(2) + 10` en la tabla | Poner la expresión encima de cada columna («1.er miembro: 3x + 2»); sin cajas, escribir solo `11`. |
| OC16 | «0 cajas y 11 fichas» | «Ninguna caja y 11 fichas.» |
| OC17 | Riesgo de quedarse en tanteo en el nivel 0 | (a) Decir, sin calificar, qué miembro tiene más fichas; (b) mensaje puente al terminar: «¿Qué podrías quitar de los dos miembros sin que dejen de tener las mismas fichas? Pruébalo en el nivel 1.»; (c) mantener 2x + 3 = 11 al empezar el nivel 1. |
| OC18 | «Tengan lo mismo» | «Tengan el mismo número de fichas.» |
| OC19 | Mensaje «no coincide» | Correcto. Opcional: «Cuenta otra vez las cajas y las fichas de cada miembro.» |
| OC20 | Nivel 2 | Texto doble: «Quitar cajas (restar x)», «Quitar fichas (restar un número)», «Hacer grupos (dividir)». |

## Opinión sobre D17-D20

- D17: 4 en los niveles 1 y 2. En el nivel 0 la tabla hace las cuentas: declarar 3, o pedir al
  alumno los totales y mantener 2. Subir un punto si se usa «Ver la ecuación».
- D18: citar con una línea discreta en la vista del profesor o en los créditos: «Método inspirado en
  las sesiones de cajas y fichas de pepvidalg». Licencia del original no comprobada.
- D19: niveles abiertos, con el nivel 0 seleccionado y el orden recomendado indicado.
- D20: evitar «Resuelta.». Si coincide: «Respuesta enviada. Coincide con tu comprobación en la
  tabla. Tu profesor o profesora la revisará.»; si no: «Respuesta enviada. Intento n de 5. Puedes
  comprobarla en la tabla.» Falta el texto al agotar los 5 envíos.

## No verificado

- Fidelidad al material de pepvidalg (solo coherencia interna).
- Textos en inglés, respuesta final, envíos, evidencia y vista del profesor (no están en la maqueta).
- Aspecto visual con muchas fichas o cajas (el revisor no abrió la maqueta en el navegador).
