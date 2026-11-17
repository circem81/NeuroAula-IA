# Faraday 2026 — banco de experimentación para NeuroAula-IA

**Estado:** fuente institucional catalogada y visible como referencia en la demo; **sin RAG, carga del PDF ni ejecución de experimentos**.  
**Fecha de incorporación:** 17 de noviembre de 2026.  
**Tipo de evidencia:** recurso didáctico / propuestas de demostración experimental; **no** evaluación empírica de la eficacia de NeuroAula.  
**Editor del monográfico:** Luis Moreno Martínez.  
**Instituciones editoras:** GEDH, Real Sociedad Española de Física (RSEF) y Real Sociedad Española de Química (RSEQ).  
**Motivo:** número especial de *Faraday. Boletín de Física y Química* (segunda época) por el 40.º aniversario del GEDH.

## Fuentes originales y atribución

- [Página oficial del número especial e índice completo de 31 contribuciones](https://gedh.rseq.org/numero-especial/).
- [PDF del número especial en el sitio del editor](https://gedh.rseq.org/wp-content/uploads/2026/11/Numero-especial-Faraday-completo.pdf).
- [Resolución de premios docentes, 2026](https://gedh.rseq.org/resolucion-de-los-premios-a-la-labor-docente-en-el-fomento-de-la-experimentacion-en-fisica-y-quimica/).
- Metadatos estructurados en `src/lib/faraday-catalog.ts`: títulos, autores, número de contribución y clasificación; **respetar la autoría original de cada práctica**.

**Alcance de la verificación:** se ha contrastado el índice y la descripción editorial en la web oficial. El archivo completo de gran tamaño no se pudo inspeccionar íntegramente en esta incorporación; por ello, niveles y actividades a continuación son **adaptaciones sugeridas**, no fichas ni instrucciones atribuidas a sus autores.

## Principio pedagógico para NeuroAula

Convertir la demostración en una secuencia de **predicción → observación → representación de datos → explicación → contraste → revisión**. Una respuesta correcta no equivale automáticamente a una comprensión profunda; conservar la justificación, la calidad de la evidencia y la revisión de la hipótesis como indicadores formativos, siempre sujetos a evaluación docente.

## Seis posibles pilotos (propuestas propias, no contenidos copiados)

| Nº | Fuente y autores | Objetivo de adaptación | Posible error observable | Ayuda graduada |
| --- | --- | --- | --- | --- |
| 6 | *La carrera del calor*, C. Alonso Arias y col. | Conducción y transferencia de calor | Confundir conductividad con temperatura | Predicción comparada con observación, tabla y justificación |
| 15 | *La luz: cuando la física se convierte en matemáticas*, Iván Nadal Latorre | Modelos matemáticos a partir de óptica | Interpretar un dibujo como prueba experimental | Fotografía/esquema → medidas → gráfica → contraste |
| 2 | *En busca del foco de Van Eyck*, Sara M. Alonso Ruiz y Raúl Suárez García | Óptica y medida con incertidumbre | Tratar una estimación como valor exacto | Repetición, unidades, márgenes y discusión |
| 20 | *El agua revela sus secretos*, Rafael Cabrera Moscoso | Electrólisis y cambio químico | Confundir fenómeno eléctrico con reacción química | Observación y modelos en distintos niveles |
| 24 | *¿Podemos confiar en la etiqueta?*, José Juan Sirvent Carbonell | Evaluar una afirmación mediante medición | Confundir concordancia aproximada con certeza absoluta | Datos → cálculo → límites e incertidumbre |
| 31 | *Construcción de pilas con monedas*, José Antonio Martínez Pons | Energía química y eléctrica | Atribuir la corriente solo a las monedas | Diseñar controles y distinguir función de materiales |

Estas ideas pueden implementarse primero **sin IA** mediante reglas transparentes y respuestas simuladas. La identificación de una confusión se refiere a una **respuesta de una tarea concreta**, no a una condición, diagnóstico o perfil clínico del alumno.

## Contrato de datos propuesto para RAG futuro (no implementado)

Cada fragmento recuperable, **solo si los derechos lo permiten**, debería tener:

```json
{
  "source_id": "gedh-faraday-2026",
  "contribution_number": 6,
  "source_title": "La carrera del calor: ¿qué metal ganará?",
  "author_credit": "Autores del artículo; consultar índice",
  "source_url": "https://gedh.rseq.org/numero-especial/",
  "document_type": "demostracion_experimental",
  "language": "es",
  "license_status": "pendiente_de_verificacion",
  "text_ingestion_allowed": false,
  "educational_stage": "propuesta_docente_pendiente_de_validacion",
  "activity_version": "adaptacion_original_neuroaula"
}
```

Requisitos antes de añadir recuperación con IA:

1. Confirmar licencia por obra, figuras, vídeos y anexos; obtener permiso cuando sea necesario. La disponibilidad pública para lectura **no equivale** a licencia de reproducción o indexación.
2. Catalogar por contribución, autores, fuente y fecha; distinguir hechos citados de actividades originales de NeuroAula.
3. Recuperar con referencias rastreables y abstenerse de inventar pasos de experimentos no consultados.
4. Revisar científicamente y en materia de seguridad cualquier propuesta de laboratorio (reactivos, electricidad, fuentes de calor, radiaciones, biología).
5. Vincular criterios LOMLOE **solo tras verificar etapa, asignatura, comunidad autónoma y normativa**. Ninguna competencia curricular se presupone homologada.
6. Evitar subir datos de menores; los pilotos deben usar datos ficticios y supervisión docente.
7. Si se concede permiso para indexar, implementar almacenamiento de fragmentos autorizados, controles de acceso, citas y evaluación de recuperación antes de activar un agente.

## Distinción de estados

- **Incorporado ahora:** índice público, autoría, enlaces, seis hipótesis de diseño y visibilidad en la demo de actividades.
- **No incorporado:** PDF como archivo, contenidos protegidos reproducidos, RAG, embeddings, agentes, fichas experimentales completas, adaptación automática y evaluación científica.
- **Pendiente:** comprobación íntegra de protocolos de cada experiencia, validación por profesorado, seguridad y derechos de reutilización.

**No existe colaboración ni aval del GEDH, RSEF, RSEQ o los autores sobre NeuroAula-IA.**
