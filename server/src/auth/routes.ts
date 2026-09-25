import { Router, type Request, type Response } from "express";
import { getSupabase } from "../db/client.js";
import { query, queryOne } from "../db/pg.js";
import { EMAIL_PATTERN, MIN_PASSWORD_LENGTH, PHONE_PATTERN, USERNAME_PATTERN, type LoginMethods } from "../../../shared-types/auth.js";
import { clearSessionCookies, clientIp, readAccessToken, readCookie, REFRESH_COOKIE, setSessionCookies } from "./cookies.js";
import { invalidateUserCache, resolveSession, toAuthUser } from "./session.js";
import { isLoginThrottled, recordLoginAttempt } from "./loginThrottle.js";
import { freshAuthClient, isPlaceholderEmail, placeholderEmail } from "./supabaseAuth.js";
import { asyncRoute } from "../shared/asyncRoute.js";

export const authRouter: Router = Router();

const GENERIC_LOGIN_ERROR = "Incorrect username or password.";
const MAX_PASSWORD_CHARS = 200;

function envFlag(name: string): boolean {
  return /^(1|true|yes|on)$/i.test(process.env[name] ?? "");
}

/**
 * Which sign-in methods are live. Email OTP and phone/WhatsApp OTP are fully
 * wired below but stay OFF until these server-side flags are set -- no code
 * change or client rebuild needed to turn them on.
 */
export function loginMethods(): LoginMethods {
  return {
    password: true,
    emailOtp: envFlag("AUTH_EMAIL_OTP_ENABLED"),
    phoneOtp: envFlag("AUTH_PHONE_OTP_ENABLED"),
    phoneOtpChannel: process.env.AUTH_PHONE_OTP_CHANNEL === "sms" ? "sms" : "whatsapp",
  };
}

function normalizeUsername(v: unknown): string | null {
  if (typeof v !== "string") return null;
  const u = v.trim().toLowerCase();
  return u.length >= 1 && u.length <= 64 ? u : null;
}

async function markLoggedIn(userId: string): Promise<void> {
  await query(`UPDATE public.profiles SET last_login_at = now() WHERE id = $1`, [userId]).catch(() => {});
}

/** Finishes any successful sign-in: re-checks the profile, sets cookies, returns the user. */
async function completeSignIn(
  req: Request,
  res: Response,
  session: { access_token: string; refresh_token: string; expires_in: number }
): Promise<void> {
  const resolved = await resolveSession(session.access_token);
  if (!resolved.ok) {
    console.warn(`[auth] sign-in succeeded but session check failed: ${resolved.reason}`);
    await getSupabase().auth.admin.signOut(session.access_token, "local").catch(() => {});
    const inactive = resolved.reason === "inactive" || resolved.reason === "no_profile";
    res.status(inactive ? 403 : 401).json({
      error: inactive ? "This account has been deactivated. Contact an admin." : GENERIC_LOGIN_ERROR,
    });
    return;
  }
  setSessionCookies(req, res, {
    accessToken: session.access_token,
    refreshToken: session.refresh_token,
    expiresIn: session.expires_in,
  });
  await markLoggedIn(resolved.auth.userId);
  res.json({ user: toAuthUser(resolved.auth) });
}

authRouter.get("/methods", (_req, res) => {
  res.json(loginMethods());
});

