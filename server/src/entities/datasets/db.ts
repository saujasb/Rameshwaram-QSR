import { query } from "../../db/client.js";

// Stage 3: schema creation (dataset_records, dataset_import_batches,
// app_settings + their indexes) and the boot-time legacy-sales copy
// (migrateLegacySalesLineItems()) have both been removed from application
// code.
//
// Schema is owned entirely by supabase/migrations/001_initial_schema.sql --
// the application must never create or alter it at startup.
//
// The legacy copy was a one-time DATA migration (copying historical
// sales_line_items rows into dataset_records, tagged
// importBatchId LIKE 'legacy-%'), not a schema migration. Re-deriving it on
// every process boot was already wasteful under SQLite (guarded by a
// COUNT(*) idempotency check run on every cold start) and would be actively
// wrong under Postgres/serverless, where "every cold start" can mean far
// more frequent invocations than a single long-lived Render process ever
// saw. The Stage 2 migration tool
// (server/src/db/migrate-sqlite-to-postgres.ts) is what carries historical
// SQLite data -- including whatever legacy-derived dataset_records rows
// already exist in the production file -- into Postgres exactly once,
// confirmed via its --mode=verify report; the running application no longer
// needs to know that derivation ever happened, so this file no longer
// performs it.

const BUSINESS_DAY_START_KEY = "business_day_start_hour";

export async function getBusinessDayStartHour(): Promise<number> {
  const { rows } = await query<{ value: string }>(`SELECT value FROM app_settings WHERE key = $1`, [BUSINESS_DAY_START_KEY]);
  const parsed = rows[0] ? Number(rows[0].value) : NaN;
  return Number.isInteger(parsed) && parsed >= 0 && parsed <= 23 ? parsed : 5;
}

export async function setBusinessDayStartHour(hour: number): Promise<{ hour: number; updatedAt: string }> {
  const now = new Date().toISOString();
  await query(
    `INSERT INTO app_settings (key, value, "updatedAt") VALUES ($1, $2, $3)
     ON CONFLICT (key) DO UPDATE SET value = excluded.value, "updatedAt" = excluded."updatedAt"`,
    [BUSINESS_DAY_START_KEY, String(hour), now]
  );
  return { hour, updatedAt: now };
}
