-- NeuroAula MVP end-to-end: curriculum item -> attempt -> assessment -> evidence -> Twin -> review.
-- This migration extends existing Phase 2/Learning Twin tables rather than duplicating them.

create table public.classroom_teachers (
  classroom_id uuid not null references public.classrooms(id) on delete cascade,
  teacher_id uuid not null references auth.users(id) on delete cascade,
  assigned_at timestamptz not null default now(),
  primary key (classroom_id, teacher_id)
);

create table public.curriculum_elements (
  id uuid primary key default extensions.gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  parent_id uuid references public.curriculum_elements(id) on delete restrict,
  element_type text not null check (element_type in ('competency','evaluation_criterion','basic_knowledge')),
  code text not null check (char_length(code) between 1 and 100),
  title text not null check (char_length(title) between 2 and 300),
  stage text not null check (stage in ('ESO','Bachillerato')),
  course text not null check (char_length(course) between 1 and 40),
  subject text not null check (char_length(subject) between 2 and 80),
  autonomous_community text not null check (char_length(autonomous_community) between 2 and 100),
  source_label text not null check (char_length(source_label) between 2 and 200),
  source_url text check (source_url is null or source_url ~ '^https://'),
  source_version text not null check (char_length(source_version) between 1 and 80),
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  unique (organization_id, code, source_version),
  unique (id, organization_id)
);

create table public.learning_activity_items (
  id uuid primary key default extensions.gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  classroom_id uuid not null,
  activity_id uuid not null,
  criterion_id uuid not null,
  prompt text not null check (char_length(prompt) between 2 and 2000),
  response_kind text not null check (response_kind in ('single_choice','short_text','numeric')),
  options jsonb not null default '[]'::jsonb check (jsonb_typeof(options) = 'array'),
  position integer not null check (position > 0),
  created_at timestamptz not null default now(),
  unique (activity_id, position),
  unique (id, organization_id, classroom_id, activity_id),
  foreign key (activity_id, classroom_id, organization_id)
    references public.learning_activities(id, classroom_id, organization_id) on delete cascade,
  foreign key (criterion_id, organization_id)
    references public.curriculum_elements(id, organization_id) on delete restrict
);

create table public.learning_activity_item_keys (
  item_id uuid primary key references public.learning_activity_items(id) on delete cascade,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  answer_key jsonb not null check (jsonb_typeof(answer_key) in ('string','number','array','object')),
  rubric jsonb not null default '{}'::jsonb check (jsonb_typeof(rubric) = 'object'),
  created_at timestamptz not null default now()
);

alter table public.learning_attempts
  add column item_id uuid references public.learning_activity_items(id) on delete restrict,
  add column response_value text check (response_value is null or char_length(response_value) <= 1000),
  add column support_level smallint check (support_level between 0 and 5),
  add column duration_ms integer check (duration_ms is null or duration_ms between 0 and 86400000);

create table public.learning_assessments (
  id uuid primary key default extensions.gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  classroom_id uuid not null,
  learner_id uuid not null,
  activity_id uuid not null,
  attempt_id uuid not null unique,
  criterion_id uuid not null,
  score_percent smallint not null check (score_percent between 0 and 100),
  mastery_estimate double precision not null check (mastery_estimate between 0 and 1),
  detected_errors text[] not null default '{}',
  observed_strengths text[] not null default '{}',
  misconceptions text[] not null default '{}',
  evidence_summary text not null check (char_length(evidence_summary) between 2 and 1200),
  confidence double precision not null check (confidence between 0 and 1),
  requires_human_review boolean not null,
  recommended_next_action text not null check (char_length(recommended_next_action) between 2 and 800),
  review_status text not null default 'pending' check (review_status in ('pending','approved','corrected','rejected')),
  evaluator_kind text not null check (evaluator_kind in ('deterministic_rules','model_assisted','human')),
  evaluator_version text not null check (char_length(evaluator_version) between 1 and 100),
  created_at timestamptz not null default now(),
  foreign key (attempt_id, organization_id, learner_id)
    references public.learning_attempts(id, organization_id, learner_id) on delete cascade,
  foreign key (activity_id, classroom_id, organization_id)
    references public.learning_activities(id, classroom_id, organization_id) on delete cascade,
  foreign key (criterion_id, organization_id)
    references public.curriculum_elements(id, organization_id) on delete restrict
);

