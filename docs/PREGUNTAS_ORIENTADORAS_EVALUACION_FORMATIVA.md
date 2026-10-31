# Preguntas orientadoras y evaluación formativa — NeuroAula-IA

**Estado:** especificación pedagógica y demostración local, no motor de IA operativo ni evaluación acreditada.

## Propósito

NeuroAula debe ayudar a que el estudiante **piense, explique, revise y transfiera**, no sustituir su razonamiento por una respuesta correcta. Una pregunta orientadora busca evidencia sobre la comprensión y abre un siguiente paso; no es una pista que revela automáticamente la regla.

El método sigue el ciclo **observar → interpretar provisionalmente → preguntar/apoyar → comprobar → decidir con el docente**. Se alinea con la evaluación formativa de Black y Wiliam, el feedback orientado al siguiente paso y la autorregulación. No afirmar que una pregunta, por sí sola, demuestra aprendizaje.

## Protocolo de diálogo pedagógico

1. **Establecer objetivo y criterio:** explicar qué se va a aprender y cómo se reconocerá la comprensión.
2. **Primer intento:** permitir una respuesta propia sin mostrar la solución.
3. **Pregunta diagnóstica breve:** «¿Cómo has pensado este paso?», «¿Qué dato te hizo decidir eso?».
4. **Andamiaje ajustable:** si no avanza, reformular, pedir una representación concreta, ofrecer ejemplo no idéntico, o explicitar una regla cuando proceda. Evitar el interrogatorio interminable.
5. **Justificación y metacognición:** «¿Cómo lo comprobarías?», «¿Qué cambiarías si empezaras de nuevo?».
6. **Transferencia:** problema equivalente pero nuevo para comprobar uso del razonamiento.
7. **Devolución al docente:** mostrar intentos, preguntas, respuestas, apoyos y **nivel de verificación**; permitir corregir la interpretación y elegir la siguiente intervención.

**Nunca etiquetar como «no sabe» por un único error, un silencio o una respuesta poco elaborada.** Distinguir barrera lingüística, expresión verbal, lectura o atención de dominio conceptual. El docente puede sustituir entrevista oral por señalamiento, representación visual, material manipulativo o expresión escrita.

## Ejemplo original — operaciones con enteros

**Actividad:** `−8 + (−5) − (−3)`.

| Momento | Pregunta orientadora | Para qué sirve |
| --- | --- | --- |
| Comprender | «¿Qué representa cada signo? ¿Qué significa quitar un número negativo?» | Explorar el significado |
| Representar | «¿Cómo dibujarías los movimientos en una recta numérica?» | Visibilizar estrategia |
| Justificar | «¿Por qué cambias o mantienes la operación? ¿Cómo lo comprobarías?» | Descartar repetición mecánica |
| Transferir | «Sin copiar el ejemplo, resuelve y explica `−6 − (−4)`.» | Buscar evidencia de transferencia |

Si el alumno dice «no lo sé», responder con otra representación o apoyo, **no** con una valoración negativa automática. No revelar la solución hasta que el itinerario de ayuda y la intervención docente lo justifiquen.

## Dos contextos de evidencias, que no deben confundirse

- **Práctica asistida/no verificada:** el estudiante puede utilizar cualquier recurso, incluida otra IA. Se observan procesos y se proponen apoyos; no se acredita autonomía ni autoría.
- **Comprobación supervisada:** una persona responsable organiza las condiciones de trabajo, garantiza ajustes razonables y recoge evidencia de resolución independiente. Solo aquí puede haber afirmaciones justificadas sobre autonomía dentro de ese contexto.

**Ninguna pregunta digital, por difícil o imprevista que sea, demuestra por sí sola que el estudiante no consultó una IA externa.** No usar detectores de IA como prueba de aprendizaje o conducta.

## Contrato futuro: datos mínimos y procedencia

Una sesión, siempre bajo la autorización del centro, puede registrar:

