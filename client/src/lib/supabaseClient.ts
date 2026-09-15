import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Publishable/anon key only -- safe to expose to the browser (see
// client/.env.example). Never the service-role key; that one stays
// server-only (server/.env.example). This client can only SELECT from
// provider_orders, per its read-only RLS policy -- no writes are possible
// from here.
//
// Realtime is optional infrastructure, not a hard requirement: if these env
// vars aren't set, `supabase` is null and callers (useProviderOrdersRealtime)
// fall back to the existing poll instead of throwing.
const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const supabase: SupabaseClient | null = url && key ? createClient(url, key) : null;
