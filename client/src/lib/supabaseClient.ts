import type { SupabaseClient } from "@supabase/supabase-js";

// Supabase Realtime for the Live Sales feed is switched OFF.
//
// It used to subscribe with the publishable (anon) key, which relied on an
// RLS policy letting *anyone* holding that key -- it ships in the browser
// bundle -- read provider_orders. That policy was removed: order data is now
// readable only by signed-in, active dashboard users. The dashboard's session
// lives in HttpOnly cookies (never exposed to JavaScript), so there is no
// user JWT here to authorise a Realtime channel with.
//
// Callers (useProviderOrdersRealtime) already treat `null` as "not
// configured" and fall back to their regular polling through the
// authenticated /api, which is how production has always run (the VITE_
// Supabase vars were never set there). To bring pushed updates back later,
// add a server-issued, short-lived Realtime token and call
// `client.realtime.setAuth(token)` before subscribing.
export const supabase: SupabaseClient | null = null;