create table public.learning_twin_reviews (
  id uuid primary key default extensions.gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  assessment_id uuid not null references public.learning_assessments(id) on delete cascade,
  original_evidence_id uuid references public.learning_twin_evidence(id) on delete restrict,
  corrective_evidence_id uuid references public.learning_twin_evidence(id) on delete restrict,
  decision text not null check (decision in ('approved','corrected','rejected')),
  corrected_score_percent smallint check (corrected_score_percent between 0 and 100),
  review_note text not null default '' check (char_length(review_note) <= 800),
  reviewed_by uuid not null references auth.users(id),
  reviewed_at timestamptz not null default now(),
  check ((decision = 'corrected') = (corrected_score_percent is not null)),
  check ((decision = 'corrected') = (corrective_evidence_id is not null))
);

create table public.agent_interactions (
  id uuid primary key default extensions.gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  classroom_id uuid,
  learner_id uuid references public.learners(id) on delete cascade,
  activity_id uuid references public.learning_activities(id) on delete cascade,
  attempt_id uuid references public.learning_attempts(id) on delete cascade,
  evidence_id uuid references public.learning_twin_evidence(id) on delete restrict,
  agent text not null check (agent in ('student','evaluation','evidence_store','learning_twin','recommendation','teacher','orchestrator')),
  input_summary jsonb not null default '{}'::jsonb check (jsonb_typeof(input_summary) = 'object'),
  output_summary jsonb not null default '{}'::jsonb check (jsonb_typeof(output_summary) = 'object'),
  confidence double precision check (confidence between 0 and 1),
  model_name text check (model_name is null or char_length(model_name) <= 120),
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  check (learner_id is not null or activity_id is null),
  check (attempt_id is null or activity_id is not null)
);

create table public.learning_recommendations (
  id uuid primary key default extensions.gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  learner_id uuid not null references public.learners(id) on delete cascade,
  criterion_id uuid not null references public.curriculum_elements(id) on delete restrict,
  evidence_id uuid not null references public.learning_twin_evidence(id) on delete restrict,
  recommendation text not null check (char_length(recommendation) between 2 and 800),
  status text not null default 'proposed' check (status in ('proposed','accepted','dismissed','completed')),
  proposed_by text not null check (proposed_by in ('deterministic_rules','model_assisted','teacher')),
  decided_by uuid references auth.users(id),
  decided_at timestamptz,
  created_at timestamptz not null default now(),
  check ((decided_by is null) = (decided_at is null))
);

-- Cover the access paths used by foreign keys and classroom-scoped RLS checks.
create index classroom_teachers_teacher_idx on public.classroom_teachers(teacher_id, classroom_id);
create index curriculum_elements_parent_idx on public.curriculum_elements(parent_id);
create index curriculum_elements_created_by_idx on public.curriculum_elements(created_by);
create index learning_activity_items_classroom_idx on public.learning_activity_items(classroom_id, organization_id);
create index learning_activity_items_criterion_idx on public.learning_activity_items(criterion_id, organization_id);
create index learning_activity_item_keys_org_idx on public.learning_activity_item_keys(organization_id);
create index learning_attempts_item_idx on public.learning_attempts(item_id);
create index learning_assessments_classroom_idx on public.learning_assessments(classroom_id, organization_id);
create index learning_assessments_learner_idx on public.learning_assessments(learner_id, organization_id);
create index learning_assessments_activity_idx on public.learning_assessments(activity_id, classroom_id, organization_id);
create index learning_assessments_criterion_idx on public.learning_assessments(criterion_id, organization_id);
create index learning_twin_reviews_assessment_idx on public.learning_twin_reviews(assessment_id);
create index learning_twin_reviews_original_evidence_idx on public.learning_twin_reviews(original_evidence_id);
create index learning_twin_reviews_corrective_evidence_idx on public.learning_twin_reviews(corrective_evidence_id);
create index learning_twin_reviews_reviewer_idx on public.learning_twin_reviews(reviewed_by);
create index agent_interactions_classroom_idx on public.agent_interactions(classroom_id, organization_id);
create index agent_interactions_learner_idx on public.agent_interactions(learner_id);
create index agent_interactions_activity_idx on public.agent_interactions(activity_id);
create index agent_interactions_attempt_idx on public.agent_interactions(attempt_id);
create index agent_interactions_evidence_idx on public.agent_interactions(evidence_id);
create index agent_interactions_creator_idx on public.agent_interactions(created_by);
create index learning_recommendations_learner_idx on public.learning_recommendations(learner_id, organization_id);
create index learning_recommendations_criterion_idx on public.learning_recommendations(criterion_id);
create index learning_recommendations_evidence_idx on public.learning_recommendations(evidence_id);
create index learning_recommendations_decider_idx on public.learning_recommendations(decided_by);

