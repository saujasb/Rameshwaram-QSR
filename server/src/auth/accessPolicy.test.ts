import { test, before, after, beforeEach } from "node:test";
import assert from "node:assert/strict";
import type { AddressInfo } from "node:net";
import type { Server } from "node:http";
import express from "express";
import http from "node:http";
import { requireApiAccess, ACCESS_RULES, findRule } from "./accessPolicy.js";
import { invalidateUserCache, sessionDeps, type ProfileRow } from "./session.js";
import { parseCookies } from "./cookies.js";
import { ROLE_PERMISSIONS, roleHasPermission } from "../../../shared-types/auth.js";

// Fake identity provider: token "tok-<username>" is valid for that user.
const users: Record<string, ProfileRow & { sessionActive?: boolean }> = {};
function addUser(username: string, role: string, extra: Partial<ProfileRow & { sessionActive: boolean }> = {}) {
  users[username] = {
    id: `00000000-0000-0000-0000-${String(Object.keys(users).length + 1).padStart(12, "0")}`,
    username,
    full_name: username,
    email: null,
    phone: null,
    role,
    is_active: true,
    must_change_password: false,
    ...extra,
  };
}

const realDeps = { ...sessionDeps };
let server: Server;
let base: string;

before(async () => {
  addUser("admin1", "admin");
  addUser("manager1", "manager");
  addUser("staff1", "staff");
  addUser("viewer1", "viewer");
  addUser("inactive1", "admin", { is_active: false });
  addUser("newbie", "manager", { must_change_password: true });
  addUser("loggedout", "admin", { sessionActive: false });

  sessionDeps.verifyAccessToken = async (token) => {
    const m = /^tok-(.+)$/.exec(token);
    if (!m || !users[m[1]]) return null;
    return { sub: users[m[1]].id, sessionId: `sess-${m[1]}` };
  };
  sessionDeps.loadProfile = async (userId) => {
    const u = Object.values(users).find((x) => x.id === userId);
    if (!u) return null;
    const { sessionActive, ...profile } = u;
    return { profile, sessionActive: sessionActive ?? true };
  };

  const app = express();
  app.use(express.json());
  app.use("/api", requireApiAccess);
  // Stand-in for every real router: reports what the gate let through.
  app.all("*", (req, res) => {
    res.json({ reached: true, userId: req.auth?.userId ?? null, role: req.auth?.role ?? null });
  });
  await new Promise<void>((resolve) => {
    server = app.listen(0, resolve);
  });
  base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
});

after(() => {
  Object.assign(sessionDeps, realDeps);
  server.close();
});

beforeEach(() => invalidateUserCache());

async function call(method: string, path: string, opts: { user?: string; cookie?: boolean; headers?: Record<string, string>; body?: unknown } = {}) {
  const headers: Record<string, string> = { ...(opts.headers ?? {}) };
  if (opts.user) {
    if (opts.cookie) headers.cookie = `rqsr_at=tok-${opts.user}`;
    else headers.authorization = `Bearer tok-${opts.user}`;
  }
  if (opts.body !== undefined) headers["content-type"] = "application/json";
  const res = await fetch(`${base}${path}`, { method, headers, body: opts.body === undefined ? undefined : JSON.stringify(opts.body) });
  const json = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  return { status: res.status, json };
}

// ---- Authentication ------------------------------------------------------

test("unauthenticated requests to protected data APIs are rejected with 401", async () => {
  for (const path of [
    "/api/provider-orders",
    "/api/provider-orders/sales-summary",
    "/api/sales/summary",
    "/api/datasets/records",
    "/api/datasets/export.csv",
    "/api/analytics/snapshot",
    "/api/intelligence/today",
    "/api/action-center",
    "/api/wastage",
    "/api/users",
    "/api/auth/me",
  ]) {
    const r = await call("GET", path);
    assert.equal(r.status, 401, path);
    assert.equal(r.json.reached, undefined, path);
  }
  assert.equal((await call("POST", "/api/ramesh/ask", { body: { question: "sales today" } })).status, 401);
});

test("public endpoints stay reachable without a session", async () => {
  for (const [method, path] of [
    ["GET", "/api/health"],
    ["POST", "/api/auth/login"],
    ["POST", "/api/auth/refresh"],
    ["POST", "/api/auth/logout"],
    ["GET", "/api/auth/methods"],
    ["POST", "/api/webhooks/petpooja/order"],
    ["POST", "/api/webhooks/goselfserve/order"],
  ] as const) {
    const r = await call(method, path);
    assert.equal(r.status, 200, `${method} ${path}`);
    assert.equal(r.json.reached, true);
  }
});

