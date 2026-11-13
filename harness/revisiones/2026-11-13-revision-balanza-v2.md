# Comprobación de la versión 2 de la especificación de la balanza (2026-11-13)

Hecha por Claude (sesión principal), no por el rol revisor-pedagogico. Solo lectura de
`harness/propuestas/balanza-2x3-11.md`, más un cálculo con fracciones exactas (Python,
`fractions.Fraction`) fuera del proyecto.

## Comprobado

- OV1. Filas 7-12 de la tabla 6.2: las seis líneas simplificadas son correctas
  (x = 4; x/2 + 3/4 = 11/4; x/2 = 2; 2x − 3 = 5; 4x − 18 = −2; 2x − 8 = 0).
- OV2. Las filas 11 y 12 son alcanzables desde 2x + 3 = 11 (restando 3 varias veces).
- OV3. Con los seis botones el coeficiente de x es siempre una potencia de 2 positiva y x queda
  siempre a la izquierda (secciones 6.1 y 9.1).
- OV4. Como todas las operaciones son equivalencias, el estado final siempre es x = 4; el caso
  «cierta pero n no es el valor de la balanza» (9.2) no puede darse.

## Corregido (versión 3)

- OV5. El límite de 100 / 8 no da «tres seguidas» desde cualquier estado. Seguidas permitidas:

  | Desde | · 2 | : 2 |
  | --- | --- | --- |
  | 2x + 3 = 11 | 3 | 3 |
  | x + 3/2 = 11/2 | 4 | 2 |
  | 2x = 8 | 3 | 4 |
  | x = 4 | 4 | 3 |

  Las secciones 7 y 12 dicen ahora desde qué estado se prueba.

## Observaciones

- OV6. La respuesta final (9.3) no decía qué hacer con decimales. Resuelto en A23: el decimal se
  compara por su valor (`x = 4,0` correcto, `x = 3,5` incorrecto). Aplicado en las secciones 9.3 y 12.
- OV7. Sigue sin una revisión del rol revisor-pedagogico sobre la versión 2/3.
