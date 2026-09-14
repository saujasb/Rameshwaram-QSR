import pg from "pg";

// Raw-SQL access for the three hand-written-schema modules (sales, datasets,
// provider-orders) where the existing GROUP BY / dynamic-WHERE / ON CONFLICT
// queries port ~1:1 from SQLite to Postgres. Connects through Supabase's
// transaction pooler (port 6543, pgbouncer) -- the recommended path for
// short-lived serverless connections; a Vercel function must never hold a
// direct long-lived Postgres connection the way the old single-process
// Express server could.
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

export const pool = new pg.Pool({
  connectionString,
  ssl,
  max: 10,
  idleTimeoutMillis: 10_000,
});

export async function query<T extends pg.QueryResultRow = any>(
  text: string,
  params?: unknown[]
): Promise<T[]> {
  const result = await pool.query<T>(text, params);
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
  const client = await pool.connect();
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
