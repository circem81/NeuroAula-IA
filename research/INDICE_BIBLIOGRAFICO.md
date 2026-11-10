# Índice bibliográfico y de recursos de investigación — NeuroAula-IA

**Última actualización:** 10 de noviembre de 2026.  
**Alcance:** índice de las referencias **identificables y documentadas** en el repositorio y de recursos adicionales comentados durante el diseño. **No representa una revisión bibliográfica sistemática ni una lista exhaustiva de todas las lecturas conversadas.**

## Matrices bibliográficas de referencia (ya existentes)

Se han identificado en la **Biblioteca personal → Proyecto neurociencia**, creadas el **9 de noviembre de 2026**, dos hojas Excel que preceden a este índice:

1. `Matriz_bibliografica_NeuroAula_AI_30_estudios.xlsx` — **30 fuentes iniciales**, 3 pestañas: `Matriz 30 estudios`, `Resumen y prioridades`, `Guia de uso`. Incluye autores, títulos, DOI/URL, contextos, tipo de evidencia, cautelas de extrapolación, aplicación al proyecto, prioridad, lectura pendiente y preguntas de investigación.
2. `NeuroAula_AI_matriz_ampliada_cognicion_y_fuentes.xlsx` — amplía la anterior con **5 pestañas**, añadiendo `IA y descarga cognitiva` y `Flujo de fuentes`. Introduce hipótesis contrastables sobre autonomía, retención/transferencia sin IA, metacognición, trazabilidad y flujo Zotero/Planned Paper/DSpace-MCP/RAG.

**La matriz ampliada es la referencia de trabajo más completa; este índice Markdown funciona como entrada y complemento, no como reemplazo.** Los dos archivos Excel están en la Biblioteca personal del proyecto y **no se han copiado ni publicado en GitHub**. Su existencia aquí se documenta para evitar volver a crear matrices duplicadas. Si se desea publicarlas o sincronizarlas, comprobar primero su contenido, permisos y versión vigente.

**Estado de validación científica:** las 30 fichas constituyen una selección inicial. Las aportaciones se obtuvieron mayoritariamente de metadatos y resúmenes; **no se ha completado la lectura crítica de los artículos íntegros** ni una revisión sistemática.

## Cómo usar este índice

- **Fuentes académicas:** sirven para formular preguntas, identificar marcos teóricos y construir una revisión crítica; su presencia no prueba la eficacia de NeuroAula-IA.
- **Recursos técnicos:** repositorios y guías para comparar arquitecturas; no constituyen por sí mismos validación científica.
- **Recursos pedagógicos:** inspiraciones o materiales de divulgación, separados de las evidencias empíricas.
- **Pendiente de verificar:** información bibliográfica incompleta; no citar como publicación contrastada hasta localizar autor, año, edición, URL/DOI y alcance.

## A. Libros y obras académicas identificadas

