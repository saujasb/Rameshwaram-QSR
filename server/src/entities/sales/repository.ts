import { randomUUID } from "node:crypto";
import { query, withTransaction } from "../../db/client.js";
import type {
  SalesImportBatch,
  SalesLineItem,
  SalesSummary,
  SalesChannel,
} from "../../../../shared-types/sales.js";

export interface CandidateLineItem {
  channel: SalesChannel;
  category: string;
  itemName: string;
  quantity: number;
  amount: number;
  calendarDate: string;
  businessDate: string;
  businessDayStart: string;
  businessDayEnd: string;
  transactionTimestamp: string | null;
  transactionTime: string | null;
}

export interface UpsertResult {
  inserted: number;
  updated: number;
  duplicates: number;
}

function normalizeKey(itemName: string): string {
  return itemName.trim().toLowerCase().replace(/\s+/g, " ");
}

function fingerprintFor(channel: SalesChannel, businessDate: string, itemNameKey: string): string {
  return `${channel}::${businessDate}::${itemNameKey}`;
}

/**
 * Idempotent per-item upsert keyed on fingerprint, run inside one
 * transaction so a partial failure never leaves the batch half-applied.
 * Ported from the SQLite version's single-connection `db.transaction`; the
 * per-row read-then-write here relies on Postgres's normal transaction
 * isolation (not on any single-writer assumption) for correctness within
 * the transaction.
 */
export async function upsertLineItems(candidates: CandidateLineItem[], importBatchId: string): Promise<UpsertResult> {
  const now = new Date().toISOString();
  let inserted = 0;
  let updated = 0;
  let duplicates = 0;

  await withTransaction(async (client) => {
    for (const item of candidates) {
      const itemNameKey = normalizeKey(item.itemName);
      const fingerprint = fingerprintFor(item.channel, item.businessDate, itemNameKey);

      const { rows } = await client.query<{ id: string; quantity: number; amount: number }>(
        `SELECT id, quantity, amount FROM sales_line_items WHERE fingerprint = $1`,
        [fingerprint]
      );
      const existing = rows[0];

      if (!existing) {
        await client.query(
          `INSERT INTO sales_line_items (
            id, "importBatchId", channel, category, "itemName", "itemNameKey", quantity, amount,
            "calendarDate", "businessDate", "businessDayStart", "businessDayEnd",
            "transactionTimestamp", "transactionTime", fingerprint, "createdAt", "updatedAt"
          ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)`,
          [
            randomUUID(),
            importBatchId,
            item.channel,
            item.category,
            item.itemName,
            itemNameKey,
            item.quantity,
            item.amount,
            item.calendarDate,
            item.businessDate,
            item.businessDayStart,
            item.businessDayEnd,
            item.transactionTimestamp,
            item.transactionTime,
            fingerprint,
            now,
            now,
          ]
        );
        inserted++;
        continue;
      }

      const sameValues = Math.abs(existing.quantity - item.quantity) < 0.005 && Math.abs(existing.amount - item.amount) < 0.005;
      if (sameValues) {
        duplicates++;
        continue;
      }

      await client.query(
        `UPDATE sales_line_items SET
          "importBatchId" = $1, category = $2, "itemName" = $3, quantity = $4, amount = $5,
          "calendarDate" = $6, "businessDayStart" = $7, "businessDayEnd" = $8,
          "transactionTimestamp" = $9, "transactionTime" = $10, "updatedAt" = $11
        WHERE id = $12`,
        [
          importBatchId,
          item.category,
          item.itemName,
          item.quantity,
          item.amount,
          item.calendarDate,
          item.businessDayStart,
          item.businessDayEnd,
          item.transactionTimestamp,
          item.transactionTime,
          now,
          existing.id,
        ]
      );
      updated++;
    }
  });

  return { inserted, updated, duplicates };
}

export async function insertImportBatch(batch: Omit<SalesImportBatch, "createdAt" | "updatedAt">): Promise<SalesImportBatch> {
  const now = new Date().toISOString();
  await query(
    `INSERT INTO sales_import_batches (
      id, "fileName", channel, "businessDate", "recordsFound", "recordsInserted", "recordsUpdated",
      "duplicatesSkipped", "parsingErrorsJson", "validationStatus", "validationExpectedQuantity",
      "validationExpectedAmount", "validationActualQuantity", "validationActualAmount",
      "validationNotesJson", "hasHourlyData", "createdAt", "updatedAt"
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)`,
    [
      batch.id,
      batch.fileName,
      batch.channel,
      batch.businessDate,
      batch.recordsFound,
      batch.recordsInserted,
      batch.recordsUpdated,
      batch.duplicatesSkipped,
      JSON.stringify(batch.parsingErrors),
      batch.validation.status,
      batch.validation.expectedQuantity,
      batch.validation.expectedAmount,
      batch.validation.actualQuantity,
      batch.validation.actualAmount,
      JSON.stringify(batch.validation.notes),
      batch.hasHourlyData ? 1 : 0,
      now,
      now,
    ]
  );
  return { ...batch, createdAt: now, updatedAt: now };
}

