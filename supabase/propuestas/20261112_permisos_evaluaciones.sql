-- PROPUESTA — NO APLICADA. No está en supabase/migrations a propósito, para que
-- ningún `supabase db push` la aplique por accidente. Moverla a migrations/ con una
-- marca de tiempo nueva solo cuando se apruebe y se haya contrastado con el esquema real.
--
-- Regla acordada (12 nov 2026):
--   * Cada alumno consulta únicamente sus propias evaluaciones y recomendaciones.
--   * Cada docente consulta las de los grupos a los que está asignado, y solo
--     mientras su membresía en el centro esté activa.
--
-- Qué corrige respecto a 20260924081351_mvp_end_to_end.sql y 20260921074103_learning_twin_v1.sql
-- (comprobado en un PostgreSQL local con un esquema base inferido, no en Supabase):
--   1. learning_assessments y learning_recommendations se leían por aula: un alumno
--      veía las de sus compañeros.
--   2. learning_twin_reviews (notas de revisión docente) también era legible por el
--      alumnado del aula, pese a que la política se llama «assigned staff».
--   3. private.can_access_classroom no exigía membresía activa: un docente dado de
--      baja conservaba el acceso mientras siguiera en classroom_teachers.
--   4. Las tablas del Learning Twin eran legibles por cualquier docente del centro,
--      no solo por los asignados al grupo del alumno.
--   5. En dos políticas, la comparación `x.organization_id = organization_id` dentro de
--      una subconsulta se resolvía contra la propia tabla de la subconsulta y era
--      siempre cierta: una revisión o una clave de respuesta podía guardarse con el
--      identificador de otro centro.
--
-- Se mantiene sin cambios: la dirección del centro (organization_admin activo) sigue
-- viendo todos los grupos de su centro. Pendiente de confirmar si debe ser así.

begin;

-- Personal autorizado de un aula: dirección activa del centro, o docente con
-- membresía activa Y asignación explícita al aula.
create or replace function private.is_classroom_staff(target_classroom_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.classrooms c
    join public.organization_memberships m
      on m.organization_id = c.organization_id
     and m.user_id = (select auth.uid())
     and m.status = 'active'
    where c.id = target_classroom_id
      and (
        m.role = 'organization_admin'
        or (
          m.role = 'teacher'
          and exists (
            select 1 from public.classroom_teachers ct
            where ct.classroom_id = c.id and ct.teacher_id = m.user_id
          )
        )
      )
  );
$$;

-- El registro de alumno pertenece a quien consulta y su membresía sigue activa.
create or replace function private.is_own_learner(target_learner_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.learners l
    join public.organization_memberships m
      on m.organization_id = l.organization_id
     and m.user_id = l.user_id
     and m.status = 'active'
    where l.id = target_learner_id
      and l.user_id = (select auth.uid())
  );
$$;

-- Quien consulta es personal autorizado de algún aula del alumno.
create or replace function private.is_staff_of_learner(target_learner_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.classroom_learners cl
    where cl.learner_id = target_learner_id
      and private.is_classroom_staff(cl.classroom_id)
  );
$$;

