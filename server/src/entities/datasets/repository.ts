import { db } from "../../db/client.js";
import { ensureDatasetTables, getBusinessDayStartHour } from "./db.js";
import type {
  DatasetCoverage,
  DatasetFilter,
  DatasetRecord,
  DatasetType,
  ImportBatch,
  PaginatedRecords,
} from "../../../../shared-types/datasets.js";
import type { HourlyBucket, ProductPerformanceRow } from "../../../../shared-types/intelligence.js";
import { formatHourBucket, getBusinessHourSlot } from "../../../../shared-types/businessDate.js";

ensureDatasetTables();

// ---------------------------------------------------------------- writes ----

const insertStmt = db.prepare(`
  INSERT INTO dataset_records (
    id, datasetType, rawTimestamp, transactionDate, businessDate, businessDayStartHour, hour, shift,
    product, productKey, category, outlet, channel, quantity, salesValue, reason,
    importBatchId, sourceFile, sourceType, sourceSheet, sourcePage, sourceRow,
    fingerprint, flagsJson, createdAt, updatedAt
  ) VALUES (
    @id, @datasetType, @rawTimestamp, @transactionDate, @businessDate, @businessDayStartHour, @hour, @shift,
    @product, @productKey, @category, @outlet, @channel, @quantity, @salesValue, @reason,
    @importBatchId, @sourceFile, @sourceType, @sourceSheet, @sourcePage, @sourceRow,
    @fingerprint, @flagsJson, @createdAt, @updatedAt
  )
`);

const findByFingerprint = db.prepare(`SELECT id, quantity, salesValue FROM dataset_records WHERE fingerprint = ?`);

const updateStmt = db.prepare(`
  UPDATE dataset_records SET
    importBatchId = @importBatchId, category = @category, product = @product, quantity = @quantity,
    salesValue = @salesValue, reason = @reason, transactionDate = @transactionDate,
    rawTimestamp = @rawTimestamp, hour = @hour, shift = @shift, outlet = @outlet,
    businessDayStartHour = @businessDayStartHour, flagsJson = @flagsJson, updatedAt = @updatedAt
  WHERE id = @id
`);

export interface UpsertResult {
  inserted: number;
  updated: number;
  duplicates: number;
}

function productKeyOf(product: string): string {
  return product.trim().toLowerCase().replace(/\s+/g, " ");
}

export function upsertRecords(records: DatasetRecord[]): UpsertResult {
  let inserted = 0;
  let updated = 0;
  let duplicates = 0;

  const run = db.transaction((rows: DatasetRecord[]) => {
    for (const r of rows) {
      const existing = findByFingerprint.get(r.fingerprint) as
        | { id: string; quantity: number; salesValue: number | null }
        | undefined;

      const params = {
        id: existing?.id ?? r.id,
        datasetType: r.datasetType,
        rawTimestamp: r.rawTimestamp,
        transactionDate: r.transactionDate,
        businessDate: r.businessDate,
        businessDayStartHour: r.businessDayStartHour,
        hour: r.hour,
        shift: r.shift,
        product: r.product,
        productKey: productKeyOf(r.product),
        category: r.category,
        outlet: r.outlet,
        channel: r.channel,
        quantity: r.quantity,
        salesValue: r.salesValue,
        reason: r.reason,
        importBatchId: r.importBatchId,
        sourceFile: r.sourceFile,
        sourceType: r.sourceType,
        sourceSheet: r.sourceSheet,
        sourcePage: r.sourcePage,
        sourceRow: r.sourceRow,
        fingerprint: r.fingerprint,
        flagsJson: JSON.stringify(r.flags),
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
      };

      if (!existing) {
        insertStmt.run(params);
        inserted++;
        continue;
      }

      const same =
        Math.abs(existing.quantity - r.quantity) < 0.005 &&
        Math.abs((existing.salesValue ?? 0) - (r.salesValue ?? 0)) < 0.005;
      if (same) {
        duplicates++;
        continue;
      }
      updateStmt.run(params);
      updated++;
    }
  });

  run(records);
  return { inserted, updated, duplicates };
}