alter table public.learning_twin_agent_events
  add column previous_state jsonb,
  add column new_state jsonb,
  add column reason text not null default 'Evidence incorporated by Learning Twin engine'
    check (char_length(reason) between 2 and 800);

create or replace function private.can_access_classroom(target_classroom_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.classrooms c
    where c.id = target_classroom_id
      and (
        exists (
          select 1 from public.organization_memberships m
          where m.organization_id = c.organization_id
            and m.user_id = (select auth.uid())
            and m.status = 'active'
            and m.role = 'organization_admin'
        )
        or exists (
          select 1 from public.classroom_teachers ct
          where ct.classroom_id = c.id and ct.teacher_id = (select auth.uid())
        )
        or exists (
          select 1
          from public.classroom_learners cl
          join public.learners l on l.id = cl.learner_id
          where cl.classroom_id = c.id and l.user_id = (select auth.uid())
        )
      )
  );
$$;
revoke all on function private.can_access_classroom(uuid) from public, anon;
grant execute on function private.can_access_classroom(uuid) to authenticated;

do $$
declare table_name text;
begin
  foreach table_name in array array[
    'classroom_teachers','curriculum_elements','learning_activity_items',
    'learning_activity_item_keys','learning_assessments','learning_twin_reviews',
    'agent_interactions','learning_recommendations'
  ] loop
    execute format('alter table public.%I enable row level security', table_name);
    execute format('revoke all on table public.%I from public, anon, authenticated', table_name);
    execute format('grant all on table public.%I to service_role', table_name);
  end loop;
end $$;

grant select on public.classroom_teachers, public.curriculum_elements,
  public.learning_activity_items, public.learning_assessments,
  public.learning_twin_reviews, public.learning_recommendations to authenticated;
grant select on public.learning_activity_item_keys, public.agent_interactions to authenticated;
grant insert, update, delete on public.classroom_teachers, public.curriculum_elements,
  public.learning_activity_items, public.learning_activity_item_keys to authenticated;
grant insert on public.learning_twin_reviews to authenticated;
grant update on public.learning_recommendations to authenticated;

create policy "classroom members read teacher assignments"
on public.classroom_teachers for select to authenticated
using ((select private.can_access_classroom(classroom_id)));
create policy "admins manage teacher assignments"
on public.classroom_teachers for all to authenticated
using (exists (select 1 from public.classrooms c where c.id=classroom_id and
  (select private.has_organization_role(c.organization_id, array['organization_admin']::public.organization_role[]))))
with check (exists (select 1 from public.classrooms c where c.id=classroom_id and
  (select private.has_organization_role(c.organization_id, array['organization_admin']::public.organization_role[]))));

create policy "authorized staff read curriculum"
on public.curriculum_elements for select to authenticated
using ((select private.has_organization_role(organization_id,
  array['organization_admin','teacher','pt','orientation']::public.organization_role[])));
create policy "staff manage curriculum"
on public.curriculum_elements for all to authenticated
using ((select private.has_organization_role(organization_id,
  array['organization_admin','teacher']::public.organization_role[])))
