# Propuestas de base de datos (no aplicadas)

Los archivos de esta carpeta **no son migraciones** y no se han aplicado a ningún
proyecto de Supabase. Están fuera de `supabase/migrations/` para que ningún
`supabase db push` los ejecute por accidente.

## `20261112_permisos_evaluaciones.sql`

Regla acordada el 12 de noviembre de 2026:

- Cada alumno consulta únicamente sus propias evaluaciones y recomendaciones.
- Cada docente consulta las de los grupos a los que está asignado, y solo mientras
  su membresía en el centro esté activa.

### Qué se comprobó y dónde

Todo se comprobó en un PostgreSQL 16 local y desechable, con las tres migraciones
del repositorio sobre un esquema base **inferido**
(`supabase/tests/support/esquema_base_inferido.sql`). No se ha consultado ni
modificado Supabase. Los resultados describen las políticas tal como están escritas
en el repositorio; falta contrastarlos con el esquema y las políticas reales.

| Perfil ficticio | Antes | Con la propuesta |
| --- | --- | --- |
| Alumna del grupo A | Ve 2 evaluaciones, 2 recomendaciones y 1 revisión docente (propias y de un compañero) | Ve 1 evaluación y 1 recomendación (las suyas); ninguna revisión |
| Docente asignado y activo | Ve su grupo | Igual |
| Docente del mismo centro, no asignado | No ve evaluaciones, pero sí el Learning Twin del grupo | No ve nada del grupo |
| Docente asignado con membresía no activa | Conserva la lectura de evaluaciones, recomendaciones y revisiones | No ve nada |
| Docente de otro centro | No ve nada | Igual |
| Dirección del centro | Ve evaluaciones del centro, no el Twin | Igual |

Además, antes de la propuesta una revisión docente podía guardarse con el
identificador de otro centro; con la propuesta se rechaza.

### Pruebas

- `supabase/tests/permisos_evaluaciones.sql`: pasa con la propuesta y falla sin ella
  (primer fallo: «Una alumna ve evaluaciones ajenas»).
- `supabase/tests/mvp_end_to_end.sql`: pasa antes y después.
- `supabase/tests/learning_twin_v1.sql`: pasa antes; **después falla** en «Teacher
  cannot read own organization», porque su docente de prueba no está asignado a
  ningún grupo. Al adoptar la propuesta hay que añadirle, tras crear el aula:

  ```sql
  insert into public.classroom_teachers(classroom_id,teacher_id) values
    ('fc000000-0000-4000-8000-000000000001','fa000000-0000-4000-8000-000000000001');
  ```

  Con esa línea pasa antes y después (requiere la migración del MVP, que crea
  `classroom_teachers`).

### Cómo repetir la comprobación en local

En una base PostgreSQL vacía y desechable, en este orden:

1. `supabase/tests/support/esquema_base_inferido.sql`
2. Las tres migraciones no vacías de `supabase/migrations/`
3. `supabase/propuestas/20261112_permisos_evaluaciones.sql`
4. `supabase/tests/permisos_evaluaciones.sql`

### Antes de aplicarla a Supabase

1. Obtener el esquema y las políticas reales y compararlos con el esquema inferido,
   en especial el tipo y los valores de `organization_memberships.status` y las
   políticas de `learners`, `classrooms` y `classroom_learners`.
2. Confirmar las decisiones abiertas:
   - si la dirección del centro debe seguir viendo todos los grupos;
   - si el alumnado debe poder leer la revisión docente de sus propias evaluaciones
     (la propuesta no lo permite);
   - si un alumno con membresía no activa debe perder la lectura (la propuesta lo hace).
3. Ejecutar las pruebas en una rama o proyecto de desarrollo, nunca en producción.
4. Solo entonces mover el archivo a `supabase/migrations/` con una marca de tiempo nueva.

### Fuera del alcance de esta propuesta

- `commit_learning_twin_v1` comprueba que quien registra es docente activo del centro,
  pero no que esté asignado al grupo del alumno. Hoy ningún código lo invoca.
- Las políticas de las tablas base (`learners`, `classrooms`, `learning_attempts`…)
  no están en el repositorio y no se han revisado.
