// In dev, Vite's proxy forwards "/api" to the local server (see vite.config.ts).
// In production, the client and API are one Vercel project (see /vercel.json's
// /api/:path* rewrite), so the same-origin "/api" default just works. Only set
// VITE_API_BASE_URL if the API is ever split into a separate deployment.
export const BASE = import.meta.env.VITE_API_BASE_URL ?? "/api";

// The session lives in HttpOnly cookies the browser attaches to every
// same-origin /api request automatically -- this code never sees the tokens.
// When the short-lived access token expires the API answers 401; apiFetch
// then asks /auth/refresh for a new one (once, shared by every request that
// hit the 401 at the same moment) and retries. If refresh fails the session
// is over and AuthProvider shows the login screen.

const SESSION_ENDED_EVENT = "rqsr:session-ended";

let refreshing: Promise<boolean> | null = null;

export function refreshSession(): Promise<boolean> {
  if (!refreshing) {
    refreshing = fetch(`${BASE}/auth/refresh`, { method: "POST", credentials: "same-origin" })
      .then((res) => res.ok)
      .catch(() => false)
      .finally(() => {
        // Let the next expiry trigger a fresh refresh.
        setTimeout(() => {
          refreshing = null;
        }, 0);
      });
  }
  return refreshing;
}

export function onSessionEnded(listener: () => void): () => void {
  window.addEventListener(SESSION_ENDED_EVENT, listener);
  return () => window.removeEventListener(SESSION_ENDED_EVENT, listener);
}

function isAuthPath(url: string): boolean {
  return url.startsWith(`${BASE}/auth/`);
}

/** fetch() for /api URLs, with transparent session refresh. Use for every API call. */
export async function apiFetch(url: string, init: RequestInit = {}): Promise<Response> {
  const res = await fetch(url, { credentials: "same-origin", ...init });
  if (res.status !== 401 || isAuthPath(url)) return res;

  if (await refreshSession()) {
    return fetch(url, { credentials: "same-origin", ...init });
  }
  window.dispatchEvent(new Event(SESSION_ENDED_EVENT));
  return res;
}

export class ApiError extends Error {
  constructor(message: string, readonly status: number, readonly code?: string) {
    super(message);
  }
}

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: res.statusText }));
    throw new ApiError(body.error ?? `Request failed with ${res.status}`, res.status, body.code);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export function apiGet<T>(path: string): Promise<T> {
  return apiFetch(`${BASE}${path}`).then((res) => handle<T>(res));
}

export function apiPost<T>(path: string, body?: unknown): Promise<T> {
  return apiFetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body ?? {}),
  }).then((res) => handle<T>(res));
}

export function apiPut<T>(path: string, body: unknown): Promise<T> {
  return apiFetch(`${BASE}${path}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }).then((res) => handle<T>(res));
}

export function apiPatch<T>(path: string, body: unknown): Promise<T> {
  return apiFetch(`${BASE}${path}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }).then((res) => handle<T>(res));
}

export function apiDelete(path: string): Promise<void> {
  return apiFetch(`${BASE}${path}`, { method: "DELETE" }).then((res) => handle<void>(res));
}
