import { test, before, after, beforeEach } from "node:test";
import assert from "node:assert/strict";
import type { AddressInfo } from "node:net";
import http, { type Server } from "node:http";
import express from "express";
import { PASSWORD_RESET_REQUESTED_MESSAGE } from "../../../shared-types/auth.js";
import { appBaseUrl, linkSessionType, passwordLinkDeps, passwordLinkRouter, setPasswordRedirectUrl } from "./passwordLinks.js";
import { invalidateUserCache, isLinkOnlySession, resolveSession, sessionDeps, type ProfileRow, type VerifiedClaims } from "./session.js";
import { throttleDeps } from "./loginThrottle.js";
import { requireApiAccess } from "./accessPolicy.js";
import { normalizeLoginIdentifier } from "./routes.js";

const now = () => Math.floor(Date.now() / 1000);

// ---------------------------------------------------------------------------
// Pure helpers
// ---------------------------------------------------------------------------

test("appBaseUrl: explicit PUBLIC_APP_URL wins, then Vercel's own production/preview URLs", () => {
  assert.equal(appBaseUrl({ PUBLIC_APP_URL: "https://dash.example.com/some/path", VERCEL_ENV: "production", VERCEL_PROJECT_PRODUCTION_URL: "x.vercel.app" }), "https://dash.example.com");
  assert.equal(appBaseUrl({ VERCEL_ENV: "production", VERCEL_PROJECT_PRODUCTION_URL: "prod.vercel.app", VERCEL_URL: "deploy-abc.vercel.app" }), "https://prod.vercel.app");
  assert.equal(appBaseUrl({ VERCEL_ENV: "preview", VERCEL_PROJECT_PRODUCTION_URL: "prod.vercel.app", VERCEL_URL: "deploy-abc.vercel.app" }), "https://deploy-abc.vercel.app");
  assert.equal(appBaseUrl({ PUBLIC_APP_URL: "http://localhost:5173" }), "http://localhost:5173");
  assert.equal(appBaseUrl({ PUBLIC_APP_URL: "http://evil.example.com" }), null, "plain http is refused outside localhost");
  assert.equal(appBaseUrl({}), null);
  assert.equal(setPasswordRedirectUrl({ PUBLIC_APP_URL: "https://dash.example.com" }), "https://dash.example.com/set-password");
});

test("linkSessionType: only fresh invite/recovery-only sessions qualify", () => {
  assert.equal(linkSessionType([{ method: "recovery", timestamp: now() }], now()), "recovery");
  assert.equal(linkSessionType([{ method: "invite", timestamp: now() - 60 }], now()), "invite");
  assert.equal(linkSessionType([{ method: "password", timestamp: now() }], now()), null, "a normal login can't skip the current password");
  assert.equal(linkSessionType([{ method: "password", timestamp: now() }, { method: "recovery", timestamp: now() }], now()), null);
  assert.equal(linkSessionType([{ method: "recovery", timestamp: now() - 2 * 3600 }], now()), null, "stale link session");
  assert.equal(linkSessionType(undefined, now()), null);
  assert.equal(linkSessionType([], now()), null);
});

test("isLinkOnlySession", () => {
  assert.equal(isLinkOnlySession([{ method: "recovery", timestamp: 1 }]), true);
  assert.equal(isLinkOnlySession([{ method: "invite", timestamp: 1 }]), true);
  assert.equal(isLinkOnlySession([{ method: "password", timestamp: 1 }]), false);
  assert.equal(isLinkOnlySession(undefined), false);
});

test("normalizeLoginIdentifier: username or email, case-insensitive", () => {
  assert.deepEqual(normalizeLoginIdentifier("  Ravi.K "), { kind: "username", value: "ravi.k" });
  assert.deepEqual(normalizeLoginIdentifier("Ravi@Example.com"), { kind: "email", value: "ravi@example.com" });
  assert.equal(normalizeLoginIdentifier(""), null);
  assert.equal(normalizeLoginIdentifier(42), null);
  assert.equal(normalizeLoginIdentifier(`${"a".repeat(250)}@x.com`), null);
});

// ---------------------------------------------------------------------------
// HTTP: /api/auth/password/* and the API gate, with Supabase/Postgres faked
// ---------------------------------------------------------------------------

type FakeUser = ProfileRow & { sessions: Set<string> };
const users: FakeUser[] = [];
const tokens = new Map<string, VerifiedClaims>();
const calls = {
  sent: [] as string[],
  setPassword: [] as { userId: string; password: string }[],
  recorded: [] as { userId: string; via: string }[],
  revoked: [] as string[],
  verifiedHashes: [] as string[],
};
let pending: Promise<unknown>[] = [];
const throttleRows: { key: string; ip: string }[] = [];

const realSessionDeps = { ...sessionDeps };
const realLinkDeps = { ...passwordLinkDeps };
const realThrottleDeps = { ...throttleDeps };
const saved = { PUBLIC_APP_URL: process.env.PUBLIC_APP_URL };
let server: Server;
let base: string;