with check (created_by=(select auth.uid()) and (select private.has_organization_role(organization_id,
  array['organization_admin','teacher']::public.organization_role[])));

create policy "classroom members read activity items"
on public.learning_activity_items for select to authenticated
using ((select private.can_access_classroom(classroom_id)));
create policy "assigned staff manage activity items"
on public.learning_activity_items for all to authenticated
using ((select private.can_access_classroom(classroom_id)) and
  (select private.has_organization_role(organization_id,
    array['organization_admin','teacher']::public.organization_role[])))
with check ((select private.can_access_classroom(classroom_id)) and
  (select private.has_organization_role(organization_id,
    array['organization_admin','teacher']::public.organization_role[])));

create policy "assigned staff read answer keys"
on public.learning_activity_item_keys for select to authenticated
using (exists (select 1 from public.learning_activity_items i where i.id=item_id
  and (select private.can_access_classroom(i.classroom_id))
  and (select private.has_organization_role(i.organization_id,
    array['organization_admin','teacher']::public.organization_role[]))));
create policy "assigned staff manage answer keys"
on public.learning_activity_item_keys for all to authenticated
using (exists (select 1 from public.learning_activity_items i where i.id=item_id
  and (select private.can_access_classroom(i.classroom_id))
  and (select private.has_organization_role(i.organization_id,
    array['organization_admin','teacher']::public.organization_role[]))))
with check (exists (select 1 from public.learning_activity_items i where i.id=item_id
  and i.organization_id=organization_id
  and (select private.can_access_classroom(i.classroom_id))
  and (select private.has_organization_role(i.organization_id,
    array['organization_admin','teacher']::public.organization_role[]))));

create policy "classroom users read assessments"
on public.learning_assessments for select to authenticated
using ((select private.can_access_classroom(classroom_id)));
create policy "assigned staff read Twin reviews"
on public.learning_twin_reviews for select to authenticated
using (exists (select 1 from public.learning_assessments a where a.id=assessment_id
  and (select private.can_access_classroom(a.classroom_id))));
create policy "assigned teachers create Twin reviews"
on public.learning_twin_reviews for insert to authenticated
with check (reviewed_by=(select auth.uid()) and exists (
  select 1 from public.learning_assessments a where a.id=assessment_id
    and a.organization_id=organization_id
    and (select private.can_access_classroom(a.classroom_id))
    and (select private.has_organization_role(a.organization_id,
      array['organization_admin','teacher']::public.organization_role[]))));

create policy "assigned staff read agent audit"
on public.agent_interactions for select to authenticated
using (classroom_id is not null and (select private.can_access_classroom(classroom_id))
  and (select private.has_organization_role(organization_id,
    array['organization_admin','teacher','pt','orientation']::public.organization_role[])));

create policy "classroom users read recommendations"
on public.learning_recommendations for select to authenticated
using (exists (select 1 from public.classroom_learners cl
  where cl.learner_id=learning_recommendations.learner_id
    and (select private.can_access_classroom(cl.classroom_id))));
create policy "assigned teachers decide recommendations"
on public.learning_recommendations for update to authenticated
using (exists (select 1 from public.classroom_learners cl where cl.learner_id=learning_recommendations.learner_id
  and (select private.can_access_classroom(cl.classroom_id)))
  and (select private.has_organization_role(organization_id,
    array['organization_admin','teacher']::public.organization_role[])))
with check (exists (select 1 from public.classroom_learners cl where cl.learner_id=learning_recommendations.learner_id
  and (select private.can_access_classroom(cl.classroom_id)))
  and (select private.has_organization_role(organization_id,
    array['organization_admin','teacher']::public.organization_role[])));

comment on table public.learning_assessments is
  'Structured educational assessment. Misconceptions remain empty unless directly evidenced; no clinical inference.';
comment on table public.learning_twin_reviews is
  'Human decisions are append-only review records; corrections point to new evidence and retain the original.';
comment on table public.agent_interactions is
  'Auditable summaries only. Do not store raw chat transcripts, diagnoses, secrets or unrestricted prompts.';
