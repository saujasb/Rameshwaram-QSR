-- Move the RLS helper functions out of `public` (which PostgREST exposes as
-- /rest/v1/rpc/*) into a non-exposed `private` schema. Policies still call
-- them; they just can't be invoked directly over the API any more.

create schema if not exists private;
revoke all on schema private from public, anon;
grant usage on schema private to authenticated;

create or replace function private.is_active_user()
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.is_active)
$$;

create or replace function private.is_admin()
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.is_active and p.role = 'admin')
$$;

revoke all on function private.is_active_user() from public, anon;
revoke all on function private.is_admin() from public, anon;
grant execute on function private.is_active_user() to authenticated;
grant execute on function private.is_admin() to authenticated;

drop policy if exists "profiles: read own or admin reads all" on public.profiles;
create policy "profiles: read own or admin reads all" on public.profiles for select to authenticated
  using (id = (select auth.uid()) or (select private.is_admin()));

drop policy if exists "provider_orders: active dashboard users read" on public.provider_orders;
create policy "provider_orders: active dashboard users read" on public.provider_orders for select to authenticated
  using ((select private.is_active_user()));

drop function if exists public.is_admin();
drop function if exists public.is_active_user();
drop function if exists public.current_user_role();
