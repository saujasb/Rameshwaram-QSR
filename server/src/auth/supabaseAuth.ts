import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * A throwaway Supabase client for one sign-in / refresh / OTP call.
 *
 * supabase-js keeps the signed-in session in memory on the client instance.
 * On a server handling many users, a shared instance could hand one user's
 * session to another request, so session-creating calls always get a fresh
 * instance that is discarded afterwards. (Admin calls and JWT verification
 * use the shared service client in db/client.ts -- they hold no session.)
 */
export function freshAuthClient(): SupabaseClient {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set (server-side only).");
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
}

/**
 * Supabase Auth password sign-in needs an email (or phone). Users sign in
 * with a username, so users without a real email get a placeholder address on
 * the reserved .invalid TLD (RFC 2606) -- it can never receive mail, and can't
 * be registered by anyone else. Nobody ever types it.
 */
export const PLACEHOLDER_EMAIL_DOMAIN = "users.rameshwaram-qsr.invalid";

export function placeholderEmail(username: string): string {
  return `${username}@${PLACEHOLDER_EMAIL_DOMAIN}`;
}

export function isPlaceholderEmail(email: string | null | undefined): boolean {
  return Boolean(email && email.toLowerCase().endsWith(`@${PLACEHOLDER_EMAIL_DOMAIN}`));
}