authRouter.post("/login", asyncRoute(async (req, res) => {
  const username = normalizeUsername(req.body?.username);
  const password = typeof req.body?.password === "string" ? req.body.password : "";
  if (!username || !password || password.length > MAX_PASSWORD_CHARS) {
    res.status(400).json({ error: "Enter your username and password." });
    return;
  }

  const ip = clientIp(req);
  if (await isLoginThrottled(username, ip)) {
    res.status(429).json({ error: "Too many failed sign-in attempts. Wait 15 minutes and try again." });
    return;
  }

  // Username -> the auth email Supabase signs in with. Looked up server-side
  // so the browser never learns (or can probe) which usernames exist.
  const account = await queryOne<{ email: string | null }>(
    `SELECT u.email FROM public.profiles p JOIN auth.users u ON u.id = p.id WHERE lower(p.username) = $1`,
    [username]
  );

  if (!account?.email) {
    console.warn("[auth] login rejected: no such username");
    await recordLoginAttempt(username, ip, false);
    res.status(401).json({ error: GENERIC_LOGIN_ERROR });
    return;
  }

  const { data, error } = await freshAuthClient().auth.signInWithPassword({ email: account.email, password });
  if (error || !data.session) {
    // Reason code only -- never the username, email or password.
    console.warn(`[auth] login rejected by Supabase Auth: ${error?.code ?? "no_session"} (${error?.status ?? "-"})`);
    await recordLoginAttempt(username, ip, false);
    const status = error?.status === 429 ? 429 : 401;
    res.status(status).json({ error: status === 429 ? "Too many sign-in attempts. Try again shortly." : GENERIC_LOGIN_ERROR });
    return;
  }

  await recordLoginAttempt(username, ip, true);
  await completeSignIn(req, res, data.session);
}));

authRouter.post("/refresh", asyncRoute(async (req, res) => {
  const refreshToken = readCookie(req, REFRESH_COOKIE);
  if (!refreshToken) {
    res.status(401).json({ error: "Please sign in.", code: "auth_missing" });
    return;
  }
  const { data, error } = await freshAuthClient().auth.refreshSession({ refresh_token: refreshToken });
  if (error || !data.session) {
    clearSessionCookies(req, res);
    res.status(401).json({ error: "Your session has expired. Please sign in again.", code: "auth_invalid" });
    return;
  }
  const resolved = await resolveSession(data.session.access_token);
  if (!resolved.ok) {
    await getSupabase().auth.admin.signOut(data.session.access_token, "local").catch(() => {});
    clearSessionCookies(req, res);
    res.status(resolved.reason === "inactive" ? 403 : 401).json({ error: "Please sign in again.", code: `auth_${resolved.reason}` });
    return;
  }
  setSessionCookies(req, res, {
    accessToken: data.session.access_token,
    refreshToken: data.session.refresh_token,
    expiresIn: data.session.expires_in,
  });
  res.json({ user: toAuthUser(resolved.auth) });
}));

authRouter.post("/logout", asyncRoute(async (req, res) => {
  const token = readAccessToken(req);
  if (token) {
    // Revokes this session's refresh token server-side and deletes the
    // session row, so even a copied access token stops working (session.ts
    // checks auth.sessions on every request).
    const resolved = await resolveSession(token).catch(() => null);
    await getSupabase().auth.admin.signOut(token, "local").catch(() => {});
    if (resolved?.ok) invalidateUserCache(resolved.auth.userId);
  }
  clearSessionCookies(req, res);
  res.json({ ok: true });
}));

authRouter.get("/me", (req, res) => {
  res.json({ user: toAuthUser(req.auth!) });
});

