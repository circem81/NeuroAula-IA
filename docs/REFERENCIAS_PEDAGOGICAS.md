# Referencias pedagógicas para NeuroAula-IA

**Estado:** documento de diseño e investigación, no funcionalidad implementada.  
**Fecha de incorporación:** 6 de noviembre de 2026.

## Propósito

Documentar referencias externas que inspiren el diseño de experiencias de aprendizaje activo, adaptativo, inclusivo y evaluable en NeuroAula-IA. **Una referencia pedagógica no implica integración técnica, afiliación institucional ni validación científica del producto.**

En el estado actual del proyecto, la demo utiliza datos simulados: no ejecuta agentes de IA, no utiliza RAG y no conserva historiales educativos reales. Las ideas que siguen son hipótesis de diseño para un futuro prototipo, sujetas a evaluación y supervisión docente.

## 1. CSIC: investigación científica y aprendizaje por indagación

**Institución de referencia:** Consejo Superior de Investigaciones Científicas (CSIC).  
**Papel en NeuroAula-IA:** inspiración para aprender ciencia haciendo ciencia, promover la participación y organizar tareas de indagación con evidencias.

### Fuentes oficiales consultadas

- [Banco de Recursos CSIC — Educación y ciencia](https://recursosdivulgacion.csic.es/educacion-y-ciencia): educación científica activa, experimentación, inclusión y accesibilidad.
- [CSIC — 15 consejos imprescindibles para llevar la ciencia a las aulas](https://www.recursosdivulgacion.csic.es/actividad/15-consejos-imprescindibles-para-llevar-la-ciencia-las-aulas): participación bidireccional, adaptación al público, aprendizaje práctico, accesibilidad y evaluación de las actividades.
- [CSIC — Ciencia ciudadana](https://www.recursosdivulgacion.csic.es/index.php/ciencia-ciudadana): hipótesis, indicadores, recogida y validación de datos, comunicación de resultados y participación social.
- [CSIC — Las propiedades del agua](https://www.recursosdivulgacion.csic.es/actividad/las-propiedades-del-agua): ejemplo de experimentación y formulación de preguntas científicas para Primaria y Secundaria.

Estas fuentes fundamentan los **principios pedagógicos generales** enumerados; las capacidades adaptativas de NeuroAula-IA descritas a continuación son **propuestas propias**, no funciones ni recomendaciones atribuidas al CSIC.

### Principios de diseño derivados como inspiración

1. **Partir de una pregunta auténtica** conectada con el entorno cotidiano y los conocimientos previos.
2. **Formular hipótesis** antes de ofrecer una solución o explicación.
3. **Observar, experimentar y recoger datos**, distinguiendo hechos, interpretaciones e incertidumbres.
4. **Contrastar hipótesis con evidencias** y revisar conclusiones ante datos contradictorios.
5. **Comunicar y argumentar resultados**, promoviendo el intercambio entre estudiantes.
6. **Diseñar apoyos inclusivos y accesibles**, ajustables al grupo y al contexto.
7. **Evaluar el proceso y no solo la respuesta final**: calidad de preguntas, razonamiento, evidencias, revisión y reflexión.

### Secuencia didáctica propuesta para un futuro prototipo

| Fase | Acción del alumnado | Apoyo educativo propuesto | Evidencia observable |
| --- | --- | --- | --- |
| Pregunta | Investiga un problema contextualizado | Enunciado accesible y activación de conocimientos previos | Pregunta reformulada |
| Hipótesis | Expone una predicción y justificación | Andamiaje graduado, sin dar la solución | Hipótesis argumentada |
| Indagación | Explora fuentes, experimentos o datos | Pistas, vocabulario, visualizaciones y alternativas de representación | Datos y observaciones |
| Contraste | Compara sus predicciones con los resultados | Preguntas que distinguen correlación, causa e incertidumbre | Justificación y revisión |
| Conclusión | Explica lo aprendido y sus límites | Guía de comunicación científica | Conclusión fundamentada |
| Retroalimentación | Reflexiona sobre errores y próximos pasos | Propuesta de práctica o apoyo revisable por el docente | Autoevaluación y mejora |

**No limitar la interacción a «correcto/incorrecto».** Una respuesta puede ser científicamente incompleta y contener razonamientos útiles. La retroalimentación debe explicar qué evidencia falta, ofrecer nuevas oportunidades de revisión y evitar atribuir capacidades o diagnósticos al estudiante.

### Caso piloto ilustrativo: ¿está contaminada el agua?

**Etapa sugerida:** ESO; ajustar al currículo, los conocimientos previos y la accesibilidad del grupo.  
**Pregunta guía:** «¿Qué datos necesitaríamos para valorar si una muestra de agua presenta indicios de contaminación?».

1. Presentar un escenario **ficticio**, con datos simulados claramente identificados (pH, turbidez, nitratos u otras variables pertinentes).
2. Pedir hipótesis iniciales y explicación de qué indicadores serían útiles.
3. Facilitar un conjunto de datos de ejemplo y tareas de interpretación.
4. Ofrecer apoyos según dificultades **observables en la tarea**: vocabulario, lectura de tablas, representación gráfica, identificación de variables o argumentación.
5. Solicitar conclusiones que distingan resultados medidos, hipótesis e incertidumbres. No presentar el ejercicio como diagnóstico real de potabilidad.
6. Recoger evidencias de aprendizaje para una revisión docente y una segunda iteración mejorada.

**Resultados que sería razonable evaluar en un piloto:** mejora entre versiones de una explicación científica, uso de evidencias, capacidad de revisar hipótesis, autonomía en la resolución, accesibilidad percibida y carga de trabajo docente. No asumir eficacia sin una evaluación empírica.

## 2. Referencias complementarias por explorar

Estas referencias se mencionaron durante el diseño conceptual de NeuroAula-IA. **No se documenta aquí ninguna integración, acuerdo de uso ni evaluación comparativa de sus productos.**

| Referencia | Aspecto de diseño que interesa estudiar | Posible aportación futura |
| --- | --- | --- |
| SpaceSphere | Exploración y navegación interactiva | Escenarios científicos explorables |
| DragonBox | Progresión matemática guiada | Descomposición de dificultades y avance gradual |
| Kahoot | Participación y actividades de respuesta | Comprobaciones formativas breves, sin reducir la evaluación al acierto |
| Libro interactivo | Secuenciación de contenidos y actividades | Itinerarios didácticos accesibles e interconectados |

**Criterio de diseño:** la indagación, la exploración y el razonamiento deben complementar —no sustituir— la práctica gradual y la evaluación formativa.

### Investigación complementaria: aprendizaje por refuerzo (RL)

Se incorpora como **referencia técnica, todavía no implementada**, el libro abierto de Dipesh Gautam sobre aprendizaje por refuerzo, sus algoritmos clásicos y RLHF. Para futuras experiencias inspiradas en DragonBox y el libro interactivo, podría ayudar a investigar la selección secuencial de niveles, tareas o pistas, siempre a partir de evidencias educativas observables, con evaluación pedagógica independiente y supervisión docente.

La propuesta, sus límites y la distinción entre **RL, RAG y RLM** se documentan en [Aprendizaje por refuerzo para adaptación educativa](../research/REINFORCEMENT_LEARNING_ADAPTATIVO.md). El repositorio externo no se ha conectado a la aplicación y no se ha incorporado código.


## 3. Relación con la arquitectura prevista de NeuroAula-IA

- **Apoyo al alumnado (propuesto):** mostrar preguntas, pistas y representaciones alternativas sin resolver automáticamente la actividad.
- **Evaluación formativa (propuesta):** registrar evidencias de razonamiento y evolución, evitando diagnósticos y etiquetas personales automáticas.
- **Apoyo al profesorado (propuesto):** permitir revisar tareas, evidencias, adaptaciones y recomendaciones antes de aplicarlas.
- **Gemelo de aprendizaje / Learning Twin (conceptual):** representar el progreso en competencias observables, sin inferir trastornos o rasgos clínicos.
- **RAG y referencias externas (futuro):** solo si se implementa una estrategia de trazabilidad, control de derechos y verificación de fuentes; no existe hoy una conexión operativa con el CSIC.

## 4. Límites éticos, científicos y técnicos

- No se ha recibido autorización, convenio ni aval institucional del CSIC. Citar y enlazar sus recursos no implica colaboración oficial.
- No copiar ni redistribuir materiales, ilustraciones o actividades completas sin comprobar la licencia de cada recurso.
- Separar evidencia pedagógica publicada, hipótesis de diseño y resultados que puedan obtenerse mediante pruebas propias.
- Utilizar datos ficticios en las demos; no introducir datos personales de menores sin las garantías legales, éticas y técnicas pertinentes.
- La adaptación debe basarse en el desempeño educativo observable y permitir la intervención y corrección docente; no emitir diagnósticos de TDAH, TEA, dislexia u otras condiciones.
- Antes de guardar información educativa real, definir autorización, minimización, controles de acceso, aislamiento por centro mediante RLS y evaluación del impacto sobre privacidad.
- Evitar considerar una tarea «científica» solo por incorporar un cuestionario: debe existir una pregunta, una investigación y una conclusión sustentada.

## 5. Primer prototipo interactivo (noviembre de 2026)

La demo docente incluye una primera **situación de indagación interactiva** en `/demo/actividades` (archivo `src/components/water-inquiry.tsx`):

- Seis pasos: problema, hipótesis, lectura de datos, interpretación, conclusión y revisión.
- Dos muestras de agua con valores **enteramente inventados**, sin juicios reales de potabilidad.
- Pistas optativas, tabla accesible, preguntas cerradas y una recomendación sencilla basada en reglas locales.
- Hipótesis y conclusión escritas por quien realiza la actividad, pendientes de revisión por el docente.
- Lista de autoevaluación y resumen copiable para revisión docente.
- Estado solo en memoria de la página; **sin persistencia, cuentas de estudiantes, IA generativa, agentes, RAG ni datos personales**.
- Interfaz en español e inglés, incluida dentro del acceso ya establecido para el perfil docente.

**Alcance:** este prototipo comprueba la viabilidad de una interacción didáctica, no demuestra personalización inteligente ni mejora del aprendizaje. La inspiración en recursos del CSIC no implica integración ni colaboración institucional.

## 6. Siguientes pasos pendientes

1. Precisar los criterios de evaluación LOMLOE aplicables al curso, materia y comunidad autónoma elegidos.
2. Revisar con docentes una rúbrica explícita de formulación de hipótesis, datos, inferencias y limitaciones.
3. Realizar pruebas reales de usabilidad y accesibilidad de la actividad, incluidos dispositivos móviles y lectores de pantalla.
4. Recoger evaluación docente de utilidad, carga de trabajo y pertinencia de los apoyos, antes de afirmar cualquier eficacia educativa.
5. Solo después valorar integración técnica, seguimiento longitudinal y posibles fuentes documentales, respetando derechos y privacidad.

---

**Nota de alcance:** este documento preserva la referencia pedagógica del CSIC y su relación conceptual con otras inspiraciones de NeuroAula-IA. No modifica las funciones de la demo ni afirma que la eficacia de la futura adaptación haya sido validada.


## 7. Altas capacidades y desarrollo del talento: Pfeiffer (2017)

**Tipo de referencia:** monografía académica de evaluación psicoeducativa; fuente conceptual para el marco teórico, **no** ensayo experimental de eficacia de NeuroAula-IA.  
**Estado de integración:** referencia bibliográfica registrada; sin subida del PDF, sin indexación RAG y sin funcionalidades diagnósticas.

### Referencia bibliográfica

Pfeiffer, S. I. (2017). *Identificación y evaluación del alumnado con altas capacidades: Una guía práctica* (J. Tourón y R. Ranz, eds. y trads.). UNIR Editorial. (Obra original publicada en 2015 como *Essentials of Gifted Assessment*, Wiley).

- ISBN de la edición electrónica en español (ePub): **978-84-16602-88-9**.
- Fuente de trabajo: ejemplar facilitado para consulta privada en el proyecto. Su presencia en una conversación **no** autoriza su redistribución.
- Derechos: edición y traducción © UNIR 2017; original © John Wiley & Sons 2015. **No publicar el PDF ni incorporarlo a un índice RAG compartido sin revisar las licencias y obtener, cuando corresponda, autorización.** La referencia y las notas originales sí pueden documentarse.

### Contenidos prioritarios para estudiar

| Apartado del libro | Aportación conceptual | Posible utilización en NeuroAula-IA |
| --- | --- | --- |
| Capítulos 1-2: concepciones de altas capacidades y modelo tripartito | Distingue alta inteligencia, desempeño sobresaliente y potencial de excelencia; presenta modelos de desarrollo del talento. | Evitar una única etiqueta o un umbral automático; pensar en necesidades educativas y oportunidades de desarrollo. |
| Capítulo 3: características, contexto y doble excepcionalidad | Describe heterogeneidad de perfiles, factores socioemocionales, desventaja social y coexistencia con otras necesidades. | Explorar barreras y fortalezas mediante observaciones contextualizadas, sin inferir perfiles clínicos. |
| Capítulo 4: principios de identificación y evaluación | Destaca la importancia de múltiples medidas, instrumentos válidos y juicio profesional; relaciona evaluación con intervención. | Diseñar requisitos de trazabilidad, incertidumbre, revisión humana y propuestas educativas accionables. |
| Capítulos 5-7: capacidad intelectual, rendimiento, creatividad y medidas alternativas | Diferencia indicadores cognitivos, académicos, creativos y otras fuentes de información. | Evitar equiparar una respuesta, un test o una puntuación con el potencial completo del estudiante. |
| Capítulos 8-9: preguntas frecuentes, Talent Search y aceleración | Debate identificación, evaluación e intervenciones para el desarrollo del talento. | Estudiar enriquecimiento, nivel de reto y posibles adaptaciones curriculares siempre revisadas por profesionales. |

### Principios de diseño derivados como **hipótesis**, no resultados probados

1. La aplicación debe centrarse en **evidencias educativas observables y objetivos de aprendizaje**, no determinar si un alumno «es AACC» ni asignarle diagnósticos de TDAH, TEA u otras condiciones.
2. Un indicador aislado (calificación, velocidad, error, creatividad o interés) no basta para inferir capacidad cognitiva o necesidad educativa. Se requiere contexto, múltiples observaciones y valoración profesional.
3. Las propuestas de enriquecimiento, andamiaje o ajuste del nivel de reto deben incluir **justificación, grado de incertidumbre, referencia bibliográfica y aprobación docente/orientadora** cuando proceda.
4. Los perfiles de aprendizaje se conceptualizan como **dinámicos y revisables**, sin etiquetas deterministas.
5. Las orientaciones del libro deben contrastarse con investigación actual, normativa educativa aplicable y estudios empíricos de intervenciones antes de incorporarse al motor de recomendaciones.

### Relación con la posible tesis

Esta monografía aporta la **base conceptual del desarrollo del talento y la evaluación psicoeducativa**; no es una prueba de que un sistema RAG identifique altas capacidades ni de que sus recomendaciones mejoren el aprendizaje. Puede servir para definir límites y criterios de calidad en casos de uso de atención a la diversidad. Para la tesis deben localizarse y evaluarse además los estudios empíricos y las revisiones actuales citados por el libro.

**Pendiente:** ficha de lectura crítica detallada y actualización de la bibliografía relacionada (Pfeiffer, Gagné, Subotnik, Renzulli, Tourón, doble excepcionalidad y evaluación multiinformante).
