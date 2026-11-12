-- Run after 20260924081351_mvp_end_to_end.sql. Fixtures always roll back.
begin;

insert into auth.users(id) values
  ('e1000000-0000-4000-8000-000000000001'),
  ('e1000000-0000-4000-8000-000000000002'),
  ('e1000000-0000-4000-8000-000000000003');
insert into public.organizations(id,name,slug) values
  ('e2000000-0000-4000-8000-000000000001','MVP test A','mvp-e2e-test-a'),
  ('e2000000-0000-4000-8000-000000000002','MVP test B','mvp-e2e-test-b');
insert into public.organization_memberships(organization_id,user_id,role,status) values
  ('e2000000-0000-4000-8000-000000000001','e1000000-0000-4000-8000-000000000001','teacher','active'),
  ('e2000000-0000-4000-8000-000000000001','e1000000-0000-4000-8000-000000000003','student','active'),
  ('e2000000-0000-4000-8000-000000000002','e1000000-0000-4000-8000-000000000002','teacher','active');
insert into public.classrooms(id,organization_id,name,academic_year,created_by) values
  ('e3000000-0000-4000-8000-000000000001','e2000000-0000-4000-8000-000000000001','Class A','2026-2027','e1000000-0000-4000-8000-000000000001'),
  ('e3000000-0000-4000-8000-000000000002','e2000000-0000-4000-8000-000000000002','Class B','2026-2027','e1000000-0000-4000-8000-000000000002');
insert into public.classroom_teachers(classroom_id,teacher_id) values
  ('e3000000-0000-4000-8000-000000000001','e1000000-0000-4000-8000-000000000001'),
  ('e3000000-0000-4000-8000-000000000002','e1000000-0000-4000-8000-000000000002');
insert into public.learners(id,organization_id,user_id,pseudonym) values
  ('e4000000-0000-4000-8000-000000000001','e2000000-0000-4000-8000-000000000001','e1000000-0000-4000-8000-000000000003','Learner A');
insert into public.classroom_learners(classroom_id,learner_id) values
  ('e3000000-0000-4000-8000-000000000001','e4000000-0000-4000-8000-000000000001');
insert into public.learning_activities(id,organization_id,classroom_id,title,subject,created_by) values
  ('e5000000-0000-4000-8000-000000000001','e2000000-0000-4000-8000-000000000001','e3000000-0000-4000-8000-000000000001','Equations A','mathematics','e1000000-0000-4000-8000-000000000001'),
  ('e5000000-0000-4000-8000-000000000002','e2000000-0000-4000-8000-000000000002','e3000000-0000-4000-8000-000000000002','Equations B','mathematics','e1000000-0000-4000-8000-000000000002');
insert into public.curriculum_elements(id,organization_id,element_type,code,title,stage,course,subject,autonomous_community,source_label,source_version,created_by) values
  ('e6000000-0000-4000-8000-000000000001','e2000000-0000-4000-8000-000000000001','evaluation_criterion','ALG-A','Solve equations','ESO','2 ESO','Matemáticas','Canarias','Synthetic fixture','v1','e1000000-0000-4000-8000-000000000001'),
  ('e6000000-0000-4000-8000-000000000002','e2000000-0000-4000-8000-000000000002','evaluation_criterion','ALG-B','Solve equations','ESO','2 ESO','Matemáticas','Canarias','Synthetic fixture','v1','e1000000-0000-4000-8000-000000000002');
insert into public.learning_activity_items(id,organization_id,classroom_id,activity_id,criterion_id,prompt,response_kind,options,position) values
  ('e7000000-0000-4000-8000-000000000001','e2000000-0000-4000-8000-000000000001','e3000000-0000-4000-8000-000000000001','e5000000-0000-4000-8000-000000000001','e6000000-0000-4000-8000-000000000001','2x + 3 = 11','single_choice','["2","3","4","6"]',1),
  ('e7000000-0000-4000-8000-000000000002','e2000000-0000-4000-8000-000000000002','e3000000-0000-4000-8000-000000000002','e5000000-0000-4000-8000-000000000002','e6000000-0000-4000-8000-000000000002','x + 1 = 3','single_choice','["1","2"]',1);
insert into public.learning_activity_item_keys(item_id,organization_id,answer_key,rubric) values
  ('e7000000-0000-4000-8000-000000000001','e2000000-0000-4000-8000-000000000001','"4"','{}'),
  ('e7000000-0000-4000-8000-000000000002','e2000000-0000-4000-8000-000000000002','"2"','{}');
