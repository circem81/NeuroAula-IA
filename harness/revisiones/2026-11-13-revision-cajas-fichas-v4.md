# Revisión pedagógica de «cajas y fichas», versión 4 (especificación y maqueta)

Hecha por el rol revisor-pedagogico el 2026-11-13, solo leyendo. Guardada por el coordinador
(Claude, sesión principal). Comprobaciones del coordinador:
- Ejemplos de OV4-3 sustituidos: 4x + 2 = x + 8 (x = 2; 10 = 10; con x = 1, 6 y 9),
  4x + 1 = x + 10 (x = 3; 13 = 13), 5x + 2 = 2x + 14 (x = 4; 22 = 22).
- OV4-6 (2x + 15 = 5x + 3, x = 4; 23 = 23) y OV4-8 (6x + 1 = 2x + 13 → 6x = 2x + 12 → 3x = x + 6)
  comprobados.
- OV4-1 y OV4-5 confirmados en el código de la maqueta (la tabla se cierra con el primer «iguales»
  y el mensaje de error dice «Compruébala en la tabla»; texto del reparto desigual).

Las conclusiones son propuestas hasta que la usuaria las apruebe.

## Lo que está bien

- Las 9 ecuaciones y todos los ejemplos de las secciones 6.1, 6.2, 7, 8 y 12 son correctos y tienen
  solución entera (A24). `EXERCISES` de la maqueta coincide con la especificación.
- Tachar y repartir a mano (A27): no hay estados imposibles (solo se quita lo tachado igual en los dos
  miembros), no hay callejones sin salida (siempre se puede tachar o repartir, y el reparto sale
  exacto) y no se califica al alumno (el reparto desigual solo se avisa al terminar; «Volver a
  repartir» lo devuelve todo; la respuesta equivocada a «¿Cuántas fichas hay en cada caja?» no cuenta
  como intento).
- A30 bien aplicada: dice si la respuesta es correcta sin decir el valor, también al agotar los
  envíos, y respeta A23 (`5,0` y `5.0` correctas; `10/2` pide simplificar sin gastar intento).

## Errores (corregir)

| N.º | Elemento | Problema | Corrección propuesta |
| --- | --- | --- | --- |
| OV4-1 | Respuesta incorrecta (A30) | Dice «Compruébala en la tabla.», pero la tabla ya está cerrada. | (a, recomendada) Reabrir la tabla tras un envío incorrecto. (b) Texto: «Esa respuesta no es correcta. Intento n de 5. Compárala con lo que dice la tabla.» Nunca dar el valor. |
| OV4-2 | Niveles en orden (A29) | Un alumno que agota los envíos del nivel 0 no abre nunca el nivel 1 (error verosímil: enviar el total, «x = 16»). No se dice cómo se guardan los niveles abiertos. | Salida a decidir: (1) el docente puede abrir el nivel; (2) también se abre al terminar (resolver o agotar envíos) los tres ejercicios del anterior. Calcular la apertura a partir del estado guardado de cada actividad y añadir la prueba. |
| OV4-3 | Ejemplo resuelto antes de cada tarea | Sigue abierto desde la segunda revisión; el tachar y repartir es nuevo y no se ve hecho. | Un ejemplo por nivel, con ecuaciones distintas de las nueve: nivel 0, dibujo de 4x + 2 = x + 8 (ensayos 1 → 6 y 9; 2 → 10 y 10); nivel 1, 4x + 1 = x + 10 (tachar 1 caja y 1 ficha → 3x = 9 → x = 3); nivel 2, 5x + 2 = 2x + 14 (restar 2x, restar 2, dividir entre 3 → x = 4). |
| OV4-4 | P9 (A13): «la comprobación la escribe el alumno» | La tabla calcula sola. A25 no nombra P9 ni la retira. | Decide la usuaria: si se aplica, el alumno escribe el total de cada miembro y la tabla dice «iguales» o «distintos»; si no, anotarlo en la sección 7. Afecta a D17. |
| OV4-5 | Reparto desigual | «Las cajas no tienen el mismo número de fichas, y todas las cajas tienen dentro lo mismo.» parece contradictorio. | «Las cajas no tienen el mismo número de fichas. Recuerda: todas las cajas tienen dentro lo mismo. Vuelve a repartir.» Mismo texto en `aria-live`. |
| OV4-6 | Sección 12, prueba del nivel 2 | Usa 3x + 9 = 6x + 3, que es del nivel 1. | Usar 2x + 15 = 5x + 3: quitar 2 cajas → `15 = 3x + 3`; quitar 3 fichas → `12 = 3x`; 3 grupos → `4 = x`; deshacer vuelve a `12 = 3x`. |
| OV4-7 | Inglés (A20) | Solo la cita de A28 está en inglés; la maqueta es solo española. | Anexo con los textos en inglés (términos nuevos: *Cross out*, *Remove what is crossed out*, *Share out the counters*, *How many counters are in each box?*, *Opens when you solve an exercise in level 0*). |

## Sugerencias (decide la usuaria)

| N.º | Elemento | Propuesta |
| --- | --- | --- |
| OV4-8 | Ejemplo `(4x + 6) : 2` de 6.2 no sale de ningún ejercicio | Usar `6x : 2 = (2x + 12) : 2` → `3x = x + 6` (desde 6x + 1 = 2x + 13 tras quitar 1 ficha) y añadirlo a las pruebas. |
| OV4-9 | Apertura del nivel 2 sin aviso | «Se ha abierto el nivel 2.», también en `aria-live`. |
| OV4-10 | Recuento durante el reparto | «2 cajas, con 7 fichas dentro» y «Quedan 3 fichas por repartir». |
| OV4-11 | La caja muestra un número al repartir | Dibujar las fichas dentro de la caja y dejar el número solo para el lector de pantalla. |
| OV4-12 | Corregir el reparto | Permitir sacar una ficha de una caja, además de «Volver a repartir». |
| OV4-13 | «Ninguna caja y ninguna ficha» | «Nada.» |
| OV4-14 | Puente al nivel 1 | «Al resolver» en las secciones 4 y 7. |
| OV4-15 | Orden de 6.2 | Cabecera «Paso · nombre en el nivel 2»; mensajes comunes en un apartado 6.3. |
| OV4-16 | D17 (pendiente) | Nivel 1: 4, como el nivel 2 (3 significa «ejemplo análogo» en `supportLabel`). Nivel 0: 3 o 4 según OV4-4, y un punto más con «Ver la ecuación». Con el ejemplo de OV4-3, el 3 tendría sentido literal. |

## Diferencias entre maqueta y especificación

- Envíos: la maqueta los reinicia al cambiar de ejercicio (limitación declarada); la aplicación debe
  seguir la especificación.
- Falta en la sección 5 el texto de «Ver la ecuación» («La ecuación del dibujo es …»).
- Falta en la sección 8 el ejemplo `x = 5.0` con punto.
- La maqueta quita `·`, `*`, `×` en cualquier parte, no solo entre número y x (detalle para el revisor
  técnico). `=x+11` sale «no coincide»; mejor «no se entiende».
- Comentario desfasado en el código («D20» ya resuelta en A30).

## No verificado

- Aspecto con muchas fichas, foco del teclado y lector de pantalla (no abrió la maqueta).
- El material de Pepe Vidal (Proyecto Newton) y su licencia.
- Textos en inglés (no existen), persistencia real de envíos y niveles, vista del profesor.
