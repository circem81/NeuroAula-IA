# Propuesta: cómo aprende cada alumno (P15, versión 1)

Estado: **Propuesto**. Redactada por Claude el 2026-11-13 a petición de la usuaria. No está aprobada.
Amplía el gemelo adaptativo (P13, aprobada en A37) y los ajustes de apoyo (P14). Incluye una
propuesta para cerrar D29 (sección 9) y tiene dos decisiones nuevas (D30 y D31, sección 11).

Maqueta: panel «Hipótesis del gemelo» de los cuatro alumnos ficticios en
`harness/propuestas/maqueta-gemelo-adaptativo.html`.

## 1. Idea

Palabras de la usuaria: «la IA no diagnostica pero sí puede aprender cómo aprende el alumno,
ajustarse a su forma, ya que vamos a introducir niveles de aprendizaje basados en neurociencia».

El gemelo no solo registra si el alumno acierta. Con las evidencias formula **hipótesis
revisables** sobre qué le cuesta y qué le funciona, prueba una adaptación y comprueba si ha
servido. Nunca convierte una hipótesis en una etiqueta.

## 2. Fuentes

- **Marco de neuroeducación de NeuroAULA AI:** «NeuroAula AI — Marco de neuroeducación aplicada»,
  en el repositorio privado `cognitive-evolve-ai` (`docs/NEUROEDUCATION_FRAMEWORK.md`). Aquí se
  resume con palabras de Claude y no se copia, porque el repositorio del proyecto es público.
- **Libros que cita ese marco:**
  - Daniel Molina, *Neurodidáctica y funciones ejecutivas* (secuencia AIDARE);
  - Anna Carballo y Marta Portero, *10 ideas clave. Neurociencia y educación*;
  - Caballero, García Cabrera y Llorent, *Hacer de la neuroeducación el arte de enseñar* (BRAIM);
  - obras de Francisco Mora y David Bueno.

  **Claude no ha leído estos libros:** solo conoce el resumen del marco. Lo que se diga de AIDARE y
  BRAIM debe completarlo la usuaria.
- **Inspiración de arquitectura:** el documento «9 RAG Architectures Every AI Developer Must Know»,
  aportado por la usuaria. Es la exportación de una conversación con un asistente de IA, no una
  fuente académica: autor y fecha sin identificar, como ya indica el índice bibliográfico del
  proyecto. De él se toma la idea de dos capas (sección 4), no ninguna afirmación de eficacia.
- **Principio y base metodológica:** A34 («Prohibido hacer nada que no se entienda») y A35
  (Liljedahl).

## 3. El ciclo (del marco de neuroeducación)

> actividad → lo que hace el alumno → evidencia → hipótesis sobre una dificultad o una fortaleza →
> adaptación → nueva actividad → comprobación

Se guardan por separado cuatro cosas:
- lo observado;
- la hipótesis;
- la adaptación que se prueba;
- el resultado de la comprobación.

Una observación aislada nunca se convierte en hipótesis.

## 4. Dos capas, más el estado del alumno

| Capa | Qué contiene | En cajas y fichas |
| --- | --- | --- |
| A · Mapa de lo que se aprende | Pasos pequeños y observables, unidos por «necesita» y «abre». | Signo igual → escribir el dibujo → quitar lo mismo en los dos miembros → repartir → comprobar → símbolos (positivos) → negativos → paréntesis… (el mapa de P13). |
| B · Orientación pedagógica | Cómo se quiere enseñar. | A34, las prácticas de Liljedahl (A35), la regla de no dar la solución (P9), la decisión mixta (A33) y los ajustes de Orientación y PT (P14). |
| Estado del alumno en cada punto del mapa | Dominado, en curso, bloqueado, sin empezar o **en retroceso** (lo dominaba y vuelve a fallar). | El panel del alumno. |

El gemelo combina las tres: dónde está bloqueado (A), cómo se quiere enseñar (B) y qué le está
funcionando a este alumno (sección 5).

Todo esto **funciona sin modelo de IA**: el mapa y la orientación son datos, y el gemelo los
consulta con reglas. Un sistema RAG con modelo de lenguaje solo tendría sentido más adelante,
para buscar materiales o redactar textos, y depende de D1.

## 5. Dimensiones que el gemelo puede observar en cajas y fichas

Son las dimensiones funcionales del marco, solo las que esta actividad permite observar. Son
**hipótesis sobre la tarea, no rasgos del alumno**. La columna «Señal» indica si basta la respuesta
final o hacen falta los pasos, que hoy no se guardan (A31, ver D30).