authRouter.post("/change-password", asyncRoute(async (req, res) => {
  const auth = req.auth!;
  const currentPassword = typeof req.body?.currentPassword === "string" ? req.body.currentPassword : "";
  const newPassword = typeof req.body?.newPassword === "string" ? req.body.newPassword : "";
  if (!currentPassword || newPassword.length < MIN_PASSWORD_LENGTH || newPassword.length > MAX_PASSWORD_CHARS) {
    res.status(400).json({ error: `The new password must be at least ${MIN_PASSWORD_LENGTH} characters.` });
    return;
  }
  if (newPassword === currentPassword) {
    res.status(400).json({ error: "Choose a new password that is different from the current one." });
    return;
  }

  // Optional username choice, allowed ONLY for an Admin still on their
  // temporary password (i.e. the first-login step). Everyone else keeps the
  // username an admin assigned; usernames never change after first login.
  const requestedUsername =
    typeof req.body?.newUsername === "string" ? req.body.newUsername.trim().toLowerCase() : "";
  const renaming = requestedUsername !== "" && requestedUsername !== auth.profile.username.toLowerCase();
  if (renaming) {
    if (!(auth.profile.must_change_password && auth.role === "admin")) {
      res.status(403).json({ error: "Your username can't be changed." });
      return;
    }
    if (!USERNAME_PATTERN.test(requestedUsername)) {
      res.status(400).json({ error: "Username must be 3-32 characters: lowercase letters, numbers, dot, dash or underscore." });
      return;
    }
    const taken = await queryOne<{ id: string }>(
      `SELECT id FROM public.profiles WHERE lower(username) = $1 AND id <> $2`,
      [requestedUsername, auth.userId]
    );
    if (taken) {
      res.status(400).json({ error: "That username is already taken." });
      return;
    }
  }

  const ip = clientIp(req);
  const key = auth.profile.username.toLowerCase();
  if (await isLoginThrottled(key, ip)) {
    res.status(429).json({ error: "Too many failed attempts. Wait 15 minutes and try again." });
    return;
  }

  const account = await queryOne<{ email: string | null }>(`SELECT email FROM auth.users WHERE id = $1`, [auth.userId]);
  if (!account?.email) {
    res.status(400).json({ error: "This account can't change its password here." });
    return;
  }
  // Re-authenticate with the current password before changing it.
  const verify = await freshAuthClient().auth.signInWithPassword({ email: account.email, password: currentPassword });
  if (verify.error || !verify.data.session) {
    await recordLoginAttempt(key, ip, false);
    res.status(401).json({ error: "The current password is incorrect." });
    return;
  }
  await getSupabase().auth.admin.signOut(verify.data.session.access_token, "local").catch(() => {});

  // The username is claimed first (the unique index is the final guard
  // against a race) and handed back if the password update then fails.
  const oldUsername = auth.profile.username;
  if (renaming) {
    try {
      await query(`UPDATE public.profiles SET username = $2, updated_by = $1 WHERE id = $1`, [auth.userId, requestedUsername]);
    } catch (err) {
      if ((err as { code?: string }).code === "23505") {
        res.status(400).json({ error: "That username is already taken." });
        return;
      }
      throw err;
    }
  }
  // A placeholder sign-in address is derived from the username; keep it in
  // step so the old name's placeholder doesn't block a future user.
  const signInEmail = renaming && isPlaceholderEmail(account.email) ? placeholderEmail(requestedUsername) : account.email;

  const { error } = await getSupabase().auth.admin.updateUserById(auth.userId, {
    password: newPassword,
    ...(signInEmail !== account.email ? { email: signInEmail, email_confirm: true } : {}),
  });
  if (error) {
    if (renaming) {
      await query(`UPDATE public.profiles SET username = $2 WHERE id = $1`, [auth.userId, oldUsername]).catch(() => {});
    }
    res.status(400).json({ error: error.message.includes("weak") ? "That password is too weak. Try a longer one." : "Could not change the password." });
    return;
  }
  await query(`UPDATE public.profiles SET must_change_password = false, updated_by = $1 WHERE id = $1`, [auth.userId]);
  await query(`INSERT INTO public.user_audit_log (actor_id, target_id, action) VALUES ($1, $1, 'password_changed')`, [auth.userId]);
  if (renaming) {
    await query(`INSERT INTO public.user_audit_log (actor_id, target_id, action, changes) VALUES ($1, $1, 'username_changed', $2)`, [
      auth.userId,
      JSON.stringify({ username: { from: oldUsername, to: requestedUsername } }),
    ]);
  }
  invalidateUserCache(auth.userId);

  // Supabase ends the user's existing sessions when the password changes, so
  // hand back a fresh session under the new password (a new session after a
  // credential change is the right outcome anyway).
  const fresh = await freshAuthClient().auth.signInWithPassword({ email: signInEmail, password: newPassword });
  if (fresh.error || !fresh.data.session) {
    clearSessionCookies(req, res);
    res.json({ ok: true, reauthenticate: true });
    return;
  }
  await completeSignIn(req, res, fresh.data.session);
}));

