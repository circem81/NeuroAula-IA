# Manipulativos, juegos visuales y escenas interactivas — NeuroAula-IA

**Estado (31-10-2026):** propuesta de diseño; NO describe una funcionalidad implementada ni autoriza reutilizar materiales de terceros.

## Referencias contrastadas

### Kahoot! Algebra 2 by DragonBox (DragonBox Algebra 12+)

La usuaria identificó con una captura la experiencia **Kahoot! Kids → Álgebra 2** como ejemplo del tipo de juego intuitivo que le interesa incorporar **como inspiración pedagógica, no como copia**. Referencias:
- [Kahoot!: juegos DragonBox (catálogo oficial)](https://kahoot.com/es/home/learning-apps/dragonbox/)
- [Kahoot! Álgebra 2 en Google Play](https://play.google.com/store/apps/details?id=com.kahoot.algebra12)
- [Common Sense Media: la mecánica de equilibrar ambos lados](https://www.commonsensemedia.org/app-reviews/kahoot-algebra-2-by-dragonbox)

Aspectos de diseño a estudiar: manipulación de objetos equivalentes en los dos lados de un tablero, cancelación de elementos opuestos, descubrimiento gradual de reglas y transición de dibujos a símbolos algebraicos. DragonBox ha recibido premios educativos; este reconocimiento **no equivale por sí solo a evidencia de eficacia para todos los estudiantes**.

### Morales Lobo y Fernández Fernández: evaluación formativa

Morales Lobo, M. y Fernández Fernández, J. G. (2022). *La evaluación formativa: estrategias eficaces para regular el aprendizaje*. SM, colección Biblioteca Innovación Educativa, n.º 48. ISBN 9788411201445. Prólogo de Neus Sanmartí. [Ficha oficial SM](https://tienda.grupo-sm.com/producto/la-evaluacion-formativa/).

La editorial explica que la evaluación debe **recoger evidencias y activar acciones inmediatas que mejoren el aprendizaje**, durante la actividad y con participación activa del alumnado. El libro fue identificado por su cubierta e ISBN; **no se ha leído íntegro**, y esta síntesis procede de la descripción editorial pública. No atribuir estrategias específicas a capítulos no consultados.

## Principio central de NeuroAula

**El criterio LOMLOE indica qué se pretende aprender; la actividad manipulativa permite explorar cómo se aprende; la evaluación formativa decide qué hacer con la evidencia observada.** No bastan criterios curriculares y preguntas de opción múltiple.

Ciclo de diseño:

1. **Explorar y manipular** un objeto, escena, diagrama, símbolo o simulación original.
2. **Hacer una predicción** antes de actuar: «¿Qué sucederá si...?» y permitir equivocarse sin penalización.
3. **Actuar y observar** una consecuencia visual y reversible (feedback informativo).
4. **Explicar una decisión** con preguntas orientadoras breves, no con la solución revelada.
5. **Cambiar un dato o contexto** y comprobar transferencia con otro desafío.
6. **Revisar evidencia y apoyo**: diferenciar aprendizaje asistido de comprobación autónoma supervisada. El docente decide los siguientes pasos.

Evitar las secuencias cerradas «vídeo → pausa → cuestionario», cuando pueden sustituirse por **vídeos/escenas ramificadas con acciones**. Una pausa con una pregunta tiene utilidad, pero no es la única forma de actividad.

## Primer prototipo propuesto: BALANZA ALGEBRAICA (original)

Ejemplo: `x + 3 = 7`.

- Tablero de dos platillos o dos recintos **equivalentes** con elementos visuales propios de NeuroAula, sin copiar activos de DragonBox.
- En izquierda: una caja desconocida + tres unidades; derecha: siete unidades.
- Acción principal: arrastrar o seleccionar retirar **una unidad de cada lado**; impedir transformaciones que rompan la igualdad o mostrar por qué fallan.
- Pregunta inicial: «¿Qué debe mantenerse igual mientras mueves las piezas?».
- Tras una acción: «¿Por qué has quitado lo mismo en ambos lados?». Si no responde, dar representación alternativa (balanza, fichas, recta, contexto real) antes de la regla formal.
- Revelación progresiva: tras comprender las acciones, mostrar que la caja representa `x` y que la escena representa `x + 3 = 7`.
- Transferencia: `x + 5 = 9` o `2x + 4 = 10` con nuevos objetos, no solo repetir una animación.
- Revisión docente: registrar la secuencia de acciones y apoyos, sin inferir de ello autoría ni dominio de forma concluyente.

**Preguntas incorrectas a evitar:** «¿Tienes que quitar 3 de ambos lados?», porque anticipan la respuesta y sesgan la exploración.

## Otros tipos de juego contemplados

| Área | Manipulación que construye significado | Pregunta orientadora / evidencia |
|---|---|---|
| Ecuaciones | Cajas, fichas y platillos equilibrados | «¿Qué transformación conserva la igualdad?» |
| Proporcionalidad | Recetas, bolsas de mezclas o grupos escalables | «¿Qué debe crecer en la misma proporción?» |
| Fracciones | Partes de una figura, recipientes, recta numérica | «¿Qué cambia al dividir una unidad de otra manera?» |
| Geometría | Componer y descomponer figuras, arrastrar vértices | «¿Qué propiedades permanecen cuando mueves esta pieza?» |
| Ciencias | Simulación sencilla de variables y consecuencias | «¿Qué variable has cambiado y qué observaste?» |
| Lengua | Ordenar causas, consecuencias y evidencias visuales | «¿Qué pieza del texto justifica tu elección?» |

## Vídeo/escena interactiva (más allá del quiz sobre vídeo)

Un recurso original puede plantear una situación y detenerse **cuando la acción del alumno afecta al siguiente estado**:
- elegir y arrastrar objetos al escenario;
- señalar una variable o crear una hipótesis visual;
- ajustar controles y observar un cambio;
- elegir explicación y recibir contraejemplo específico;
- probar de nuevo con otra variable;
- justificar oralmente, por escrito, por señalamiento o manipulando fichas.

Diseño inclusivo: alternativa por teclado, descripción textual equivalente, no depender solo del color, lectura accesible, posibilidad de pausar y de repetir, ausencia de cronómetro obligatorio, opciones de expresión no verbal y apoyos que no etiqueten por TDAH/TEA u otras condiciones.

## Contrato conceptual para futuros contenidos (no desplegado)

```ts
type InteractiveLearningScene = {
  id: string;
  curriculumReference: { territory: string; level: string; criteria: string[] };
  goal: string;
  manipulatives: Array<{ id: string; type: string; accessibleLabel: string }>;
  initialState: Record<string, unknown>;
  allowedActions: string[];
  invariantChecks: string[]; // reglas deterministas, p.ej. conservación de igualdad
  guidingQuestions: Array<{
    trigger: string;
    purpose: "predict" | "explain" | "justify" | "transfer";
    text: string;
  }>;
  alternativeRepresentations: string[];
  transferSceneId?: string;
  evidencePolicy: "practice_unverified" | "teacher_supervised";
};
```

Las reglas matemáticas **no deben depender del juicio libre de un LLM**; se validan con código determinista. El futuro agente IA podrá seleccionar preguntas, ofrecer representaciones alternativas y sugerir al docente una intervención revisable. El Learning Twin conserva origen, tipo de ayuda y contexto de verificación. No recopilar datos de menores en esta fase.

## Criterios de aceptación del MVP propuesto

- Los objetos se mueven y la representación cambia de forma inmediata, reversible y coherente matemáticamente.
- Las preguntas aparecen en el momento de la acción relevante, no como una batería de test.
- Una respuesta incorrecta conduce a un contraejemplo, una pregunta aclaratoria o cambio de representación.
- Siempre existe un camino accesible sin arrastrar, sin vídeo, sin sonido ni presión de tiempo.
- El docente puede inspeccionar el diseño, cambiar preguntas y elegir tarea de transferencia.
- No se otorgan calificaciones oficiales, no se aseguran aprendizajes por jugar y no se despliega seguimiento real de menores sin autorizaciones y validación apropiada.

## Licencias y límites

Las mecánicas educativas generales (balanza, equivalencia, fichas, andamiaje) pueden inspirar diseños propios. No reutilizar personajes, ilustraciones, música, pantallas, textos de niveles, marcas en la interfaz o código de DragonBox sin permiso. No incorporar el contenido protegido del libro de SM a un RAG sin autorización/licencia; usar fichas bibliográficas, enlaces y notas originales con atribución.

**Prioridad de implementación:** diseñar primero una escena vertical completa y accesible sobre `x + 3 = 7`, evaluar su utilidad con ejercicios sintéticos y revisión docente; después añadir escenas de proporcionalidad, fracciones y geometría.