-- Misma firma que antes; ahora exige membresía activa en todos los casos.
-- La siguen usando las políticas de classroom_teachers, learning_activity_items,
-- learning_activity_item_keys y agent_interactions.
create or replace function private.can_access_classroom(target_classroom_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select private.is_classroom_staff(target_classroom_id)
    or exists (
      select 1
      from public.classroom_learners cl
      where cl.classroom_id = target_classroom_id
        and private.is_own_learner(cl.learner_id)
    );
$$;

revoke all on function private.is_classroom_staff(uuid) from public, anon;
revoke all on function private.is_own_learner(uuid) from public, anon;
revoke all on function private.is_staff_of_learner(uuid) from public, anon;
grant execute on function private.is_classroom_staff(uuid) to authenticated;
grant execute on function private.is_own_learner(uuid) to authenticated;
grant execute on function private.is_staff_of_learner(uuid) to authenticated;

-- Evaluaciones: personal del aula, o el propio alumno.
drop policy if exists "classroom users read assessments" on public.learning_assessments;
create policy "staff or own learner read assessments"
on public.learning_assessments for select to authenticated
using (
  (select private.is_classroom_staff(classroom_id))
  or (select private.is_own_learner(learner_id))
);

-- Recomendaciones: personal de un aula del alumno, o el propio alumno.
drop policy if exists "classroom users read recommendations" on public.learning_recommendations;
create policy "staff or own learner read recommendations"
on public.learning_recommendations for select to authenticated
using (
  (select private.is_staff_of_learner(learner_id))
  or (select private.is_own_learner(learner_id))
);

drop policy if exists "assigned teachers decide recommendations" on public.learning_recommendations;
create policy "assigned teachers decide recommendations"
on public.learning_recommendations for update to authenticated
using ((select private.is_staff_of_learner(learner_id)))
with check ((select private.is_staff_of_learner(learner_id)));

-- Revisiones docentes: solo personal del aula. El alumnado no las lee.
drop policy if exists "assigned staff read Twin reviews" on public.learning_twin_reviews;
create policy "assigned staff read Twin reviews"
on public.learning_twin_reviews for select to authenticated
using (exists (
  select 1 from public.learning_assessments a
  where a.id = assessment_id
    and private.is_classroom_staff(a.classroom_id)
));

drop policy if exists "assigned teachers create Twin reviews" on public.learning_twin_reviews;
create policy "assigned teachers create Twin reviews"
on public.learning_twin_reviews for insert to authenticated
with check (
  reviewed_by = (select auth.uid())
  and exists (
    select 1 from public.learning_assessments a
    where a.id = assessment_id
      and a.organization_id = learning_twin_reviews.organization_id
      and private.is_classroom_staff(a.classroom_id)
  )
);

-- Claves de respuesta: misma regla que antes, con el centro de la fila comprobado de verdad.
drop policy if exists "assigned staff manage answer keys" on public.learning_activity_item_keys;
create policy "assigned staff manage answer keys"
on public.learning_activity_item_keys for all to authenticated
using (exists (
  select 1 from public.learning_activity_items i
  where i.id = item_id
    and private.is_classroom_staff(i.classroom_id)
))
with check (exists (
  select 1 from public.learning_activity_items i
  where i.id = item_id
    and i.organization_id = learning_activity_item_keys.organization_id
    and private.is_classroom_staff(i.classroom_id)
));

drop policy if exists "assigned staff read answer keys" on public.learning_activity_item_keys;
create policy "assigned staff read answer keys"
on public.learning_activity_item_keys for select to authenticated
using (exists (
  select 1 from public.learning_activity_items i
  where i.id = item_id
    and private.is_classroom_staff(i.classroom_id)
));

-- Learning Twin: del centro entero a los grupos asignados.
-- learning_twin_criteria (catálogo sin datos de alumnos) no cambia.
-- Como antes, solo docentes: la dirección y el alumnado siguen sin leer estas tablas.
drop policy if exists twin_teacher_read on public.learning_twin_evidence;
create policy twin_staff_read on public.learning_twin_evidence
for select to authenticated
using (
  (select private.has_organization_role(organization_id, array['teacher']::public.organization_role[]))
  and (select private.is_classroom_staff(classroom_id))
);

do $$
declare t text;
begin
  foreach t in array array[
    'learning_twin_state', 'error_patterns', 'strategy_observations',
    'support_effectiveness', 'learning_twin_agent_events'
  ] loop
    execute format('drop policy if exists twin_teacher_read on public.%I', t);
    execute format(
      'create policy twin_staff_read on public.%I for select to authenticated '
      'using ((select private.has_organization_role(organization_id, array[''teacher'']::public.organization_role[])) '
      'and (select private.is_staff_of_learner(student_id)))', t);
  end loop;
end $$;

commit;
