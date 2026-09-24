import { query, queryOne } from "../db/pg.js";

// Brute-force protection for username/password login, stored in Postgres so
// it holds across Vercel's many short-lived function instances (an
// in-memory counter would reset on every cold start). Supabase Auth's own
// per-IP rate limits sit behind this as a second layer.
export const MAX_FAILURES_PER_USERNAME = 5;
export const MAX_FAILURES_PER_IP = 25;
export const WINDOW_MINUTES = 15;

export const throttleDeps = {
  async countFailures(usernameKey: string, ip: string): Promise<{ byUser: number; byIp: number }> {
    const row = await queryOne<{ by_user: string; by_ip: string }>(
      `SELECT
         count(*) FILTER (WHERE username_key = $1) AS by_user,
         count(*) FILTER (WHERE ip = $2) AS by_ip
       FROM public.auth_login_attempts
       WHERE NOT success AND created_at > now() - make_interval(mins => $3)`,
      [usernameKey, ip, WINDOW_MINUTES]
    );
    return { byUser: Number(row?.by_user ?? 0), byIp: Number(row?.by_ip ?? 0) };
  },
  async record(usernameKey: string, ip: string, success: boolean): Promise<void> {
    await query(`INSERT INTO public.auth_login_attempts (username_key, ip, success) VALUES ($1, $2, $3)`, [usernameKey, ip, success]);
    if (success) {
      // A successful login clears that username's failure streak.
      await query(`DELETE FROM public.auth_login_attempts WHERE username_key = $1 AND NOT success`, [usernameKey]);
    }
    // Keep the table small.
    if (Math.random() < 0.02) {
      await query(`DELETE FROM public.auth_login_attempts WHERE created_at < now() - interval '7 days'`);
    }
  },
};

export async function isLoginThrottled(usernameKey: string, ip: string): Promise<boolean> {
  const { byUser, byIp } = await throttleDeps.countFailures(usernameKey, ip);
  return byUser >= MAX_FAILURES_PER_USERNAME || byIp >= MAX_FAILURES_PER_IP;
}

export async function recordLoginAttempt(usernameKey: string, ip: string, success: boolean): Promise<void> {
  await throttleDeps.record(usernameKey, ip, success).catch((err) => {
    console.error("[auth] could not record login attempt:", err instanceof Error ? err.message : err);
  });
}
