import { randomUUID } from "node:crypto";
import { db } from "../../db/client.js";
import { ensureSalesTables } from "./db.js";
import type {
  SalesImportBatch,
  SalesLineItem,
  SalesSummary,
  SalesChannel,
} from "../../../../shared-types/sales.js";

ensureSalesTables();

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

const findByFingerprint = db.prepare(
  `SELECT id, quantity, amount FROM sales_line_items WHERE fingerprint = ?`
);
const insertLineItemStmt = db.prepare(`
  INSERT INTO sales_line_items (
    id, importBatchId, channel, category, itemName, itemNameKey, quantity, amount,
    calendarDate, businessDate, businessDayStart, businessDayEnd,
    transactionTimestamp, transactionTime, fingerprint, createdAt, updatedAt
  ) VALUES (@id, @importBatchId, @channel, @category, @itemName, @itemNameKey, @quantity, @amount,
    @calendarDate, @businessDate, @businessDayStart, @businessDayEnd,
    @transactionTimestamp, @transactionTime, @fingerprint, @createdAt, @updatedAt)
`);
const updateLineItemStmt = db.prepare(`
  UPDATE sales_line_items SET
    importBatchId = @importBatchId, category = @category, itemName = @itemName,
    quantity = @quantity, amount = @amount, calendarDate = @calendarDate,
    businessDayStart = @businessDayStart, businessDayEnd = @businessDayEnd,
    transactionTimestamp = @transactionTimestamp, transactionTime = @transactionTime,
    updatedAt = @updatedAt
  WHERE id = @id
`);

export function upsertLineItems(candidates: CandidateLineItem[], importBatchId: string): UpsertResult {
  const now = new Date().toISOString();
  let inserted = 0;
  let updated = 0;
  let duplicates = 0;

  const run = db.transaction((items: CandidateLineItem[]) => {
    for (const item of items) {
      const itemNameKey = normalizeKey(item.itemName);
      const fingerprint = fingerprintFor(item.channel, item.businessDate, itemNameKey);
      const existing = findByFingerprint.get(fingerprint) as { id: string; quantity: number; amount: number } | undefined;

      if (!existing) {
        insertLineItemStmt.run({
          id: randomUUID(),
          importBatchId,
          channel: item.channel,
          category: item.category,
          itemName: item.itemName,
          itemNameKey,
          quantity: item.quantity,
          amount: item.amount,
          calendarDate: item.calendarDate,
          businessDate: item.businessDate,
          businessDayStart: item.businessDayStart,
          businessDayEnd: item.businessDayEnd,
          transactionTimestamp: item.transactionTimestamp,
          transactionTime: item.transactionTime,
          fingerprint,
          createdAt: now,
          updatedAt: now,
        });
        inserted++;
        continue;
      }

      const sameValues = Math.abs(existing.quantity - item.quantity) < 0.005 && Math.abs(existing.amount - item.amount) < 0.005;
      if (sameValues) {
        duplicates++;
        continue;
      }

      updateLineItemStmt.run({
        id: existing.id,
        importBatchId,
        category: item.category,
        itemName: item.itemName,
        quantity: item.quantity,
        amount: item.amount,
        calendarDate: item.calendarDate,
        businessDayStart: item.businessDayStart,
        businessDayEnd: item.businessDayEnd,
        transactionTimestamp: item.transactionTimestamp,
        transactionTime: item.transactionTime,
        updatedAt: now,
      });
      updated++;
    }
  });

  run(candidates);
  return { inserted, updated, duplicates };
}

const insertBatchStmt = db.prepare(`
  INSERT INTO sales_import_batches (
    id, fileName, channel, businessDate, recordsFound, recordsInserted, recordsUpdated,
    duplicatesSkipped, parsingErrorsJson, validationStatus, validationExpectedQuantity,
    validationExpectedAmount, validationActualQuantity, validationActualAmount,
    validationNotesJson, hasHourlyData, createdAt, updatedAt
  ) VALUES (@id, @fileName, @channel, @businessDate, @recordsFound, @recordsInserted, @recordsUpdated,
    @duplicatesSkipped, @parsingErrorsJson, @validationStatus, @validationExpectedQuantity,
    @validationExpectedAmount, @validationActualQuantity, @validationActualAmount,
    @validationNotesJson, @hasHourlyData, @createdAt, @updatedAt)
`);