// -------------------------------------------------------------- batches ----

export function insertImportBatch(batch: ImportBatch): ImportBatch {
  db.prepare(`
    INSERT INTO dataset_import_batches (
      id, fileName, fileSizeBytes, sourceType, fileHash, datasetTypesJson, status,
      businessDateFrom, businessDateTo, recordsFound, recordsInserted, recordsUpdated,
      duplicatesSkipped, recordsRejected, qualityJson, sheetsJson, rejectedRowsJson,
      reconciliationJson, businessDayStartHour, createdAt
    ) VALUES (
      @id, @fileName, @fileSizeBytes, @sourceType, @fileHash, @datasetTypesJson, @status,
      @businessDateFrom, @businessDateTo, @recordsFound, @recordsInserted, @recordsUpdated,
      @duplicatesSkipped, @recordsRejected, @qualityJson, @sheetsJson, @rejectedRowsJson,
      @reconciliationJson, @businessDayStartHour, @createdAt
    )
  `).run({
    id: batch.id,
    fileName: batch.fileName,
    fileSizeBytes: batch.fileSizeBytes,
    sourceType: batch.sourceType,
    fileHash: batch.fileHash,
    datasetTypesJson: JSON.stringify(batch.datasetTypes),
    status: batch.status,
    businessDateFrom: batch.businessDateFrom,
    businessDateTo: batch.businessDateTo,
    recordsFound: batch.recordsFound,
    recordsInserted: batch.recordsInserted,
    recordsUpdated: batch.recordsUpdated,
    duplicatesSkipped: batch.duplicatesSkipped,
    recordsRejected: batch.recordsRejected,
    qualityJson: JSON.stringify(batch.quality),
    sheetsJson: JSON.stringify(batch.sheets),
    rejectedRowsJson: JSON.stringify(batch.rejectedRows),
    reconciliationJson: batch.reconciliation ? JSON.stringify(batch.reconciliation) : null,
    businessDayStartHour: batch.businessDayStartHour,
    createdAt: batch.createdAt,
  });
  return batch;
}

function rowToBatch(row: any): ImportBatch {
  return {
    id: row.id,
    fileName: row.fileName,
    fileSizeBytes: row.fileSizeBytes,
    sourceType: row.sourceType,
    fileHash: row.fileHash,
    datasetTypes: JSON.parse(row.datasetTypesJson),
    status: row.status,
    businessDateFrom: row.businessDateFrom,
    businessDateTo: row.businessDateTo,
    recordsFound: row.recordsFound,
    recordsInserted: row.recordsInserted,
    recordsUpdated: row.recordsUpdated,
    duplicatesSkipped: row.duplicatesSkipped,
    recordsRejected: row.recordsRejected,
    quality: JSON.parse(row.qualityJson),
    sheets: JSON.parse(row.sheetsJson),
    rejectedRows: JSON.parse(row.rejectedRowsJson),
    reconciliation: row.reconciliationJson ? JSON.parse(row.reconciliationJson) : null,
    businessDayStartHour: row.businessDayStartHour,
    createdAt: row.createdAt,
  };
}

export function listImportBatches(limit = 100): ImportBatch[] {
  return db
    .prepare(`SELECT * FROM dataset_import_batches ORDER BY createdAt DESC LIMIT ?`)
    .all(limit)
    .map(rowToBatch);
}

export function getImportBatch(id: string): ImportBatch | undefined {
  const row = db.prepare(`SELECT * FROM dataset_import_batches WHERE id = ?`).get(id);
  return row ? rowToBatch(row) : undefined;
}

export function findBatchByFileHash(fileHash: string): ImportBatch | undefined {
  const row = db.prepare(`SELECT * FROM dataset_import_batches WHERE fileHash = ? ORDER BY createdAt DESC LIMIT 1`).get(fileHash);
  return row ? rowToBatch(row) : undefined;
}

export function deleteImportBatch(id: string): boolean {
  const run = db.transaction((batchId: string) => {
    db.prepare(`DELETE FROM dataset_records WHERE importBatchId = ?`).run(batchId);
    return db.prepare(`DELETE FROM dataset_import_batches WHERE id = ?`).run(batchId).changes > 0;
  });
  return run(id);
}

