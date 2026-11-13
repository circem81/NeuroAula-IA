# Propuesta: gemelo de aprendizaje adaptativo para ecuaciones (P13, versión 2)

Estado: **Propuesto**. Redactada por Claude el 2026-11-13 a petición de la usuaria. No está
aprobada y no se toca `src/` hasta que lo esté. Versión 2: las tres decisiones de la sección 9 están
resueltas (A31, A32 y A33).

Maqueta con tres alumnos ficticios: `harness/propuestas/maqueta-gemelo-adaptativo.html`.

## 1. Idea

El Learning Twin ya registra lo que el alumno hace en cada tarea. La propuesta añade un **motor de
decisiones** que lee ese registro y, en los momentos clave, decide **qué metodología o actividad
viene después**. No reacciona a cada clic.

Palabras de la usuaria: «crear un gemelo de aprendizaje avanzado donde […] las decisiones de usar
una metodología vengan adaptadas según las respuestas del alumno».

## 2. Principios

1. **«Prohibido hacer nada que no se entienda»**, principio de todo NeuroAULA AI (A34), tomado del
   material de Pepe Vidal (Proyecto Newton). El gemelo no hace avanzar hacia el símbolo mientras el paso anterior no se haya
   entendido. Ante un error repetido, vuelve a la representación que el alumno sí entiende.
2. **Mantener el flujo** (Liljedahl, práctica 9, A35). El reto se ajusta a lo que el alumno puede
   hacer: ni tan fácil que aburra ni tan difícil que bloquee.
3. **Se adapta a errores observados, no a perfiles.** Nada de «estilos de aprendizaje» ni
   etiquetas sobre capacidades. Cada decisión se apoya en respuestas concretas y fechadas.
4. **No se decide por un solo fallo.** Un error aislado da como mucho una pista. Para cambiar el
   recorrido hace falta el umbral del gemelo: 3 observaciones en al menos 2 actividades distintas.
5. **Toda decisión se explica.** Cada decisión lleva su motivo en lenguaje sencillo («propongo el
   nivel 2 porque ha resuelto dos ejercicios del nivel 1 sin pistas»).
6. **El profesor puede verlo y cambiarlo.** Si un error sigue después de la actividad pensada para
   él, el gemelo avisa al profesor y no insiste por su cuenta.
7. **Sin IA y sin gastos.** El motor funciona con reglas fijas, igual que el gemelo actual (A10,
   D1). Mismas entradas, misma decisión, siempre.
8. **Volver atrás no es un castigo.** Los mensajes al alumno no califican (P9).

## 2 bis. Base metodológica: «Diseñando aulas para pensar en matemáticas» (A35)

Las 14 prácticas de Peter Liljedahl (NED Ediciones, 2024; original de Corwin, 2021), resumidas por
Claude con sus palabras. El orden y el contenido se comprobaron con el resumen ejecutivo público del
autor («What is Building Thinking Classrooms?»). La columna de la derecha es propuesta de Claude. Algunas son de organización del aula, y ahí NeuroAULA solo puede
ayudar al docente. Otras encajan directamente en el gemelo.

| N.º | Práctica (resumen) | Cómo encaja en NeuroAULA AI |
| --- | --- | --- |
| 1 | Empezar con tareas que hagan pensar, no con explicaciones. | El nivel 0 (dibujo y ensayo) y los retos van antes de enseñar el método. |
| 2 | Grupos aleatorios y visibles, que cambian a menudo. | Aula. La app podría generar los grupos para el docente. |
| 3 | Trabajar de pie en superficies verticales que se borran. | Aula. La maqueta se puede proyectar y usar en pizarra. |
| 4 | Aula sin un frente fijo. | Aula. |
| 5 | Responder solo las preguntas que mantienen pensando. | Las pistas nunca dan la solución ni el paso siguiente (P9). Toda pista del gemelo debe devolver una pregunta. |
| 6 | Dar la tarea al principio, de palabra y con el alumnado de pie. | Aula. En la app, el enunciado es breve y se puede leer en voz alta. |
| 7 | Las tareas para casa son preguntas para comprobar si se ha entendido, sin nota. | Las preguntas rápidas y la práctica variada no califican; solo informan al alumno y al gemelo. |
| 8 | Fomentar la autonomía: buscar ayuda en otros grupos y en el aula. | El alumno elige entre dos caminos válidos (A33) y puede consultar su cuaderno y los ejemplos. |
| 9 | Mantener el «flujo» con pistas y extensiones, equilibrando reto y capacidad. | **Es el objetivo del motor**: la actividad de apoyo y volver al dibujo bajan el reto; avanzar y la práctica variada lo suben. |
| 10 | Consolidar al final partiendo del trabajo del alumnado, de lo más sencillo a lo más elaborado. | Vista del profesor: ordenar los caminos que siguió la clase (tachar, repartir, símbolos) para la puesta en común. |
| 11 | Tomar notas pensadas para «el yo del futuro». | El cuaderno de líneas algebraicas es del alumno y puede añadir su propia nota. |
| 12 | Evaluar lo que se valora (también perseverar o colaborar). | El gemelo registra acierto, ayuda y transferencia; no solo la nota. |
| 13 | Evaluación formativa: dónde está el alumno y hacia dónde va. | El alumno ve el mapa del recorrido (sección 4) con dónde está. |
| 14 | Calificar con datos, no con puntos. | El Learning Twin ya funciona con evidencias fechadas y sin porcentajes visibles. |

