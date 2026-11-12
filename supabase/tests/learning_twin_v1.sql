-- Run after the migration inside a transaction; fixtures always roll back.
begin;
insert into auth.users(id) values ('fa000000-0000-4000-8000-000000000001'), ('fa000000-0000-4000-8000-000000000002');
insert into public.organizations(id,name,slug) values ('fb000000-0000-4000-8000-000000000001','Twin test A','twin-test-a'),('fb000000-0000-4000-8000-000000000002','Twin test B','twin-test-b');
insert into public.organization_memberships(organization_id,user_id,role,status) values ('fb000000-0000-4000-8000-000000000001','fa000000-0000-4000-8000-000000000001','teacher','active'),('fb000000-0000-4000-8000-000000000002','fa000000-0000-4000-8000-000000000002','teacher','active');
insert into public.classrooms(id,organization_id,name,academic_year,created_by) values ('fc000000-0000-4000-8000-000000000001','fb000000-0000-4000-8000-000000000001','Test','2026-2027','fa000000-0000-4000-8000-000000000001');
insert into public.learners(id,organization_id,pseudonym) values ('fd000000-0000-4000-8000-000000000001','fb000000-0000-4000-8000-000000000001','Test learner');
insert into public.classroom_learners(classroom_id,learner_id) values ('fc000000-0000-4000-8000-000000000001','fd000000-0000-4000-8000-000000000001');
insert into public.learning_activities(id,organization_id,classroom_id,title,subject,created_by) values ('fe000000-0000-4000-8000-000000000001','fb000000-0000-4000-8000-000000000001','fc000000-0000-4000-8000-000000000001','Test activity','mathematics','fa000000-0000-4000-8000-000000000001');
insert into public.learning_twin_criteria values ('fb000000-0000-4000-8000-000000000001','ALG-01','mathematics','Equations');

set local role service_role;
do $$
declare
  e jsonb := '{"id":"ff000000-0000-4000-8000-000000000001","organization_id":"fb000000-0000-4000-8000-000000000001","student_id":"fd000000-0000-4000-8000-000000000001","classroom_id":"fc000000-0000-4000-8000-000000000001","activity_id":"fe000000-0000-4000-8000-000000000001","criterion_id":"ALG-01","subject":"mathematics","correct":true,"reasoning_quality":1,"support_level":0,"transfer_level":0,"attempts":1,"error_type":null,"strategies":[],"evaluator_confidence":1,"previous_evidence_id":null,"created_at":"2026-09-01T10:00:00.000Z","recorded_by":"fa000000-0000-4000-8000-000000000001"}';
  s jsonb := '{"state":{"organizationId":"fb000000-0000-4000-8000-000000000001","studentId":"fd000000-0000-4000-8000-000000000001","criterionId":"ALG-01","mastery":0.2125,"confidence":0.036875,"supportLevel":0,"transferLevel":0,"trend":"insufficient_evidence","evidenceCount":1,"lastEvidenceAt":"2026-09-01T10:00:00.000Z","updatedAt":"2026-09-01T10:00:00.000Z","engineVersion":"learning-twin-v1"},"errorPatterns":[],"supportEffectiveness":[]}';
begin
  if public.commit_learning_twin_v1(e,s,0) <> 'inserted' then raise exception 'Insert failed'; end if;
  if public.commit_learning_twin_v1(e,s,0) <> 'duplicate' then raise exception 'Retry not idempotent'; end if;
  if public.commit_learning_twin_v1(e || '{"id":"ff000000-0000-4000-8000-000000000002"}',s,0) <> 'conflict' then raise exception 'Lost update protection failed'; end if;
  begin
    perform public.commit_learning_twin_v1(e || '{"correct":false}',s,1);
    raise exception 'Changed evidence accepted';
  exception when raise_exception then if sqlerrm <> 'Evidence is immutable' then raise; end if; end;
  begin
    update public.learning_twin_evidence set correct=false;
    raise exception 'Mutation accepted';
  exception when raise_exception then if sqlerrm <> 'Learning Twin evidence is append-only' then raise; end if; end;
  if (select count(*) from public.learning_twin_agent_events where evidence_id=(e->>'id')::uuid) <> 1 then raise exception 'Audit count failed'; end if;
  if (select evidence_count from public.learning_twin_state where organization_id=(e->>'organization_id')::uuid) <> 1 then raise exception 'State count failed'; end if;
  -- Deliberately fail late in the transaction; evidence/state/audit must all roll back.
  begin
    perform public.commit_learning_twin_v1(e || '{"id":"ff000000-0000-4000-8000-000000000002"}',jsonb_set(jsonb_set(s,'{state,evidenceCount}','2'),'{supportEffectiveness}','[{"supportLevel":9,"uses":1,"pairedCount":0,"meanCorrectnessChange":null,"status":"observed"}]'),1);
    raise exception 'Invalid snapshot accepted';
  exception when check_violation then null; end;
  if exists(select 1 from public.learning_twin_evidence where id='ff000000-0000-4000-8000-000000000002') then raise exception 'Partial transaction persisted'; end if;
end $$;
reset role;

set local role authenticated;
select set_config('request.jwt.claim.sub','fa000000-0000-4000-8000-000000000001',true);
do $$ begin
  if (select count(*) from public.learning_twin_evidence) <> 1 then raise exception 'Teacher cannot read own organization'; end if;
  if has_function_privilege(current_user,'public.commit_learning_twin_v1(jsonb,jsonb,integer)','EXECUTE') then raise exception 'Browser can forge state'; end if;
  if has_table_privilege(current_user,'public.learning_twin_evidence','INSERT') then raise exception 'Browser can forge evidence'; end if;
end $$;
select set_config('request.jwt.claim.sub','fa000000-0000-4000-8000-000000000002',true);
do $$ begin
  if exists(select 1 from public.learning_twin_evidence) or exists(select 1 from public.learning_twin_state) then raise exception 'Cross organization access'; end if;
end $$;
reset role;
update public.organization_memberships set role='student' where user_id='fa000000-0000-4000-8000-000000000001';
set local role authenticated;
select set_config('request.jwt.claim.sub','fa000000-0000-4000-8000-000000000001',true);
do $$ begin if exists(select 1 from public.learning_twin_state) then raise exception 'Student sees technical state'; end if; end $$;
reset role;
set local role anon;
do $$ begin
  if has_table_privilege(current_user,'public.learning_twin_evidence','SELECT') or has_function_privilege(current_user,'public.commit_learning_twin_v1(jsonb,jsonb,integer)','EXECUTE') then raise exception 'Anonymous access'; end if;
end $$;
reset role;
rollback;