export function insertImportBatch(batch: Omit<SalesImportBatch, "createdAt" | "updatedAt">): SalesImportBatch {
  const now = new Date().toISOString();
  insertBatchStmt.run({
    id: batch.id,
    fileName: batch.fileName,
    channel: batch.channel,
    businessDate: batch.businessDate,
    recordsFound: batch.recordsFound,
    recordsInserted: batch.recordsInserted,
    recordsUpdated: batch.recordsUpdated,
    duplicatesSkipped: batch.duplicatesSkipped,
    parsingErrorsJson: JSON.stringify(batch.parsingErrors),
    validationStatus: batch.validation.status,
    validationExpectedQuantity: batch.validation.expectedQuantity,
    validationExpectedAmount: batch.validation.expectedAmount,
    validationActualQuantity: batch.validation.actualQuantity,
    validationActualAmount: batch.validation.actualAmount,
    validationNotesJson: JSON.stringify(batch.validation.notes),
    hasHourlyData: batch.hasHourlyData ? 1 : 0,
    createdAt: now,
    updatedAt: now,
  });
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

export function listImportBatches(): SalesImportBatch[] {
  const rows = db.prepare(`SELECT * FROM sales_import_batches ORDER BY createdAt DESC`).all();
  return rows.map(rowToBatch);
}

export function getImportBatch(id: string): SalesImportBatch | undefined {
  const row = db.prepare(`SELECT * FROM sales_import_batches WHERE id = ?`).get(id);
  return row ? rowToBatch(row) : undefined;
}

export function deleteImportBatch(id: string): boolean {
  const run = db.transaction((batchId: string) => {
    db.prepare(`DELETE FROM sales_line_items WHERE importBatchId = ?`).run(batchId);
    return db.prepare(`DELETE FROM sales_import_batches WHERE id = ?`).run(batchId).changes > 0;
  });
  return run(id);
}

export interface SalesFilter {
  from?: string;
  to?: string;
}

function whereClause(filter: SalesFilter): { clause: string; params: string[] } {
  const conditions: string[] = [];
  const params: string[] = [];
  if (filter.from) {
    conditions.push("businessDate >= ?");
    params.push(filter.from);
  }
  if (filter.to) {
    conditions.push("businessDate <= ?");
    params.push(filter.to);
  }
  return { clause: conditions.length ? `WHERE ${conditions.join(" AND ")}` : "", params };
}

export function getSalesSummary(filter: SalesFilter): SalesSummary {
  const { clause, params } = whereClause(filter);

  const totals = db
    .prepare(`SELECT COALESCE(SUM(quantity),0) as quantity, COALESCE(SUM(amount),0) as amount, MIN(businessDate) as minDate, MAX(businessDate) as maxDate FROM sales_line_items ${clause}`)
    .get(...params) as { quantity: number; amount: number; minDate: string | null; maxDate: string | null };

  const byChannel = db
    .prepare(`SELECT channel, COALESCE(SUM(quantity),0) as quantity, COALESCE(SUM(amount),0) as amount FROM sales_line_items ${clause} GROUP BY channel ORDER BY amount DESC`)
    .all(...params) as { channel: SalesChannel; quantity: number; amount: number }[];

  const byCategory = db
    .prepare(`SELECT category, COALESCE(SUM(quantity),0) as quantity, COALESCE(SUM(amount),0) as amount FROM sales_line_items ${clause} GROUP BY category ORDER BY amount DESC`)
    .all(...params) as { category: string; quantity: number; amount: number }[];

  const topItems = db
    .prepare(`SELECT itemName, category, COALESCE(SUM(quantity),0) as quantity, COALESCE(SUM(amount),0) as amount FROM sales_line_items ${clause} GROUP BY itemName, category ORDER BY amount DESC LIMIT 15`)
    .all(...params) as { itemName: string; category: string; quantity: number; amount: number }[];

  const dailyTrend = db
    .prepare(`SELECT businessDate, COALESCE(SUM(quantity),0) as quantity, COALESCE(SUM(amount),0) as amount FROM sales_line_items ${clause} GROUP BY businessDate ORDER BY businessDate ASC`)
    .all(...params) as { businessDate: string; quantity: number; amount: number }[];

  const hourlyCountRow = db
    .prepare(`SELECT COUNT(*) as c FROM sales_line_items ${clause}${clause ? " AND" : "WHERE"} transactionTime IS NOT NULL`)
    .get(...params) as { c: number };

  return {
    businessDateFrom: totals.minDate,
    businessDateTo: totals.maxDate,
    totalQuantity: totals.quantity,
    totalAmount: totals.amount,
    byChannel,
    byCategory,
    topItems,
    dailyTrend,
    hasHourlyData: hourlyCountRow.c > 0,
  };
}

export function listLineItems(filter: SalesFilter): SalesLineItem[] {
  const { clause, params } = whereClause(filter);
  const rows = db.prepare(`SELECT * FROM sales_line_items ${clause} ORDER BY businessDate DESC, amount DESC`).all(...params);
  return rows as SalesLineItem[];
}

const DAILY_TARGET_KEY = "daily_target";

export function getDailyTarget(): { amount: number | null; updatedAt: string | null } {
  const row = db.prepare(`SELECT value, updatedAt FROM sales_settings WHERE key = ?`).get(DAILY_TARGET_KEY) as
    | { value: string; updatedAt: string }
    | undefined;
  if (!row) return { amount: null, updatedAt: null };
  return { amount: Number(row.value), updatedAt: row.updatedAt };
}

export function setDailyTarget(amount: number): { amount: number; updatedAt: string } {
  const now = new Date().toISOString();
  db.prepare(
    `INSERT INTO sales_settings (key, value, updatedAt) VALUES (?, ?, ?)
     ON CONFLICT(key) DO UPDATE SET value = excluded.value, updatedAt = excluded.updatedAt`
  ).run(DAILY_TARGET_KEY, String(amount), now);
  return { amount, updatedAt: now };
}