test("unknown /api paths are denied by default", async () => {
  assert.equal((await call("GET", "/api/not-a-real-route", { user: "admin1" })).status, 404);
  assert.equal((await call("GET", "/api/not-a-real-route")).status, 404);
});

test("session cookie and bearer header both authenticate", async () => {
  assert.equal((await call("GET", "/api/auth/me", { user: "viewer1", cookie: true })).status, 200);
  assert.equal((await call("GET", "/api/auth/me", { user: "viewer1" })).status, 200);
});

test("invalid/forged tokens, revoked sessions and inactive accounts are rejected", async () => {
  const forged = await fetch(`${base}/api/provider-orders`, { headers: { authorization: "Bearer not-a-real-jwt" } });
  assert.equal(forged.status, 401);
  assert.equal((await call("GET", "/api/provider-orders", { user: "loggedout" })).status, 401);
  const inactive = await call("GET", "/api/provider-orders", { user: "inactive1" });
  assert.equal(inactive.status, 403);
  assert.equal(inactive.json.code, "auth_inactive");
});

test("a user with a temporary password can only reach /auth/me and change-password", async () => {
  const r = await call("GET", "/api/provider-orders", { user: "newbie" });
  assert.equal(r.status, 403);
  assert.equal(r.json.code, "password_change_required");
  assert.equal((await call("GET", "/api/auth/me", { user: "newbie" })).status, 200);
  assert.equal((await call("POST", "/api/auth/change-password", { user: "newbie", body: {} })).status, 200);
});

// ---- Authorization -------------------------------------------------------

const matrix: Array<[string, string, Record<string, number>]> = [
  // [method, path, expected status per user]
  ["GET", "/api/users", { admin1: 200, manager1: 403, staff1: 403, viewer1: 403 }],
  ["POST", "/api/users", { admin1: 200, manager1: 403, staff1: 403, viewer1: 403 }],
  ["PATCH", "/api/users/00000000-0000-0000-0000-000000000002", { admin1: 200, manager1: 403, staff1: 403, viewer1: 403 }],
  ["GET", "/api/provider-orders", { admin1: 200, manager1: 200, staff1: 200, viewer1: 200 }],
  ["GET", "/api/provider-orders/sales-summary", { admin1: 200, manager1: 200, staff1: 403, viewer1: 200 }],
  ["GET", "/api/provider-orders/item-sales", { admin1: 200, manager1: 200, staff1: 403, viewer1: 200 }],
  ["POST", "/api/provider-orders", { admin1: 405, manager1: 405, staff1: 405, viewer1: 405 }],
  ["GET", "/api/sales/summary", { admin1: 200, manager1: 200, staff1: 403, viewer1: 200 }],
  ["PUT", "/api/sales/target", { admin1: 200, manager1: 200, staff1: 403, viewer1: 403 }],
  ["POST", "/api/sales/import", { admin1: 200, manager1: 200, staff1: 403, viewer1: 403 }],
  ["DELETE", "/api/datasets/import-batches/x", { admin1: 200, manager1: 200, staff1: 403, viewer1: 403 }],
  ["GET", "/api/datasets/settings", { admin1: 200, manager1: 200, staff1: 200, viewer1: 200 }],
  ["PUT", "/api/datasets/settings", { admin1: 200, manager1: 403, staff1: 403, viewer1: 403 }],
  ["GET", "/api/datasets/export.csv", { admin1: 200, manager1: 200, staff1: 403, viewer1: 200 }],
  ["POST", "/api/uploads/sign", { admin1: 200, manager1: 200, staff1: 403, viewer1: 403 }],
  ["GET", "/api/analytics/snapshot", { admin1: 200, manager1: 200, staff1: 403, viewer1: 200 }],
  ["GET", "/api/action-center", { admin1: 200, manager1: 200, staff1: 403, viewer1: 200 }],
  ["POST", "/api/ramesh/ask", { admin1: 200, manager1: 200, staff1: 403, viewer1: 200 }],
  ["GET", "/api/wastage", { admin1: 200, manager1: 200, staff1: 200, viewer1: 200 }],
  ["POST", "/api/wastage", { admin1: 200, manager1: 200, staff1: 200, viewer1: 403 }],
  ["DELETE", "/api/tasks/abc", { admin1: 200, manager1: 200, staff1: 200, viewer1: 403 }],
  ["POST", "/api/orders", { admin1: 200, manager1: 200, staff1: 200, viewer1: 403 }],
  ["GET", "/api/expenses", { admin1: 200, manager1: 200, staff1: 403, viewer1: 200 }],
  ["POST", "/api/expenses", { admin1: 200, manager1: 200, staff1: 403, viewer1: 403 }],
  ["GET", "/api/staff", { admin1: 200, manager1: 200, staff1: 403, viewer1: 200 }],
  ["POST", "/api/summaries/deliver", { admin1: 200, manager1: 200, staff1: 403, viewer1: 200 }],
];