// ---------------------------------------------------------------------------
// One-time-code sign-in (email, and phone via WhatsApp/SMS).
//
// Dormant: every call returns 404 until AUTH_EMAIL_OTP_ENABLED /
// AUTH_PHONE_OTP_ENABLED is set. To enable later:
//   Email:    configure custom SMTP in Supabase Auth, set AUTH_EMAIL_OTP_ENABLED=true.
//   WhatsApp: enable the Phone provider in Supabase Auth with a Twilio (or
//             other supported) account that has WhatsApp sender approval,
//             set AUTH_PHONE_OTP_ENABLED=true (AUTH_PHONE_OTP_CHANNEL=sms for SMS).
// Codes are only sent to identities that already belong to an active
// dashboard user (shouldCreateUser: false) -- OTP can never create accounts.
// ---------------------------------------------------------------------------

type OtpChannel = "email" | "phone";

function otpIdentifier(channel: OtpChannel, raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const v = raw.trim();
  if (channel === "email") return EMAIL_PATTERN.test(v) && v.length <= 254 ? v.toLowerCase() : null;
  return PHONE_PATTERN.test(v) ? v : null;
}

function otpEnabled(channel: OtpChannel): boolean {
  const m = loginMethods();
  return channel === "email" ? m.emailOtp : m.phoneOtp;
}

authRouter.post("/otp/request", asyncRoute(async (req, res) => {
  const channel = req.body?.channel === "phone" ? "phone" : req.body?.channel === "email" ? "email" : null;
  if (!channel || !otpEnabled(channel)) {
    res.status(404).json({ error: "This sign-in method is not enabled." });
    return;
  }
  const identifier = otpIdentifier(channel, req.body?.identifier);
  if (!identifier) {
    res.status(400).json({ error: channel === "email" ? "Enter a valid email address." : "Enter the mobile number with country code, e.g. +919876543210." });
    return;
  }
  const ip = clientIp(req);
  if (await isLoginThrottled(`otp:${identifier}`, ip)) {
    res.status(429).json({ error: "Too many attempts. Wait 15 minutes and try again." });
    return;
  }
  const column = channel === "email" ? "lower(email)" : "phone";
  const profile = await queryOne<{ id: string }>(`SELECT id FROM public.profiles WHERE ${column} = $1 AND is_active`, [identifier]);
  if (profile) {
    const client = freshAuthClient();
    const result =
      channel === "email"
        ? await client.auth.signInWithOtp({ email: identifier, options: { shouldCreateUser: false } })
        : await client.auth.signInWithOtp({ phone: identifier, options: { shouldCreateUser: false, channel: loginMethods().phoneOtpChannel } });
    if (result.error) console.error("[auth] OTP send failed:", result.error.message);
  }
  // Same answer whether or not the identity exists (no account enumeration).
  res.json({ ok: true, message: "If that belongs to an active account, a code is on its way." });
}));

authRouter.post("/otp/verify", asyncRoute(async (req, res) => {
  const channel = req.body?.channel === "phone" ? "phone" : req.body?.channel === "email" ? "email" : null;
  if (!channel || !otpEnabled(channel)) {
    res.status(404).json({ error: "This sign-in method is not enabled." });
    return;
  }
  const identifier = otpIdentifier(channel, req.body?.identifier);
  const code = typeof req.body?.code === "string" ? req.body.code.trim() : "";
  if (!identifier || !/^[0-9]{6,10}$/.test(code)) {
    res.status(400).json({ error: "Enter the code you received." });
    return;
  }
  const ip = clientIp(req);
  const key = `otp:${identifier}`;
  if (await isLoginThrottled(key, ip)) {
    res.status(429).json({ error: "Too many attempts. Wait 15 minutes and try again." });
    return;
  }
  const client = freshAuthClient();
  const { data, error } =
    channel === "email"
      ? await client.auth.verifyOtp({ email: identifier, token: code, type: "email" })
      : await client.auth.verifyOtp({ phone: identifier, token: code, type: "sms" });
  if (error || !data.session) {
    await recordLoginAttempt(key, ip, false);
    res.status(401).json({ error: "That code is incorrect or has expired." });
    return;
  }
  await recordLoginAttempt(key, ip, true);
  await completeSignIn(req, res, data.session);
}));
