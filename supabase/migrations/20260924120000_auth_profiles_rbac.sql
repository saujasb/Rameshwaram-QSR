-- Authentication, RBAC and user-management foundation.
--
-- Additive only: no existing table is dropped or altered in shape, and no
-- order/sales data is touched. Credentials live in Supabase Auth (auth.users);
-- this layer only references them.
--
-- Access model:
--   * The Express API (server/) talks to Postgres as the owner role via
--     SUPABASE_DB_URL and to Supabase with the service-role key. Both bypass
--     RLS, and the API enforces authentication + role permissions itself
--     (server/src/auth/).
--   * The browser only ever holds the publishable (anon) key. After this
--     migration the anon role can read nothing, and an authenticated JWT can
--     read only what the policies below allow -- and only while the user has
--     an active profile.

-- ---------------------------------------------------------------------------
-- profiles: one row per dashboard user, 1:1 with auth.users
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text not null,
  full_name text not null default '',
  email text,
  phone text,
  role text not null default 'viewer' check (role in ('admin', 'manager', 'staff', 'viewer')),
  is_active boolean not null default false,
  must_change_password boolean not null default false,
  last_login_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users (id) on delete set null,
  updated_by uuid references auth.users (id) on delete set null,
  constraint profiles_username_format check (username ~ '^[a-z0-9][a-z0-9._-]{2,31}$'),
  constraint profiles_email_format check (email is null or email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  constraint profiles_phone_format check (phone is null or phone ~ '^\+[1-9][0-9]{7,14}$')
);

create unique index if not exists profiles_username_key on public.profiles (lower(username));
create unique index if not exists profiles_email_key on public.profiles (lower(email)) where email is not null;
create unique index if not exists profiles_phone_key on public.profiles (phone) where phone is not null;

comment on table public.profiles is
  'Dashboard user profile + role. Credentials are in auth.users; never store passwords here.';

-- Keep updated_at honest regardless of which code path writes the row.
create or replace function public.profiles_touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists profiles_touch_updated_at on public.profiles;
create trigger profiles_touch_updated_at
  before update on public.profiles
  for each row execute function public.profiles_touch_updated_at();

-- Any auth user created outside the dashboard's User Management API (e.g. a
-- public sign-up, or a user added from the Supabase dashboard) gets an
-- INACTIVE viewer profile, so it can reach no data until an admin activates
-- it. The API creates the profile itself first, so this is a no-op there.
create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  base text;
  candidate text;
  n int := 0;
begin
  base := lower(regexp_replace(coalesce(split_part(new.email, '@', 1), ''), '[^a-z0-9._-]', '', 'gi'));
  if length(base) < 3 then
    base := 'user' || substr(replace(new.id::text, '-', ''), 1, 8);
  end if;
  base := substr(base, 1, 28);
  candidate := base;
  while exists (select 1 from public.profiles where lower(username) = candidate) loop
    n := n + 1;
    candidate := base || n::text;
  end loop;

  insert into public.profiles (id, username, email, role, is_active)
  values (new.id, candidate, null, 'viewer', false)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_auth_user();

-- ---------------------------------------------------------------------------
-- Helper predicates for RLS. SECURITY DEFINER so they can read profiles
-- without recursing through profiles' own policies.
-- ---------------------------------------------------------------------------
create or replace function public.current_user_role()
returns text
language sql
stable
security definer
set search_path = ''
as $$
  select p.role from public.profiles p
  where p.id = (select auth.uid()) and p.is_active
$$;

create or replace function public.is_active_user()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.is_active)
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(public.current_user_role() = 'admin', false)
$$;

revoke all on function public.current_user_role() from public, anon;
revoke all on function public.is_active_user() from public, anon;
revoke all on function public.is_admin() from public, anon;
revoke all on function public.handle_new_auth_user() from public, anon, authenticated;
grant execute on function public.current_user_role() to authenticated;
grant execute on function public.is_active_user() to authenticated;
grant execute on function public.is_admin() to authenticated;

alter table public.profiles enable row level security;

-- Read: yourself, or everyone if you are an active admin. No insert/update/
-- delete policies at all: every profile mutation goes through the API, which
-- checks the caller's role server-side. A user therefore cannot change their
-- own role/is_active even with a valid JWT and the publishable key.
drop policy if exists "profiles: read own or admin reads all" on public.profiles;
create policy "profiles: read own or admin reads all"
  on public.profiles for select
  to authenticated
  using (id = (select auth.uid()) or (select public.is_admin()));

