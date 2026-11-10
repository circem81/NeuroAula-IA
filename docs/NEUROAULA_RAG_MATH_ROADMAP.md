# NeuroAula-IA: RAG abierto y matemáticas manipulativas

**Estado:** plan técnico + demostración local. No hay RAG real, indexación documental, tutor de IA ni procesamiento de datos personales en el laboratorio de actividades.

## Base conceptual (documento remitido por el profesor Boticario)

El documento «9 RAG Architectures Every AI Developer Must Know: A Complete Guide with Examples» describe nueve opciones: Naive, Advanced, Modular, Graph, Agentic, Self, Corrective, Speculative e HippoRAG. Su propuesta útil para NeuroAula combina dos capas: *conocimientos y competencias* (qué se aprende) y *orientación pedagógica explícita del docente* (cómo intervenir). La conversación compartida es un insumo conceptual, no una demostración científica de eficacia ni una licencia de redistribución.

**Prioridad para el doctorado:** investigar una pregunta acotada: si las recomendaciones pedagógicas formuladas desde necesidades observables y un corpus de evidencia curada son pertinentes, verificables, conscientes de sus limitaciones y útiles a juicio de profesionales. No confundirlo con mostrar que un alumno aprende más, estimar diagnósticos o realizar predicciones clínicas.

## Orden sugerido

1. **Modular RAG**: adaptar recuperadores, generadores y verificadores intercambiables; conservar trazabilidad independientemente del proveedor de modelos.
2. **Advanced RAG**: filtros curriculares (país, ciclo, materia, idioma), búsqueda híbrida y reranking de documentos autorizados. Priorizar exactitud de recuperación sobre cantidad.
3. **Corrective RAG**: comprobar relevancia y confiabilidad; si no hay fuentes suficientes, abstenerse. No enviar automáticamente datos sensibles a búsquedas externas.
4. **Graph RAG**: dependencias curriculares y habilidades verificables, separadas del perfil de cada estudiante. Probar primero con un grafo pequeño y creado por el equipo.
5. **Agentic RAG / Self-RAG**: incorporación experimental tras evaluar recuperación, seguridad y costes. Una salida autorevisada no sustituye la comprobación independiente de fuentes.
6. **HippoRAG**: línea posterior, al poder aumentar la complejidad sin mejorar necesariamente la precisión en el problema central.
7. **Naive / Speculative RAG**: establecer una línea de base reproducible y explorar alternativas si una hipótesis concreta justifica su evaluación.

### Bibliotecas públicas para estudiar (no instaladas en NeuroAula)

- [Haystack](https://github.com/deepset-ai/haystack): Apache-2.0; pipelines modulares explícitos de recuperación, reranking, evaluación y agentes; Python.
- [LlamaIndex](https://github.com/run-llama/llama_index): MIT; ingestión de documentos y conectores, RAG y evaluación.
- [HippoRAG](https://github.com/OSU-NLP-Group/HippoRAG): MIT; recuperar información mediante asociaciones, candidato de investigación avanzada.
- [Microsoft GraphRAG](https://github.com/microsoft/graphrag): público, orientado a investigación y actualmente en mantenimiento; el proceso de indexación puede implicar costes significativos.

**Código público no significa ejecución sin coste**: indexar, almacenar, alojar y ejecutar modelos puede requerir infraestructura y licencias adicionales. Verificar las licencias en la versión concreta antes de copiar dependencias. Evitar subir a GitHub los PDF recibidos sin comprobar permiso.

## Demostración visual incorporada

Ruta protegida `/demo/actividades`. El módulo `NeuroaulaLearningLab` incluye:

- Libro original de tres páginas sobre el principio de igualdad, con una balanza SVG y preguntas autocorregibles.
- Tres ejercicios de álgebra de dificultad gradual: `x+3=7`, `2x=10`, `x/2+3=7`, con elecciones y retroalimentación.
- Una búsqueda determinista simulada entre una regla matemática y una preferencia pedagógica del docente. **No es RAG**: no recupera estudios externos ni genera recomendaciones con LLM.
- Sin llamadas a servicios de IA, sin API de pago, sin persistir intentos ni evaluaciones.

Inspiración pedagógica general: experiencias de aprendizaje basado en juegos de transformación algebraica. **No reproduce ni redistribuye el juego DragonBox**, sus personajes, ilustraciones, branding, niveles o código. El prototipo tiene mecánicas y expresión gráfica propias.

## Próximos criterios de evaluación (no implementados)

- Corpus curado de artículos científicos con metadatos de fuente, licencia, fecha, país y alcance de los resultados.
- Casos educativos sintéticos, separados por centro y accesibles solo según rol.
- Protocolo reproducible para recuperar documentos y asociar cada recomendación a evidencia localizada.
- Rúbrica docente: pertinencia, trazabilidad de las citas, fidelidad, viabilidad, accesibilidad, abstención apropiada y acuerdo entre revisores.
- Comparativa con línea base de búsqueda simple antes de elegir arquitecturas más complejas.
- Supervisión humana, aislamiento de centros y evaluación de protección de datos antes de usar información real.

Esta demo es un recurso de trabajo y discusión, no evidencia científica de eficacia.
