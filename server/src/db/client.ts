import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Server-only Supabase client. Every generic-CRUD table in this project has
// RLS enabled with zero policies, so the anon/publishable key would silently
// read/write nothing -- the service-role key (which bypasses RLS) is required
// here and must never reach the browser or a VITE_-prefixed env var.
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error(
    "SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set (server-side only). See server/.env.example."
  );
}

export const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});
