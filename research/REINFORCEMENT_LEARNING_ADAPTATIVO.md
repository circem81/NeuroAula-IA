# Aprendizaje por refuerzo (RL) como referencia para NeuroAula-IA

**Estado:** referencia técnica y posible línea futura de investigación; **no implementado**.  
**Incorporación:** 10 de noviembre de 2026.

## Fuente

Gautam, D. (2026). *Reinforcement Learning: Mathematics and algorithms from MDPs to RLHF, InstructGPT, and DeepSeek-R1, with Python*. Repositorio público con libro, derivaciones matemáticas y ejemplos en Python/PyTorch.

- Repositorio: https://github.com/dipeshgautam2012/rl-book-project
- Texto en Markdown: https://github.com/dipeshgautam2012/rl-book-project/blob/main/md/main.md
- PDF del libro: https://github.com/dipeshgautam2012/rl-book-project/blob/main/tex/main.pdf
- DOI declarado por el autor: https://doi.org/10.5281/zenodo.23996511
- Licencia declarada en el README de origen: CC BY 4.0. Verificar la licencia y la procedencia de cualquier material antes de reutilizar código o contenido.

El libro sistematiza métodos de RL ya conocidos, **no presenta un algoritmo nuevo** y **no demuestra eficacia educativa**. No se incorpora su código ni se añade dependencia al producto.

## Por qué interesa al proyecto

El aprendizaje por refuerzo puede servir para **investigar** políticas de selección de la siguiente actividad, pista o nivel de andamiaje a partir de interacciones educativas observables. Es distinto de los patrones previstos:

| Concepto | Función conceptual en NeuroAula-IA |
| --- | --- |
| **RAG** | Recuperar evidencias científicas, materiales, normativa y criterios curriculares que fundamenten recomendaciones |
| **RLM / contexto longitudinal** | Consultar selectivamente el historial de evidencias y el estado de aprendizaje, con permisos |
| **RL** | Explorar experimentalmente una política de decisiones secuenciales sobre actividades y apoyos |
| **RLHF** | Estudiar el papel de valoraciones humanas en la optimización; **no equivale** a aprobación docente ni justifica entrenar modelos con datos de estudiantes |

Ninguno de estos mecanismos de IA/RL está implementado en la demo actual. La retroalimentación local de la actividad de agua se basa en reglas y no constituye aprendizaje por refuerzo.

## Ejemplo de uso futuro: itinerario de proporcionalidad

**Escenario:** un alumno resuelve ejercicios interactivos de proporcionalidad, en formatos de manipulación visual inspirados conceptualmente en la progresión gradual de DragonBox, y en un libro interactivo de matemáticas.

- **Estado observable hipotético:** tareas resueltas, naturaleza de los errores, estrategias mostradas, intentos, pistas utilizadas y evidencias curriculares. No se infieren rasgos clínicos, inteligencia ni diagnósticos.
- **Acciones posibles:** proponer una tarea equivalente, ofrecer una pista visual, variar la representación, introducir práctica guiada o proponer un desafío mayor.
- **Transición:** nueva evidencia tras completar la actividad, disponible solo bajo permisos y reglas de minimización.
- **Señal de resultado a estudiar:** aprendizaje verificable mediante tareas independientes, razonamiento explicado y progreso en objetivos específicos, no solo rapidez, clics o aciertos inmediatos.
- **Restricciones:** pertinencia curricular, accesibilidad, límites de dificultad, transparencia y posibilidad de corrección o anulación por el profesorado.

Ejemplo orientativo de flujo (todavía no implementado):

```text
Actividad interactiva → Evidencias observables → Propuesta de siguiente apoyo
                                              → Justificación y límites
                                              → Revisión docente
                                              → Nueva actividad y evaluación
```

**Riesgo principal:** una función de recompensa mal diseñada puede favorecer respuestas rápidas, tareas fáciles o conductas que maximizan puntos sin generar aprendizaje. No reducir «éxito educativo» a una recompensa automática ni experimentar con estudiantes sin evaluación y salvaguardas.

## Capítulos prioritarios de la fuente

| Capítulo | Qué estudiar |
| --- | --- |
| 1. The RL Problem | Formalización de estados, acciones, transiciones y recompensas |
| 2. Value Functions and the Bellman Equations | Cómo evaluar consecuencias futuras de decisiones |
| 5. Temporal-Difference Learning | Actualizaciones tras interacciones sucesivas |
| 6. TD Control | SARSA, Q-Learning y exploración; interés para prototipos simulados |
| 11. Reinforcement Learning from Human Feedback | Preferencias y recompensas humanas; límites respecto al juicio docente |
| 14. Exercises and Code Solutions | Prácticas reproducibles en entornos de ejemplo |

## Secuencia de trabajo propuesta

1. **Prioridad actual de la tesis:** definir y validar recomendaciones pedagógicas basadas en evidencia, trazables y supervisadas por profesionales, sin introducir RL como requisito.
2. **Diseño base:** especificar evidencias observables, rúbricas, objetivos curriculares y un selector transparente basado en reglas; valorar su utilidad con profesorado.
3. **Investigación separada:** formular un problema de decisión secuencial en un entorno **simulado**, con tareas de proporcionalidad y datos sintéticos.
4. **Comparación de métodos:** contrastar reglas, selección contextual y, solo si resulta justificable, un algoritmo tabular de RL en el simulador.
5. **Validación:** medir resultados de aprendizaje en pruebas independientes, seguridad pedagógica, equidad, accesibilidad, carga docente, incertidumbre y posibilidad de auditar/corregir decisiones. No afirmar mejoras sin evidencia empírica.
6. **Decisión de integración:** requerir revisión pedagógica, técnica, ética, legal y de protección de datos antes de experimentar con información real de menores.

## Límites

- Referencia de investigación **sin integración, entrenamiento, agente RL, RLHF operativo ni conexión automática al repositorio externo**.
- No crear perfiles clínicos ni deducir capacidades cognitivas a partir de patrones de interacción.
- Los datos reales del alumnado requieren base jurídica adecuada, minimización, autorización por roles y aislamiento entre centros con RLS, entre otras garantías.
- Las decisiones relevantes para el aprendizaje siguen bajo responsabilidad y supervisión humana.
- La inspiración en interfaces lúdicas no autoriza copiar componentes o recursos protegidos de terceros.

## Relación con documentación existente

- [Referencias pedagógicas](../docs/REFERENCIAS_PEDAGOGICAS.md): DragonBox, libro interactivo y principios de aprendizaje activo.
- [Arquitectura RLM](../docs/RLM_ARCHITECTURE.md): contexto longitudinal y recuperación selectiva; **RLM no significa RL**.
- [Índice de investigación](README.md): líneas de I+D y limitaciones clínicas.
