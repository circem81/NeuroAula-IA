-- Prueba de la propuesta supabase/propuestas/20261112_permisos_evaluaciones.sql.
-- Ejecutar SOLO en una base local desechable, después de las tres migraciones y de la
-- propuesta. Usa datos ficticios y termina siempre en rollback: no deja filas.
-- Contra las políticas actuales (sin la propuesta) esta prueba debe fallar.
begin;

-- Datos ficticios compartidos por la prueba y el diagnóstico. Siempre dentro de una transacción con rollback.
insert into auth.users(id) values
  ('a1000000-0000-4000-8000-000000000001'), -- T1 docente asignado al grupo A
  ('a1000000-0000-4000-8000-000000000002'), -- T2 docente del mismo centro, asignado solo al grupo C
  ('a1000000-0000-4000-8000-000000000003'), -- T3 docente de otro centro
  ('a1000000-0000-4000-8000-000000000004'), -- T4 docente asignado al grupo A con membresía no activa
  ('a1000000-0000-4000-8000-000000000005'), -- AD dirección del centro
  ('a1000000-0000-4000-8000-000000000011'), -- S1 alumna del grupo A
  ('a1000000-0000-4000-8000-000000000012'); -- S2 alumno del grupo A
insert into public.organizations(id,name,slug) values
  ('a2000000-0000-4000-8000-000000000001','Centro ficticio A','permisos-test-a'),
  ('a2000000-0000-4000-8000-000000000002','Centro ficticio B','permisos-test-b');
insert into public.organization_memberships(organization_id,user_id,role,status) values
  ('a2000000-0000-4000-8000-000000000001','a1000000-0000-4000-8000-000000000001','teacher','active'),
  ('a2000000-0000-4000-8000-000000000001','a1000000-0000-4000-8000-000000000002','teacher','active'),
  ('a2000000-0000-4000-8000-000000000002','a1000000-0000-4000-8000-000000000003','teacher','active'),
  ('a2000000-0000-4000-8000-000000000001','a1000000-0000-4000-8000-000000000004','teacher','active'),
  ('a2000000-0000-4000-8000-000000000001','a1000000-0000-4000-8000-000000000005','organization_admin','active'),
  ('a2000000-0000-4000-8000-000000000001','a1000000-0000-4000-8000-000000000011','student','active'),
  ('a2000000-0000-4000-8000-000000000001','a1000000-0000-4000-8000-000000000012','student','active');
insert into public.classrooms(id,organization_id,name,academic_year,created_by) values
  ('a3000000-0000-4000-8000-00000000000a','a2000000-0000-4000-8000-000000000001','Grupo A','2026-2027','a1000000-0000-4000-8000-000000000001'),
  ('a3000000-0000-4000-8000-00000000000c','a2000000-0000-4000-8000-000000000001','Grupo C','2026-2027','a1000000-0000-4000-8000-000000000002');
insert into public.classroom_teachers(classroom_id,teacher_id) values
  ('a3000000-0000-4000-8000-00000000000a','a1000000-0000-4000-8000-000000000001'),
  ('a3000000-0000-4000-8000-00000000000a','a1000000-0000-4000-8000-000000000004'),
  ('a3000000-0000-4000-8000-00000000000c','a1000000-0000-4000-8000-000000000002');
insert into public.learners(id,organization_id,user_id,pseudonym) values
  ('a4000000-0000-4000-8000-000000000001','a2000000-0000-4000-8000-000000000001','a1000000-0000-4000-8000-000000000011','Alumna ficticia 1'),
  ('a4000000-0000-4000-8000-000000000002','a2000000-0000-4000-8000-000000000001','a1000000-0000-4000-8000-000000000012','Alumno ficticio 2');
insert into public.classroom_learners(classroom_id,learner_id) values
  ('a3000000-0000-4000-8000-00000000000a','a4000000-0000-4000-8000-000000000001'),
  ('a3000000-0000-4000-8000-00000000000a','a4000000-0000-4000-8000-000000000002');
insert into public.learning_activities(id,organization_id,classroom_id,title,subject,created_by) values
  ('a5000000-0000-4000-8000-000000000001','a2000000-0000-4000-8000-000000000001','a3000000-0000-4000-8000-00000000000a','Ecuaciones','mathematics','a1000000-0000-4000-8000-000000000001');
insert into public.curriculum_elements(id,organization_id,element_type,code,title,stage,course,subject,autonomous_community,source_label,source_version,created_by) values
  ('a6000000-0000-4000-8000-000000000001','a2000000-0000-4000-8000-000000000001','evaluation_criterion','ALG-T','Resolver ecuaciones','ESO','2 ESO','Matemáticas','Canarias','Dato ficticio de prueba','v1','a1000000-0000-4000-8000-000000000001');