function addUser(id: string, username: string, email: string, extra: Partial<ProfileRow> = {}): FakeUser {
  const u: FakeUser = {
    id,
    username,
    full_name: username,
    email,
    phone: null,
    role: "staff",
    is_active: true,
    must_change_password: false,
    sessions: new Set(),
    ...extra,
  };
  users.push(u);
  return u;
}

/** Mints a fake access token for `user` whose session was opened by `method`. */
function token(user: FakeUser, method: string, ageSec = 0): string {
  const sessionId = `sess-${user.username}-${method}-${tokens.size}`;
  user.sessions.add(sessionId);
  const t = `tok-${tokens.size}`;
  tokens.set(t, { sub: user.id, sessionId, amr: [{ method, timestamp: now() - ageSec }] });
  return t;
}

async function post(path: string, body: unknown, headers: Record<string, string> = {}) {
  const res = await fetch(`${base}${path}`, {
    method: "POST",
    headers: { "content-type": "application/json", ...headers },
    body: JSON.stringify(body),
  });
  return { status: res.status, body: (await res.json().catch(() => ({}))) as Record<string, unknown> };
}

before(async () => {
  process.env.PUBLIC_APP_URL = "https://dash.example.com";
  addUser("11111111-1111-1111-1111-111111111111", "alice", "alice@example.com");
  addUser("22222222-2222-2222-2222-222222222222", "bob", "bob@example.com", { role: "viewer" });
  addUser("33333333-3333-3333-3333-333333333333", "gone", "gone@example.com", { is_active: false });

  sessionDeps.verifyAccessToken = async (t) => tokens.get(t) ?? null;
  sessionDeps.loadProfile = async (userId, sessionId) => {
    const u = users.find((x) => x.id === userId);
    if (!u) return null;
    const { sessions, ...profile } = u;
    return { profile, sessionActive: sessionId === null || sessions.has(sessionId) };
  };
  throttleDeps.countFailures = async (key, ip) => ({
    byUser: throttleRows.filter((r) => r.key === key).length,
    byIp: throttleRows.filter((r) => r.ip === ip).length,
  });
  throttleDeps.record = async (key, ip, success) => {
    if (!success) throttleRows.push({ key, ip });
  };
  passwordLinkDeps.findActiveAccountByEmail = async (email) => {
    const u = users.find((x) => x.email === email && x.is_active);
    return u ? { userId: u.id, username: u.username } : null;
  };
  passwordLinkDeps.sendRecoveryEmail = async (email) => {
    calls.sent.push(email);
    return { ok: true };
  };
  passwordLinkDeps.verifyTokenHash = async (hash, type) => {
    calls.verifiedHashes.push(hash);
    return hash === "good-hash" ? token(users[1], type) : null;
  };
  passwordLinkDeps.setPassword = async (userId, password) => {
    calls.setPassword.push({ userId, password });
    return { ok: true };
  };
  passwordLinkDeps.recordPasswordSet = async (userId, via) => {
    calls.recorded.push({ userId, via });
  };
  passwordLinkDeps.revokeAllSessions = async (userId) => {
    calls.revoked.push(userId);
    users.find((u) => u.id === userId)?.sessions.clear();
    invalidateUserCache(userId);
  };
  passwordLinkDeps.clearLoginFailures = async () => {};
  passwordLinkDeps.defer = (task) => {
    pending.push(task);
  };

  const app = express();
  app.use(express.json());
  app.use("/api", requireApiAccess);
  app.use("/api/auth/password", passwordLinkRouter);
  app.all("*", (req, res) => res.json({ reached: true, userId: req.auth?.userId ?? null }));
  await new Promise<void>((resolve) => {
    server = http.createServer(app).listen(0, "127.0.0.1", resolve);
  });
  base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
});

after(async () => {
  Object.assign(sessionDeps, realSessionDeps);
  Object.assign(passwordLinkDeps, realLinkDeps);
  Object.assign(throttleDeps, realThrottleDeps);
  process.env.PUBLIC_APP_URL = saved.PUBLIC_APP_URL;
  if (saved.PUBLIC_APP_URL === undefined) delete process.env.PUBLIC_APP_URL;
  await new Promise<void>((resolve) => server.close(() => resolve()));
});

beforeEach(() => {
  for (const list of Object.values(calls)) list.length = 0;
  pending = [];
  throttleRows.length = 0;
  invalidateUserCache();
});

test("forgot: same response whether or not the account exists; email only goes to real active accounts", async () => {
  const known = await post("/api/auth/password/forgot", { email: "Alice@Example.com" });
  const unknown = await post("/api/auth/password/forgot", { email: "nobody@example.com" });
  const inactive = await post("/api/auth/password/forgot", { email: "gone@example.com" });
  await Promise.all(pending);

  for (const r of [known, unknown, inactive]) {
    assert.equal(r.status, 200);
    assert.deepEqual(r.body, { ok: true, message: PASSWORD_RESET_REQUESTED_MESSAGE });
  }
  assert.deepEqual(calls.sent, ["alice@example.com"]);
});