| Referencia | Área de estudio | Estado y localización |
| --- | --- | --- |
| **Gautam, D. (2026).** *Reinforcement Learning: Mathematics and algorithms from MDPs to RLHF, InstructGPT, and DeepSeek-R1, with Python*. Zenodo. DOI declarado: [10.5281/zenodo.23996511](https://doi.org/10.5281/zenodo.23996511). | Aprendizaje por refuerzo, decisiones secuenciales, Q-Learning, RLHF | [Repositorio original](https://github.com/dipeshgautam2012/rl-book-project) · [Ficha técnica y límites](REINFORCEMENT_LEARNING_ADAPTATIVO.md). Texto de síntesis matemática, **no evaluación de intervenciones educativas**. |
| **Pfeiffer, S. I. (2017).** *Identificación y evaluación del alumnado con altas capacidades: Una guía práctica* (J. Tourón y R. Ranz, eds. y trads.). UNIR Editorial. Obra original: *Essentials of Gifted Assessment* (2015), Wiley. | Identificación, evaluación psicoeducativa, desarrollo del talento y heterogeneidad | [Ficha y precauciones](../docs/REFERENCIAS_PEDAGOGICAS.md#7-altas-capacidades-y-desarrollo-del-talento-pfeiffer-2017). **Libro con derechos de autor**: no subir PDF ni usarlo en RAG compartido sin revisar permisos. |

### Investigación adicional pendiente de completar

- **Arquitecturas RAG:** documento de trabajo compartido en conversación, *9 RAG Architectures Every AI Developer Must Know: A Complete Guide*. Autoría, fecha, procedencia y referencias primarias **pendientes de verificar**. No se presenta como artículo científico revisado por pares.
- **Investigación doctoral sobre recomendaciones pedagógicas basadas en evidencia:** faltan fichas de estudios empíricos y revisiones sistemáticas con autores, DOI, metodología, población, hallazgos y limitaciones. La propuesta de tesis debe distinguir la fiabilidad de recomendaciones, su trazabilidad y su eventual impacto sobre aprendizaje.
- **Bibliografía derivada de Pfeiffer:** consultar y documentar, tras verificar publicaciones concretas, modelos de Gagné, Renzulli, Subotnik, Tourón y trabajos sobre doble excepcionalidad. **Son líneas de búsqueda**, no citas completas aún.

## B. Arquitecturas y repositorios técnicos

| Recurso | Para qué sirve / no sirve | Documentación |
| --- | --- | --- |
| **RLM Agent — nicolasramos/rlm-agent** | Referencia experimental para contexto externo, recuperación selectiva y agentes; no equivale a RL ni acredita uso en producción. | [Repositorio](https://github.com/nicolasramos/rlm-agent) · [Arquitectura propuesta](../docs/RLM_ARCHITECTURE.md) |
| **Everything Claude Code (ECC) — Affaan Mustafa** | Referencia de organización de agentes, memoria y flujos de trabajo; **requiere validar la fuente exacta y adecuación** antes de adoptar componentes. | Recurso comentado; **integración y adopción no verificadas**. |
| **MetaLens / Planned Paper** | Herramientas comentadas para revisión y metaanálisis, no evidencia científica por sí mismas. | Identificadas como herramientas de apoyo; faltan ficha técnica verificada y enlace de versión concreta. |
| **LangGraph** | Alternativa arquitectónica propuesta para orquestar agentes futuros; no se ha adoptado como dependencia. | Pendiente evaluación comparativa y decisión técnica. |

## C. Fuentes institucionales y recursos pedagógicos

| Recurso | Uso conceptual | Fuente |
| --- | --- | --- |
| **CSIC — Banco de Recursos, Educación y ciencia** | Actividades de indagación, experimentación y divulgación | [Banco del CSIC](https://recursosdivulgacion.csic.es/educacion-y-ciencia) · [Ficha de diseño](../docs/REFERENCIAS_PEDAGOGICAS.md) |
| **CSIC — Ciencia ciudadana; Las propiedades del agua; 15 consejos para llevar la ciencia a las aulas** | Hipótesis, observación, datos, argumentación y revisión | Enlaces institucionales recogidos en [Referencias pedagógicas](../docs/REFERENCIAS_PEDAGOGICAS.md) |
| **DragonBox** | Inspiración conceptual para manipulación y progresión de actividades matemáticas; **sin reutilización autorizada de activos** | [Referencias pedagógicas](../docs/REFERENCIAS_PEDAGOGICAS.md) |
| **Kahoot** | Inspiración para comprobaciones formativas breves; la evaluación no debe reducirse a puntuación | [Referencias pedagógicas](../docs/REFERENCIAS_PEDAGOGICAS.md) |
| **SpaceSphere** | Inspiración para exploración interactiva; referencia concreta y licencia por verificar | [Referencias pedagógicas](../docs/REFERENCIAS_PEDAGOGICAS.md) |
| **Libro interactivo** | Recurso propio propuesto, no publicación bibliográfica | [Referencias pedagógicas](../docs/REFERENCIAS_PEDAGOGICAS.md) |

## D. Fuentes de datos para investigación, no bibliografía de eficacia

Identificadas como referencias en el área `research/`: **Healthy Brain Network**, **Human Connectome Project** y **OpenNeuro**. Antes de usar datos: verificar condiciones de acceso/licencia, población y propósito de recogida, consentimiento, sesgos, pertinencia para contextos escolares y límites de inferencia. Un conjunto de datos neurocientíficos no demuestra por sí mismo que una adaptación educativa sea eficaz.

## E. Prioridades para la tesis y el producto

1. **Núcleo de investigación:** revisiones sistemáticas y estudios originales sobre recomendaciones pedagógicas fundamentadas en evidencia, fiabilidad/explicabilidad, validación experta y supervisión humana.
2. **Evaluación formativa y atención a la diversidad:** evidencia sobre adaptaciones, andamiaje, feedback, diseño accesible y medición de aprendizaje, evitando diagnósticos automáticos.
3. **RAG y gestión de conocimiento:** estudios sobre recuperación de evidencias, grounding, calidad de fuentes, evaluación de errores y auditoría de recomendaciones.
4. **Adaptación algorítmica:** comenzar por reglas explícitas y comparadores basados en evidencia; explorar RL **solo en una línea experimental posterior y con simulaciones**.
5. **Interfaz pedagógica:** analizar el libro interactivo, actividades manipulativas y la forma de recoger evidencias del razonamiento; no confundir inspiración de producto con validación de resultados.

## F. Ficha estándar para futuras lecturas

Para cada **publicación científica** nueva, registrar:
- Referencia APA 7 completa, URL/DOI, tipo de publicación y fecha de consulta si procede.
- Pregunta, diseño metodológico, muestra, edades, contexto educativo y variables.
- Hallazgos y tamaños de efecto (si los hay), limitaciones, sesgos y aplicabilidad.
- Relación concreta con el agente alumno, evaluación, profesor, Learning Twin, RAG o actividades.
- Estado: **identificada / leída / evaluada críticamente / usada en hipótesis / validada para revisión**.
- Restricciones de copyright y posibilidad de indexación RAG.

**Control de calidad:** ningún enlace o mención se debe considerar aval académico, resultado experimental verificado o implementación funcional. Las referencias incompletas deben completarse con fuentes originales antes de utilizarlas en un documento académico.
