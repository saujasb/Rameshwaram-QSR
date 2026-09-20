import pg from "pg";

// Raw-SQL access for the three hand-written-schema modules (sales, datasets,
// provider-orders) where the existing GROUP BY / dynamic-WHERE / ON CONFLICT
// queries port ~1:1 from SQLite to Postgres. Connects through Supabase's
// transaction pooler (port 6543, pgbouncer) -- the recommended path for
// short-lived serverless connections; a Vercel function must never hold a
// direct long-lived Postgres connection the way the old single-process
// Express server could.
//
// The pool is built lazily (on first query), not at module load. This file
// used to construct it -- and throw if SUPABASE_DB_URL was missing -- as
// soon as it was imported. Every DB-backed router imports it, and
// server/src/app.ts imports every router unconditionally, so that throw
// fired during app.ts's own module evaluation. Since api/index.ts (Vercel's
// single serverless entry point) imports `app` directly, a missing/wrong
// SUPABASE_DB_URL took down the ENTIRE API -- including routes that never
// touch the database, like the Petpooja/GoSelfServe webhooks and /api/health
// -- instead of only the routes that actually need it. Deferring construction
// to first real use means an unrelated route still works even if the database
// is misconfigured, and a DB-dependent route fails with a clear per-request
// error instead of the whole function failing to load.
let pool: pg.Pool | undefined;

function getPool(): pg.Pool {
  if (pool) return pool;

  const connectionString = process.env.SUPABASE_DB_URL;
  if (!connectionString) {
    throw new Error(
      "SUPABASE_DB_URL must be set (Supabase Dashboard -> Project Settings -> Database -> " +
        "Connection string -> Transaction pooler, port 6543). See server/.env.example."
    );
  }

  // Verification stays on. Supabase's Supavisor pooler signs its certificate
  // with a project-specific root CA that isn't in Node's public trust store;
  // PGSSL_CA_CERT supplies that CA's PEM (Supabase Dashboard -> Project
  // Settings -> Database -> SSL Configuration) so the chain verifies properly
  // instead of disabling verification.
  const ssl: pg.PoolConfig["ssl"] = process.env.PGSSL_CA_CERT
    ? { rejectUnauthorized: true, ca: process.env.PGSSL_CA_CERT }
    : { rejectUnauthorized: true };

  pool = new pg.Pool({ connectionString, ssl, max: 10, idleTimeoutMillis: 10_000 });
  return pool;
}

export async function query<T extends pg.QueryResultRow = any>(
  text: string,
  params?: unknown[]
): Promise<T[]> {
  const result = await getPool().query<T>(text, params);
  return result.rows;
}

export async function queryOne<T extends pg.QueryResultRow = any>(
  text: string,
  params?: unknown[]
): Promise<T | undefined> {
  const rows = await query<T>(text, params);
  return rows[0];
}

/**
 * Checks out a single client for the lifetime of `fn`, wraps it in
 * BEGIN/COMMIT (ROLLBACK on throw), and always releases the client back to
 * the pool -- the Postgres equivalent of better-sqlite3's `db.transaction()`.
 */
export async function withTransaction<T>(fn: (client: pg.PoolClient) => Promise<T>): Promise<T> {
  const client = await getPool().connect();
  try {
    await client.query("BEGIN");
    const result = await fn(client);
    await client.query("COMMIT");
    return result;
  } catch (err) {
    await client.query("ROLLBACK").catch(() => {});
    throw err;
  } finally {
    client.release();
  }
}
