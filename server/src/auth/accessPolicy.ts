import type { NextFunction, Request, Response } from "express";
import type { Permission } from "../../../shared-types/auth.js";
import { readAccessToken } from "./cookies.js";
import { resolveSession, type AuthContext, type SessionFailure } from "./session.js";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      /** Set only by requireApiAccess after the session was verified server-side. */
      auth?: AuthContext;
    }
  }
}

/**
 * Who may call what, for every /api route, in one place.
 *
 * DEFAULT DENY: any /api path that matches no rule is rejected, so a newly
 * added router is locked down until someone deliberately writes a rule for
 * it. Rules are checked top to bottom; the first whose prefix matches wins,
 * so more specific prefixes must come first.
 *
 *   access: "public"        -- no session (health check, login, webhooks with their own token auth)
 *   access: "authenticated" -- any active signed-in user
 *   read / write            -- permission needed for GET/HEAD vs. any other method;
 *                              `null` means that kind of request is not allowed at all
 */
export type AccessRule =
  | { prefix: string; access: "public" }
  | { prefix: string; access: "authenticated"; allowDuringPasswordChange?: boolean }
  | { prefix: string; read: Permission | null; write: Permission | null };

export const ACCESS_RULES: AccessRule[] = [
  { prefix: "/api/health", access: "public" },
  // Petpooja / GoSelfServe are external systems, not dashboard users: they
  // authenticate with their own shared-secret token inside webhook.ts.
  { prefix: "/api/webhooks", access: "public" },
  { prefix: "/api/auth/login", access: "public" },
  { prefix: "/api/auth/refresh", access: "public" },
  { prefix: "/api/auth/logout", access: "public" },
  { prefix: "/api/auth/methods", access: "public" },
  { prefix: "/api/auth/otp", access: "public" },
  // Forgot password + completing an emailed setup/reset link: they carry their own proof (the link's token).
  { prefix: "/api/auth/password", access: "public" },
  { prefix: "/api/auth/me", access: "authenticated", allowDuringPasswordChange: true },
  { prefix: "/api/auth/change-password", access: "authenticated", allowDuringPasswordChange: true },

  { prefix: "/api/users", read: "users.manage", write: "users.manage" },
  { prefix: "/api/summaries", read: "summary.request", write: "summary.request" },

  // Live order data (Petpooja POS + online, GoSelfServe kiosk). Staff see
  // orders for operations; the revenue roll-ups need sales access.
  { prefix: "/api/provider-orders/sales-summary", read: "sales.view", write: null },
  { prefix: "/api/provider-orders/item-sales", read: "sales.view", write: null },
  { prefix: "/api/provider-orders", read: "orders.view", write: null },
  { prefix: "/api/orders", read: "orders.view", write: "orders.edit" },

  { prefix: "/api/sales/import-batches", read: "sales.view", write: "data.import" },
  { prefix: "/api/sales/import", read: null, write: "data.import" },
  { prefix: "/api/sales/target", read: "sales.view", write: "targets.edit" },
  { prefix: "/api/sales", read: "sales.view", write: null },

  // Everyone needs the business-day start hour to work out "today"; changing it is admin-only (SETTINGS_WRITE_PREFIXES).
  { prefix: "/api/datasets/settings", access: "authenticated" },
  { prefix: "/api/datasets/export.csv", read: "data.export", write: null },
  { prefix: "/api/datasets/import-batches", read: "sales.view", write: "data.import" },
  { prefix: "/api/datasets/import", read: null, write: "data.import" },
  { prefix: "/api/datasets", read: "sales.view", write: null },
  { prefix: "/api/uploads", read: null, write: "data.import" },

  { prefix: "/api/intelligence", read: "analytics.view", write: null },
  { prefix: "/api/analytics", read: "analytics.view", write: null },
  { prefix: "/api/action-center", read: "dashboard.view", write: null },
  // Ask Anything answers from live sales data; POST /ask is a read.
  { prefix: "/api/ramesh", read: "assistant.use", write: "assistant.use" },

  { prefix: "/api/wastage", read: "operations.view", write: "operations.edit" },
  { prefix: "/api/tasks", read: "operations.view", write: "operations.edit" },
  { prefix: "/api/inventory-movements", read: "operations.view", write: "operations.edit" },
  { prefix: "/api/inventory", read: "operations.view", write: "operations.edit" },
  { prefix: "/api/suppliers", read: "operations.view", write: "operations.edit" },
  { prefix: "/api/purchases", read: "operations.view", write: "operations.edit" },
  { prefix: "/api/maintenance", read: "operations.view", write: "operations.edit" },
  { prefix: "/api/complaints", read: "operations.view", write: "operations.edit" },

  { prefix: "/api/staff", read: "people.view", write: "people.edit" },
  { prefix: "/api/attendance", read: "people.view", write: "people.edit" },
  { prefix: "/api/expenses", read: "finance.view", write: "finance.edit" },
];

