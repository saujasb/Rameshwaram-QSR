import { getSupabase, supabaseBaseUrl } from "../db/client.js";
import { queryOne } from "../db/pg.js";
import { isRole, permissionsForRole, type AuthUser, type Permission, type Role } from "../../../shared-types/auth.js";

/** What every authenticated request carries as `req.auth`. Built only from verified/trusted data. */
export interface AuthContext {
  userId: string;
  sessionId: string | null;
  role: Role;
  permissions: Set<Permission>;
  profile: ProfileRow;
}

export interface ProfileRow {
  id: string;
  username: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  role: string;
  is_active: boolean;
  must_change_password: boolean;
}

export type SessionFailure = "missing" | "invalid" | "revoked" | "no_profile" | "inactive";

export type SessionResult = { ok: true; auth: AuthContext } | { ok: false; reason: SessionFailure };

export interface VerifiedClaims {
  sub: string;
  sessionId: string | null;
  /** Supabase `amr` entries: how this session was established (password, recovery, invite, ...). */
  amr?: { method: string; timestamp: number }[];
}

/** Sessions opened by an emailed link. They may only be used to set a password, never for dashboard access. */
export const LINK_SESSION_METHODS = ["recovery", "invite"] as const;

export function isLinkOnlySession(amr: VerifiedClaims["amr"]): boolean {
  return Boolean(amr && amr.length > 0 && amr.every((a) => (LINK_SESSION_METHODS as readonly string[]).includes(a.method)));
}

/**
 * Pluggable so tests can swap in fakes; production uses Supabase's JWKS
 * verification (ES256 keys, verified locally -- no network round trip per
 * request once the JWKS is cached) and a single Postgres lookup.
 */
export const sessionDeps = {
  async verifyAccessToken(token: string): Promise<VerifiedClaims | null> {
    const { data, error } = await getSupabase().auth.getClaims(token);
    if (error || !data?.claims) return null;
    const c = data.claims as Record<string, unknown>;
    // getClaims checks signature + exp. Also pin who issued it and for what.
    const expectedIss = `${supabaseBaseUrl()}/auth/v1`;
    if (c.iss !== expectedIss) return null;
    if (c.role !== "authenticated") return null;
    const aud = c.aud;
    if (!(aud === "authenticated" || (Array.isArray(aud) && aud.includes("authenticated")))) return null;
    if (typeof c.sub !== "string" || !c.sub) return null;
    const amr = Array.isArray(c.amr)
      ? c.amr
          .filter((a): a is { method: string; timestamp: number } => typeof a?.method === "string" && typeof a?.timestamp === "number")
          .map((a) => ({ method: a.method, timestamp: a.timestamp }))
      : undefined;
    return { sub: c.sub, sessionId: typeof c.session_id === "string" ? c.session_id : null, amr };
  },

  /** Profile + whether the Supabase session behind the JWT still exists (it's deleted on logout/revocation). */
  async loadProfile(userId: string, sessionId: string | null): Promise<{ profile: ProfileRow; sessionActive: boolean } | null> {
    const row = await queryOne<ProfileRow & { session_active: boolean }>(
      `SELECT p.id, p.username, p.full_name, p.email, p.phone, p.role, p.is_active, p.must_change_password,
              CASE WHEN $2::uuid IS NULL THEN true
                   ELSE EXISTS (SELECT 1 FROM auth.sessions s WHERE s.id = $2::uuid AND s.user_id = p.id) END AS session_active
         FROM public.profiles p
        WHERE p.id = $1::uuid`,
      [userId, sessionId]
    );
    if (!row) return null;
    const { session_active, ...profile } = row;
    return { profile, sessionActive: session_active };
  },
};

// Short cache so a page firing 10 parallel API calls doesn't do 10 profile
// lookups. Deactivation / role change / logout reach every instance within
// PROFILE_CACHE_MS; the instance that made the change clears its own entry
// immediately (invalidateUserCache).
const PROFILE_CACHE_MS = 15_000;
const cache = new Map<string, { at: number; value: { profile: ProfileRow; sessionActive: boolean } | null }>();

export function invalidateUserCache(userId?: string): void {
  if (!userId) {
    cache.clear();
    return;
  }
  for (const key of cache.keys()) if (key.startsWith(`${userId}:`)) cache.delete(key);
}

async function cachedProfile(userId: string, sessionId: string | null) {
  const key = `${userId}:${sessionId ?? ""}`;
  const hit = cache.get(key);
  const now = Date.now();
  if (hit && now - hit.at < PROFILE_CACHE_MS) return hit.value;
  const value = await sessionDeps.loadProfile(userId, sessionId);
  cache.set(key, { at: now, value });
  if (cache.size > 1000) {
    for (const [k, v] of cache) if (now - v.at >= PROFILE_CACHE_MS) cache.delete(k);
  }
  return value;
}

export async function resolveSession(token: string | undefined): Promise<SessionResult> {
  if (!token) return { ok: false, reason: "missing" };
  const claims = await sessionDeps.verifyAccessToken(token).catch(() => null);
  if (!claims) return { ok: false, reason: "invalid" };
  // A password-setup/reset link proves control of the mailbox, not the
  // password; that session is only good for POST /api/auth/password/complete.
  if (isLinkOnlySession(claims.amr)) return { ok: false, reason: "invalid" };

  const loaded = await cachedProfile(claims.sub, claims.sessionId);
  if (!loaded) return { ok: false, reason: "no_profile" };
  if (!loaded.sessionActive) return { ok: false, reason: "revoked" };
  const { profile } = loaded;
  if (!profile.is_active || !isRole(profile.role)) return { ok: false, reason: "inactive" };

  return {
    ok: true,
    auth: {
      userId: profile.id,
      sessionId: claims.sessionId,
      role: profile.role,
      permissions: new Set(permissionsForRole(profile.role)),
      profile,
    },
  };
}

export function toAuthUser(auth: AuthContext): AuthUser {
  const p = auth.profile;
  return {
    id: p.id,
    username: p.username,
    fullName: p.full_name,
    email: p.email,
    phone: p.phone,
    role: auth.role,
    mustChangePassword: p.must_change_password,
    permissions: [...auth.permissions],
  };
}
