-- Additive v1: the existing learning_evidence score/observation contract is preserved.
create table public.learning_twin_criteria (
  organization_id uuid not null references public.organizations(id),
  id text not null check (length(id) between 1 and 100),
  subject text not null check (length(subject) between 1 and 100),
  label text not null check (length(label) between 1 and 200),
  primary key (organization_id, id),
  unique (organization_id, id, subject)
);

create table public.learning_twin_evidence (
  id uuid primary key,
  organization_id uuid not null,
  student_id uuid not null,
  classroom_id uuid not null,
  activity_id uuid not null,
  criterion_id text not null,
  subject text not null,
  source_evidence_id uuid references public.learning_evidence(id),
  correct boolean not null,
  reasoning_quality double precision check (reasoning_quality between 0 and 1),
  support_level smallint check (support_level between 0 and 5),
  transfer_level smallint check (transfer_level between 0 and 4),
  attempts integer not null check (attempts between 1 and 100),
  error_type text check (length(error_type) between 1 and 100),
  strategies text[] not null default '{}',
  evaluator_confidence double precision not null check (evaluator_confidence between 0 and 1),
  previous_evidence_id uuid,
  created_at timestamptz not null,
  recorded_at timestamptz not null default now(),
  recorded_by uuid not null references auth.users(id),
  check (not correct or error_type is null),
  check (previous_evidence_id is null or previous_evidence_id <> id),
  check (strategies <@ array['UsesDiagram','UsesEquation','TrialAndError','PatternRecognition','VerbalReasoning','AnalogicalReasoning','Recall','AlgorithmicProcedure']::text[]),
  unique (id, organization_id, student_id, criterion_id),
  unique (previous_evidence_id),
  foreign key (student_id, organization_id) references public.learners(id, organization_id),
  foreign key (activity_id, classroom_id, organization_id) references public.learning_activities(id, classroom_id, organization_id),
  foreign key (classroom_id, student_id) references public.classroom_learners(classroom_id, learner_id),
  foreign key (organization_id, criterion_id, subject) references public.learning_twin_criteria(organization_id, id, subject),
  foreign key (previous_evidence_id, organization_id, student_id, criterion_id) references public.learning_twin_evidence(id, organization_id, student_id, criterion_id)
);
create index learning_twin_evidence_scope on public.learning_twin_evidence(organization_id, student_id, criterion_id, created_at, id);

create table public.learning_twin_state (
  organization_id uuid not null,
  student_id uuid not null,
  criterion_id text not null,
  mastery_score double precision not null check (mastery_score between 0 and 1),
  confidence_score double precision not null check (confidence_score between 0 and 1),
  support_level double precision check (support_level between 0 and 5),
  transfer_score double precision check (transfer_score between 0 and 4),
  trend text not null check (trend in ('improving','stable','declining','insufficient_evidence')),
  evidence_count integer not null check (evidence_count > 0),
  last_evidence_at timestamptz not null,
  updated_at timestamptz not null,
  engine_version text not null,
  primary key (organization_id, student_id, criterion_id),
  foreign key (student_id, organization_id) references public.learners(id, organization_id),
  foreign key (organization_id, criterion_id) references public.learning_twin_criteria(organization_id, id)
);
create table public.error_patterns (
  organization_id uuid not null, student_id uuid not null, criterion_id text not null,
  error_type text not null, occurrences integer not null check (occurrences > 0),
  first_seen_at timestamptz not null, last_seen_at timestamptz not null,
  persistence_score double precision not null check (persistence_score between 0 and 1),
  status text not null check (status in ('observed','emerging_pattern','consistent_pattern','requires_human_review')),
  primary key (organization_id, student_id, criterion_id, error_type),
  foreign key (organization_id, student_id, criterion_id) references public.learning_twin_state(organization_id, student_id, criterion_id)
);
create table public.strategy_observations (
  evidence_id uuid not null references public.learning_twin_evidence(id),
  organization_id uuid not null, student_id uuid not null, criterion_id text not null,
  strategy text not null,
  primary key (evidence_id, strategy),
  foreign key (evidence_id, organization_id, student_id, criterion_id) references public.learning_twin_evidence(id, organization_id, student_id, criterion_id)
);
create table public.support_effectiveness (
  organization_id uuid not null, student_id uuid not null, criterion_id text not null,
  support_level smallint not null check (support_level between 1 and 5),
  uses integer not null check (uses > 0), paired_count integer not null check (paired_count between 0 and uses),
  mean_correctness_change double precision check (mean_correctness_change between -1 and 1),
  status text not null check (status in ('observed','emerging_pattern','consistent_pattern','requires_human_review')),
  primary key (organization_id, student_id, criterion_id, support_level),
  foreign key (organization_id, student_id, criterion_id) references public.learning_twin_state(organization_id, student_id, criterion_id)
);
create table public.learning_twin_agent_events (
  evidence_id uuid primary key references public.learning_twin_evidence(id),
  organization_id uuid not null, student_id uuid not null, criterion_id text not null,
  event_type text not null default 'learning_twin_updated' check (event_type = 'learning_twin_updated'),
  engine_version text not null, evidence_count integer not null check (evidence_count > 0),
  created_at timestamptz not null default now(),
  foreign key (evidence_id, organization_id, student_id, criterion_id) references public.learning_twin_evidence(id, organization_id, student_id, criterion_id)
);

