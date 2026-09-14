// In dev, Vite's proxy forwards "/api" to the local server (see vite.config.ts).
// In production, the client and API are one Vercel project (see /vercel.json's
// /api/:path* rewrite), so the same-origin "/api" default just works. Only set
// VITE_API_BASE_URL if the API is ever split into a separate deployment.
const BASE = import.meta.env.VITE_API_BASE_URL ?? "/api";

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(body.error ?? `Request failed with ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export function apiGet<T>(path: string): Promise<T> {
  return fetch(`${BASE}${path}`).then((res) => handle<T>(res));
}

export function apiPost<T>(path: string, body?: unknown): Promise<T> {
  return fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body ?? {}),
  }).then((res) => handle<T>(res));
}

export function apiPut<T>(path: string, body: unknown): Promise<T> {
  return fetch(`${BASE}${path}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }).then((res) => handle<T>(res));
}

export function apiDelete(path: string): Promise<void> {
  return fetch(`${BASE}${path}`, { method: "DELETE" }).then((res) => handle<void>(res));
}
