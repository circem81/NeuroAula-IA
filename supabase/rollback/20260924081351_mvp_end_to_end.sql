-- Manual rollback for 20260924081351_mvp_end_to_end.sql.
-- Review data retention/export requirements before running in any shared environment.
drop policy if exists "assigned teachers decide recommendations" on public.learning_recommendations;
drop policy if exists "classroom users read recommendations" on public.learning_recommendations;
drop policy if exists "assigned staff read agent audit" on public.agent_interactions;
drop policy if exists "assigned teachers create Twin reviews" on public.learning_twin_reviews;
drop policy if exists "assigned staff read Twin reviews" on public.learning_twin_reviews;
drop policy if exists "classroom users read assessments" on public.learning_assessments;
drop policy if exists "assigned staff manage answer keys" on public.learning_activity_item_keys;
drop policy if exists "assigned staff read answer keys" on public.learning_activity_item_keys;
drop policy if exists "assigned staff manage activity items" on public.learning_activity_items;
drop policy if exists "classroom members read activity items" on public.learning_activity_items;
drop policy if exists "staff manage curriculum" on public.curriculum_elements;
drop policy if exists "authorized staff read curriculum" on public.curriculum_elements;
drop policy if exists "admins manage teacher assignments" on public.classroom_teachers;
drop policy if exists "classroom members read teacher assignments" on public.classroom_teachers;
drop function if exists private.can_access_classroom(uuid);
alter table public.learning_twin_agent_events drop column if exists reason,
  drop column if exists new_state, drop column if exists previous_state;
drop table if exists public.learning_recommendations;
drop table if exists public.agent_interactions;
drop table if exists public.learning_twin_reviews;
drop table if exists public.learning_assessments;
alter table public.learning_attempts drop column if exists duration_ms,
  drop column if exists support_level, drop column if exists response_value,
  drop column if exists item_id;
drop table if exists public.learning_activity_item_keys;
drop table if exists public.learning_activity_items;
drop table if exists public.curriculum_elements;
drop table if exists public.classroom_teachers;
