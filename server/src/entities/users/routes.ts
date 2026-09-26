import { Router } from "express";
import { getSupabase } from "../../db/client.js";
import { query, queryOne } from "../../db/pg.js";
import {
  EMAIL_PATTERN,
  isRole,
  MIN_PASSWORD_LENGTH,
  PHONE_PATTERN,
  USERNAME_PATTERN,
  type CreateUserInput,
  type ManagedUser,
  type Role,
  type UpdateUserInput,
} from "../../../../shared-types/auth.js";
import { asyncRoute } from "../../shared/asyncRoute.js";
import { invalidateUserCache } from "../../auth/session.js";
import { isPlaceholderEmail, placeholderEmail } from "../../auth/supabaseAuth.js";
import { describeSendError, passwordLinkDeps, setPasswordRedirectUrl } from "../../auth/passwordLinks.js";

// Settings -> User Management. The whole router sits behind the
// "users.manage" permission (admin only) in auth/accessPolicy.ts; the actor is
// always req.auth (verified server-side), never anything in the request body.

export const usersRouter: Router = Router();

interface ProfileDbRow {
  id: string;
  username: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  role: Role;
  is_active: boolean;
  must_change_password: boolean;
  password_set: boolean;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
}

// password_set comes from Supabase Auth: an invited user has no password
// until they complete their emailed setup link.
const PROFILE_COLUMNS = `p.id, p.username, p.full_name, p.email, p.phone, p.role, p.is_active, p.must_change_password,
  (coalesce(u.encrypted_password, '') <> '') AS password_set, p.last_login_at, p.created_at, p.updated_at`;
const SELECT_PROFILE = `SELECT ${PROFILE_COLUMNS} FROM public.profiles p JOIN auth.users u ON u.id = p.id`;

function toManagedUser(r: ProfileDbRow): ManagedUser {
  const iso = (v: string | Date | null) => (v == null ? null : new Date(v).toISOString());
  return {
    id: r.id,
    username: r.username,
    fullName: r.full_name,
    email: r.email,
    phone: r.phone,
    role: r.role,
    isActive: r.is_active,
    mustChangePassword: r.must_change_password,
    passwordSet: Boolean(r.password_set),
    lastLoginAt: iso(r.last_login_at),
    createdAt: iso(r.created_at)!,
    updatedAt: iso(r.updated_at)!,
  };
}

class ValidationError extends Error {}

function cleanText(v: unknown, max: number): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

/** Every user needs a real email: it receives the account-setup link and password-reset links. */
function requiredEmail(v: unknown): string {
  if (v === null || v === undefined || v === "") throw new ValidationError("Enter the person's email address. It's needed to set up and recover their account.");
  if (typeof v !== "string" || !EMAIL_PATTERN.test(v.trim()) || v.trim().length > 254 || isPlaceholderEmail(v.trim())) {
    throw new ValidationError("Enter a valid email address.");
  }
  return v.trim().toLowerCase();
}

function optionalPhone(v: unknown): string | null | undefined {
  if (v === undefined) return undefined;
  if (v === null || v === "") return null;
  const phone = typeof v === "string" ? v.replace(/[\s()-]/g, "") : "";
  if (!PHONE_PATTERN.test(phone)) throw new ValidationError("Enter the mobile/WhatsApp number with country code, e.g. +919876543210.");
  return phone;
}

/** `value` must already be normalized (usernames/emails lower-cased, phones in +E.164). */
async function assertUnique(field: "username" | "email" | "phone", value: string | null | undefined, exceptId?: string): Promise<void> {
  if (!value) return;
  const column = field === "phone" ? "phone" : `lower(${field})`;
  const clash = await queryOne<{ id: string }>(
    `SELECT id FROM public.profiles WHERE ${column} = $1 ${exceptId ? "AND id <> $2" : ""} LIMIT 1`,
    exceptId ? [value, exceptId] : [value]
  );
  if (clash) throw new ValidationError(`That ${field === "phone" ? "mobile number" : field} is already used by another user.`);
}

async function audit(actorId: string, targetId: string, action: string, changes: Record<string, unknown> = {}): Promise<void> {
  await query(`INSERT INTO public.user_audit_log (actor_id, target_id, action, changes) VALUES ($1, $2, $3, $4)`, [
    actorId,
    targetId,
    action,
    JSON.stringify(changes),
  ]);
}

async function authUserIdByEmail(email: string): Promise<string | null> {
  const row = await queryOne<{ id: string }>(`SELECT id FROM auth.users WHERE lower(email) = $1 LIMIT 1`, [email]);
  return row?.id ?? null;
}

