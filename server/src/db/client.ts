import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Server-only Supabase client. Every generic-CRUD table in this project has
// RLS enabled with zero policies, so the anon/publishable key would silently
// read/write nothing -- the service-role key (which bypasses RLS) is required
// here and must never reach the browser or a VITE_-prefixed env var.
//
// Built lazily (on first use), not at module load. shared/repository.ts (the
// generic CRUD base class used by most simple entity routers -- wastage,
// tasks, inventory, staff, orders, and more) and shared/uploads.ts both
// import this file, and server/src/app.ts imports every router
// unconditionally. Throwing here at import time -- as this used to -- meant
// a missing/wrong SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY took down
// api/index.ts's entire module load (Vercel's single serverless entry point
// for every API route), not just the routes that actually need this client.
// Same class of bug, same fix, as db/pg.ts's pool.
let client: SupabaseClient | undefined;

/**
 * The project's base URL (https://<ref>.supabase.co). Tolerates the env var
 * being set with a trailing slash or an API path such as /rest/v1 --
 * supabase-js appends its own /auth/v1, /storage/v1... paths, so anything
 * beyond the origin makes those calls 404.
 */
export function supabaseBaseUrl(): string | undefined {
  const raw = process.env.SUPABASE_URL?.trim();
  if (!raw) return undefined;
  try {
    return new URL(raw).origin;
  } catch {
    return raw.replace(/\/+$/, "");
  }
}

export function getSupabase(): SupabaseClient {
  if (client) return client;

  const SUPABASE_URL = supabaseBaseUrl();
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error(
      "SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set (server-side only). See server/.env.example."
    );
  }

  client = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return client;
}
