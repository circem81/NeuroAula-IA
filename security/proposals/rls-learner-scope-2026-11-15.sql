-- Proposed-only SECURITY PATCH, 15 November 2026.
-- DO NOT EXECUTE IN PRODUCTION YET.
-- Baseline migration history is incomplete in GitHub; reconcile it and run
-- real authenticated-role RLS tests with synthetic fixtures in staging first.
-- This file is deliberately NOT in supabase/migrations.
-- Scoped to the observed existing schema and policy names. No real learner data.
--
-- Design:
-- * Teacher requires an ACTIVE organization membership + explicit class assignment.
-- * Admin has organization-wide access to attempts/evidence (existing privilege).
-- * Learners read only their own records, never classmates' records.
-- * For the Learning Twin, preserve teacher-only read, add student+class scope.
-- * The comparison is performed in Postgres RLS, not merely in the UI.
-- * All permissive SELECT policies shown must be replaced, not appended.

begin;

drop policy if exists "twin_teacher_read" on public.learning_twin_state;
create policy "twin_teacher_read_assigned"
on public.learning_twin_state for select to authenticated
using (
    (select private.has_organization_role(learning_twin_state.organization_id, array['teacher']::public.organization_role[]))
    and exists (
      select 1
      from public.classroom_learners cl
      join public.classrooms c on c.id = cl.classroom_id
      join public.classroom_teachers ct on ct.classroom_id = cl.classroom_id
      join public.learners l on l.id = cl.learner_id
      where cl.learner_id = learning_twin_state.student_id
        
        and ct.teacher_id = (select auth.uid())
        and l.organization_id = learning_twin_state.organization_id
        and c.organization_id = learning_twin_state.organization_id
    )
  );

drop policy if exists "twin_teacher_read" on public.learning_twin_evidence;
create policy "twin_teacher_read_assigned"
on public.learning_twin_evidence for select to authenticated
using (
    (select private.has_organization_role(learning_twin_evidence.organization_id, array['teacher']::public.organization_role[]))
    and exists (
      select 1
      from public.classroom_learners cl
      join public.classrooms c on c.id = cl.classroom_id
      join public.classroom_teachers ct on ct.classroom_id = cl.classroom_id
      join public.learners l on l.id = cl.learner_id
      where cl.learner_id = learning_twin_evidence.student_id
        and cl.classroom_id = learning_twin_evidence.classroom_id
        and ct.teacher_id = (select auth.uid())
        and l.organization_id = learning_twin_evidence.organization_id
        and c.organization_id = learning_twin_evidence.organization_id
    )
  );

drop policy if exists "twin_teacher_read" on public.learning_twin_agent_events;
create policy "twin_teacher_read_assigned"
on public.learning_twin_agent_events for select to authenticated
using (
    (select private.has_organization_role(learning_twin_agent_events.organization_id, array['teacher']::public.organization_role[]))
    and exists (
      select 1
      from public.classroom_learners cl
      join public.classrooms c on c.id = cl.classroom_id
      join public.classroom_teachers ct on ct.classroom_id = cl.classroom_id
      join public.learners l on l.id = cl.learner_id
      where cl.learner_id = learning_twin_agent_events.student_id
        
        and ct.teacher_id = (select auth.uid())
        and l.organization_id = learning_twin_agent_events.organization_id
        and c.organization_id = learning_twin_agent_events.organization_id
    )
  );

drop policy if exists "staff and linked learner read learning attempts" on public.learning_attempts;
create policy "assigned staff and own learner read learning attempts"
on public.learning_attempts for select to authenticated
using (
  exists (
    select 1
    from public.classroom_learners cl
    join public.classrooms c on c.id = cl.classroom_id
    join public.learners l on l.id = cl.learner_id
    where cl.classroom_id = learning_attempts.classroom_id
      and cl.learner_id = learning_attempts.learner_id
      and c.organization_id = learning_attempts.organization_id
      and l.organization_id = learning_attempts.organization_id
  )
  and ((
    (select private.has_organization_role(learning_attempts.organization_id, array['organization_admin']::public.organization_role[]))
    or (
    (select private.has_organization_role(learning_attempts.organization_id, array['teacher']::public.organization_role[]))
    and exists (
      select 1
      from public.classroom_teachers ct
      join public.classrooms c on c.id = ct.classroom_id
      where ct.classroom_id = learning_attempts.classroom_id
        and ct.teacher_id = (select auth.uid())
        and c.organization_id = learning_attempts.organization_id
    )
  )
  ) or (
    (select private.is_active_organization_member(learning_attempts.organization_id))
    and exists (
      select 1 from public.learners l
      where l.id = learning_attempts.learner_id
        and l.organization_id = learning_attempts.organization_id
        and l.user_id = (select auth.uid())
    )
  ))
);

