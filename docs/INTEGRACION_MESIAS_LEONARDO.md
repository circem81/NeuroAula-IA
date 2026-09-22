# Integración de referencias Mesias + Leonardo en NeuroAula AI

Estado: **plan técnico documentado, no implementación funcional**. Fecha: 2026-09-22.

## Alcance y procedencia

Estas referencias sirven para diseñar componentes **propios** de NeuroAula AI, sin importar ni copiar código, documentación, pesos de modelos, prompts, datasets ni otros materiales ajenos. No se declara que los agentes, el RAG ni el Learning Twin estén desplegados.

- Mesias: https://github.com/joedejesus/jj_mesias_system — arquitectura local modular, fachada de inferencia, memoria conversacional simple, API FastAPI, separación de entrenamiento LoRA y runtime. **Licencia propietaria de uso limitado**: el uso comercial, la incorporación y la reutilización de contenidos o código en servicios/productos ajenos requieren autorización previa y escrita. Solo estudiar las ideas generales y desarrollar implementación independiente, o negociar licencia específica antes de integrar material protegido.
- Leonardo / RAG documental: https://github.com/caraqueleonardoAlfredo/ai-doc-rag-chat — referencia conceptual para ingestión documental, fragmentación, recuperación semántica, respuesta anclada en fuentes y declaración explícita de falta de evidencia.
- Leonardo / agentes: https://github.com/caraqueleonardoAlfredo/ai-research-agent — referencia conceptual para flujos con herramientas, contratos estructurados, límites por petición, tratamiento de casos sin resultados y aislamiento de sesiones. Su caso de uso real es empleo: **no** contiene un agente educativo listo para reutilizar.
- Leonardo / evaluación: https://github.com/caraqueleonardoAlfredo/ai-eval-harness — referencia conceptual para recall@k, conjuntos de pruebas y evaluaciones estructuradas. Sus métricas de ejemplo no son resultados de NeuroAula.
- Los repositorios de Leonardo se muestran públicos, pero no consta una licencia de reutilización en su metadata; **no asumir permiso para copiar o integrar el código**. Revisar todos los archivos de licencia y obtener permiso cuando sea necesario.

## Arquitectura objetivo (diseño propio)

Frontend React/TypeScript (existente) -> backend autorizado -> orquestador NeuroAula -> agentes Alumno, Evaluación y Profesor -> servicios independientes:

1. **Learning Twin**: estado longitudinal educativo por alumno y criterio curricular, calculado con reglas explícitas sobre evidencias de aprendizaje; no historial completo de chat, no diagnóstico clínico y no inferencias de salud.
2. **Memoria conversacional**: contexto breve, con caducidad y consentimiento apropiado, separado del Learning Twin; claves por centro, alumno, rol y conversación. No guardar conversaciones completas como perfil psicológico.
3. **RAG educativo**: ingestión autorizada de materiales docentes y currículo; metadatos de territorio, curso, asignatura, versión curricular, licencia, centro y visibilidad; recuperación filtrada según permisos; respuesta con cita a documentos recuperados o «no consta en las fuentes».
4. **Motor de modelos intercambiable**: interfaz propia de inferencia que admita proveedores remotos o motores locales autorizados, con límites de coste, tiempo y datos. La inferencia local y LoRA son posibilidades de laboratorio, no requisitos del MVP.
5. **Orquestación controlada**: reglas deterministas primero; llamar a agentes solo cuando proceda. Alumno ofrece pistas; Evaluación registra evidencias con rúbrica y control de incertidumbre; Profesor presenta resultados revisables al docente. Ningún agente modifica unilateralmente el nivel, adaptación o evaluación oficial.
6. **Evaluación y observabilidad**: pruebas de recuperación (recall@k con dataset curado), fidelidad de citas, abstención sin fuente, precisión de cálculos del Learning Twin, aislamiento entre centros, sesgos por subgrupo cuando sea apropiado, coste/latencia y revisión humana. Un LLM juez puede complementar pruebas, nunca sustituir resultados objetivos ni evaluación docente.

La persistencia educativa prevista continúa en **Supabase/PostgreSQL**, con RLS real en cada tabla, separación por centro, permisos por rol, auditoría y minimización de datos. No trasplantar colecciones por sesión de Chroma o JSON de Mesias como almacén central de alumnos; elegir el índice vectorial según pruebas técnicas y su control de acceso. Las credenciales solo viven en el servidor.

## Fases de implementación para Codex

**Fase 0 — Auditoría previa:** identificar branch/estado del repo, frontend y Supabase existentes; confirmar licencias/autorizaciones; definir contratos API y pruebas de aislamiento. Mantener historial de Git sin force push ni rebase sobre commits publicados (integración Lovable existente).

**Fase 1 — Evidencias + Learning Twin v1:** implementar y probar `learning_evidence`, `learning_twin_state`, `error_patterns`, `strategy_observations` y `support_effectiveness` según las migraciones reales; registrar procedencia, criterio LOMLOE, intentos, timestamp y docente revisor. Motor determinista reproducible: dominio, confianza, ayudas, transferencia y patrones de error. No usar texto libre para etiquetar clínicamente a menores.

**Fase 2 — Adaptador de modelos y memoria:** servicio de inferencia desacoplado, límites de tokens/coste/latencia, enmascarado de datos, memoria conversacional acotada y permisos por rol. Tests de contaminación entre usuarios y centros. Solo modelos y dependencias con licencias compatibles.

**Fase 3 — RAG curricular:** pipeline original de carga/validación/chunking/indexación, filtros de tenant y licencia, recuperación con citas/versiones, respuesta abstentiva cuando falta evidencia y pruebas con preguntas conocidas. No cargar datos reales de menores en demos o servicios externos.

**Fase 4 — Agentes y orquestador:** implementar Alumno, Evaluación y Profesor a través de contratos tipados, límites de herramientas y trazabilidad de cada decisión. Los agentes consultan el Twin autorizado, nunca sustituyen el juicio docente.

**Fase 5 — Evaluación y piloto controlado:** suite automatizada de calidad, privacidad, seguridad, trazabilidad, accesibilidad, rendimiento y costes; usar solo datos sintéticos hasta superar controles y obtener bases legales/autorizaciones necesarias para un piloto real. Comparar resultados educativos contra una línea de base y documentar limitaciones.

## Condiciones de aceptación de la integración

- No copiar ni redistribuir Mesias ni repositorios de Leonardo sin permiso/licencia aplicable.
- No modificar el demo para presentarlo como funcional antes de que existan backend, tests y datos autorizados.
- RLS y pruebas negativas entre centros/roles antes de persistir información de menores.
- Todo resultado del Twin debe poder rastrearse hasta evidencias concretas y ser corregido por un docente.
- Cualquier salida generativa asociada al currículo debe exhibir fuentes identificables o declarar falta de fundamento.
- Código nuevo desarrollado como módulo propio, separado de la interfaz y versionado con pruebas.