-- Browser clients only read within an active teaching membership. No student technical scores.
do $$
declare t text;
begin
  foreach t in array array['learning_twin_criteria','learning_twin_evidence','learning_twin_state','error_patterns','strategy_observations','support_effectiveness','learning_twin_agent_events'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('revoke all on public.%I from public, anon, authenticated', t);
    execute format('grant select on public.%I to authenticated', t);
    execute format('grant all on public.%I to service_role', t);
    execute format('create policy twin_teacher_read on public.%I for select to authenticated using ((select private.has_organization_role(organization_id, array[''teacher'']::public.organization_role[])))', t);
  end loop;
end $$;

create function private.reject_twin_evidence_mutation() returns trigger
language plpgsql set search_path = '' as $$
begin raise exception 'Learning Twin evidence is append-only'; end $$;
revoke all on function private.reject_twin_evidence_mutation() from public, anon, authenticated;
create trigger learning_twin_evidence_immutable before update or delete on public.learning_twin_evidence
for each row execute function private.reject_twin_evidence_mutation();

-- Service-only atomic commit. The TypeScript engine computes the snapshot; the model never writes it.
-- Advisory lock + expected count prevents lost updates across server instances.
create function public.commit_learning_twin_v1(p_evidence jsonb, p_snapshot jsonb, p_expected_count integer)
returns text language plpgsql security invoker set search_path = '' as $$
declare
  e public.learning_twin_evidence;
  s jsonb := p_snapshot->'state';
  n integer;
begin
  e := jsonb_populate_record(null::public.learning_twin_evidence, p_evidence);
  perform pg_advisory_xact_lock(hashtextextended(e.organization_id::text || ':' || e.student_id::text || ':' || e.criterion_id, 0));
  if not exists (select 1 from public.organization_memberships m where m.organization_id=e.organization_id and m.user_id=e.recorded_by and m.status='active' and m.role='teacher') then
    raise exception 'Active teacher membership required' using errcode='42501';
  end if;
  if exists (select 1 from public.learning_twin_evidence x where x.id=e.id) then
    if exists (select 1 from public.learning_twin_evidence x where x.id=e.id and (to_jsonb(x)-'recorded_at') = (to_jsonb(e)-'recorded_at')) then return 'duplicate'; end if;
    raise exception 'Evidence is immutable';
  end if;
  select count(*) into n from public.learning_twin_evidence x where x.organization_id=e.organization_id and x.student_id=e.student_id and x.criterion_id=e.criterion_id;
  if n <> p_expected_count then return 'conflict'; end if;
  if (s->>'organizationId')::uuid is distinct from e.organization_id or (s->>'studentId')::uuid is distinct from e.student_id or s->>'criterionId' is distinct from e.criterion_id or (s->>'evidenceCount')::integer is distinct from n+1 then raise exception 'Snapshot scope mismatch'; end if;
  if e.source_evidence_id is not null and not exists (select 1 from public.learning_evidence x where x.id=e.source_evidence_id and x.organization_id=e.organization_id and x.learner_id=e.student_id and x.activity_id=e.activity_id) then raise exception 'Source evidence scope mismatch'; end if;
  if e.created_at > now() + interval '5 seconds' then raise exception 'Future evidence'; end if;
  if e.previous_evidence_id is not null and not exists (select 1 from public.learning_twin_evidence x where x.id=e.previous_evidence_id and x.activity_id=e.activity_id and x.attempts+1=e.attempts and x.created_at<e.created_at) then raise exception 'Invalid evidence pair'; end if;
  insert into public.learning_twin_evidence select (jsonb_populate_record(null::public.learning_twin_evidence, p_evidence || jsonb_build_object('recorded_at', now()))).*;
  insert into public.learning_twin_state values (e.organization_id,e.student_id,e.criterion_id,(s->>'mastery')::float8,(s->>'confidence')::float8,(s->>'supportLevel')::float8,(s->>'transferLevel')::float8,s->>'trend',(s->>'evidenceCount')::integer,(s->>'lastEvidenceAt')::timestamptz,(s->>'updatedAt')::timestamptz,s->>'engineVersion')
  on conflict (organization_id,student_id,criterion_id) do update set mastery_score=excluded.mastery_score,confidence_score=excluded.confidence_score,support_level=excluded.support_level,transfer_score=excluded.transfer_score,trend=excluded.trend,evidence_count=excluded.evidence_count,last_evidence_at=excluded.last_evidence_at,updated_at=excluded.updated_at,engine_version=excluded.engine_version;
  delete from public.error_patterns x where x.organization_id=e.organization_id and x.student_id=e.student_id and x.criterion_id=e.criterion_id;
  insert into public.error_patterns select e.organization_id,e.student_id,e.criterion_id,x."errorType",x.occurrences,x."firstSeenAt",x."lastSeenAt",x."persistenceScore",x.status from jsonb_to_recordset(p_snapshot->'errorPatterns') as x("errorType" text,occurrences integer,"firstSeenAt" timestamptz,"lastSeenAt" timestamptz,"persistenceScore" float8,status text);
  delete from public.support_effectiveness x where x.organization_id=e.organization_id and x.student_id=e.student_id and x.criterion_id=e.criterion_id;
  insert into public.support_effectiveness select e.organization_id,e.student_id,e.criterion_id,x."supportLevel",x.uses,x."pairedCount",x."meanCorrectnessChange",x.status from jsonb_to_recordset(p_snapshot->'supportEffectiveness') as x("supportLevel" smallint,uses integer,"pairedCount" integer,"meanCorrectnessChange" float8,status text);
  insert into public.strategy_observations select e.id,e.organization_id,e.student_id,e.criterion_id,unnest(e.strategies);
  insert into public.learning_twin_agent_events(evidence_id,organization_id,student_id,criterion_id,engine_version,evidence_count) values(e.id,e.organization_id,e.student_id,e.criterion_id,s->>'engineVersion',n+1);
  return 'inserted';
end $$;
revoke all on function public.commit_learning_twin_v1(jsonb,jsonb,integer) from public, anon, authenticated;
grant execute on function public.commit_learning_twin_v1(jsonb,jsonb,integer) to service_role;
comment on table public.learning_twin_state is 'Internal estimates, not percentages of knowledge or permanent learner traits. Recompute confidence at read time.';
comment on table public.support_effectiveness is 'Observed paired change in correctness, not causal effectiveness.';