// ---------------------------------------------------------------- reads ----

function buildWhere(filter: DatasetFilter): { clause: string; params: unknown[] } {
  const conds: string[] = [];
  const params: unknown[] = [];
  if (filter.from) {
    conds.push("businessDate >= ?");
    params.push(filter.from);
  }
  if (filter.to) {
    conds.push("businessDate <= ?");
    params.push(filter.to);
  }
  if (filter.datasetType) {
    conds.push("datasetType = ?");
    params.push(filter.datasetType);
  }
  if (filter.product) {
    conds.push("productKey = ?");
    params.push(productKeyOf(filter.product));
  }
  if (filter.outlet) {
    conds.push("outlet = ?");
    params.push(filter.outlet);
  }
  if (filter.shift) {
    conds.push("shift = ?");
    params.push(filter.shift);
  }
  if (filter.search) {
    conds.push("(product LIKE ? OR category LIKE ? OR sourceFile LIKE ? OR reason LIKE ?)");
    const like = `%${filter.search}%`;
    params.push(like, like, like, like);
  }
  return { clause: conds.length ? `WHERE ${conds.join(" AND ")}` : "", params };
}

function mapRecord(row: any): DatasetRecord {
  return {
    id: row.id,
    datasetType: row.datasetType,
    rawTimestamp: row.rawTimestamp,
    transactionDate: row.transactionDate,
    businessDate: row.businessDate,
    businessDayStartHour: row.businessDayStartHour,
    hour: row.hour,
    shift: row.shift,
    product: row.product,
    category: row.category,
    outlet: row.outlet,
    channel: row.channel,
    quantity: row.quantity,
    salesValue: row.salesValue,
    reason: row.reason,
    importBatchId: row.importBatchId,
    sourceFile: row.sourceFile,
    sourceType: row.sourceType,
    sourceSheet: row.sourceSheet,
    sourcePage: row.sourcePage,
    sourceRow: row.sourceRow,
    fingerprint: row.fingerprint,
    flags: JSON.parse(row.flagsJson ?? "[]"),
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

const MAX_PAGE_SIZE = 200;

export function queryRecords(filter: DatasetFilter): PaginatedRecords {
  const { clause, params } = buildWhere(filter);
  const total = (db.prepare(`SELECT COUNT(*) as c FROM dataset_records ${clause}`).get(...params) as { c: number }).c;
  const pageSize = Math.min(MAX_PAGE_SIZE, Math.max(1, filter.pageSize ?? 50));
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const page = Math.min(Math.max(1, filter.page ?? 1), totalPages);
  const rows = db
    .prepare(
      `SELECT * FROM dataset_records ${clause}
       ORDER BY businessDate DESC, COALESCE(rawTimestamp, '') DESC, salesValue DESC, quantity DESC
       LIMIT ? OFFSET ?`
    )
    .all(...params, pageSize, (page - 1) * pageSize)
    .map(mapRecord);

  return { data: rows, pagination: { page, pageSize, totalItems: total, totalPages } };
}

/** Every record matching a filter, for CSV export. Hard-capped to stay safe. */
export function exportRecords(filter: DatasetFilter, cap = 50000): DatasetRecord[] {
  const { clause, params } = buildWhere(filter);
  return db
    .prepare(`SELECT * FROM dataset_records ${clause} ORDER BY businessDate DESC, product ASC LIMIT ?`)
    .all(...params, cap)
    .map(mapRecord);
}

export interface DatasetTotals {
  quantity: number;
  value: number;
  recordCount: number;
}

export function totalsFor(filter: DatasetFilter): DatasetTotals {
  const { clause, params } = buildWhere(filter);
  const row = db
    .prepare(
      `SELECT COALESCE(SUM(quantity),0) as quantity, COALESCE(SUM(salesValue),0) as value, COUNT(*) as recordCount
       FROM dataset_records ${clause}`
    )
    .get(...params) as DatasetTotals;
  return row;
}

export function dailyTotals(filter: DatasetFilter): { businessDate: string; quantity: number; value: number }[] {
  const { clause, params } = buildWhere(filter);
  return db
    .prepare(
      `SELECT businessDate, COALESCE(SUM(quantity),0) as quantity, COALESCE(SUM(salesValue),0) as value
       FROM dataset_records ${clause} GROUP BY businessDate ORDER BY businessDate ASC`
    )
    .all(...params) as { businessDate: string; quantity: number; value: number }[];
}

export function topProducts(
  filter: DatasetFilter,
  limit = 15,
  order: "desc" | "asc" = "desc"
): { product: string; category: string | null; quantity: number; value: number }[] {
  const { clause, params } = buildWhere(filter);
  return db
    .prepare(
      `SELECT product, MAX(category) as category, COALESCE(SUM(quantity),0) as quantity, COALESCE(SUM(salesValue),0) as value
       FROM dataset_records ${clause}
       GROUP BY productKey
       ORDER BY value ${order === "desc" ? "DESC" : "ASC"}, quantity ${order === "desc" ? "DESC" : "ASC"}
       LIMIT ?`
    )
    .all(...params, limit) as { product: string; category: string | null; quantity: number; value: number }[];
}

export function categoryTotals(filter: DatasetFilter): { category: string; quantity: number; value: number }[] {
  const { clause, params } = buildWhere(filter);
  return db
    .prepare(
      `SELECT COALESCE(category, 'Uncategorised') as category, COALESCE(SUM(quantity),0) as quantity,
              COALESCE(SUM(salesValue),0) as value
       FROM dataset_records ${clause} GROUP BY COALESCE(category, 'Uncategorised') ORDER BY value DESC`
    )
    .all(...params) as { category: string; quantity: number; value: number }[];
}

export function channelTotals(filter: DatasetFilter): { channel: string; quantity: number; value: number }[] {
  const { clause, params } = buildWhere(filter);
  const extra = clause ? `${clause} AND channel IS NOT NULL` : `WHERE channel IS NOT NULL`;
  return db
    .prepare(
      `SELECT channel, COALESCE(SUM(quantity),0) as quantity, COALESCE(SUM(salesValue),0) as value
       FROM dataset_records ${extra} GROUP BY channel ORDER BY value DESC`
    )
    .all(...params) as { channel: string; quantity: number; value: number }[];
}

/**
 * Hourly buckets keyed on the RAW clock hour, ordered by position within the
 * trading window. A 01:00 transaction on a 05:00-start day therefore appears
 * at the end of its own business day's curve, with its real clock time intact.
 * Returns [] when no record in range carries a timestamp.
 */
export function hourlyBuckets(filter: DatasetFilter): HourlyBucket[] {
  const startHour = getBusinessDayStartHour();
  const { clause, params } = buildWhere({ ...filter, datasetType: undefined });
  const where = clause ? `${clause} AND hour IS NOT NULL` : `WHERE hour IS NOT NULL`;

  const rows = db
    .prepare(
      `SELECT hour, datasetType,
              COALESCE(SUM(quantity),0) as quantity,
              COALESCE(SUM(salesValue),0) as value,
              COUNT(*) as recordCount
       FROM dataset_records ${where}
       GROUP BY hour, datasetType`
    )
    .all(...params) as { hour: number; datasetType: DatasetType; quantity: number; value: number; recordCount: number }[];

  if (rows.length === 0) return [];

  const byHour = new Map<number, HourlyBucket>();
  for (const r of rows) {
    let b = byHour.get(r.hour);
    if (!b) {
      b = {
        hour: r.hour,
        label: formatHourBucket(r.hour),
        slot: (r.hour - startHour + 24) % 24,
        isAfterMidnight: r.hour < startHour,
        salesValue: 0,
        salesQty: 0,
        productionQty: 0,
        wastageQty: 0,
        recordCount: 0,
      };
      byHour.set(r.hour, b);
    }
    if (r.datasetType === "sales") {
      b.salesValue += r.value;
      b.salesQty += r.quantity;
    } else if (r.datasetType === "production") b.productionQty += r.quantity;
    else if (r.datasetType === "wastage") b.wastageQty += r.quantity;
    b.recordCount += r.recordCount;
  }

  return [...byHour.values()].sort((a, b) => a.slot - b.slot);
}

/** Per-product sales/production/wastage side by side, for cross-dataset analysis. */
export function productPerformance(filter: DatasetFilter, limit = 200): ProductPerformanceRow[] {
  const base: DatasetFilter = { ...filter, datasetType: undefined };
  const { clause, params } = buildWhere(base);
  const rows = db
    .prepare(
      `SELECT product, MAX(category) as category,
              COALESCE(SUM(CASE WHEN datasetType='sales' THEN quantity END),0) as salesQty,
              COALESCE(SUM(CASE WHEN datasetType='sales' THEN salesValue END),0) as salesValue,
              COALESCE(SUM(CASE WHEN datasetType='production' THEN quantity END),0) as productionQty,
              COALESCE(SUM(CASE WHEN datasetType='wastage' THEN quantity END),0) as wastageQty
       FROM dataset_records ${clause}
       GROUP BY productKey
       ORDER BY salesValue DESC, salesQty DESC
       LIMIT ?`
    )
    .all(...params, limit) as Omit<ProductPerformanceRow, "sellThroughPct" | "wastagePct" | "variancePct">[];

  return rows.map((r) => ({
    ...r,
    sellThroughPct: r.productionQty > 0 ? (r.salesQty / r.productionQty) * 100 : null,
    wastagePct: r.productionQty > 0 ? (r.wastageQty / r.productionQty) * 100 : null,
    variancePct: r.productionQty > 0 ? ((r.productionQty - r.salesQty - r.wastageQty) / r.productionQty) * 100 : null,
  }));
}

export function wastageByReason(filter: DatasetFilter): { reason: string; quantity: number; recordCount: number }[] {
  const { clause, params } = buildWhere({ ...filter, datasetType: "wastage" });
  return db
    .prepare(
      `SELECT COALESCE(reason, 'Not recorded') as reason, COALESCE(SUM(quantity),0) as quantity, COUNT(*) as recordCount
       FROM dataset_records ${clause} GROUP BY COALESCE(reason, 'Not recorded') ORDER BY quantity DESC`
    )
    .all(...params) as { reason: string; quantity: number; recordCount: number }[];
}

/** What data actually exists -- drives every "Insufficient data" decision. */
export function datasetCoverage(): DatasetCoverage[] {
  const rows = db
    .prepare(
      `SELECT datasetType, COUNT(*) as recordCount, MIN(businessDate) as businessDateFrom,
              MAX(businessDate) as businessDateTo,
              SUM(CASE WHEN rawTimestamp IS NOT NULL THEN 1 ELSE 0 END) as tsCount,
              COUNT(DISTINCT productKey) as distinctProducts
       FROM dataset_records GROUP BY datasetType`
    )
    .all() as any[];

  return rows.map((r) => ({
    datasetType: r.datasetType,
    recordCount: r.recordCount,
    businessDateFrom: r.businessDateFrom,
    businessDateTo: r.businessDateTo,
    hasTimestamps: r.tsCount > 0,
    distinctProducts: r.distinctProducts,
  }));
}

export function distinctValues(column: "product" | "outlet" | "shift"): string[] {
  const col = column === "product" ? "product" : column;
  return (
    db.prepare(`SELECT DISTINCT ${col} as v FROM dataset_records WHERE ${col} IS NOT NULL ORDER BY v ASC LIMIT 500`).all() as {
      v: string;
    }[]
  ).map((r) => r.v);
}

export function latestBusinessDate(datasetType?: DatasetType): string | null {
  const row = datasetType
    ? (db.prepare(`SELECT MAX(businessDate) as d FROM dataset_records WHERE datasetType = ?`).get(datasetType) as { d: string | null })
    : (db.prepare(`SELECT MAX(businessDate) as d FROM dataset_records`).get() as { d: string | null });
  return row?.d ?? null;
}

export { getBusinessDayStartHour };
