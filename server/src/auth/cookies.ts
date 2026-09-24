import type { Request, Response } from "express";

// Session tokens live in HttpOnly cookies, never in JS-readable storage:
//   * XSS can't read them.
//   * Same-origin fetch() and plain <a href="/api/...csv"> downloads carry
//     them automatically, so no call site has to attach a header.
// SameSite=Lax (access) / Strict (refresh) stops other sites from riding the
// session on state-changing requests; accessPolicy.ts adds an Origin check
// on top for defence in depth.
export const ACCESS_COOKIE = "rqsr_at";
export const REFRESH_COOKIE = "rqsr_rt";
const REFRESH_PATH = "/api/auth";
const REFRESH_MAX_AGE_SEC = 30 * 24 * 60 * 60;

export function parseCookies(header: string | undefined): Record<string, string> {
  const out: Record<string, string> = {};
  if (!header) return out;
  for (const part of header.split(";")) {
    const i = part.indexOf("=");
    if (i < 0) continue;
    const name = part.slice(0, i).trim();
    if (!name || name in out) continue;
    const raw = part.slice(i + 1).trim();
    try {
      out[name] = decodeURIComponent(raw);
    } catch {
      out[name] = raw;
    }
  }
  return out;
}

export function readCookie(req: Request, name: string): string | undefined {
  return parseCookies(req.headers.cookie)[name] || undefined;
}

function isSecure(req: Request): boolean {
  if (process.env.VERCEL) return true;
  return req.secure || req.headers["x-forwarded-proto"] === "https";
}

function serialize(name: string, value: string, opts: { path: string; maxAgeSec: number; sameSite: "Lax" | "Strict"; secure: boolean }): string {
  const parts = [
    `${name}=${encodeURIComponent(value)}`,
    `Path=${opts.path}`,
    `Max-Age=${Math.max(0, Math.floor(opts.maxAgeSec))}`,
    "HttpOnly",
    `SameSite=${opts.sameSite}`,
  ];
  if (opts.secure) parts.push("Secure");
  return parts.join("; ");
}

export interface SessionTokens {
  accessToken: string;
  refreshToken: string;
  /** Seconds until the access token expires. */
  expiresIn: number;
}

export function setSessionCookies(req: Request, res: Response, tokens: SessionTokens): void {
  const secure = isSecure(req);
  res.append("Set-Cookie", serialize(ACCESS_COOKIE, tokens.accessToken, { path: "/api", maxAgeSec: tokens.expiresIn, sameSite: "Lax", secure }));
  res.append("Set-Cookie", serialize(REFRESH_COOKIE, tokens.refreshToken, { path: REFRESH_PATH, maxAgeSec: REFRESH_MAX_AGE_SEC, sameSite: "Strict", secure }));
}

export function clearSessionCookies(req: Request, res: Response): void {
  const secure = isSecure(req);
  res.append("Set-Cookie", serialize(ACCESS_COOKIE, "", { path: "/api", maxAgeSec: 0, sameSite: "Lax", secure }));
  res.append("Set-Cookie", serialize(REFRESH_COOKIE, "", { path: REFRESH_PATH, maxAgeSec: 0, sameSite: "Strict", secure }));
}

/** Access token from the session cookie, or an explicit `Authorization: Bearer` header (for non-browser callers). */
export function readAccessToken(req: Request): string | undefined {
  const auth = req.headers.authorization;
  if (auth && /^Bearer\s+/i.test(auth)) return auth.replace(/^Bearer\s+/i, "").trim() || undefined;
  return readCookie(req, ACCESS_COOKIE);
}

/** Best-effort client IP for throttling. Vercel sets x-real-ip / x-forwarded-for itself. */
export function clientIp(req: Request): string {
  const real = req.headers["x-real-ip"];
  if (typeof real === "string" && real) return real;
  const fwd = req.headers["x-forwarded-for"];
  if (typeof fwd === "string" && fwd) return fwd.split(",")[0].trim();
  return req.socket.remoteAddress ?? "unknown";
}
