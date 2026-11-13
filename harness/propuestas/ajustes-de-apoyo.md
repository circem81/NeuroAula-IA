# Propuesta: ajustes de apoyo definidos por Orientación y PT (P14, versión 3)

Estado: **Propuesto**. Redactada por Claude el 2026-11-13 a petición de la usuaria. No está aprobada:
no se toca `src/` ni Supabase hasta que lo esté. Versión 2: D24-D27 resueltas como
recomendaba Claude (A38-A41, sección 8). Sigue el requisito previo a cualquier dato real
(sección 9, D28).
Versión 3: se guardan también el diagnóstico y el informe de Orientación, con acceso restringido
(A42, A43). Sustituye lo que decía la versión 2 sobre «solo ajustes». Queda abierta D29 (sección 2 bis).

Maqueta: el alumno ficticio D de `harness/propuestas/maqueta-gemelo-adaptativo.html`.

## 1. Idea

Palabras de la usuaria: «descargar un poco al profesor en clase, que haya informes del PT y del
orientador y que cada alumno sea guiado gracias a esos apoyos. Es decir, un alumno TDAH tiene una
necesidad alta de ejercicios de una manera, pasos cortos, guía concreta, etc.». Y después: «es
importante, es una pata de NeuroAULA AI».

Dentro del gemelo hay dos piezas que trabajan juntas:
- **El motor de decisiones (P13)** decide **qué** viene después, según las respuestas.
- **Los ajustes de apoyo (P14)** deciden **cómo** se le presenta cada actividad a ese alumno, según
  lo que hayan establecido Orientación y PT.

## 2. Principio: el gemelo no diagnostica

> Desde la versión 3 (A42) sí se guardan el diagnóstico y el informe que aporta Orientación; ver la
> sección 2 bis. Lo que sigue vale para todo lo demás: el gemelo no infiere ni pone etiquetas.

El Learning Twin no diagnostica ni etiqueta («no diagnostica AACC, TDAH u otras condiciones»). P14
lo mantiene:

- Orientación o PT **no suben el informe**. Rellenan una **ficha de ajustes**: qué necesita el
  alumno para aprender, no qué tiene.
- La aplicación no tiene ningún campo para diagnósticos ni para informes. Si no existe el campo, no
  se puede guardar por error.
- El profesor ve «Ajustes activos: pasos cortos, guía visible». No ve el motivo.
- El informe psicopedagógico sigue donde está ahora, en Orientación.

Así se guarda lo mínimo necesario para ayudar, no se pone una etiqueta al alumno, y un mismo ajuste
sirve a alumnos con necesidades distintas.

## 2 bis. Diagnóstico e informe de Orientación (A42, A43)

**Dos capas de datos.**

| Capa | Qué contiene | Riesgo | Quién accede |
| --- | --- | --- | --- |
| Datos de Orientación | Diagnóstico (de una lista cerrada, la que use el centro para el alumnado con necesidades) e informe. | **Alto** | PT, Orientación, tutor y profesor de la materia con apoyo (A43). |
| Ajustes | La ficha de ajustes de la sección 4. | Medio | Además, el resto del profesorado del alumno y el propio alumno (sus ajustes). |

**Cómo se usa.**
- Orientación registra el diagnóstico. La aplicación le **propone ajustes de partida** para ese
  diagnóstico, y Orientación los confirma o los cambia. No todos los alumnos con el mismo
  diagnóstico necesitan lo mismo.
- El gemelo toma sus decisiones con los ajustes y con las respuestas observadas, nunca solo por la
  etiqueta.
- El gemelo no infiere diagnósticos. Nada de lo que observa se convierte en uno.

**Acceso de la IA (D29, pendiente).** Petición de la usuaria: «La IA deberá tener acceso o
información para adaptar el aprendizaje». Propuesta:
- **El gemelo (reglas, dentro de NeuroAULA):** usa la categoría del diagnóstico y los ajustes. No
  necesita leer el informe.
- **Un modelo de IA externo,** si algún día se aprueba uno (D1): solo **información derivada**, es
  decir, los ajustes y unas necesidades descritas sin nombre ni diagnóstico. Nunca el informe ni el
  diagnóstico. El texto de un informe psicopedagógico de un menor no debe salir del sistema del
  centro.

**Protecciones mínimas para la capa de riesgo alto.**
- Permisos por rol y por materia en Supabase (RLS): el profesor de otra materia no puede leerla.
- Registro de quién consulta cada diagnóstico o informe, y cuándo.
- Informe guardado cifrado y con plazo de conservación definido por el centro.
- Nunca en datos de demostración reales: en las pruebas, todo ficticio.

**Requisitos antes de datos reales (ampliación de D28).** Al tratarse de datos de salud de menores a
gran escala, hace falta:
- una evaluación de impacto en protección de datos;
- la autorización del centro y de su delegado de protección de datos;
- informar a las familias.

Además, una IA que oriente el aprendizaje en educación probablemente sea de alto riesgo según el
Reglamento europeo de IA, con obligaciones de supervisión humana y documentación. Lo deben valorar
el centro y su asesoría; no es algo que pueda decidir Claude.

## 3. Catálogo de ajustes

Hay dos tipos. Los **de acceso** cambian la forma, no la tarea. Los **de andamiaje** dan más
estructura para hacer la misma tarea.