| Dimensión | Qué se observa | Señal | Adaptación que se prueba | Cómo se comprueba |
| --- | --- | --- | --- | --- |
| Mantener información intermedia (memoria de trabajo) | Falla cuando ve todos los pasos a la vez y acierta paso a paso. | Respuesta final con y sin «un paso cada vez». | «Un paso cada vez» y guía visible. | Aciertos con el ajuste; después se retira poco a poco y se mira si se mantiene. |
| Paso entre representaciones | Acierta con dibujo y falla con símbolos, o al revés. | Respuesta final por nivel. | Volver al dibujo y escribir él la línea algebraica. | Acierta en el nivel 2 sin volver al dibujo. |
| Evocación | Resuelve hoy y falla el mismo tipo días después. | Respuesta final con fecha. | Repaso espaciado: el mismo tipo a los pocos días. | Acierto diferido. |
| Atención sostenida en la tarea | Baja el acierto a partir del tercer ejercicio seguido. | Respuesta final con su posición en la tanda. | Tandas cortas y pausas. | El acierto se mantiene en cada tanda. |
| Flexibilidad | Tras un error cambia de camino, o repite el mismo error. | Respuestas finales seguidas. | «Comparar dos caminos». | Usa otro camino cuando le conviene. |
| Planificación y secuencia | Da muchos pasos o en un orden que lo bloquea. | **Pasos** (D30). | Guía visible y «Comparar caminos». | Menos pasos para llegar. |
| Monitorización del error | Envía sin comprobar, o se corrige solo. | **Pasos** (D30). | Comprobar antes de enviar y la pregunta «¿cómo lo compruebas?». | Se corrige sin pista. |

Se registran también las **fortalezas** («transfiere a ecuaciones escritas de otra forma», «se
corrige solo»), no solo las dificultades.

**Cuidado con la atención.** Una hipótesis sobre atención se parece a un diagnóstico. Por eso se
redacta siempre sobre la tarea («baja el acierto tras el tercer ejercicio seguido»), nunca sobre la
persona. Y nunca se usa para confirmar un diagnóstico (sección 7).

## 6. Cómo se escribe una hipótesis

> En estas tareas se observa un patrón compatible con dificultad para mantener información
> intermedia. Confianza: **moderada**. Evidencias: respuestas 1, 2 y 8. Adaptación: «un paso cada
> vez» desde la respuesta 4. Comprobación: 5 de 6 correctas con la adaptación → **confirmada**.

Niveles de confianza:
- **Provisional:** 2 observaciones.
- **Moderada:** 3 o más observaciones en 2 actividades distintas, el umbral que ya usa el gemelo.
- **Confirmada:** mejora tras la adaptación.
- **No confirmada:** no mejora tras la adaptación; se avisa al profesor.

Las hipótesis pierden peso con el tiempo, como las evidencias del gemelo, que tienen una semivida
de 90 días. Se descartan si las contradicen evidencias nuevas.

## 7. Hipótesis y diagnóstico no se mezclan

Orientación puede haber registrado un diagnóstico (A42). El gemelo:
- no usa el diagnóstico para formular ni para confirmar hipótesis, para evitar ver lo que se espera
  ver;
- solo usa los ajustes que Orientación haya fijado;
- deja que Orientación, que ve las dos cosas (A43), las compare y decida.

## 8. Escalera de validación (del marco)

Ningún libro ni teoría se convierte en regla sin pasar por estos escalones:
1. fundamento;
2. hipótesis de diseño;
3. indicador candidato;
4. indicador con respaldo empírico;
5. componente validado en NeuroAULA AI.

Todas las dimensiones de la sección 5 están hoy en el escalón **3**.

## 9. Propuesta para cerrar D29 (cómo accede la IA)

- **El gemelo, que funciona con reglas dentro de NeuroAULA:** usa las evidencias, las hipótesis,
  los ajustes y, si hiciera falta, la categoría del diagnóstico para proponer ajustes de partida
  (A42). Nada sale del sistema.
- **Un modelo de IA externo, si algún día se aprueba (D1):** recibe solo información derivada, es
  decir, los ajustes y lo que le funciona al alumno, sin nombre, diagnóstico ni informe.

## 10. Qué ve cada uno

| Quién | Qué ve |
| --- | --- |
| Alumno | «Lo que te está funcionando», en positivo («te va mejor paso a paso»), para que reflexione sobre cómo aprende. No ve dimensiones ni niveles de confianza (D31). |
| Profesor | Las hipótesis con sus evidencias, la adaptación y la comprobación. Puede cambiar la adaptación (A33). |
| Orientación y PT | Lo mismo que el profesor, más el contexto de A42-A43. |

Lo que el gemelo aprende de un menor es una forma de perfil. Por eso hacen falta tres cosas:
supervisión humana, explicación de cada hipótesis y que nada sea definitivo sin una persona detrás.
También entra en la autorización de D28.

## 11. Decisiones abiertas

- **D30 · Pasos para la planificación y la monitorización.** Con A31, los pasos no se guardan, así
  que esas dos dimensiones no se pueden observar más allá de la sesión. Opciones:
  - (a) dejarlas fuera;
  - (b) guardar solo un resumen por ejercicio (número de pasos, si comprobó antes de enviar), sin
    el detalle de cada paso.

  Recomendación: (b). Exige revisar A31 en ese punto.
- **D31 · Qué ve el alumno.** Recomendación: solo «lo que te está funcionando», en positivo.

## 12. Si se aprueba: piezas

- `src/lib/learning-hypotheses.ts` (nuevo, sin React): hipótesis, confianza y comprobación, con
  pruebas.
- Mapa de cajas y fichas como datos (capa A) y orientación como datos (capa B).
- Panel del alumno en `/demo/alumno/$id` con alumnado ficticio.
- Cuando haya datos reales: tabla de hipótesis en Supabase, con migración aprobada (A6).
