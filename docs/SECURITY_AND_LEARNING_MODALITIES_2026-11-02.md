# Seguridad y modalidades de aprendizaje — revisión 2026-11-02

## Seguridad

Se revisaron 43 tablas del esquema público con RLS activo. Se aplicó en Supabase la migración `harden_multitenant_classroom_and_learner_rls_20261102` para:

- Exigir membresía activa de organización incluso en accesos derivados de asignaciones a aulas.
- Evitar que un alumno vea evaluaciones o recomendaciones de sus compañeros.
- Restringir la relación entre aula y alumno para las lecturas de `classroom_learners`.
- Vincular explícitamente `organization_id` de respuestas a los ítems de aprendizaje y de revisiones a sus evaluaciones.

### Comprobaciones pendientes

1. Pruebas automatizadas con dos centros, varios docentes, estudiante y cuenta dada de baja, usando el cliente de API con JWT reales o aislados.
2. Inspección de todas las funciones RPC, permisos por columnas, vistas, Storage, Edge Functions y configuración de despliegue.
3. Revisar que el acceso docente esté limitado a los grupos asignados cuando corresponda.
4. Activar protección contra contraseñas filtradas en Supabase Auth.
5. Añadir validaciones de integridad de organización mediante claves externas compuestas o triggers seguros tras evaluar el esquema y los registros.
6. Revisar la validez de roles como `student`, `family`, `pt` y `orientation` con pruebas de autorización.
7. No cargar datos personales reales de menores hasta completar evaluación de impacto, controles de acceso y acuerdo con el centro.

## Modalidades de aprendizaje

La demo adaptativa incluye cuatro **modalidades de apoyo contextual**: visual, oral, manipulativa y escrita.

Esto **no** es una clasificación del alumno como visual, auditivo o kinestésico. La selección no determina la capacidad de aprendizaje, no realiza diagnóstico, ni persiste resultados; es únicamente una interacción simulada.

Para una versión futura, registrar por tarea: conocimiento previo, formato ofrecido, elección voluntaria, tipo de error, grado de ayuda, resultados de transferencia y revisión docente. Comparar progreso real antes de recomendar un formato. Respetar accesibilidad y Diseño Universal para el Aprendizaje, con supervisión humana.

Fuentes: CAST UDL Guidelines 3.0; documentación oficial Supabase Row Level Security y seguridad de contraseñas.