// "...Json" columns and every date/time column on this table stayed plain
// TEXT in Postgres (Stage 1 deliberately did not change these to jsonb/
// timestamptz -- see supabase/migrations/001_initial_schema.sql), so they
// come back from node-postgres as plain strings, same as they did from
// better-sqlite3, and still need JSON.parse for the two "...Json" columns.
function rowToBatch(row: Record<string, unknown>): SalesImportBatch {
  return {
    id: row.id as string,
    fileName: row.fileName as string,
    channel: row.channel as SalesImportBatch["channel"],
    businessDate: row.businessDate as string,
    recordsFound: row.recordsFound as number,
    recordsInserted: row.recordsInserted as number,
    recordsUpdated: row.recordsUpdated as number,
    duplicatesSkipped: row.duplicatesSkipped as number,
    parsingErrors: JSON.parse(row.parsingErrorsJson as string),
    validation: {
      status: row.validationStatus as SalesImportBatch["validation"]["status"],
      expectedQuantity: row.validationExpectedQuantity as number | null,
      expectedAmount: row.validationExpectedAmount as number | null,
      actualQuantity: row.validationActualQuantity as number,
      actualAmount: row.validationActualAmount as number,
      quantityDiff:
        row.validationExpectedQuantity != null
          ? (row.validationActualQuantity as number) - (row.validationExpectedQuantity as number)
          : null,
      amountDiff:
        row.validationExpectedAmount != null
          ? (row.validationActualAmount as number) - (row.validationExpectedAmount as number)
          : null,
      notes: JSON.parse(row.validationNotesJson as string),
    },
    hasHourlyData: Boolean(row.hasHourlyData),
    createdAt: row.createdAt as string,
    updatedAt: row.updatedAt as string,
  };
}

export async function listImportBatches(): Promise<SalesImportBatch[]> {
  const { rows } = await query(`SELECT * FROM sales_import_batches ORDER BY "createdAt" DESC`);
  return rows.map(rowToBatch);
}

export async function getImportBatch(id: string): Promise<SalesImportBatch | undefined> {
  const { rows } = await query(`SELECT * FROM sales_import_batches WHERE id = $1`, [id]);
  return rows[0] ? rowToBatch(rows[0]) : undefined;
}

export async function deleteImportBatch(id: string): Promise<boolean> {
  return withTransaction(async (client) => {
    await client.query(`DELETE FROM sales_line_items WHERE "importBatchId" = $1`, [id]);
    const res = await client.query(`DELETE FROM sales_import_batches WHERE id = $1`, [id]);
    return (res.rowCount ?? 0) > 0;
  });
}

export interface SalesFilter {
  from?: string;
  to?: string;
}

function whereClause(filter: SalesFilter): { clause: string; params: string[] } {
  const conditions: string[] = [];
  const params: string[] = [];
  if (filter.from) {
    params.push(filter.from);
    conditions.push(`"businessDate" >= $${params.length}`);
  }
  if (filter.to) {
    params.push(filter.to);
    conditions.push(`"businessDate" <= $${params.length}`);
  }
  return { clause: conditions.length ? `WHERE ${conditions.join(" AND ")}` : "", params };
}

/**
 * Reads from the unified `dataset_records` store rather than the original
 * sales-only table, so this endpoint reflects Excel imports too. The
 * response shape is unchanged, which keeps every existing dashboard
 * component working untouched -- `channel` and `category` map straight
 * across, and `hasHourlyData` becomes true automatically once a timestamped
 * source is imported.
 */
