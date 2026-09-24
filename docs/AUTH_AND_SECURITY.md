# Authentication, roles & API security

## How sign-in works

- **Username + password** (on). The browser posts to `POST /api/auth/login`; the
  server looks up the username's Supabase Auth account, signs in with Supabase
  Auth, and sets two **HttpOnly** cookies (`rqsr_at` access token, `rqsr_rt`
  refresh token). JavaScript never sees a token.
- Access tokens last ~1 hour; the client refreshes silently through
  `POST /api/auth/refresh`. Logout (`POST /api/auth/logout`) revokes the
  Supabase session, so a copied token stops working too.
- Failed logins are throttled per username (5 / 15 min) and per IP
  (25 / 15 min) in `public.auth_login_attempts`.
- New users get a temporary password and must choose their own at first
  sign-in.
- **Email OTP** and **phone/WhatsApp OTP** are built (`/api/auth/otp/*` and the
  login screen) but **off**. To turn one on:
  - Email: configure custom SMTP in Supabase → Auth → SMTP, then set
    `AUTH_EMAIL_OTP_ENABLED=true` in Vercel.
  - WhatsApp/SMS: enable the Phone provider in Supabase → Auth → Providers
    (Twilio; WhatsApp needs an approved sender), then set
    `AUTH_PHONE_OTP_ENABLED=true` (and `AUTH_PHONE_OTP_CHANNEL=sms` for SMS).
  No code change or rebuild is needed; the login screen reads
  `GET /api/auth/methods`.

## Roles

Defined once in `shared-types/auth.ts` (`ROLE_PERMISSIONS`), enforced on the
server in `server/src/auth/accessPolicy.ts`:

| | Admin | Manager | Staff | Viewer |
|---|---|---|---|---|
| Dashboard, Sales & Revenue, Analytics | ✓ | ✓ | – | read |
| Live Orders / Orders / Kitchen / Front counter | ✓ | ✓ | ✓ | read |
| Tasks, Inventory, Wastage, Maintenance, Complaints | ✓ | ✓ | ✓ | read |
| Staff, Attendance, Expenses | ✓ | ✓ | – | read |
| Import data, sales target | ✓ | ✓ | – | – |
| Settings (view) | ✓ | ✓ | – | – |
| Business-day setting (change) | ✓ | – | – | – |
| Settings → User Management | ✓ | – | – | – |

To add a finer permission: add it to `PERMISSIONS`, grant it in
`ROLE_PERMISSIONS`, and use it in an `ACCESS_RULES` entry.

## API protection

Every `/api/*` request passes `requireApiAccess` first. It is **default
deny**: a path with no rule in `ACCESS_RULES` returns 404, so a new router is
locked until someone writes its rule. The user's identity and role come only
from the verified Supabase JWT + `public.profiles`, never from the request.
Public paths: `/api/health`, `/api/auth/{login,refresh,logout,methods,otp}`,
and `/api/webhooks/*` (which use their own tokens).

## Webhooks

- Petpooja: `PETPOOJA_WEBHOOK_TOKEN` must equal the `token` Petpooja puts in
  every payload.
- GoSelfServe: `GOSELFSERVE_WEBHOOK_TOKEN` is our own secret; GoSelfServe must
  send it as `x-webhook-token`, `Authorization: Bearer …`, or `?token=` on the
  URL.
- If a token variable is unset, that webhook stays open (and logs a warning)
  so live orders keep flowing. Set `WEBHOOK_AUTH_REQUIRED=true` once both are
  configured to make a missing token fail closed.

## Database

`supabase/migrations/20260924120000_auth_profiles_rbac.sql` adds `profiles`,
`user_audit_log`, `auth_login_attempts`, `summary_delivery_log`, RLS helper
functions, and removes the old policy that let the public anon key read
`provider_orders`. The browser-facing `anon` role can read nothing.

## Creating the first admin / recovering access

Admins create everyone else in **Settings → User Management**. If no admin
can sign in, create or promote one in the Supabase SQL editor:

```sql
-- promote an existing user
update public.profiles set role = 'admin', is_active = true where username = '<username>';
```

## Summarize Data

User menu → *Summarize data* previews a sales summary and can send it to the
signed-in user's **own** profile email / WhatsApp (the server picks the
destination; the request can't). Delivery providers are stubs in
`server/src/entities/summaries/providers.ts` — implement `send` and
`isConfigured` for a provider and add its credentials as server-side env vars.