insert into public.learning_activity_items(id,organization_id,classroom_id,activity_id,criterion_id,prompt,response_kind,options,position) values
  ('a7000000-0000-4000-8000-000000000001','a2000000-0000-4000-8000-000000000001','a3000000-0000-4000-8000-00000000000a','a5000000-0000-4000-8000-000000000001','a6000000-0000-4000-8000-000000000001','2x + 3 = 11','single_choice','["2","3","4","6"]',1);
insert into public.learning_attempts(id,organization_id,classroom_id,activity_id,learner_id,attempt_number,learning_dimension,response_score_percent,strategy,recorded_by,item_id,response_value,support_level) values
  ('a8000000-0000-4000-8000-000000000001','a2000000-0000-4000-8000-000000000001','a3000000-0000-4000-8000-00000000000a','a5000000-0000-4000-8000-000000000001','a4000000-0000-4000-8000-000000000001',1,'procedural_mastery',100,'Solo respuesta observada','a1000000-0000-4000-8000-000000000001','a7000000-0000-4000-8000-000000000001','4',0),
  ('a8000000-0000-4000-8000-000000000002','a2000000-0000-4000-8000-000000000001','a3000000-0000-4000-8000-00000000000a','a5000000-0000-4000-8000-000000000001','a4000000-0000-4000-8000-000000000002',1,'procedural_mastery',0,'Solo respuesta observada','a1000000-0000-4000-8000-000000000001','a7000000-0000-4000-8000-000000000001','2',0);
insert into public.learning_assessments(id,organization_id,classroom_id,learner_id,activity_id,attempt_id,criterion_id,score_percent,mastery_estimate,evidence_summary,confidence,requires_human_review,recommended_next_action,evaluator_kind,evaluator_version) values
  ('a9000000-0000-4000-8000-000000000001','a2000000-0000-4000-8000-000000000001','a3000000-0000-4000-8000-00000000000a','a4000000-0000-4000-8000-000000000001','a5000000-0000-4000-8000-000000000001','a8000000-0000-4000-8000-000000000001','a6000000-0000-4000-8000-000000000001',100,0.2,'Respuesta correcta; razonamiento no observado.',0.45,true,'Proponer otro ejercicio.','deterministic_rules','mvp-v1'),
  ('a9000000-0000-4000-8000-000000000002','a2000000-0000-4000-8000-000000000001','a3000000-0000-4000-8000-00000000000a','a4000000-0000-4000-8000-000000000002','a5000000-0000-4000-8000-000000000001','a8000000-0000-4000-8000-000000000002','a6000000-0000-4000-8000-000000000001',0,0.05,'Respuesta incorrecta; causa no observada.',0.45,true,'Ofrecer una pista.','deterministic_rules','mvp-v1');
insert into public.learning_twin_criteria values ('a2000000-0000-4000-8000-000000000001','ALG-T','mathematics','Ecuaciones');
insert into public.learning_twin_evidence(id,organization_id,student_id,classroom_id,activity_id,criterion_id,subject,correct,attempts,evaluator_confidence,created_at,recorded_by) values
  ('aa000000-0000-4000-8000-000000000001','a2000000-0000-4000-8000-000000000001','a4000000-0000-4000-8000-000000000001','a3000000-0000-4000-8000-00000000000a','a5000000-0000-4000-8000-000000000001','ALG-T','mathematics',true,1,0.45,'2026-11-01T10:00:00Z','a1000000-0000-4000-8000-000000000001'),
  ('aa000000-0000-4000-8000-000000000002','a2000000-0000-4000-8000-000000000001','a4000000-0000-4000-8000-000000000002','a3000000-0000-4000-8000-00000000000a','a5000000-0000-4000-8000-000000000001','ALG-T','mathematics',false,1,0.45,'2026-11-01T10:00:00Z','a1000000-0000-4000-8000-000000000001');
insert into public.learning_twin_state(organization_id,student_id,criterion_id,mastery_score,confidence_score,trend,evidence_count,last_evidence_at,updated_at,engine_version) values
  ('a2000000-0000-4000-8000-000000000001','a4000000-0000-4000-8000-000000000001','ALG-T',0.1,0.01,'insufficient_evidence',1,'2026-11-01T10:00:00Z','2026-11-01T10:00:00Z','learning-twin-v1'),
  ('a2000000-0000-4000-8000-000000000001','a4000000-0000-4000-8000-000000000002','ALG-T',0.0,0.01,'insufficient_evidence',1,'2026-11-01T10:00:00Z','2026-11-01T10:00:00Z','learning-twin-v1');
