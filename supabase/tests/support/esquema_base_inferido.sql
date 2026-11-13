-- SOLO PARA PRUEBAS LOCALES. NO ES UNA MIGRACIÓN Y NO DEBE APLICARSE A SUPABASE.
--
-- Las migraciones del repositorio usan tablas que ninguna migración crea. Este
-- archivo reconstruye el mínimo necesario para ejecutar las migraciones y las
-- pruebas en un PostgreSQL local desechable. Las columnas se han INFERIDO de las
-- migraciones, de supabase/tests/*.sql y de src/lib; no proceden del esquema real
-- y pueden diferir de él (tipos, restricciones, políticas y columnas adicionales).
-- Sustituir por un volcado real (`supabase db dump --schema-only`) cuando exista.

-- Entorno que Supabase proporciona de serie.
do $$ begin
  if not exists (select 1 from pg_roles where rolname = 'anon') then create role anon nologin; end if;
  if not exists (select 1 from pg_roles where rolname = 'authenticated') then create role authenticated nologin; end if;
  if not exists (select 1 from pg_roles where rolname = 'service_role') then create role service_role nologin bypassrls; end if;
end $$;
create schema if not exists auth;
create schema if not exists extensions;
create table auth.users (id uuid primary key);
create function auth.uid() returns uuid language sql stable as
  $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
create function extensions.gen_random_uuid() returns uuid language sql volatile as
  $$ select pg_catalog.gen_random_uuid() $$;
grant usage on schema public, auth, extensions to anon, authenticated, service_role;
grant execute on function auth.uid() to anon, authenticated, service_role;
grant select on auth.users to service_role;

-- Tablas base inferidas.
create type public.organization_role as enum
  ('organization_admin', 'teacher', 'pt', 'orientation', 'student');

create table public.organizations (
  id uuid primary key default extensions.gen_random_uuid(),
  name text not null,
  slug text not null unique
);
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text
);
create table public.organization_memberships (
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.organization_role not null,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  primary key (organization_id, user_id)
);
create table public.classrooms (
  id uuid primary key default extensions.gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  academic_year text not null,
  created_by uuid not null references auth.users(id)
);
create table public.learners (
  id uuid primary key default extensions.gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid references auth.users(id),
  pseudonym text not null,
  unique (id, organization_id)
);
create table public.classroom_learners (
  classroom_id uuid not null references public.classrooms(id) on delete cascade,
  learner_id uuid not null references public.learners(id) on delete cascade,
  primary key (classroom_id, learner_id)
);
create table public.learning_activities (
  id uuid primary key default extensions.gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  classroom_id uuid not null references public.classrooms(id) on delete cascade,
  title text not null,
  subject text not null,
  created_by uuid not null references auth.users(id),
  unique (id, classroom_id, organization_id)
);
create table public.learning_attempts (
  id uuid primary key default extensions.gen_random_uuid(),
  organization_id uuid not null,
  classroom_id uuid not null,
  activity_id uuid not null,
  learner_id uuid not null,
  attempt_number integer not null,
  learning_dimension text,
  response_score_percent smallint,
  strategy text,
  recorded_by uuid references auth.users(id),
  unique (id, organization_id, learner_id)
);
create table public.learning_evidence (
  id uuid primary key default extensions.gen_random_uuid(),
  organization_id uuid not null,
  learner_id uuid not null,
  activity_id uuid not null
);
-- Las políticas reales de estas tablas se desconocen. Para las pruebas basta con
-- lectura abierta a usuarios autenticados; NO refleja la seguridad real.
grant select on public.classrooms, public.learners, public.classroom_learners,
  public.learning_activities, public.learning_attempts, public.learning_evidence
  to authenticated;
grant all on all tables in schema public to service_role;