Consecuencia para el motor: su meta no es «avanzar lo más rápido», sino **mantener a cada alumno
en flujo** (práctica 9), sin hacer nada que no se entienda (A34).

## 3. Lo que ya existe y lo que falta

| Ya existe en el Learning Twin | Falta |
| --- | --- |
| Evidencia por respuesta: acierto, ayuda, transferencia, error, estrategias, intentos y fecha. | Errores concretos de ecuaciones; hoy solo hay categorías genéricas (D22). |
| Patrones de error: emergente (3 en 2 actividades) o consistente (6 en 3, en 14 días). | Actividades diseñadas para que cada fallo deje ver su causa (sección 5). |
| Efecto de las ayudas, comparando intentos consecutivos. | El motor de decisiones (sección 6). |
| Informe para el profesor, sin IA. | La vista del profesor con las decisiones y su motivo. |

El motor sería un módulo nuevo que **lee** el informe del gemelo y no lo modifica. El gemelo sigue
guardando hechos; el motor propone qué hacer con ellos.

## 4. Mapa del recorrido

Sigue la progresión de álgebra del material de referencia. Los nodos que no están en la
especificación de cajas y fichas quedan dibujados para más adelante.

| Nodo | Contenido | Estado |
| --- | --- | --- |
| Signo igual | Verdadero o falso y huecos con el = en distintas posiciones (informe de errores, propuesta 1). | Nuevo, propuesto |
| Nivel 0 · Dibujo y ensayo | Cajas y fichas, escribir la ecuación, tabla de ensayo. | Especificado (cajas y fichas) |
| Nivel 1 · Tachar y repartir | Tachar lo mismo en los dos miembros y repartir a mano. | Especificado |
| Nivel 2 · Solo símbolos (positivos) | Los mismos pasos con la x. | Especificado |
| Negativos 1 y 2 | Fichas de dos colores que se anulan por parejas, o ya con símbolos. | Más adelante |
| Paréntesis 1 y 2 | Positivos y negativos. | Más adelante |
| Denominadores | Ecuaciones con fracciones. | Más adelante |
| Sistemas | Dos incógnitas. | Más adelante |

El mapa cubre por ahora el álgebra. El material de referencia es el Genially completo de Proyecto
Newton (A34): cálculo, números, estructuras aditiva y multiplicativa, fracciones y porcentajes,
proporcionalidad, geometría, funciones, probabilidad, etc. Cada área podría tener su propio mapa
con el mismo motor.

Además del recorrido principal hay **actividades de apoyo** a las que el motor puede desviar al
alumno: «El signo igual», «¿Qué representa x?», «Encuentra el error», «Comparar dos caminos» y
«Lo mismo en los dos miembros» (escribir la línea completa).

El orden de los niveles aprobado en A29 se respeta: el motor nunca abre un nivel saltándose el
anterior. Puede proponer acortar un nivel (un ejercicio en lugar de tres) o volver a uno anterior.

## 5. Errores que el gemelo distingue y cómo se ven

Los errores son los del informe de investigación. Cada uno tiene que poder verse en una respuesta
o en un paso concreto.

| Código | Error | Señal en la respuesta final | Señal en los pasos (D21) |
| --- | --- | --- | --- |
| E1 | El = como «da el resultado» | Pone 12 en `8 + 4 = □ + 5`. Dice que `11 = 2x + 3` no es una ecuación. | Tacha distinto en cada miembro 3 veces o más. |
| E2 | La x como objeto | Al repartir 8 fichas entre 2 cajas, contesta 8 (el total). | Escribe «x» por cada caja sin contar las fichas. |
| E3 | Jerarquía y estructura | Con x = 4 calcula `2x + 3` como 27 (24 + 3). | En la tabla escribe 24 + 3. |
| E4 | Operar solo una parte | En `2x + 3 = 11` contesta x = 2,5 (dividió el 2x y no el 3). | — |
| E5 | Cambiar de miembro con el signo mal | En `2x + 3 = 11` contesta x = 7 (sumó 3 en lugar de restarlo). | — |
| E7 | Juntar lo que no se puede juntar | Escribe `5x` por `2x + 3`. | Escribe la ecuación del dibujo juntando cajas y fichas. |