```ts
type FormativeTurn = {
  activityRef: string;
  questionId: string;
  purpose: "comprehension" | "representation" | "justification" | "transfer";
  answerRef?: string;
  support: "none" | "rephrase" | "visual" | "example" | "direct_explanation";
  evidenceContext: "unverified_practice" | "teacher_supervised";
  teacherValidation: "pending" | "validated" | "rejected";
  uncertaintyReason?: string;
};
```

En la **demo actual** los borradores son locales y no persisten; no se aplica clasificación automática ni se recogen datos personales. El futuro agente de evaluación puede **proponer** la próxima pregunta y una hipótesis explicable, pero el docente controla criterios, intervenciones de impacto y calificaciones. Learning Twin: separar siempre **desempeño asistido** de **dominio demostrado y validado**.

## Reglas de diseño y aceptación

- Preguntar una cosa cada vez, con lenguaje claro, corto y sin infantilizar.
- Incluir «No lo sé» y «Necesito otra forma» como respuestas legítimas.
- Permitir detenerse, cambiar de modalidad y acudir al profesor sin penalizar.
- Registrar si la ayuda consistió en acceso (lectura en voz alta, tiempo extra, formato) o contenido (regla, ejemplo, solución); **no tratarlas como equivalentes**.
- Mostrar incertidumbre cuando no existan pruebas suficientes; no calificar, diagnosticar ni atribuir causas clínicas.
- Prueba con casos sintéticos: respuesta correcta sin explicación; resultado erróneo con razonamiento correcto; barrera idiomática; ausencia de respuesta; ayuda externa admitida; transferencia no lograda.
- Revisar sesgos, accesibilidad, privacidad, titularidad/licencias de materiales y la regulación aplicable antes de cualquier evaluación real.

## Referencias documentadas

- Black, P. & Wiliam, D. (1998). *Assessment and Classroom Learning*. https://doi.org/10.1080/0969595980050102
- Hattie, J. & Timperley, H. (2007). *The Power of Feedback*. https://doi.org/10.3102/003465430298487
- Education Endowment Foundation (2021). *Teacher Feedback to Improve Pupil Learning*. https://educationendowmentfoundation.org.uk/education-evidence/guidance-reports/feedback
- Documento del proyecto: [Evidencia pedagógica](EVIDENCIA_PEDAGOGICA.md).
- Documento del proyecto: [Arquitectura del workshop AI Engineer PRO](WORKSHOP_AI_ENGINEER_PRO_2026-10-27.md).

### Libro identificado por la usuaria

- Morales Lobo, M. y Fernández Fernández, J. G. (2022). *La evaluación formativa: Estrategias eficaces para regular el aprendizaje*. SM. Biblioteca Innovación Educativa, volumen 48. ISBN 9788411201445. Prólogo de Neus Sanmartí. [Ficha editorial](https://tienda.grupo-sm.com/producto/la-evaluacion-formativa/).
- Según la sinopsis oficial, la evaluación debe producir evidencias que orienten **acciones durante el aprendizaje**, no limitarse a certificar productos finales. La descripción no equivale a una lectura completa del libro; quedan pendientes las notas o extractos autorizados que la usuaria quiera integrar.
- Diseño de experiencias visuales originales: [juegos manipulativos y escenas interactivas](JUEGOS_MANIPULATIVOS_INTERACTIVOS.md). Evitar importar materiales protegidos al RAG sin permiso.

## Próximas fases

1. Probar la secuencia guiada de la demo con docentes y casos sintéticos; observar si las preguntas realmente generan razonamientos.
2. Diseñar una rúbrica revisable por el profesor con criterios explícitos de comprensión, justificación y transferencia.
3. Implementar contratos tipados, autorización y trazabilidad antes de un tutor IA real.
4. Incorporar bibliografía autorizada mediante recuperación con fuentes y versiones (RAG), sin prometer que la demo actual lo haga.