test("forgot: rejects malformed input and rate-limits per address", async () => {
  assert.equal((await post("/api/auth/password/forgot", { email: "not-an-email" })).status, 400);
  assert.equal((await post("/api/auth/password/forgot", {})).status, 400);
  for (let i = 0; i < 5; i++) assert.equal((await post("/api/auth/password/forgot", { email: "alice@example.com" })).status, 200);
  const limited = await post("/api/auth/password/forgot", { email: "alice@example.com" });
  assert.equal(limited.status, 429);
  // The limit is identical for a non-existent address, so it reveals nothing.
  for (let i = 0; i < 5; i++) await post("/api/auth/password/forgot", { email: "ghost@example.com" });
  assert.equal((await post("/api/auth/password/forgot", { email: "ghost@example.com" })).status, 429);
});

test("complete: a recovery link sets only that user's password, then ends every session (single use)", async () => {
  const alice = users[0];
  const other = token(alice, "password"); // an existing signed-in session elsewhere
  const link = token(alice, "recovery");

  const res = await post("/api/auth/password/complete", {
    accessToken: link,
    password: "a-brand-new-password",
    // Anything else in the body is ignored: role, target user, status.
    role: "admin",
    userId: users[1].id,
    isActive: true,
  });
  assert.equal(res.status, 200);
  assert.deepEqual(calls.setPassword, [{ userId: alice.id, password: "a-brand-new-password" }]);
  assert.deepEqual(calls.recorded, [{ userId: alice.id, via: "recovery" }]);
  assert.deepEqual(calls.revoked, [alice.id]);
  assert.equal(alice.role, "staff", "role untouched");
  assert.equal(alice.sessions.size, 0, "old sessions and the link session are gone");

  const replay = await post("/api/auth/password/complete", { accessToken: link, password: "another-password-123" });
  assert.equal(replay.status, 400, "the same link can't be used twice");
  assert.equal(replay.body.code, "link_invalid");
  const oldSession = await fetch(`${base}/api/users`, { headers: { authorization: `Bearer ${other}` } });
  assert.equal(oldSession.status, 401, "sessions from before the reset no longer work");
});

test("complete: an invite link records account setup", async () => {
  const bob = users[1];
  const res = await post("/api/auth/password/complete", { accessToken: token(bob, "invite"), password: "bobs-own-password" });
  assert.equal(res.status, 200);
  assert.deepEqual(calls.recorded, [{ userId: bob.id, via: "invite" }]);
});

test("complete: refuses normal sessions, stale links, forged tokens, inactive users and short passwords", async () => {
  const alice = users[0];
  const cases: [string, Record<string, unknown>, number][] = [
    ["normal password session", { accessToken: token(alice, "password"), password: "long-enough-pw" }, 400],
    ["stale recovery session", { accessToken: token(alice, "recovery", 2 * 3600), password: "long-enough-pw" }, 400],
    ["forged token", { accessToken: "not-a-real-token", password: "long-enough-pw" }, 400],
    ["no token", { password: "long-enough-pw" }, 400],
    ["bad token hash", { tokenHash: "bad-hash", type: "recovery", password: "long-enough-pw" }, 400],
    ["short password", { accessToken: token(alice, "recovery"), password: "short" }, 400],
    ["inactive user", { accessToken: token(users[2], "recovery"), password: "long-enough-pw" }, 403],
  ];
  for (const [name, body, status] of cases) {
    const res = await post("/api/auth/password/complete", body);
    assert.equal(res.status, status, name);
  }
  assert.deepEqual(calls.setPassword, [], "no password was changed");
});

test("complete: accepts a token_hash link (custom email template) verified server-side", async () => {
  const res = await post("/api/auth/password/complete", { tokenHash: "good-hash", type: "recovery", password: "long-enough-pw" });
  assert.equal(res.status, 200);
  assert.deepEqual(calls.verifiedHashes, ["good-hash"]);
  assert.equal(calls.setPassword[0].userId, users[1].id);
});

test("gate: link sessions can't be used for dashboard access; the password endpoints are public", async () => {
  const alice = users[0];
  for (const method of ["recovery", "invite"]) {
    const res = await fetch(`${base}/api/provider-orders`, { headers: { authorization: `Bearer ${token(alice, method)}` } });
    assert.equal(res.status, 401, `${method} session refused`);
  }
  const normal = await fetch(`${base}/api/provider-orders`, { headers: { authorization: `Bearer ${token(alice, "password")}` } });
  assert.equal(normal.status, 200, "a normal staff session works");
  const rbac = await fetch(`${base}/api/users`, { headers: { authorization: `Bearer ${token(alice, "password")}` } });
  assert.equal(rbac.status, 403, "and RBAC still applies: staff can't manage users");

  const resolved = await resolveSession(token(alice, "recovery"));
  assert.deepEqual(resolved, { ok: false, reason: "invalid" });
});
