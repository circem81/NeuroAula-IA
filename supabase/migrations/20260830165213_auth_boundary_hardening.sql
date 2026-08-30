-- Authentication boundary hardening for the browser/SSR application.
-- These policies keep PostgreSQL RLS as the authority; route guards are UX only.

alter table public.organizations enable row level security;
alter table public.profiles enable row level security;
alter table public.organization_memberships enable row level security;

create schema if not exists private;
revoke all on schema private from public, anon;
grant usage on schema private to authenticated;

create or replace function private.is_active_organization_member(target_organization_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.organization_memberships as membership
    where membership.organization_id = target_organization_id
      and membership.user_id = (select auth.uid())
      and membership.status = 'active'
  );
$$;

create or replace function private.has_organization_role(
  target_organization_id uuid,
  allowed_roles public.organization_role[]
)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.organization_memberships as membership
    where membership.organization_id = target_organization_id
      and membership.user_id = (select auth.uid())
      and membership.status = 'active'
      and membership.role = any(allowed_roles)
  );
$$;

revoke all on function private.is_active_organization_member(uuid) from public, anon;
revoke all on function private.has_organization_role(uuid, public.organization_role[]) from public, anon;
grant execute on function private.is_active_organization_member(uuid) to authenticated;
grant execute on function private.has_organization_role(uuid, public.organization_role[]) to authenticated;

revoke all on public.organizations from anon;
revoke all on public.profiles from anon;
revoke all on public.organization_memberships from anon;
grant select, update on public.organizations to authenticated;
grant select, insert, update on public.profiles to authenticated;
grant select, insert, update, delete on public.organization_memberships to authenticated;

drop policy if exists "users read own profile" on public.profiles;
create policy "users read own profile"
on public.profiles for select to authenticated
using ((select auth.uid()) = id);

drop policy if exists "users create own profile" on public.profiles;
create policy "users create own profile"
on public.profiles for insert to authenticated
with check ((select auth.uid()) = id);

drop policy if exists "users update own profile" on public.profiles;
create policy "users update own profile"
on public.profiles for update to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

drop policy if exists "members read organizations" on public.organizations;
create policy "members read organizations"
on public.organizations for select to authenticated
using ((select private.is_active_organization_member(id)));

drop policy if exists "admins update organizations" on public.organizations;
create policy "admins update organizations"
on public.organizations for update to authenticated
using ((select private.has_organization_role(id, array['organization_admin']::public.organization_role[])))
with check ((select private.has_organization_role(id, array['organization_admin']::public.organization_role[])));

drop policy if exists "members read memberships" on public.organization_memberships;
create policy "members read memberships"
on public.organization_memberships for select to authenticated
using ((select private.is_active_organization_member(organization_id)));

drop policy if exists "admins create memberships" on public.organization_memberships;
create policy "admins create memberships"
on public.organization_memberships for insert to authenticated
with check (
  (select private.has_organization_role(
    organization_id,
    array['organization_admin']::public.organization_role[]
  ))
);

drop policy if exists "admins update memberships" on public.organization_memberships;
create policy "admins update memberships"
on public.organization_memberships for update to authenticated
using (
  (select private.has_organization_role(
    organization_id,
    array['organization_admin']::public.organization_role[]
  ))
)
with check (
  (select private.has_organization_role(
    organization_id,
    array['organization_admin']::public.organization_role[]
  ))
);

drop policy if exists "admins delete memberships" on public.organization_memberships;
create policy "admins delete memberships"
on public.organization_memberships for delete to authenticated
using (
  (select private.has_organization_role(
    organization_id,
    array['organization_admin']::public.organization_role[]
  ))
);
