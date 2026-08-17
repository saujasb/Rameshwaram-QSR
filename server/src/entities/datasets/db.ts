import { db } from "../../db/client.js";

/**
 * `dataset_records` is the single normalized store for every imported business
 * record, whatever its source (PDF or Excel) or dataset (sales/production/
 * wastage). The pre-existing `sales_line_items` table is migrated into it once,
 * so the live dashboard keeps its history while gaining the wider model.
 */
export function ensureDatasetTables(): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS dataset_records (
      id TEXT PRIMARY KEY,
      datasetType TEXT NOT NULL,
      rawTimestamp TEXT,
      transactionDate TEXT,
      businessDate TEXT NOT NULL,
      businessDayStartHour INTEGER NOT NULL,
      hour INTEGER,
      shift TEXT,
      product TEXT NOT NULL,
      productKey TEXT NOT NULL,
      category TEXT,
      outlet TEXT,
      channel TEXT,
      quantity REAL NOT NULL,
      salesValue REAL,
      reason TEXT,
      importBatchId TEXT NOT NULL,
      sourceFile TEXT NOT NULL,
      sourceType TEXT NOT NULL,
      sourceSheet TEXT,
      sourcePage INTEGER,
      sourceRow INTEGER,
      fingerprint TEXT NOT NULL UNIQUE,
      flagsJson TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS dataset_import_batches (
      id TEXT PRIMARY KEY,
      fileName TEXT NOT NULL,
      fileSizeBytes INTEGER NOT NULL,
      sourceType TEXT NOT NULL,
      fileHash TEXT NOT NULL,
      datasetTypesJson TEXT NOT NULL,
      status TEXT NOT NULL,
      businessDateFrom TEXT,
      businessDateTo TEXT,
      recordsFound INTEGER NOT NULL,
      recordsInserted INTEGER NOT NULL,
      recordsUpdated INTEGER NOT NULL,
      duplicatesSkipped INTEGER NOT NULL,
      recordsRejected INTEGER NOT NULL,
      qualityJson TEXT NOT NULL,
      sheetsJson TEXT NOT NULL,
      rejectedRowsJson TEXT NOT NULL,
      reconciliationJson TEXT,
      businessDayStartHour INTEGER NOT NULL,
      createdAt TEXT NOT NULL
    )
  `);

  db.exec(`CREATE INDEX IF NOT EXISTS idx_dr_business_date ON dataset_records(businessDate)`);
  db.exec(`CREATE INDEX IF NOT EXISTS idx_dr_type_date ON dataset_records(datasetType, businessDate)`);
  db.exec(`CREATE INDEX IF NOT EXISTS idx_dr_product ON dataset_records(productKey)`);
  db.exec(`CREATE INDEX IF NOT EXISTS idx_dr_batch ON dataset_records(importBatchId)`);
  db.exec(`CREATE INDEX IF NOT EXISTS idx_dib_created ON dataset_import_batches(createdAt DESC)`);

  db.exec(`
    CREATE TABLE IF NOT EXISTS app_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    )
  `);

  migrateLegacySalesLineItems();
}

function tableExists(name: string): boolean {
  const row = db.prepare(`SELECT name FROM sqlite_master WHERE type='table' AND name=?`).get(name);
  return Boolean(row);
}

/**
 * One-time lift of the original sales-only table into the unified store. Runs
 * only when dataset_records has no rows carried over from it, so it is safe to
 * re-run on every boot and never double-counts.
 */
function migrateLegacySalesLineItems(): void {
  if (!tableExists("sales_line_items")) return;

  const already = db
    .prepare(`SELECT COUNT(*) as c FROM dataset_records WHERE sourceType = 'pdf' AND sourceSheet IS NULL AND importBatchId LIKE 'legacy-%'`)
    .get() as { c: number };
  if (already.c > 0) return;

  const legacy = db.prepare(`SELECT * FROM sales_line_items`).all() as Record<string, any>[];
  if (legacy.length === 0) return;

  const insert = db.prepare(`
    INSERT OR IGNORE INTO dataset_records (
      id, datasetType, rawTimestamp, transactionDate, businessDate, businessDayStartHour, hour, shift,
      product, productKey, category, outlet, channel, quantity, salesValue, reason,
      importBatchId, sourceFile, sourceType, sourceSheet, sourcePage, sourceRow,
      fingerprint, flagsJson, createdAt, updatedAt
    ) VALUES (
      @id, 'sales', @rawTimestamp, @transactionDate, @businessDate, 5, @hour, NULL,
      @product, @productKey, @category, NULL, @channel, @quantity, @salesValue, NULL,
      @importBatchId, @sourceFile, 'pdf', NULL, NULL, NULL,
      @fingerprint, @flagsJson, @createdAt, @updatedAt
    )
  `);

  const run = db.transaction((rows: Record<string, any>[]) => {
    for (const r of rows) {
      insert.run({
        id: r.id,
        rawTimestamp: r.transactionTimestamp ?? null,
        transactionDate: r.calendarDate ?? null,
        businessDate: r.businessDate,
        hour: null,
        product: r.itemName,
        productKey: String(r.itemName ?? "").trim().toLowerCase().replace(/\s+/g, " "),
        category: r.category ?? null,
        channel: r.channel ?? null,
        quantity: r.quantity,
        salesValue: r.amount,
        importBatchId: `legacy-${r.importBatchId}`,
        sourceFile: "legacy sales import",
        fingerprint: `agg::sales::${r.channel}::${r.businessDate}::${String(r.itemName ?? "").trim().toLowerCase().replace(/\s+/g, " ")}`,
        flagsJson: JSON.stringify(["missing_timestamp"]),
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
      });
    }
  });
  run(legacy);
  console.log(`[datasets] migrated ${legacy.length} legacy sales rows into dataset_records`);
}

const BUSINESS_DAY_START_KEY = "business_day_start_hour";

export function getBusinessDayStartHour(): number {
  const row = db.prepare(`SELECT value FROM app_settings WHERE key = ?`).get(BUSINESS_DAY_START_KEY) as
    | { value: string }
    | undefined;
  const parsed = row ? Number(row.value) : NaN;
  return Number.isInteger(parsed) && parsed >= 0 && parsed <= 23 ? parsed : 5;
}

export function setBusinessDayStartHour(hour: number): { hour: number; updatedAt: string } {
  const now = new Date().toISOString();
  db.prepare(
    `INSERT INTO app_settings (key, value, updatedAt) VALUES (?, ?, ?)
     ON CONFLICT(key) DO UPDATE SET value = excluded.value, updatedAt = excluded.updatedAt`
  ).run(BUSINESS_DAY_START_KEY, String(hour), now);
  return { hour, updatedAt: now };
}