revoke all on public.profiles from anon, authenticated;
grant select on public.profiles to authenticated;

-- ---------------------------------------------------------------------------
-- user_audit_log: who changed which user/role, and when
-- ---------------------------------------------------------------------------
create table if not exists public.user_audit_log (
  id bigint generated always as identity primary key,
  actor_id uuid references auth.users (id) on delete set null,
  target_id uuid references auth.users (id) on delete set null,
  action text not null,
  changes jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists user_audit_log_target_idx on public.user_audit_log (target_id, created_at desc);
create index if not exists user_audit_log_actor_idx on public.user_audit_log (actor_id);
alter table public.user_audit_log enable row level security;
revoke all on public.user_audit_log from anon, authenticated;

-- ---------------------------------------------------------------------------
-- auth_login_attempts: brute-force throttling for username/password login.
-- Shared across serverless instances (an in-memory counter would not be).
-- ---------------------------------------------------------------------------
create table if not exists public.auth_login_attempts (
  id bigint generated always as identity primary key,
  username_key text not null,
  ip text,
  success boolean not null,
  created_at timestamptz not null default now()
);
create index if not exists auth_login_attempts_user_idx on public.auth_login_attempts (username_key, created_at desc);
create index if not exists auth_login_attempts_ip_idx on public.auth_login_attempts (ip, created_at desc);
alter table public.auth_login_attempts enable row level security;
revoke all on public.auth_login_attempts from anon, authenticated;

-- ---------------------------------------------------------------------------
-- summary_delivery_log: future "Summarize Data" deliveries (email/WhatsApp),
-- tied to the authenticated requester.
-- ---------------------------------------------------------------------------
create table if not exists public.summary_delivery_log (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users (id) on delete set null,
  channel text not null check (channel in ('email', 'whatsapp')),
  destination_masked text,
  scope jsonb not null default '{}'::jsonb,
  status text not null check (status in ('sent', 'not_configured', 'no_destination', 'failed')),
  error text,
  created_at timestamptz not null default now()
);
create index if not exists summary_delivery_log_user_idx on public.summary_delivery_log (user_id, created_at desc);
alter table public.summary_delivery_log enable row level security;
revoke all on public.summary_delivery_log from anon, authenticated;

-- ---------------------------------------------------------------------------
-- Close the existing public read path on live order data.
--
-- "Dashboard read-only access" let the anon role (i.e. anyone holding the
-- publishable key that ships in the browser bundle) SELECT provider_orders.
-- Replace it with: authenticated AND an active profile.
-- ---------------------------------------------------------------------------
drop policy if exists "Dashboard read-only access" on public.provider_orders;
drop policy if exists "provider_orders: active dashboard users read" on public.provider_orders;
create policy "provider_orders: active dashboard users read"
  on public.provider_orders for select
  to authenticated
  using ((select public.is_active_user()));

-- Least privilege for the browser-facing roles on every pre-existing public
-- table. RLS already denied these (no policies), but the default Supabase
-- grants gave anon INSERT/UPDATE/DELETE/TRUNCATE at the privilege level; the
-- API never uses anon/authenticated, so revoking changes nothing for it.
do $$
declare
  t text;
begin
  foreach t in array array[
    'app_settings', 'attendance', 'complaints', 'dataset_import_batches', 'dataset_records',
    'expenses', 'inventory_items', 'inventory_movements', 'maintenance_issues', 'manual_orders',
    'provider_orders', 'provider_webhook_events', 'purchases', 'sales_import_batches',
    'sales_line_items', 'sales_settings', 'staff', 'suppliers', 'tasks', 'wastage'
  ] loop
    if to_regclass('public.' || t) is not null then
      execute format('revoke all on table public.%I from anon', t);
      execute format('revoke insert, update, delete, truncate, references, trigger on table public.%I from authenticated', t);
    end if;
  end loop;
end;
$$;

-- anon also had column-level SELECT on provider_orders (from the earlier
-- restrict_provider_orders_columns_for_dashboard_clients migration).
revoke select on public.provider_orders from anon;
do $$
declare
  c text;
begin
  for c in select column_name from information_schema.columns
           where table_schema = 'public' and table_name = 'provider_orders' loop
    execute format('revoke select (%I) on public.provider_orders from anon', c);
  end loop;
end;
$$;

-- Tables created later by the owner role don't automatically become
-- readable/writable by anon.
alter default privileges in schema public revoke all on tables from anon;