No son errores, pero también son señales:
- Tantear sin acercarse: más de 6 ensayos en el nivel 0 sin acercarse a la solución.
- Pistas pedidas en cada ejercicio.

## 6. Decisiones y reglas

El motor solo decide en estos momentos: **después de cada respuesta final** y **al terminar una
actividad**. Si se cumplen varias reglas a la vez, gana la primera de la tabla.

| Prioridad | Regla | Cuándo | Decisión | Alternativa que puede elegir el alumno |
| --- | --- | --- | --- | --- |
| 1 | Aviso al profesor | Un error reaparece después de su actividad de apoyo. | No cambia el recorrido. Avisa al profesor con las respuestas concretas. | — |
| 2 | Actividad de apoyo | Un error llega al umbral (3 observaciones en 2 actividades). | Inserta la actividad pensada para ese error (E1 → «El signo igual», E2 → «¿Qué representa x?», E3 → «¿Qué va primero?», E4 y E7 → «Encuentra el error», E5 → «Lo mismo en los dos miembros»). | — |
| 3 | Volver al dibujo | Dos fallos seguidos en el nivel 2 después de haber resuelto el nivel 1. | El siguiente ejercicio es del nivel 1. | Intentarlo otra vez sin dibujo. |
| 4 | Comparar caminos | Dos aciertos en el nivel 1 resueltos por el mismo camino. | «Comparar dos caminos» con 3x + 9 = 6x + 3. | Seguir sin comparar. |
| 5 | Avanzar | Dos aciertos seguidos en el mismo nivel sin pistas. | Propone el nivel siguiente. | Hacer uno más de este nivel. |
| 6 | Practicar de otras formas | Tres aciertos en el nivel 2 sin pistas. | Práctica variada: la x a la derecha, el número delante, soluciones mayores. | — |
| — | Pista en la sesión (D21) | Una señal de los pasos, como tachar distinto o tantear mucho. | Una pista breve en ese momento, sin cambiar el recorrido. | — |

Las reglas y los umbrales son una propuesta: hay que probarlos con alumnado ficticio y, más
adelante, ajustarlos.

## 7. Qué ve cada uno

- **Alumno:** la actividad siguiente y una frase sin calificar («Vamos a probar con el dibujo otra
  vez»). Cuando la regla tiene alternativa, puede elegir.
- **Profesor:** una línea de tiempo con cada respuesta, el error observado, la decisión y su motivo.
  Puede aceptar o cambiar cada decisión, y recibe los avisos de la regla 1.

## 8. Fuera de esta propuesta

- IA, modelos de lenguaje y proveedores (D1).
- Datos reales: todo se prueba con alumnado ficticio.
- Supabase: no se toca. Si las señales de los pasos se guardaran (D21), haría falta una migración
  aparte y aprobada.
- Los nodos «más adelante» de la sección 4.

## 9. Decisiones tomadas

- **Señales de los pasos (A31, antes D21).** Se usan solo durante la sesión para dar pistas. No se
  guardan ni cuentan para los patrones; A14 no cambia.
- **Errores concretos (A32, antes D22).** Se añaden E1-E7 a `ERROR_TYPES` en
  `src/lib/learning-twin.ts`, y solo esa lista. Se hará al implementar P13. Añadir el archivo a
  `harness/permisos.json` le corresponde a la usuaria.
- **Última palabra (A33, antes D23).** Mezcla: el profesor ve todas las decisiones y puede
  cambiarlas, el alumno elige cuando hay dos caminos igual de válidos, y los avisos solo los ve el
  profesor.

## 10. Si se aprueba: archivos y pruebas

- Nuevos: `src/lib/learning-path.ts` (motor, sin React), `src/lib/learning-path.test.ts`.
- A tocar: `src/lib/learning-twin.ts` (solo `ERROR_TYPES`, A32), la vista del
  profesor y la página de cajas y fichas.
- Pruebas mínimas: los tres recorridos de la maqueta dan exactamente las decisiones de la maqueta,
  con las opciones aprobadas (A31-A33). Además:
  - ninguna decisión sale de un solo error;
  - ninguna abre un nivel saltándose el anterior;
  - toda decisión tiene un motivo escrito.
