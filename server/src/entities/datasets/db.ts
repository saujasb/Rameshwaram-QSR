import { queryOne, query } from "../../db/pg.js";

// Table DDL (dataset_records, dataset_import_batches, app_settings + indexes)
// already exists in Supabase -- verified column-for-column and index-for-index
// against the live project during the Phase 1 audit, so there is nothing to
// create here. migrateLegacySalesLineItems() is also gone: the Supabase
// sales_line_items/dataset_records tables both start empty, so there is no
// legacy data left to backfill.

const BUSINESS_DAY_START_KEY = "business_day_start_hour";

export async function getBusinessDayStartHour(): Promise<number> {
  const row = await queryOne<{ value: string }>(
    `SELECT value FROM app_settings WHERE key = $1`,
    [BUSINESS_DAY_START_KEY]
  );
  const parsed = row ? Number(row.value) : NaN;
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