/** Writes to settings that change how every number is computed are admin-only. */
const SETTINGS_WRITE_PREFIXES = ["/api/datasets/settings"];
const SETTINGS_WRITE_PERMISSION: Permission = "settings.manage";

function prefixMatches(path: string, prefix: string): boolean {
  return path === prefix || path.startsWith(`${prefix}/`);
}

export function findRule(path: string, rules: AccessRule[] = ACCESS_RULES): AccessRule | undefined {
  return rules.find((r) => prefixMatches(path, r.prefix));
}

function isRead(method: string): boolean {
  return method === "GET" || method === "HEAD" || method === "OPTIONS";
}

const FAILURE_MESSAGES: Record<SessionFailure, string> = {
  missing: "Please sign in.",
  invalid: "Your session has expired. Please sign in again.",
  revoked: "Your session has ended. Please sign in again.",
  no_profile: "This account is not set up for the dashboard.",
  inactive: "This account has been deactivated.",
};

/**
 * Cross-site request guard for state-changing calls. SameSite cookies already
 * block most of this; an explicit Origin/Host comparison closes the rest.
 */
function crossSiteWrite(req: Request): boolean {
  if (isRead(req.method)) return false;
  const origin = req.headers.origin;
  if (!origin) return false; // non-browser clients (curl, server-to-server) don't send Origin
  const host = req.headers["x-forwarded-host"] ?? req.headers.host;
  try {
    const originHost = new URL(origin).host;
    if (originHost === host) return false;
    const allowed = process.env.CLIENT_ORIGIN?.split(",").map((o) => o.trim()).filter(Boolean) ?? [];
    return !allowed.includes(origin);
  } catch {
    return true;
  }
}

/** Single gate in front of every /api route. Mounted once in app.ts. */
export async function requireApiAccess(req: Request, res: Response, next: NextFunction): Promise<void> {
  // req.path is relative to the mount point; originalUrl keeps the /api prefix.
  // Lower-cased because Express routing is case-insensitive: /api/USERS must hit the same rule as /api/users.
  const path = ((req.originalUrl.split("?")[0] || "/").replace(/\/+$/, "") || "/").toLowerCase();
  // Refuse dot-segments outright so a public prefix can never be used to reach a protected route.
  if (/(^|\/)(\.|%2e){1,2}(\/|$)/i.test(path) || path.includes("%2f") || path.includes("\\")) {
    res.status(400).json({ error: "Bad request." });
    return;
  }
  const rule = findRule(path);

  if (!rule) {
    res.status(404).json({ error: "Not found." });
    return;
  }
  if ("access" in rule && rule.access === "public") {
    next();
    return;
  }

  if (crossSiteWrite(req)) {
    res.status(403).json({ error: "Cross-site request blocked.", code: "csrf" });
    return;
  }

  const session = await resolveSession(readAccessToken(req)).catch((err) => {
    console.error("[auth] session resolution failed:", err instanceof Error ? err.message : err);
    return null;
  });
  if (!session) {
    res.status(503).json({ error: "Authentication is temporarily unavailable. Please try again." });
    return;
  }
  if (!session.ok) {
    const status = session.reason === "inactive" || session.reason === "no_profile" ? 403 : 401;
    res.status(status).json({ error: FAILURE_MESSAGES[session.reason], code: `auth_${session.reason}` });
    return;
  }

  const auth = session.auth;
  req.auth = auth;

  const allowDuringPasswordChange = "access" in rule && rule.access === "authenticated" && rule.allowDuringPasswordChange;
  if (auth.profile.must_change_password && !allowDuringPasswordChange) {
    res.status(403).json({ error: "Please change your temporary password first.", code: "password_change_required" });
    return;
  }

  let needed: Permission | null | undefined;
  if ("access" in rule) {
    needed = undefined; // any authenticated user
    if (!isRead(req.method) && SETTINGS_WRITE_PREFIXES.some((p) => prefixMatches(path, p))) needed = SETTINGS_WRITE_PERMISSION;
  } else {
    needed = isRead(req.method) ? rule.read : rule.write;
    if (needed === null) {
      res.status(405).json({ error: "Method not allowed." });
      return;
    }
  }

  if (needed && !auth.permissions.has(needed)) {
    res.status(403).json({ error: "You don't have access to this.", code: "forbidden" });
    return;
  }
  next();
}

/** For handlers that need an extra, finer check inside a route. */
export function hasPermission(req: Request, permission: Permission): boolean {
  return Boolean(req.auth?.permissions.has(permission));
}