| Ajuste | Tipo | Qué cambia en cajas y fichas |
| --- | --- | --- |
| Un paso cada vez | Andamiaje | Solo se ve el paso actual: «Paso 2 de 4: tacha lo mismo en los dos miembros». El resto aparece al terminarlo. |
| Guía visible | Andamiaje | Una lista corta y fija a la vista: tachar, quitar, repartir, comprobar. El paso actual va marcado. |
| Ejemplo resuelto a mano | Andamiaje | Un ejemplo con otra ecuación, siempre accesible con un botón. |
| Respuesta inmediata | Andamiaje | Tras cada acción, una frase que describe lo que ha hecho («Has quitado 1 caja de cada miembro»), sin calificar. |
| Pantalla simplificada | Acceso | Un solo ejercicio, sin animaciones y solo con los botones necesarios. |
| Tandas cortas | Acceso | Tandas de 2 ejercicios en lugar de 3, con una pausa sugerida entre tandas. |
| Lectura en voz alta | Acceso | Botón para oír el enunciado y los mensajes con la voz del navegador, sin servicios externos. |
| Letra y botones grandes | Acceso | Más tamaño y más espacio entre botones. |

La lista es inicial: Orientación y PT podrían pedir más, y cada ajuste nuevo se añadiría al
catálogo. No habría texto libre que pudiera acabar convertido en un diagnóstico.

## 4. La ficha de ajustes

| Campo | Contenido |
| --- | --- |
| Alumno | Identificador del alumno (en las pruebas, siempre ficticio). |
| Ajustes | Elegidos del catálogo. |
| Definido por | Rol (Orientación o PT) y fecha. |
| Revisar el | Fecha de revisión obligatoria, por ejemplo al final del trimestre. Así los ajustes no se convierten en una etiqueta permanente. |
| Nota para el profesor | Opcional, corta, solo sobre qué hacer en clase («sentarlo cerca de la pizarra vertical»). La aplicación avisa de que no se escriban diagnósticos. |

## 5. Cómo lo usa el gemelo

- **Presentación.** Cada actividad que proponga el motor (P13) se muestra con los ajustes activos.
- **Reglas.** Los ajustes no cambian las reglas de P13, salvo dos casos:
  - con «Tandas cortas», el gemelo propone una pausa al terminar cada tanda;
  - con «Un paso cada vez», «volver al dibujo» se propone en la misma pantalla, sin cambiar de
    nivel.
- **Ayuda.** Propuesta: los ajustes no cuentan como ayuda en el gemelo. Se guardan aparte, como
  contexto de cada respuesta, para no rebajar el resultado de un alumno por tener un ajuste (D27).
- **¿Funciona el ajuste?** El gemelo ya compara intentos con y sin ayuda. Con P14, Orientación y PT
  verían cómo le va al alumno con cada ajuste, sin afirmar causas: «Desde que tiene "un paso cada
  vez", 4 de 5 respuestas correctas; antes, 1 de 3».

## 6. Qué ve cada uno

| Quién | Qué ve | Qué puede hacer |
| --- | --- | --- |
| Alumno | Sus ajustes, con nombres sencillos. | Activar o desactivar los de acceso (D26). Pedir un cambio a su profesor. |
| Tutor y profesor de la materia con apoyo | Ajustes, diagnóstico e informe (A43). Los avisos del gemelo. | Ver y proponer cambios a Orientación. No edita la ficha. |
| Resto del profesorado | Qué alumnos tienen ajustes y cuáles, sin el motivo. | Ver. |
| Orientación y PT | Diagnóstico, informe, ficha completa y cómo funciona cada ajuste. | Registrar el diagnóstico y el informe, crear, cambiar y revisar la ficha. |
| Dirección y familias | Pendiente de decidir con el centro (D8, D25). | — |

## 7. Cómo descarga al profesor

- El mismo ejercicio se adapta solo a cada alumno, sin preparar versiones distintas.
- En el panel de clase ve de un vistazo quién tiene ajustes y quién necesita atención.
- Solo recibe avisos cuando hace falta, no un informe por alumno cada día.

## 8. Decisiones (resueltas el 2026-11-13: A38-A41)

- **D24 · Qué se guarda.**
  - (a) Solo la ficha de ajustes, sin diagnóstico ni informe.
  - (b) También el informe o el diagnóstico.

  Recomendación: (a).
- **D25 · Quién define y quién ve.** Propuesta de la sección 6: Orientación y PT definen, el
  profesor ve los ajustes sin el motivo, y el alumno ve los suyos. Familias y dirección, con el
  centro.
- **D26 · Ajustes para todos.** Que cualquier alumno pueda activar los ajustes **de acceso** sin
  ficha, siguiendo el Diseño Universal para el Aprendizaje. Los de andamiaje los activa Orientación,
  PT o el gemelo cuando lo proponga una regla. Recomendación: sí.
- **D27 · Ajustes y nivel de ayuda.** Si los ajustes cuentan como ayuda en el gemelo.
  Recomendación: no; se guardan aparte como contexto. Exigiría un cambio en el contrato del Learning
  Twin y en Supabase, con su migración aprobada.

## 9. Requisito antes de cualquier dato real

Aunque solo sean ajustes, son datos de menores vinculados a necesidades educativas, que pueden
revelar información de salud. Antes de usar datos reales hacen falta:
- la autorización del centro y de su delegado de protección de datos;
- informar a las familias como indique el centro.

Esto no lo decide la aplicación ni Claude. Hasta entonces, todo se prueba con alumnado ficticio
(regla del proyecto).

## 10. Si se aprueba: piezas

- **Supabase** (migración aparte y aprobada, A6):
  - roles de Orientación y PT;
  - tabla de fichas de ajustes con revisión obligatoria;
  - permisos para que el profesor vea los ajustes pero no edite la ficha.
- **Aplicación:**
  - catálogo de ajustes;
  - presentación de cajas y fichas con cada ajuste;
  - vista de Orientación y PT;
  - ajustes visibles en el panel del profesor y del alumno.
- **Pruebas:**
  - el mismo ejercicio con y sin cada ajuste;
  - el profesor no ve el motivo;
  - no existe ningún campo para diagnósticos;
  - una ficha vencida pide revisión.