drop policy if exists "staff create learning attempts" on public.learning_attempts;
create policy "assigned staff create learning attempts"
on public.learning_attempts for insert to authenticated
with check (
  recorded_by = (select auth.uid())
  and (
  exists (
    select 1
    from public.classroom_learners cl
    join public.classrooms c on c.id = cl.classroom_id
    join public.learners l on l.id = cl.learner_id
    where cl.classroom_id = learning_attempts.classroom_id
      and cl.learner_id = learning_attempts.learner_id
      and c.organization_id = learning_attempts.organization_id
      and l.organization_id = learning_attempts.organization_id
  )
  and (
    (select private.has_organization_role(learning_attempts.organization_id, array['organization_admin']::public.organization_role[]))
    or (
    (select private.has_organization_role(learning_attempts.organization_id, array['teacher']::public.organization_role[]))
    and exists (
      select 1
      from public.classroom_teachers ct
      join public.classrooms c on c.id = ct.classroom_id
      where ct.classroom_id = learning_attempts.classroom_id
        and ct.teacher_id = (select auth.uid())
        and c.organization_id = learning_attempts.organization_id
    )
  )
  )
)
);

drop policy if exists "staff update learning attempts" on public.learning_attempts;
create policy "assigned staff update learning attempts"
on public.learning_attempts for update to authenticated
using (
  exists (
    select 1
    from public.classroom_learners cl
    join public.classrooms c on c.id = cl.classroom_id
    join public.learners l on l.id = cl.learner_id
    where cl.classroom_id = learning_attempts.classroom_id
      and cl.learner_id = learning_attempts.learner_id
      and c.organization_id = learning_attempts.organization_id
      and l.organization_id = learning_attempts.organization_id
  )
  and (
    (select private.has_organization_role(learning_attempts.organization_id, array['organization_admin']::public.organization_role[]))
    or (
    (select private.has_organization_role(learning_attempts.organization_id, array['teacher']::public.organization_role[]))
    and exists (
      select 1
      from public.classroom_teachers ct
      join public.classrooms c on c.id = ct.classroom_id
      where ct.classroom_id = learning_attempts.classroom_id
        and ct.teacher_id = (select auth.uid())
        and c.organization_id = learning_attempts.organization_id
    )
  )
  )
)
with check (
  exists (
    select 1
    from public.classroom_learners cl
    join public.classrooms c on c.id = cl.classroom_id
    join public.learners l on l.id = cl.learner_id
    where cl.classroom_id = learning_attempts.classroom_id
      and cl.learner_id = learning_attempts.learner_id
      and c.organization_id = learning_attempts.organization_id
      and l.organization_id = learning_attempts.organization_id
  )
  and (
    (select private.has_organization_role(learning_attempts.organization_id, array['organization_admin']::public.organization_role[]))
    or (
    (select private.has_organization_role(learning_attempts.organization_id, array['teacher']::public.organization_role[]))
    and exists (
      select 1
      from public.classroom_teachers ct
      join public.classrooms c on c.id = ct.classroom_id
      where ct.classroom_id = learning_attempts.classroom_id
        and ct.teacher_id = (select auth.uid())
        and c.organization_id = learning_attempts.organization_id
    )
  )
  )
);

drop policy if exists "staff and linked learner read learning evidence" on public.learning_evidence;
create policy "assigned staff and own learner read learning evidence"
on public.learning_evidence for select to authenticated
using (
  exists (
    select 1
    from public.classroom_learners cl
    join public.classrooms c on c.id = cl.classroom_id
    join public.learners l on l.id = cl.learner_id
    where cl.classroom_id = learning_evidence.classroom_id
      and cl.learner_id = learning_evidence.learner_id
      and c.organization_id = learning_evidence.organization_id
      and l.organization_id = learning_evidence.organization_id
  )
  and ((
    (select private.has_organization_role(learning_evidence.organization_id, array['organization_admin']::public.organization_role[]))
    or (
    (select private.has_organization_role(learning_evidence.organization_id, array['teacher']::public.organization_role[]))
    and exists (
      select 1
      from public.classroom_teachers ct
      join public.classrooms c on c.id = ct.classroom_id
      where ct.classroom_id = learning_evidence.classroom_id
        and ct.teacher_id = (select auth.uid())
        and c.organization_id = learning_evidence.organization_id
    )
  )
  ) or (
    (select private.is_active_organization_member(learning_evidence.organization_id))
    and exists (
      select 1 from public.learners l
      where l.id = learning_evidence.learner_id
        and l.organization_id = learning_evidence.organization_id
        and l.user_id = (select auth.uid())
    )
  ))
);