async function activeAdminCount(): Promise<number> {
  const row = await queryOne<{ n: string }>(`SELECT count(*) AS n FROM public.profiles WHERE role = 'admin' AND is_active`);
  return Number(row?.n ?? 0);
}

/** Ends every session a user has (used on deactivation and admin password reset). */
async function revokeAllSessions(userId: string): Promise<void> {
  await query(`DELETE FROM auth.sessions WHERE user_id = $1`, [userId]).catch((err) => {
    console.error("[users] could not revoke sessions:", err instanceof Error ? err.message : err);
  });
  invalidateUserCache(userId);
}

function handleError(res: import("express").Response, err: unknown): void {
  if (err instanceof ValidationError) {
    res.status(400).json({ error: err.message });
    return;
  }
  console.error("[users]", err instanceof Error ? err.message : err);
  res.status(500).json({ error: "Could not complete that change. Nothing was saved." });
}

usersRouter.get("/", asyncRoute(async (_req, res) => {
  const rows = await query<ProfileDbRow>(`${SELECT_PROFILE} ORDER BY p.is_active DESC, lower(p.username)`);
  res.json(rows.map(toManagedUser));
}));

usersRouter.post("/", asyncRoute(async (req, res) => {
  const actor = req.auth!;
  const body = (req.body ?? {}) as Partial<CreateUserInput>;
  let createdAuthUserId: string | null = null;
  try {
    const username = cleanText(body.username, 64).toLowerCase();
    if (!USERNAME_PATTERN.test(username)) {
      throw new ValidationError("Username must be 3-32 characters: lowercase letters, numbers, dot, dash or underscore.");
    }
    const fullName = cleanText(body.fullName, 120);
    if (!fullName) throw new ValidationError("Enter the person's name.");
    if (!isRole(body.role)) throw new ValidationError("Choose a role.");
    const email = requiredEmail(body.email);
    const phone = optionalPhone(body.phone) ?? null;

    await assertUnique("username", username);
    await assertUnique("email", email);
    await assertUnique("phone", phone);
    if (await authUserIdByEmail(email)) throw new ValidationError("That email is already registered.");

    // Fallback for when email delivery isn't available: the admin is shown a
    // temporary password to pass on privately (it is never emailed) and the
    // user must replace it at first sign-in.
    const tempPassword = typeof body.temporaryPassword === "string" ? body.temporaryPassword : null;
    if (tempPassword !== null && (tempPassword.length < MIN_PASSWORD_LENGTH || tempPassword.length > 200)) {
      throw new ValidationError(`The temporary password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
    }

    const redirectTo = setPasswordRedirectUrl();
    if (!tempPassword && !redirectTo) throw new Error("PUBLIC_APP_URL (or Vercel system env vars) not set; can't build the setup link");

    // Normal path: Supabase creates the account with NO password and emails a
    // one-time setup link; the user chooses their own password on /set-password.
    const { data, error } = tempPassword
      ? await getSupabase().auth.admin.createUser({ email, password: tempPassword, email_confirm: true, user_metadata: { username } })
      : await getSupabase().auth.admin.inviteUserByEmail(email, { redirectTo: redirectTo!, data: { username } });
    if (error || !data.user) {
      if (tempPassword) {
        if (error && /already/i.test(error.message)) throw new ValidationError("That email is already registered.");
        if (error && /password/i.test(error.message)) throw new ValidationError("That temporary password is too weak. Use a longer one.");
        throw new Error(`createUser failed: ${error?.message ?? "no user"}`);
      }
      console.warn(`[users] invite not sent: ${error?.code ?? "no_user"} (${error?.status ?? "-"})`);
      // Don't leave behind an auth user this request created if the send failed.
      const orphan = await authUserIdByEmail(email);
      if (orphan) await getSupabase().auth.admin.deleteUser(orphan).catch(() => {});
      if (error && /already/i.test(error.message)) throw new ValidationError("That email is already registered.");
      throw new ValidationError(`${error ? describeSendError(error) : "The setup email couldn't be sent."} No account was created.`);
    }
    createdAuthUserId = data.user.id;
    if (phone) {
      const { error: phoneError } = await getSupabase().auth.admin.updateUserById(createdAuthUserId, { phone, phone_confirm: true });
      if (phoneError) {
        if (/already/i.test(phoneError.message)) throw new ValidationError("That mobile number is already registered.");
        throw new Error(`phone update failed: ${phoneError.message}`);
      }
    }

    // The on_auth_user_created trigger already inserted an inactive
    // placeholder profile; fill it in and activate it. The admin, not the
    // user, sets the role -- the setup link can only set a password.
    const row = await queryOne<ProfileDbRow>(
      `WITH saved AS (
         INSERT INTO public.profiles (id, username, full_name, email, phone, role, is_active, must_change_password, created_by, updated_by)
         VALUES ($1, $2, $3, $4, $5, $6, true, $8, $7, $7)
         ON CONFLICT (id) DO UPDATE SET username = excluded.username, full_name = excluded.full_name, email = excluded.email,
           phone = excluded.phone, role = excluded.role, is_active = true, must_change_password = excluded.must_change_password,
           created_by = excluded.created_by, updated_by = excluded.updated_by
         RETURNING *)
       SELECT ${PROFILE_COLUMNS} FROM saved p JOIN auth.users u ON u.id = p.id`,
      [createdAuthUserId, username, fullName, email, phone, body.role, actor.userId, Boolean(tempPassword)]
    );
    await audit(actor.userId, createdAuthUserId, tempPassword ? "user_created" : "user_invited", { username, role: body.role, email, phone });
    res.status(201).json(toManagedUser(row!));
  } catch (err) {
    if (createdAuthUserId) {
      await getSupabase().auth.admin.deleteUser(createdAuthUserId).catch(() => {});
    }
    handleError(res, err);
  }
}));

usersRouter.patch("/:id", asyncRoute(async (req, res) => {
  const actor = req.auth!;
  const targetId = req.params.id;
  const body = (req.body ?? {}) as UpdateUserInput;
  try {
    if (!/^[0-9a-f-]{36}$/i.test(targetId)) throw new ValidationError("Unknown user.");
    const current = await queryOne<ProfileDbRow>(`${SELECT_PROFILE} WHERE p.id = $1`, [targetId]);
    if (!current) {
      res.status(404).json({ error: "User not found." });
      return;
    }

    const next: Partial<Pick<ProfileDbRow, "full_name" | "email" | "phone" | "role" | "is_active">> = {};
    if (body.fullName !== undefined) {
      const fullName = cleanText(body.fullName, 120);
      if (!fullName) throw new ValidationError("Enter the person's name.");
      next.full_name = fullName;
    }
    if (body.email !== undefined) next.email = requiredEmail(body.email);
    const phone = optionalPhone(body.phone);
    if (phone !== undefined) next.phone = phone;
    if (body.role !== undefined) {
      if (!isRole(body.role)) throw new ValidationError("Choose a valid role.");
      next.role = body.role;
    }
    if (body.isActive !== undefined) {
      if (typeof body.isActive !== "boolean") throw new ValidationError("Invalid status.");
      next.is_active = body.isActive;
    }

    // Nobody changes their own role or deactivates themselves -- this blocks
    // self-elevation and accidental self-lockout alike.
    if (targetId === actor.userId && ((next.role && next.role !== current.role) || next.is_active === false)) {
      res.status(403).json({ error: "You can't change your own role or deactivate your own account. Ask another admin." });
      return;
    }
    // Never leave the dashboard without an active admin.
    const losesAdmin =
      current.role === "admin" && current.is_active && ((next.role && next.role !== "admin") || next.is_active === false);
    if (losesAdmin && (await activeAdminCount()) <= 1) {
      throw new ValidationError("This is the only active admin. Make someone else an admin first.");
    }

    await assertUnique("email", next.email, targetId);
    await assertUnique("phone", next.phone, targetId);

    // Keep Supabase Auth's login identities in step with the profile (needed
    // for future email / WhatsApp OTP sign-in).
    const authUpdate: Record<string, unknown> = {};
    if (next.email !== undefined && next.email !== current.email) {
      const holder = next.email ? await authUserIdByEmail(next.email) : null;
      if (holder && holder !== targetId) throw new ValidationError("That email is already registered.");
      authUpdate.email = next.email ?? placeholderEmail(current.username);
      authUpdate.email_confirm = true;
    }
    if (next.phone !== undefined && next.phone !== current.phone && next.phone) {
      authUpdate.phone = next.phone;
      authUpdate.phone_confirm = true;
    }
    if (Object.keys(authUpdate).length > 0) {
      const { error } = await getSupabase().auth.admin.updateUserById(targetId, authUpdate);
      if (error) {
        if (/already/i.test(error.message)) throw new ValidationError("That email or mobile number is already registered.");
        throw new Error(`updateUserById failed: ${error.message}`);
      }
    }

    const sets: string[] = [];
    const params: unknown[] = [targetId, actor.userId];
    for (const [col, val] of Object.entries(next)) {
      params.push(val);
      sets.push(`${col} = $${params.length}`);
    }
    sets.push("updated_by = $2");
    const row = await queryOne<ProfileDbRow>(
      `WITH saved AS (UPDATE public.profiles SET ${sets.join(", ")} WHERE id = $1 RETURNING *)
       SELECT ${PROFILE_COLUMNS} FROM saved p JOIN auth.users u ON u.id = p.id`,
      params
    );

    const changes: Record<string, { from: unknown; to: unknown }> = {};
    for (const [col, val] of Object.entries(next)) {
      const before = current[col as keyof ProfileDbRow];
      if (before !== val) changes[col] = { from: before, to: val };
    }
    if (Object.keys(changes).length > 0) {
      const action = changes.role ? "role_changed" : changes.is_active ? (next.is_active ? "user_activated" : "user_deactivated") : "user_updated";
      await audit(actor.userId, targetId, action, changes);
    }
    if (next.is_active === false) await revokeAllSessions(targetId);
    invalidateUserCache(targetId);
    res.json(toManagedUser(row!));
  } catch (err) {
    handleError(res, err);
  }
}));

usersRouter.post("/:id/reset-password", asyncRoute(async (req, res) => {
  const actor = req.auth!;
  const targetId = req.params.id;
  try {
    if (!/^[0-9a-f-]{36}$/i.test(targetId)) throw new ValidationError("Unknown user.");
    const password = typeof req.body?.password === "string" ? req.body.password : "";
    if (password.length < MIN_PASSWORD_LENGTH || password.length > 200) {
      throw new ValidationError(`The temporary password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
    }
    const current = await queryOne<{ id: string }>(`SELECT id FROM public.profiles WHERE id = $1`, [targetId]);
    if (!current) {
      res.status(404).json({ error: "User not found." });
      return;
    }
    const { error } = await getSupabase().auth.admin.updateUserById(targetId, { password });
    if (error) {
      if (/password/i.test(error.message)) throw new ValidationError("That temporary password is too weak. Use a longer one.");
      throw new Error(`updateUserById failed: ${error.message}`);
    }
    await query(`UPDATE public.profiles SET must_change_password = true, updated_by = $2 WHERE id = $1`, [targetId, actor.userId]);
    await audit(actor.userId, targetId, "password_reset");
    // Their existing sessions end; they sign in with the temporary password.
    if (targetId !== actor.userId) await revokeAllSessions(targetId);
    invalidateUserCache(targetId);
    res.json({ ok: true });
  } catch (err) {
    handleError(res, err);
  }
}));

/**
 * Emails the user a one-time link to set their password: the account-setup
 * (invite) link again if they never accepted it, otherwise a password-reset
 * link. Nothing is emailed except the link; the password stays unchanged
 * until the user sets a new one through it.
 */
usersRouter.post("/:id/send-password-link", asyncRoute(async (req, res) => {
  const actor = req.auth!;
  const targetId = req.params.id;
  try {
    if (!/^[0-9a-f-]{36}$/i.test(targetId)) throw new ValidationError("Unknown user.");
    const target = await queryOne<{ username: string; is_active: boolean; email: string | null; confirmed: boolean; password_set: boolean }>(
      `SELECT p.username, p.is_active, u.email, (u.email_confirmed_at IS NOT NULL) AS confirmed,
              (coalesce(u.encrypted_password, '') <> '') AS password_set
         FROM public.profiles p JOIN auth.users u ON u.id = p.id WHERE p.id = $1`,
      [targetId]
    );
    if (!target) {
      res.status(404).json({ error: "User not found." });
      return;
    }
    if (!target.is_active) throw new ValidationError("Activate this user before sending them a link.");
    if (!target.email || isPlaceholderEmail(target.email)) throw new ValidationError("Add an email address for this user first.");
    const redirectTo = setPasswordRedirectUrl();
    if (!redirectTo) throw new Error("PUBLIC_APP_URL (or Vercel system env vars) not set; can't build the link");

    let kind: "invite" | "recovery" = !target.password_set && !target.confirmed ? "invite" : "recovery";
    let sent: { ok: true } | { ok: false; message: string } = { ok: false, message: "" };
    if (kind === "invite") {
      const { error } = await getSupabase().auth.admin.inviteUserByEmail(target.email, { redirectTo, data: { username: target.username } });
      if (!error) sent = { ok: true };
      else if (/already/i.test(error.message)) kind = "recovery"; // Supabase won't re-invite; a reset link does the same job.
      else sent = { ok: false, message: describeSendError(error) };
    }
    if (kind === "recovery") sent = await passwordLinkDeps.sendRecoveryEmail(target.email, redirectTo);
    if (!sent.ok) throw new ValidationError(sent.message);

    await audit(actor.userId, targetId, kind === "invite" ? "setup_link_sent" : "reset_link_sent");
    res.json({ ok: true, kind });
  } catch (err) {
    handleError(res, err);
  }
}));
