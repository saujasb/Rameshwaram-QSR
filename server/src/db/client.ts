import { Pool, type PoolClient, type QueryResultRow } from "pg";

// Stage 3: Postgres/Supabase replaces the SQLite file (server/data/app.db)
// as the runtime database. Schema is owned entirely by supabase/migrations/
// -- this module never creates or alters tables. If a table referenced by
// the application is missing, that is a migration that hasn't been applied
// yet, not something this module should paper over at boot.
//
// DATABASE_URL is required and is never defaulted or hard-coded. Prefer
// Supabase's pooler/Supavisor connection string (host contains
// "pooler.supabase.com", typically port 6543) over the direct connection
// string: it multiplexes many short-lived clients over a smaller number of
// real Postgres backend connections, which is what keeps this safe once
// Stage 4 moves the API onto Vercel serverless functions (many concurrent
// function instances would otherwise each open their own direct connection
// and exhaust Supabase's connection limit). For local development against a
// plain Postgres instance, any valid connection string works.
const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  throw new Error(
    "DATABASE_URL is required. Set it to your Supabase Postgres connection string " +
      "(the pooler/Supavisor URL is recommended -- see server/.env.example) or a " +
      "local PostgreSQL connection string for development."
  );
}

/**
 * Supabase's Postgres endpoints use publicly-trusted certificates, so
 * verification stays on by default -- there is no reason to weaken it
 * against them. `sslmode=disable` in the URL (a plain local Postgres with no
 * TLS listener at all) turns SSL off entirely. PGSSL_ALLOW_SELF_SIGNED=true
 * is a separate, explicit local-only escape hatch (e.g. a self-signed local
 * Postgres/Supabase CLI stack) and must never be set when DATABASE_URL
 * points at a real Supabase project.
 */
function resolveSsl(url: string): boolean | { rejectUnauthorized: boolean } {
  if (url.includes("sslmode=disable")) return false;
  if (process.env.PGSSL_ALLOW_SELF_SIGNED === "true") return { rejectUnauthorized: false };
  return { rejectUnauthorized: true };
}

// Pool sizing is deliberately conservative and env-overridable rather than
// using node-postgres's default of 10 unconditionally: Supabase's own
// connection limits are modest on smaller plans, and this same pool
// configuration is what Stage 4 will inherit when the API moves behind
// Vercel functions, where many concurrent function instances each hold
// their own pool. Overriding PG_POOL_MAX down (even to 1) per serverless
// instance, while relying on the Supavisor pooler upstream, is the standard
// mitigation -- left as an env var now so Stage 4 doesn't need a code change
// to tune it.
export const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: resolveSsl(DATABASE_URL),
  max: Number(process.env.PG_POOL_MAX ?? 10),
  idleTimeoutMillis: Number(process.env.PG_POOL_IDLE_TIMEOUT_MS ?? 30_000),
  connectionTimeoutMillis: Number(process.env.PG_POOL_CONNECT_TIMEOUT_MS ?? 10_000),
});

// node-postgres emits 'error' on the pool when an already-established, idle
// client fails outside of any query (e.g. the network or the server closed
// it). Without a listener, that is an unhandled 'error' event and crashes
// the entire Node process -- for a long-lived server this must be handled
// defensively; the pool itself recovers by discarding that client and
// opening a new one on next use.
pool.on("error", (err) => {
  console.error("[db] Unexpected error on an idle Postgres client:", err);
});

/** Thin, typed wrapper around pool.query for call sites that don't need a
 * dedicated client (i.e. don't need a transaction). */
export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[]
): Promise<{ rows: T[]; rowCount: number }> {
  const res = await pool.query<T>(text, params);
  return { rows: res.rows, rowCount: res.rowCount ?? 0 };
}

/** Runs `fn` inside a BEGIN/COMMIT transaction on a single checked-out
 * client, rolling back on any error. This is the replacement for the
 * SQLite-era `db.transaction(fn)` used by the sales and datasets upsert
 * paths, where several statements must commit or fail together. */
export async function withTransaction<T>(fn: (client: PoolClient) => Promise<T>): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const result = await fn(client);
    await client.query("COMMIT");
    return result;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}