test("role matrix: each role can reach exactly what it should", async () => {
  for (const [method, path, expected] of matrix) {
    for (const [user, status] of Object.entries(expected)) {
      const r = await call(method, path, { user, body: method === "GET" ? undefined : {} });
      assert.equal(r.status, status, `${user} ${method} ${path}`);
    }
  }
});

test("client-supplied role / user id cannot bypass authorization", async () => {
  const spoofHeaders = { "x-role": "admin", "x-user-id": users.admin1.id, "x-user-role": "admin" };
  const r1 = await call("GET", "/api/users?role=admin&userId=" + users.admin1.id, { user: "viewer1", headers: spoofHeaders });
  assert.equal(r1.status, 403);
  const r2 = await call("POST", "/api/users", { user: "manager1", body: { role: "admin", userId: users.admin1.id, auth: { role: "admin" } } });
  assert.equal(r2.status, 403);
  // Identity always comes from the verified token, not the request.
  const r3 = await call("GET", "/api/wastage?userId=" + users.admin1.id, { user: "staff1", headers: spoofHeaders });
  assert.equal(r3.status, 200);
  assert.equal(r3.json.userId, users.staff1.id);
  assert.equal(r3.json.role, "staff");
});

test("path tricks can't reach a protected route through a public prefix", async () => {
  // fetch() normalizes dot-segments itself, so send the raw path over http.
  const raw = (path: string) =>
    new Promise<number>((resolve, reject) => {
      const { hostname, port } = new URL(base);
      const req = http.request({ hostname, port, path, method: "GET" }, (res) => {
        res.resume();
        resolve(res.statusCode ?? 0);
      });
      req.on("error", reject);
      req.end();
    });
  assert.equal(await raw("/api/health/../users"), 400);
  assert.equal(await raw("/api/webhooks/../users"), 400);
  assert.equal(await raw("/api/health/%2e%2e/users"), 400);
  assert.equal(await raw("/api/webhooks/..%2fusers"), 400);
  // Express matches routes case-insensitively, so the gate must too.
  assert.equal((await call("GET", "/api/USERS")).status, 401);
  assert.equal((await call("GET", "/api/USERS", { user: "viewer1" })).status, 403);
  assert.equal((await call("GET", "/api/Users/", { user: "admin1" })).status, 200);
});

test("cross-site state-changing requests are blocked; same-origin ones pass", async () => {
  const evil = await call("POST", "/api/wastage", { user: "admin1", cookie: true, headers: { origin: "https://evil.example" }, body: {} });
  assert.equal(evil.status, 403);
  const same = await call("POST", "/api/wastage", { user: "admin1", cookie: true, headers: { origin: base }, body: {} });
  assert.equal(same.status, 200);
  const read = await call("GET", "/api/wastage", { user: "admin1", cookie: true, headers: { origin: "https://evil.example" } });
  assert.equal(read.status, 200);
});

test("more specific rules win over broader ones", () => {
  assert.equal((findRule("/api/sales/import-batches") as { write: string }).write, "data.import");
  assert.equal((findRule("/api/provider-orders/sales-summary") as { read: string }).read, "sales.view");
  assert.equal((findRule("/api/inventory-movements/by-item/1") as { prefix: string }).prefix, "/api/inventory-movements");
  assert.equal(findRule("/api/salesx"), undefined);
  assert.ok(ACCESS_RULES.length > 20);
});

test("role permission model", () => {
  assert.ok(roleHasPermission("admin", "users.manage"));
  for (const role of ["manager", "staff", "viewer"] as const) assert.ok(!roleHasPermission(role, "users.manage"), role);
  assert.ok(!roleHasPermission("manager", "settings.manage"));
  for (const p of ROLE_PERMISSIONS.viewer) assert.ok(p.endsWith(".view") || ["data.export", "assistant.use", "summary.request"].includes(p), p);
  assert.ok(!roleHasPermission("staff", "sales.view"));
});

test("cookie parser", () => {
  assert.deepEqual(parseCookies("a=1; rqsr_at=abc%3D; b"), { a: "1", rqsr_at: "abc=" });
  assert.deepEqual(parseCookies(undefined), {});
});
