import { Router } from "express";
import { waitUntil } from "@vercel/functions";
import { getSupabase } from "../db/client.js";
import { query, queryOne } from "../db/pg.js";
import {
  EMAIL_PATTERN,
  MIN_PASSWORD_LENGTH,
  PASSWORD_RESET_REQUESTED_MESSAGE,
  type PasswordLinkType,
} from "../../../shared-types/auth.js";
import { clientIp } from "./cookies.js";
import { isLoginThrottled, recordLoginAttempt } from "./loginThrottle.js";
import { invalidateUserCache, isLinkOnlySession, sessionDeps, type VerifiedClaims } from "./session.js";
import { freshAuthClient, isPlaceholderEmail } from "./supabaseAuth.js";
import { asyncRoute } from "../shared/asyncRoute.js";

// Emailed account-setup (invite) and password-reset (recovery) links.
//
// Supabase Auth mints, emails and verifies the one-time link; no password is
// ever emailed and there is no home-made token. Clicking the link lands on
// the dashboard's /set-password screen holding a short-lived Supabase session
// whose `amr` says "invite" or "recovery". That session is accepted by exactly
// one endpoint -- POST /api/auth/password/complete -- which sets the password
// and then ends every session the user has, so the link can't be replayed.
// Everywhere else resolveSession() rejects it (session.ts).

export const SET_PASSWORD_PATH = "/set-password";
/** A link-derived session must be used within this long of clicking the link. */
export const LINK_SESSION_MAX_AGE_SEC = 60 * 60;
const MAX_PASSWORD_CHARS = 200;
const INVALID_LINK = "This link is invalid or has expired. Request a new one from the sign-in page.";

/**
 * The dashboard's public origin, used as the redirect target inside emailed
 * links. Never derived from the request's Host header (which a caller
 * controls). PUBLIC_APP_URL wins; otherwise Vercel's own system variables:
 * the production domain in Production, the deployment URL in Preview.
 */
export function appBaseUrl(env: NodeJS.ProcessEnv = process.env): string | null {
  const raw = env.PUBLIC_APP_URL?.trim() || (env.VERCEL_ENV === "production" ? env.VERCEL_PROJECT_PRODUCTION_URL : env.VERCEL_URL);
  if (!raw) return null;
  try {
    const url = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
    const local = url.hostname === "localhost" || url.hostname === "127.0.0.1";
    if (url.protocol !== "https:" && !local) return null;
    return url.origin;
  } catch {
    return null;
  }
}

export function setPasswordRedirectUrl(env: NodeJS.ProcessEnv = process.env): string | null {
  const base = appBaseUrl(env);
  return base ? `${base}${SET_PASSWORD_PATH}` : null;
}

/**
 * Which link opened this session, if it is a link-only session opened within
 * LINK_SESSION_MAX_AGE_SEC. Anything else (a normal password session, a stale
 * link session) is refused.
 */
export function linkSessionType(amr: VerifiedClaims["amr"], nowSec: number): PasswordLinkType | null {
  if (!amr || !isLinkOnlySession(amr)) return null;
  const latest = [...amr].sort((a, b) => b.timestamp - a.timestamp)[0];
  if (latest.method !== "invite" && latest.method !== "recovery") return null;
  if (nowSec - latest.timestamp > LINK_SESSION_MAX_AGE_SEC || latest.timestamp - nowSec > 60) return null;
  return latest.method;
}

export function normalizeEmail(v: unknown): string | null {
  if (typeof v !== "string") return null;
  const email = v.trim().toLowerCase();
  return email.length <= 254 && EMAIL_PATTERN.test(email) ? email : null;
}

export type SendLinkResult = { ok: true } | { ok: false; message: string };

