# MVP end-to-end de NeuroAula AI

## Objetivo

El MVP demuestra un recorrido educativo completo con datos sintéticos:

`alumno → actividad → respuesta → evaluación → evidencia → Learning Twin → profesor`

La actividad se vincula a un criterio curricular versionado. La respuesta genera una evaluación estructurada, una evidencia observable, una actualización trazable del Learning Twin y una recomendación. El profesor puede aprobar o corregir la evaluación sin borrar la evidencia original.

## Qué se reutiliza

- La aplicación TanStack Start, su navegación y el sistema visual existente.
- La autenticación y las organizaciones de Supabase.
- Las aulas, alumnos, actividades, intentos y evidencias existentes.
- El motor Learning Twin v1 y su almacenamiento inmutable.
- La pasarela de modelos y los contratos de los agentes Mesías y Leonardo.

## Qué añade este corte

- Asignación explícita de profesores a aulas.
- Elementos curriculares LOMLOE con versión y procedencia.
- Ítems de actividad y claves de respuesta separadas.
- Evaluaciones estructuradas con confianza y revisión humana obligatoria.
- Revisión humana append-only y evidencia correctiva enlazada a la original.
- Registro resumido de interacciones entre agentes.
- Recomendaciones auditables.
- Estado anterior, estado nuevo y motivo en cada actualización del Learning Twin.
- Una demo integrada en `/demo/actividades` con vista de alumno y de profesor.

## Límites deliberados

La demo usa una actividad y un alumno sintéticos. En el navegador conserva el recorrido en almacenamiento local para facilitar la validación visual; este registro local no se presenta como expediente real. La migración deja preparado el contrato persistente de Supabase para conectar el flujo real desde funciones de servidor.

La evaluación del MVP es determinista. Una respuesta de opción múltiple acredita acierto o error, pero no permite inferir razonamiento, estrategia, dificultad psicológica ni diagnóstico. Esos campos permanecen vacíos hasta que exista evidencia directa o revisión humana.

## Selección de repositorios externos

La arquitectura debe mantener un núcleo pequeño:

- **Ollama**, opcional, como proveedor local detrás de la pasarela de modelos.
- **RAGFlow**, en una fase posterior, como servicio documental aislado para normativa y materiales con citas.
- **n8n**, fuera del núcleo pedagógico, para automatizaciones e integraciones administrativas después de revisar su licencia para el despliegue elegido.

LangChain, CrewAI, Dify y Langflow duplicarían la orquestación ya implementada. Open WebUI duplicaría la interfaz. OpenClaw tiene un ámbito de permisos demasiado amplio para incorporarlo al producto educativo. Gemini CLI y Claude Code son herramientas de desarrollo. DeepSeek-V3 completo no es una dependencia razonable para el despliegue actual.

## Próximo paso técnico

Conectar la demo a una acción de servidor que escriba el intento, ejecute la evaluación, confirme la evidencia y actualice el Twin en una única operación. El cliente nunca debe recibir la clave de respuesta ni permisos para crear evaluaciones o eventos de agentes.