insert into public.learning_recommendations(id,organization_id,learner_id,criterion_id,evidence_id,recommendation,proposed_by) values
  ('ab000000-0000-4000-8000-000000000001','a2000000-0000-4000-8000-000000000001','a4000000-0000-4000-8000-000000000001','a6000000-0000-4000-8000-000000000001','aa000000-0000-4000-8000-000000000001','Proponer otro ejercicio.','deterministic_rules'),
  ('ab000000-0000-4000-8000-000000000002','a2000000-0000-4000-8000-000000000001','a4000000-0000-4000-8000-000000000002','a6000000-0000-4000-8000-000000000001','aa000000-0000-4000-8000-000000000002','Ofrecer una pista.','deterministic_rules');
insert into public.learning_twin_reviews(id,organization_id,assessment_id,decision,review_note,reviewed_by) values
  ('ac000000-0000-4000-8000-000000000001','a2000000-0000-4000-8000-000000000001','a9000000-0000-4000-8000-000000000002','approved','Nota docente ficticia','a1000000-0000-4000-8000-000000000001');
-- T4 deja de tener membresía activa pero conserva la fila en classroom_teachers.
update public.organization_memberships set status = 'inactive'
  where user_id = 'a1000000-0000-4000-8000-000000000004';

set local role authenticated;

-- S1: solo lo suyo; ninguna nota de revisión docente ni dato técnico del Twin.
select set_config('request.jwt.claim.sub','a1000000-0000-4000-8000-000000000011',true);
do $$ begin
  if (select count(*) from public.learning_assessments) <> 1
     or exists (select 1 from public.learning_assessments where learner_id <> 'a4000000-0000-4000-8000-000000000001')
    then raise exception 'Una alumna ve evaluaciones ajenas'; end if;
  if (select count(*) from public.learning_recommendations) <> 1
     or exists (select 1 from public.learning_recommendations where learner_id <> 'a4000000-0000-4000-8000-000000000001')
    then raise exception 'Una alumna ve recomendaciones ajenas'; end if;
  if exists (select 1 from public.learning_twin_reviews) then raise exception 'Una alumna lee revisiones docentes'; end if;
  if exists (select 1 from public.learning_twin_evidence) or exists (select 1 from public.learning_twin_state)
    then raise exception 'Una alumna lee datos técnicos del Twin'; end if;
  if exists (select 1 from public.learning_activity_item_keys) then raise exception 'Una alumna ve claves de respuesta'; end if;
  if (select count(*) from public.learning_activity_items) <> 1 then raise exception 'Una alumna no ve la actividad de su grupo'; end if;
end $$;
update public.learning_recommendations set status = 'accepted';
do $$ begin
  if exists (select 1 from public.learning_recommendations where status = 'accepted')
    then raise exception 'Una alumna puede decidir recomendaciones'; end if;
end $$;
do $$ begin
  insert into public.learning_twin_reviews(organization_id,assessment_id,decision,reviewed_by)
    values ('a2000000-0000-4000-8000-000000000001','a9000000-0000-4000-8000-000000000001','approved','a1000000-0000-4000-8000-000000000011');
  raise exception 'Una alumna puede crear revisiones';
exception when insufficient_privilege then null; end $$;

-- S2: lo simétrico.
select set_config('request.jwt.claim.sub','a1000000-0000-4000-8000-000000000012',true);
do $$ begin
  if (select count(*) from public.learning_assessments where learner_id = 'a4000000-0000-4000-8000-000000000002') <> 1
     or (select count(*) from public.learning_assessments) <> 1 then raise exception 'S2 no ve exactamente su evaluación'; end if;
  if (select count(*) from public.learning_recommendations) <> 1 then raise exception 'S2 no ve exactamente su recomendación'; end if;
end $$;

-- T1: docente activo y asignado al grupo A.
select set_config('request.jwt.claim.sub','a1000000-0000-4000-8000-000000000001',true);
do $$ begin
  if (select count(*) from public.learning_assessments) <> 2 then raise exception 'El docente asignado no ve su grupo'; end if;
  if (select count(*) from public.learning_recommendations) <> 2 then raise exception 'El docente asignado no ve las recomendaciones'; end if;
  if (select count(*) from public.learning_twin_reviews) <> 1 then raise exception 'El docente asignado no ve las revisiones'; end if;
  if (select count(*) from public.learning_twin_evidence) <> 2 or (select count(*) from public.learning_twin_state) <> 2
    then raise exception 'El docente asignado no ve el Twin de su grupo'; end if;
end $$;
insert into public.learning_twin_reviews(id,organization_id,assessment_id,decision,reviewed_by) values
  ('ac000000-0000-4000-8000-000000000002','a2000000-0000-4000-8000-000000000001','a9000000-0000-4000-8000-000000000001','approved','a1000000-0000-4000-8000-000000000001');