/** Turns a Supabase mailer error into an admin-facing explanation (never includes the address). */
export function describeSendError(error: { code?: string; status?: number; message?: string }): string {
  const text = `${error.code ?? ""} ${error.message ?? ""}`;
  if (/not.?authori[sz]ed/i.test(text)) {
    return "The email couldn't be sent: Supabase's built-in email service only delivers to members of the Supabase team. Configure custom SMTP in Supabase (Authentication → Emails → SMTP Settings) to email other addresses.";
  }
  if (error.status === 429 || /rate.?limit/i.test(text)) {
    return "Too many emails were sent recently. Wait a few minutes and try again.";
  }
  return "The email couldn't be sent. Try again shortly.";
}

/** Pluggable for tests; production talks to Supabase Auth and Postgres. */
export const passwordLinkDeps = {
  /** Active dashboard account whose registered (real) email is `email`. */
  async findActiveAccountByEmail(email: string): Promise<{ userId: string; username: string } | null> {
    const row = await queryOne<{ id: string; username: string }>(
      `SELECT p.id, p.username FROM public.profiles p JOIN auth.users u ON u.id = p.id
        WHERE lower(p.email) = $1 AND lower(u.email) = $1 AND p.is_active LIMIT 1`,
      [email]
    );
    return row ? { userId: row.id, username: row.username } : null;
  },

  async sendRecoveryEmail(email: string, redirectTo: string): Promise<SendLinkResult> {
    if (isPlaceholderEmail(email)) return { ok: false, message: "This user has no email address." };
    // Implicit flow: the link works on whichever device opens it (PKCE would
    // need the verifier from the browser that asked, which is never the case here).
    const client = freshAuthClient();
    const { error } = await client.auth.resetPasswordForEmail(email, { redirectTo });
    if (error) {
      console.warn(`[auth] recovery email not sent: ${error.code ?? "error"} (${error.status ?? "-"})`);
      return { ok: false, message: describeSendError(error) };
    }
    return { ok: true };
  },

  /** For links built from {{ .TokenHash }} (custom email templates): verify server-side, return the session's access token. */
  async verifyTokenHash(tokenHash: string, type: PasswordLinkType): Promise<string | null> {
    const { data, error } = await freshAuthClient().auth.verifyOtp({ token_hash: tokenHash, type });
    if (error || !data.session) return null;
    return data.session.access_token;
  },

  async setPassword(userId: string, password: string): Promise<{ ok: true } | { ok: false; weak: boolean }> {
    const { error } = await getSupabase().auth.admin.updateUserById(userId, { password });
    if (!error) return { ok: true };
    return { ok: false, weak: /password|weak/i.test(error.message) };
  },

  async recordPasswordSet(userId: string, via: PasswordLinkType): Promise<void> {
    await query(`UPDATE public.profiles SET must_change_password = false, updated_by = $1 WHERE id = $1`, [userId]);
    await query(`INSERT INTO public.user_audit_log (actor_id, target_id, action, changes) VALUES ($1, $1, $2, $3)`, [
      userId,
      via === "invite" ? "account_setup_completed" : "password_reset_via_email",
      JSON.stringify({ via: `${via}_link` }),
    ]);
  },

  async revokeAllSessions(userId: string): Promise<void> {
    await query(`DELETE FROM auth.sessions WHERE user_id = $1`, [userId]);
    invalidateUserCache(userId);
  },

  /** A reset should also lift a lockout caused by the forgotten password. */
  async clearLoginFailures(username: string): Promise<void> {
    await query(`DELETE FROM public.auth_login_attempts WHERE username_key = $1 AND NOT success`, [username.toLowerCase()]);
  },

  /** Work that runs after the response is sent (Vercel keeps the function alive for it). */
  defer(task: Promise<unknown>): void {
    waitUntil(task);
  },
};

export const passwordLinkRouter: Router = Router();

/**
 * Forgot password. The answer, its status code and its timing are the same
 * whether or not an account exists: the lookup and the email happen after
 * the response is sent.
 */
