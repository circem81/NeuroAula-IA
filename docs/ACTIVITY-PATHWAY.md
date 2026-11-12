# Recorrido de fichas y especialistas

Implementación del 2 de octubre de 2026, en `/demo/actividades`.

- Tres fichas propias versionadas: fracciones, proporcionalidad y ecuaciones. Cada ficha tiene pregunta inicial, objetivo, prerrequisitos por comprobar, actividad y comprobación distinta.
- Una evaluación inicial completa ordena primero los objetivos con respuesta incorrecta. El docente conserva la elección. Una pregunta no acredita dominio ni permite diagnosticar.
- Las ocho especialidades pueden producir apoyo programado o solicitar un borrador real mediante el proveedor existente. La IA no elige identificadores arbitrarios ni recibe identidad del usuario u organización. El servidor verifica sesión docente, organización, catálogo, formato y fuentes y comparte el límite de llamadas existente.
- La propuesta debe aprobarse antes de registrar la comprobación. Rechazar permite otra propuesta. Tras la respuesta, el docente confirma la observación o la marca para revisión. El registro conserva ambos tipos de decisiones; no sobreescribe respuestas previas.
- Guardado local por cuenta y organización, restaurado por repetición validada de eventos, y exportación JSON. Fallos de almacenamiento visibles. Límite de 100 eventos. Solo datos sintéticos: no es almacenamiento central, historial inmutable ni expediente multiusuario.
- El índice Genially G01 se abre como referencia externa con atribución a pepvidalg, sin enviar resultados en la URL. No se extraen respuestas ni se da por completada una actividad al abrirlo. Las fichas propias no se atribuyen a Newton. Pendiente verificar y registrar cada URL individual externa con objetivos y permisos.

## Fuentes y límites

Catálogo: material propio `neuroaula:<actividad>:v1`; evaluación calculada por reglas. G01: https://view.genially.com/5f7e09dd1b2b330d2efa2489 (índice público, consultado 2026-10-02). No se han usado textos completos de libros de LLM o Python.

Los prompts no son una garantía semántica. Sigue siendo necesaria la revisión docente de exactitud, adecuación y ausencia de inferencias clínicas. La nueva evidencia no actualiza automáticamente el Learning Twin existente: la persistencia central y el mecanismo de correcciones deben cerrarse antes de esa conexión y del uso con alumnos reales.

## Verificación

Pruebas de selección, ocho roles, estados y aprobación, restauración por cuenta/organización, fuentes falsas, orden inválido, permisos y proveedor simulado. La suite no certifica credenciales ni despliegue ni calidad de respuestas reales.