update public.learning_recommendations set status = 'accepted', decided_by = 'a1000000-0000-4000-8000-000000000001', decided_at = now()
  where id = 'ab000000-0000-4000-8000-000000000001';
do $$ begin
  if (select status from public.learning_recommendations where id = 'ab000000-0000-4000-8000-000000000001') <> 'accepted'
    then raise exception 'El docente asignado no puede decidir recomendaciones'; end if;
end $$;
-- Una revisión no puede guardarse con el identificador de otro centro.
do $$ begin
  insert into public.learning_twin_reviews(organization_id,assessment_id,decision,reviewed_by)
    values ('a2000000-0000-4000-8000-000000000002','a9000000-0000-4000-8000-000000000002','approved','a1000000-0000-4000-8000-000000000001');
  raise exception 'Se acepta una revisión con el centro equivocado';
exception when insufficient_privilege then null; end $$;

-- T2: docente activo del mismo centro, sin asignación al grupo A.
select set_config('request.jwt.claim.sub','a1000000-0000-4000-8000-000000000002',true);
do $$ begin
  if exists (select 1 from public.learning_assessments) or exists (select 1 from public.learning_recommendations)
     or exists (select 1 from public.learning_twin_reviews) then raise exception 'Un docente no asignado ve otro grupo'; end if;
  if exists (select 1 from public.learning_twin_evidence) or exists (select 1 from public.learning_twin_state)
    then raise exception 'Un docente no asignado ve el Twin de otro grupo'; end if;
end $$;
update public.learning_recommendations set status = 'dismissed' where id = 'ab000000-0000-4000-8000-000000000002';
do $$ begin
  insert into public.learning_twin_reviews(organization_id,assessment_id,decision,reviewed_by)
    values ('a2000000-0000-4000-8000-000000000001','a9000000-0000-4000-8000-000000000002','approved','a1000000-0000-4000-8000-000000000002');
  raise exception 'Un docente no asignado puede crear revisiones';
exception when insufficient_privilege then null; end $$;

-- T4: asignado al grupo A, pero con la membresía no activa.
select set_config('request.jwt.claim.sub','a1000000-0000-4000-8000-000000000004',true);
do $$ begin
  if exists (select 1 from public.learning_assessments) or exists (select 1 from public.learning_recommendations)
     or exists (select 1 from public.learning_twin_reviews) or exists (select 1 from public.learning_twin_evidence)
     or exists (select 1 from public.learning_activity_items) or exists (select 1 from public.learning_activity_item_keys)
    then raise exception 'Un docente sin membresía activa conserva acceso'; end if;
end $$;

-- T3: docente de otro centro.
select set_config('request.jwt.claim.sub','a1000000-0000-4000-8000-000000000003',true);
do $$ begin
  if exists (select 1 from public.learning_assessments) or exists (select 1 from public.learning_recommendations)
     or exists (select 1 from public.learning_twin_evidence) then raise exception 'Acceso entre centros'; end if;
end $$;

-- Dirección del centro: comportamiento anterior conservado (ve los grupos, no el Twin).
select set_config('request.jwt.claim.sub','a1000000-0000-4000-8000-000000000005',true);
do $$ begin
  if (select count(*) from public.learning_assessments) <> 2 then raise exception 'La dirección ha perdido la lectura de evaluaciones'; end if;
  if exists (select 1 from public.learning_twin_evidence) then raise exception 'La dirección lee el Twin'; end if;
end $$;
reset role;

-- La decisión de T2 no debe haber tenido efecto.
do $$ begin
  if (select status from public.learning_recommendations where id = 'ab000000-0000-4000-8000-000000000002') <> 'proposed'
    then raise exception 'Un docente no asignado ha decidido una recomendación'; end if;
end $$;

-- Una alumna cuya membresía deja de estar activa pierde también la lectura.
update public.organization_memberships set status = 'inactive' where user_id = 'a1000000-0000-4000-8000-000000000011';
set local role authenticated;
select set_config('request.jwt.claim.sub','a1000000-0000-4000-8000-000000000011',true);
do $$ begin
  if exists (select 1 from public.learning_assessments) or exists (select 1 from public.learning_recommendations)
    then raise exception 'Una alumna sin membresía activa conserva acceso'; end if;
end $$;
reset role;

set local role anon;
do $$ begin
  if has_table_privilege(current_user,'public.learning_assessments','SELECT')
     or has_table_privilege(current_user,'public.learning_recommendations','SELECT')
    then raise exception 'Acceso anónimo'; end if;
end $$;
reset role;
rollback;