passwordLinkRouter.post("/forgot", asyncRoute(async (req, res) => {
  const email = normalizeEmail(req.body?.email);
  if (!email) {
    res.status(400).json({ error: "Enter a valid email address." });
    return;
  }
  const ip = clientIp(req);
  const key = `reset:${email}`;
  if (await isLoginThrottled(key, ip)) {
    res.status(429).json({ error: "Too many requests. Wait 15 minutes and try again." });
    return;
  }
  // Every request counts toward the limit (not just "failures").
  await recordLoginAttempt(key, ip, false);
  res.json({ ok: true, message: PASSWORD_RESET_REQUESTED_MESSAGE });

  passwordLinkDeps.defer(
    (async () => {
      const redirectTo = setPasswordRedirectUrl();
      if (!redirectTo) {
        console.error("[auth] password reset unavailable: PUBLIC_APP_URL (or Vercel system env vars) not set");
        return;
      }
      const account = await passwordLinkDeps.findActiveAccountByEmail(email);
      if (!account) return;
      await passwordLinkDeps.sendRecoveryEmail(email, redirectTo);
    })().catch((err) => {
      console.error("[auth] password reset request failed:", err instanceof Error ? err.message : err);
    })
  );
}));

/**
 * Completes an emailed link: sets the password the user chose. Accepts the
 * link session's access token (default Supabase email templates) or a
 * token_hash (custom templates). Only a password changes here -- never role,
 * status, email or anything else, and only for the account the link was for.
 */
passwordLinkRouter.post("/complete", asyncRoute(async (req, res) => {
  const password = typeof req.body?.password === "string" ? req.body.password : "";
  if (password.length < MIN_PASSWORD_LENGTH || password.length > MAX_PASSWORD_CHARS) {
    res.status(400).json({ error: `Use at least ${MIN_PASSWORD_LENGTH} characters.` });
    return;
  }

  let accessToken = typeof req.body?.accessToken === "string" && req.body.accessToken.length < 8192 ? req.body.accessToken : null;
  const tokenHash = typeof req.body?.tokenHash === "string" && req.body.tokenHash.length < 512 ? req.body.tokenHash : null;
  const type = req.body?.type === "invite" || req.body?.type === "recovery" ? (req.body.type as PasswordLinkType) : null;
  if (!accessToken && tokenHash && type) {
    accessToken = await passwordLinkDeps.verifyTokenHash(tokenHash, type).catch(() => null);
  }
  if (!accessToken) {
    res.status(400).json({ error: INVALID_LINK, code: "link_invalid" });
    return;
  }

  const claims = await sessionDeps.verifyAccessToken(accessToken).catch(() => null);
  const via = claims ? linkSessionType(claims.amr, Math.floor(Date.now() / 1000)) : null;
  if (!claims || !via || !claims.sessionId) {
    res.status(400).json({ error: INVALID_LINK, code: "link_invalid" });
    return;
  }
  // The link's session must still exist: it is deleted once a password has
  // been set with it, which is what makes each link single-use.
  const loaded = await sessionDeps.loadProfile(claims.sub, claims.sessionId);
  if (!loaded || !loaded.sessionActive) {
    res.status(400).json({ error: INVALID_LINK, code: "link_invalid" });
    return;
  }
  if (!loaded.profile.is_active) {
    res.status(403).json({ error: "This account has been deactivated. Contact an admin." });
    return;
  }

  const result = await passwordLinkDeps.setPassword(claims.sub, password);
  if (!result.ok) {
    res.status(400).json({ error: result.weak ? "That password is too weak. Try a longer one." : "Could not save the password. Try again." });
    return;
  }
  await passwordLinkDeps.recordPasswordSet(claims.sub, via);
  // Ends the link session (single use) and any session that still knew the old password.
  await passwordLinkDeps.revokeAllSessions(claims.sub);
  await passwordLinkDeps.clearLoginFailures(loaded.profile.username).catch(() => {});
  res.json({ ok: true });
}));
