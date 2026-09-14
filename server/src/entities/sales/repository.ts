import { randomUUID } from "node:crypto";
import { query, queryOne, withTransaction } from "../../db/pg.js";
import type {
  SalesImportBatch,
  SalesLineItem,
  SalesSummary,
  SalesChannel,
} from "../../../../shared-types/sales.js";

// sales_import_batches / sales_line_items / sales_settings already exist in
// Supabase (verified in the Phase 1 audit) -- no DDL runs here.

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

export async function upsertLineItems(candidates: CandidateLineItem[], importBatchId: string): Promise<UpsertResult> {
  const now = new Date().toISOString();
  let inserted = 0;
  let updated = 0;
  let duplicates = 0;

  await withTransaction(async (client) => {
    for (const item of candidates) {
      const itemNameKey = normalizeKey(item.itemName);
      const fingerprint = fingerprintFor(item.channel, item.businessDate, itemNameKey);
      const existingResult = await client.query<{ id: string; quantity: number; amount: number }>(
        `SELECT id, quantity, amount FROM sales_line_items WHERE fingerprint = $1`,
        [fingerprint]
      );
      const existing = existingResult.rows[0];

      if (!existing) {
        await client.query(
          `INSERT INTO sales_line_items (
            id, "importBatchId", channel, category, "itemName", "itemNameKey", quantity, amount,
            "calendarDate", "businessDate", "businessDayStart", "businessDayEnd",
            "transactionTimestamp", "transactionTime", fingerprint, "createdAt", "updatedAt"
          ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)`,
          [
            randomUUID(), importBatchId, item.channel, item.category, item.itemName, itemNameKey, item.quantity, item.amount,
            item.calendarDate, item.businessDate, item.businessDayStart, item.businessDayEnd,
            item.transactionTimestamp, item.transactionTime, fingerprint, now, now,
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
          "importBatchId" = $1, category = $2, "itemName" = $3,
          quantity = $4, amount = $5, "calendarDate" = $6,
          "businessDayStart" = $7, "businessDayEnd" = $8,
          "transactionTimestamp" = $9, "transactionTime" = $10,
          "updatedAt" = $11
        WHERE id = $12`,
        [
          importBatchId, item.category, item.itemName,
          item.quantity, item.amount, item.calendarDate,
          item.businessDayStart, item.businessDayEnd,
          item.transactionTimestamp, item.transactionTime,
          now, existing.id,
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
      batch.id, batch.fileName, batch.channel, batch.businessDate, batch.recordsFound, batch.recordsInserted, batch.recordsUpdated,
      batch.duplicatesSkipped, JSON.stringify(batch.parsingErrors), batch.validation.status, batch.validation.expectedQuantity,
      batch.validation.expectedAmount, batch.validation.actualQuantity, batch.validation.actualAmount,
      JSON.stringify(batch.validation.notes), batch.hasHourlyData ? 1 : 0, now, now,
    ]
  );
  return { ...batch, createdAt: now, updatedAt: now };
}

function rowToBatch(row: any): SalesImportBatch {
  return {
    id: row.id,
    fileName: row.fileName,
    channel: row.channel,
    businessDate: row.businessDate,
    recordsFound: row.recordsFound,
    recordsInserted: row.recordsInserted,
    recordsUpdated: row.recordsUpdated,
    duplicatesSkipped: row.duplicatesSkipped,
    parsingErrors: JSON.parse(row.parsingErrorsJson),
    validation: {
      status: row.validationStatus,
      expectedQuantity: row.validationExpectedQuantity,
      expectedAmount: row.validationExpectedAmount,
      actualQuantity: row.validationActualQuantity,
      actualAmount: row.validationActualAmount,
      quantityDiff: row.validationExpectedQuantity != null ? row.validationActualQuantity - row.validationExpectedQuantity : null,
      amountDiff: row.validationExpectedAmount != null ? row.validationActualAmount - row.validationExpectedAmount : null,
      notes: JSON.parse(row.validationNotesJson),
    },
    hasHourlyData: Boolean(row.hasHourlyData),
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export async function listImportBatches(): Promise<SalesImportBatch[]> {
  const rows = await query(`SELECT * FROM sales_import_batches ORDER BY "createdAt" DESC`);
  return rows.map(rowToBatch);
}

export async function getImportBatch(id: string): Promise<SalesImportBatch | undefined> {
  const row = await queryOne(`SELECT * FROM sales_import_batches WHERE id = $1`, [id]);
  return row ? rowToBatch(row) : undefined;
}

export async function deleteImportBatch(id: string): Promise<boolean> {
  return withTransaction(async (client) => {
    await client.query(`DELETE FROM sales_line_items WHERE "importBatchId" = $1`, [id]);
    const result = await client.query(`DELETE FROM sales_import_batches WHERE id = $1`, [id]);
    return (result.rowCount ?? 0) > 0;
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
    conditions.push(`"businessDate" >= $${params.length + 1}`);
    params.push(filter.from);
  }
  if (filter.to) {
    conditions.push(`"businessDate" <= $${params.length + 1}`);
    params.push(filter.to);
  }
  return { clause: conditions.length ? `WHERE ${conditions.join(" AND ")}` : "", params };
}

/**
 * Reads from the unified `dataset_records` store rather than the original
 * sales-only table, so this endpoint reflects Excel imports too. Response
 * shape is unchanged from the SQLite version.
 */
export async function getSalesSummary(filter: SalesFilter): Promise<SalesSummary> {
  const { clause, params } = whereClause(filter);
  const scoped = clause ? `${clause} AND "datasetType" = 'sales'` : `WHERE "datasetType" = 'sales'`;

  const totals = await queryOne<{ quantity: string; amount: string; minDate: string | null; maxDate: string | null }>(
    `SELECT COALESCE(SUM(quantity),0) as quantity, COALESCE(SUM("salesValue"),0) as amount, MIN("businessDate") as "minDate", MAX("businessDate") as "maxDate" FROM dataset_records ${scoped}`,
    params
  );

  const byChannel = await query<{ channel: SalesChannel; quantity: string; amount: string }>(
    `SELECT channel, COALESCE(SUM(quantity),0) as quantity, COALESCE(SUM("salesValue"),0) as amount FROM dataset_records ${scoped} AND channel IS NOT NULL GROUP BY channel ORDER BY amount DESC`,
    params
  );

  const byCategory = await query<{ category: string; quantity: string; amount: string }>(
    `SELECT COALESCE(category,'Uncategorised') as category, COALESCE(SUM(quantity),0) as quantity, COALESCE(SUM("salesValue"),0) as amount FROM dataset_records ${scoped} GROUP BY COALESCE(category,'Uncategorised') ORDER BY amount DESC`,
    params
  );

  const topItems = await query<{ itemName: string; category: string; quantity: string; amount: string }>(
    `SELECT product as "itemName", MAX(COALESCE(category,'Uncategorised')) as category, COALESCE(SUM(quantity),0) as quantity, COALESCE(SUM("salesValue"),0) as amount FROM dataset_records ${scoped} GROUP BY "productKey" ORDER BY amount DESC LIMIT 15`,
    params
  );

  const dailyTrend = await query<{ businessDate: string; quantity: string; amount: string }>(
    `SELECT "businessDate", COALESCE(SUM(quantity),0) as quantity, COALESCE(SUM("salesValue"),0) as amount FROM dataset_records ${scoped} GROUP BY "businessDate" ORDER BY "businessDate" ASC`,
    params
  );

  const hourlyCountRow = await queryOne<{ c: string }>(
    `SELECT COUNT(*) as c FROM dataset_records ${scoped} AND "rawTimestamp" IS NOT NULL`,
    params
  );

  return {
    businessDateFrom: totals?.minDate ?? null,
    businessDateTo: totals?.maxDate ?? null,
    totalQuantity: Number(totals?.quantity ?? 0),
    totalAmount: Number(totals?.amount ?? 0),
    byChannel: byChannel.map((r) => ({ channel: r.channel, quantity: Number(r.quantity), amount: Number(r.amount) })),
    byCategory: byCategory.map((r) => ({ category: r.category, quantity: Number(r.quantity), amount: Number(r.amount) })),
    topItems: topItems.map((r) => ({ itemName: r.itemName, category: r.category, quantity: Number(r.quantity), amount: Number(r.amount) })),
    dailyTrend: dailyTrend.map((r) => ({ businessDate: r.businessDate, quantity: Number(r.quantity), amount: Number(r.amount) })),
    hasHourlyData: Number(hourlyCountRow?.c ?? 0) > 0,
  };
}

export async function listLineItems(filter: SalesFilter): Promise<SalesLineItem[]> {
  const { clause, params } = whereClause(filter);
  const scoped = clause ? `${clause} AND "datasetType" = 'sales'` : `WHERE "datasetType" = 'sales'`;
  const rows = await query(
    `SELECT id, "importBatchId", channel, COALESCE(category,'Uncategorised') as category, product as "itemName",
            quantity, "salesValue" as amount, "transactionDate" as "calendarDate", "businessDate",
            "businessDayStartHour", "rawTimestamp" as "transactionTimestamp", "createdAt", "updatedAt"
     FROM dataset_records ${scoped} ORDER BY "businessDate" DESC, "salesValue" DESC LIMIT 5000`,
    params
  );
  return rows as unknown as SalesLineItem[];
}

const DAILY_TARGET_KEY = "daily_target";

export async function getDailyTarget(): Promise<{ amount: number | null; updatedAt: string | null }> {
  const row = await queryOne<{ value: string; updatedAt: string }>(
    `SELECT value, "updatedAt" FROM sales_settings WHERE key = $1`,
    [DAILY_TARGET_KEY]
  );
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
