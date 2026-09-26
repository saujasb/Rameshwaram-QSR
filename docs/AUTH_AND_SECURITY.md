# Authentication, roles & API security

## How sign-in works

- **Username or email + password** (on). The browser posts to
  `POST /api/auth/login` with `{ identifier, password }`; the server looks up
  the account by username or registered profile email, signs in with Supabase
  Auth, and sets two **HttpOnly** cookies (`rqsr_at` access token, `rqsr_rt`
  refresh token). JavaScript never sees a token.
- Access tokens last ~1 hour; the client refreshes silently through
  `POST /api/auth/refresh`. Logout (`POST /api/auth/logout`) revokes the
  Supabase session, so a copied token stops working too.
- Failed logins are throttled per account (5 / 15 min, shared by its username
  and email) and per IP (25 / 15 min) in `public.auth_login_attempts`.

## Account setup and forgotten passwords (emailed links)

No password is ever emailed. Supabase Auth mints, sends and verifies every
one-time link; the code is in `server/src/auth/passwordLinks.ts`.

- **New user:** Settings → User Management → *Add user* (email required) calls
  Supabase `inviteUserByEmail`. The account has no password; the email's link
  opens `/set-password` ("Create your password").
- **Forgot password:** *Forgot password?* on the sign-in page →
  `POST /api/auth/password/forgot`. The reply is always *"If an account exists
  for that email, a password reset link has been sent."*, and the lookup and
  email happen after the response, so neither the answer nor its timing
  reveals whether an account exists. Rate-limited per address and per IP.
- **Admin-sent link:** User Management → *Password* → *Email reset link* (or
  *Resend setup email* for someone who never finished setup).
- **Completing a link:** `/set-password` posts the new password with the
  link's session to `POST /api/auth/password/complete`. The server accepts
  only a session whose `amr` is `invite`/`recovery` and less than an hour old,
  sets the password (nothing else: never role, status or email), then deletes
  **all** of that user's sessions, so the link can't be reused and old
  sessions end. Everywhere else the API refuses link sessions.
- Links point at `PUBLIC_APP_URL` if set, otherwise Vercel's production
  domain (`VERCEL_PROJECT_PRODUCTION_URL`) or, in Preview, the deployment URL
  — never the request's Host header.
- **Fallback when email isn't working:** *Add user* can instead show the admin
  a temporary password, and *Password* → *Set temporary password* does the
  same for an existing user. It's shown once to the admin, never emailed, and
  must be changed at first sign-in.

### Required Supabase settings

1. **Authentication → URL Configuration:** Site URL
   `https://rameshwaram-qsr-dashboard.vercel.app`; add
   `https://rameshwaram-qsr-dashboard.vercel.app/set-password` to Redirect URLs.
   Otherwise Supabase sends people to the Site URL.
2. **Authentication → Emails → SMTP Settings:** custom SMTP. Supabase's
   built-in sender only delivers to members of the Supabase team and is
   heavily rate-limited.
3. Optional: edit the *Invite user* and *Reset password* templates' wording.
   To stop mail scanners from using up a link before the person clicks it, the
   link can be `{{ .RedirectTo }}?token_hash={{ .TokenHash }}&type=recovery`
   (`type=invite` in the invite template); `/set-password` supports both
   forms.

## One-time-code sign-in (off)

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
Public paths: `/api/health`, `/api/auth/{login,refresh,logout,methods,otp,password}`,
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