drop policy if exists "staff create learning evidence" on public.learning_evidence;
create policy "assigned staff create learning evidence"
on public.learning_evidence for insert to authenticated
with check (
  recorded_by = (select auth.uid())
  and (
  exists (
    select 1
    from public.classroom_learners cl
    join public.classrooms c on c.id = cl.classroom_id
    join public.learners l on l.id = cl.learner_id
    where cl.classroom_id = learning_evidence.classroom_id
      and cl.learner_id = learning_evidence.learner_id
      and c.organization_id = learning_evidence.organization_id
      and l.organization_id = learning_evidence.organization_id
  )
  and (
    (select private.has_organization_role(learning_evidence.organization_id, array['organization_admin']::public.organization_role[]))
    or (
    (select private.has_organization_role(learning_evidence.organization_id, array['teacher']::public.organization_role[]))
    and exists (
      select 1
      from public.classroom_teachers ct
      join public.classrooms c on c.id = ct.classroom_id
      where ct.classroom_id = learning_evidence.classroom_id
        and ct.teacher_id = (select auth.uid())
        and c.organization_id = learning_evidence.organization_id
    )
  )
  )
)
);

drop policy if exists "staff update learning evidence" on public.learning_evidence;
create policy "assigned staff update learning evidence"
on public.learning_evidence for update to authenticated
using (
  exists (
    select 1
    from public.classroom_learners cl
    join public.classrooms c on c.id = cl.classroom_id
    join public.learners l on l.id = cl.learner_id
    where cl.classroom_id = learning_evidence.classroom_id
      and cl.learner_id = learning_evidence.learner_id
      and c.organization_id = learning_evidence.organization_id
      and l.organization_id = learning_evidence.organization_id
  )
  and (
    (select private.has_organization_role(learning_evidence.organization_id, array['organization_admin']::public.organization_role[]))
    or (
    (select private.has_organization_role(learning_evidence.organization_id, array['teacher']::public.organization_role[]))
    and exists (
      select 1
      from public.classroom_teachers ct
      join public.classrooms c on c.id = ct.classroom_id
      where ct.classroom_id = learning_evidence.classroom_id
        and ct.teacher_id = (select auth.uid())
        and c.organization_id = learning_evidence.organization_id
    )
  )
  )
)
with check (
  exists (
    select 1
    from public.classroom_learners cl
    join public.classrooms c on c.id = cl.classroom_id
    join public.learners l on l.id = cl.learner_id
    where cl.classroom_id = learning_evidence.classroom_id
      and cl.learner_id = learning_evidence.learner_id
      and c.organization_id = learning_evidence.organization_id
      and l.organization_id = learning_evidence.organization_id
  )
  and (
    (select private.has_organization_role(learning_evidence.organization_id, array['organization_admin']::public.organization_role[]))
    or (
    (select private.has_organization_role(learning_evidence.organization_id, array['teacher']::public.organization_role[]))
    and exists (
      select 1
      from public.classroom_teachers ct
      join public.classrooms c on c.id = ct.classroom_id
      where ct.classroom_id = learning_evidence.classroom_id
        and ct.teacher_id = (select auth.uid())
        and c.organization_id = learning_evidence.organization_id
    )
  )
  )
);

drop policy if exists "staff delete learning evidence" on public.learning_evidence;
create policy "assigned staff delete learning evidence"
on public.learning_evidence for delete to authenticated
using (
  exists (
    select 1
    from public.classroom_learners cl
    join public.classrooms c on c.id = cl.classroom_id
    join public.learners l on l.id = cl.learner_id
    where cl.classroom_id = learning_evidence.classroom_id
      and cl.learner_id = learning_evidence.learner_id
      and c.organization_id = learning_evidence.organization_id
      and l.organization_id = learning_evidence.organization_id
  )
  and (
    (select private.has_organization_role(learning_evidence.organization_id, array['organization_admin']::public.organization_role[]))
    or (
    (select private.has_organization_role(learning_evidence.organization_id, array['teacher']::public.organization_role[]))
    and exists (
      select 1
      from public.classroom_teachers ct
      join public.classrooms c on c.id = ct.classroom_id
      where ct.classroom_id = learning_evidence.classroom_id
        and ct.teacher_id = (select auth.uid())
        and c.organization_id = learning_evidence.organization_id
    )
  )
  )
);

-- Additional tables must be audited before processing real students:
-- public.learners (org-wide staff SELECT/UPDATE), classroom membership management,
-- reports, resources, resource variants, educational hypotheses, etc.
-- public.learning_twin_criteria is org-level curriculum metadata (no learner_id):
-- this patch deliberately leaves its existing teacher read policy unchanged.
--
-- Staging acceptance tests must include SELECT/INSERT/UPDATE/DELETE with actual
-- authenticated JWT role contexts; pg_policies inspection alone is insufficient.
commit;