export async function getSalesSummary(filter: SalesFilter): Promise<SalesSummary> {
  const { clause, params } = whereClause(filter);
  const scoped = clause ? `${clause} AND "datasetType" = 'sales'` : `WHERE "datasetType" = 'sales'`;

  const totalsRes = await query<{ quantity: number; amount: number; minDate: string | null; maxDate: string | null }>(
    `SELECT COALESCE(SUM(quantity),0) as quantity, COALESCE(SUM("salesValue"),0) as amount,
            MIN("businessDate") as "minDate", MAX("businessDate") as "maxDate"
     FROM dataset_records ${scoped}`,
    params
  );
  const totals = totalsRes.rows[0];

  const byChannelRes = await query<{ channel: SalesChannel; quantity: number; amount: number }>(
    `SELECT channel, COALESCE(SUM(quantity),0) as quantity, COALESCE(SUM("salesValue"),0) as amount
     FROM dataset_records ${scoped} AND channel IS NOT NULL GROUP BY channel ORDER BY amount DESC`,
    params
  );

  const byCategoryRes = await query<{ category: string; quantity: number; amount: number }>(
    `SELECT COALESCE(category,'Uncategorised') as category, COALESCE(SUM(quantity),0) as quantity, COALESCE(SUM("salesValue"),0) as amount
     FROM dataset_records ${scoped} GROUP BY COALESCE(category,'Uncategorised') ORDER BY amount DESC`,
    params
  );

  const topItemsRes = await query<{ itemName: string; category: string; quantity: number; amount: number }>(
    `SELECT product as "itemName", MAX(COALESCE(category,'Uncategorised')) as category, COALESCE(SUM(quantity),0) as quantity, COALESCE(SUM("salesValue"),0) as amount
     FROM dataset_records ${scoped} GROUP BY "productKey" ORDER BY amount DESC LIMIT 15`,
    params
  );

  const dailyTrendRes = await query<{ businessDate: string; quantity: number; amount: number }>(
    `SELECT "businessDate", COALESCE(SUM(quantity),0) as quantity, COALESCE(SUM("salesValue"),0) as amount
     FROM dataset_records ${scoped} GROUP BY "businessDate" ORDER BY "businessDate" ASC`,
    params
  );

  const hourlyCountRes = await query<{ c: string }>(
    `SELECT COUNT(*) as c FROM dataset_records ${scoped} AND "rawTimestamp" IS NOT NULL`,
    params
  );

  return {
    businessDateFrom: totals.minDate,
    businessDateTo: totals.maxDate,
    totalQuantity: Number(totals.quantity),
    totalAmount: Number(totals.amount),
    byChannel: byChannelRes.rows.map((r) => ({ ...r, quantity: Number(r.quantity), amount: Number(r.amount) })),
    byCategory: byCategoryRes.rows.map((r) => ({ ...r, quantity: Number(r.quantity), amount: Number(r.amount) })),
    topItems: topItemsRes.rows.map((r) => ({ ...r, quantity: Number(r.quantity), amount: Number(r.amount) })),
    dailyTrend: dailyTrendRes.rows.map((r) => ({ ...r, quantity: Number(r.quantity), amount: Number(r.amount) })),
    hasHourlyData: Number(hourlyCountRes.rows[0].c) > 0,
  };
}

export async function listLineItems(filter: SalesFilter): Promise<SalesLineItem[]> {
  const { clause, params } = whereClause(filter);
  const scoped = clause ? `${clause} AND "datasetType" = 'sales'` : `WHERE "datasetType" = 'sales'`;
  const { rows } = await query(
    `SELECT id, "importBatchId", channel, COALESCE(category,'Uncategorised') as category, product as "itemName",
            quantity, "salesValue" as amount, "transactionDate" as "calendarDate", "businessDate",
            "businessDayStartHour", "rawTimestamp" as "transactionTimestamp", "createdAt", "updatedAt"
     FROM dataset_records ${scoped} ORDER BY "businessDate" DESC, amount DESC LIMIT 5000`,
    params
  );
  return rows as unknown as SalesLineItem[];
}

const DAILY_TARGET_KEY = "daily_target";

export async function getDailyTarget(): Promise<{ amount: number | null; updatedAt: string | null }> {
  const { rows } = await query<{ value: string; updatedAt: string }>(
    `SELECT value, "updatedAt" FROM sales_settings WHERE key = $1`,
    [DAILY_TARGET_KEY]
  );
  const row = rows[0];
  if (!row) return { amount: null, updatedAt: null };
  return { amount: Number(row.value), updatedAt: row.updatedAt };
}

export async function setDailyTarget(amount: number): Promise<{ amount: number; updatedAt: string }> {
  const now = new Date().toISOString();
  await query(
    `INSERT INTO sales_settings (key, value, "updatedAt") VALUES ($1, $2, $3)
     ON CONFLICT (key) DO UPDATE SET value = excluded.value, "updatedAt" = excluded."updatedAt"`,
    [DAILY_TARGET_KEY, String(amount), now]
  );
  return { amount, updatedAt: now };
}