insert into public.learning_attempts(id,organization_id,classroom_id,activity_id,learner_id,attempt_number,learning_dimension,response_score_percent,strategy,recorded_by,item_id,response_value,support_level) values
  ('e8000000-0000-4000-8000-000000000001','e2000000-0000-4000-8000-000000000001','e3000000-0000-4000-8000-000000000001','e5000000-0000-4000-8000-000000000001','e4000000-0000-4000-8000-000000000001',1,'procedural_mastery',100,'Observed answer only','e1000000-0000-4000-8000-000000000001','e7000000-0000-4000-8000-000000000001','4',0);
insert into public.learning_assessments(id,organization_id,classroom_id,learner_id,activity_id,attempt_id,criterion_id,score_percent,mastery_estimate,evidence_summary,confidence,requires_human_review,recommended_next_action,evaluator_kind,evaluator_version) values
  ('e9000000-0000-4000-8000-000000000001','e2000000-0000-4000-8000-000000000001','e3000000-0000-4000-8000-000000000001','e4000000-0000-4000-8000-000000000001','e5000000-0000-4000-8000-000000000001','e8000000-0000-4000-8000-000000000001','e6000000-0000-4000-8000-000000000001',100,0.2,'Correct answer; reasoning unobserved.',0.45,true,'Request another independent item.','deterministic_rules','mvp-v1');
insert into public.agent_interactions(id,organization_id,classroom_id,learner_id,activity_id,attempt_id,agent,input_summary,output_summary,confidence,created_by) values
  ('ea000000-0000-4000-8000-000000000001','e2000000-0000-4000-8000-000000000001','e3000000-0000-4000-8000-000000000001','e4000000-0000-4000-8000-000000000001','e5000000-0000-4000-8000-000000000001','e8000000-0000-4000-8000-000000000001','evaluation','{"answer":"4"}','{"score":100}',0.45,'e1000000-0000-4000-8000-000000000001');

set local role authenticated;
select set_config('request.jwt.claim.sub','e1000000-0000-4000-8000-000000000001',true);
do $$ begin
  if (select count(*) from public.learning_activity_items) <> 1 then raise exception 'Teacher classroom scope failed'; end if;
  if (select count(*) from public.learning_activity_item_keys) <> 1 then raise exception 'Teacher answer-key access failed'; end if;
  if (select count(*) from public.learning_assessments) <> 1 then raise exception 'Teacher assessment access failed'; end if;
  if (select count(*) from public.agent_interactions) <> 1 then raise exception 'Teacher audit access failed'; end if;
  if has_table_privilege(current_user,'public.learning_assessments','INSERT') then raise exception 'Browser can forge assessment'; end if;
  if has_table_privilege(current_user,'public.agent_interactions','INSERT') then raise exception 'Browser can forge audit'; end if;
end $$;
insert into public.learning_twin_reviews(id,organization_id,assessment_id,decision,review_note,reviewed_by) values
  ('eb000000-0000-4000-8000-000000000001','e2000000-0000-4000-8000-000000000001','e9000000-0000-4000-8000-000000000001','approved','Checked by teacher','e1000000-0000-4000-8000-000000000001');
do $$ begin
  if (select count(*) from public.learning_twin_reviews) <> 1 then raise exception 'Teacher review was not visible'; end if;
  if has_table_privilege(current_user,'public.learning_twin_reviews','UPDATE') then raise exception 'Reviews are not append-only'; end if;
end $$;

select set_config('request.jwt.claim.sub','e1000000-0000-4000-8000-000000000003',true);
do $$ begin
  if (select count(*) from public.learning_activity_items) <> 1 then raise exception 'Learner cannot read assigned activity'; end if;
  if exists(select 1 from public.learning_activity_item_keys) then raise exception 'Learner can see answer key'; end if;
  if (select count(*) from public.learning_assessments) <> 1 then raise exception 'Learner cannot read own assessment'; end if;
  if exists(select 1 from public.agent_interactions) then raise exception 'Learner can see agent audit'; end if;
end $$;

select set_config('request.jwt.claim.sub','e1000000-0000-4000-8000-000000000002',true);
do $$ begin
  if exists(select 1 from public.learning_assessments) then raise exception 'Cross-organization assessment access'; end if;
  if exists(select 1 from public.agent_interactions) then raise exception 'Cross-organization audit access'; end if;
end $$;
reset role;

set local role anon;
do $$ begin
  if has_table_privilege(current_user,'public.learning_assessments','SELECT') then raise exception 'Anonymous assessment access'; end if;
  if has_table_privilege(current_user,'public.learning_activity_item_keys','SELECT') then raise exception 'Anonymous answer-key access'; end if;
end $$;
reset role;
rollback;
