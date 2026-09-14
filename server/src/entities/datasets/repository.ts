import { query, queryOne, withTransaction } from "../../db/pg.js";
import { getBusinessDayStartHour } from "./db.js";
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

// Postgres folds unquoted identifiers to lowercase, so every camelCase column
// from the original SQLite schema (verified against the live Supabase schema
// in the Phase 1 audit) must stay double-quoted here.

export interface UpsertResult {
  inserted: number;
  updated: number;
  duplicates: number;
}

function productKeyOf(product: string): string {
  return product.trim().toLowerCase().replace(/\s+/g, " ");
}

export async function upsertRecords(records: DatasetRecord[]): Promise<UpsertResult> {
  let inserted = 0;
  let updated = 0;
  let duplicates = 0;

  await withTransaction(async (client) => {
    for (const r of records) {
      const existing = await client.query<{ id: string; quantity: number; salesValue: number | null }>(
        `SELECT id, quantity, "salesValue" FROM dataset_records WHERE fingerprint = $1`,
        [r.fingerprint]
      );
      const row = existing.rows[0];
      const productKey = productKeyOf(r.product);

      if (!row) {
        await client.query(
          `INSERT INTO dataset_records (
            id, "datasetType", "rawTimestamp", "transactionDate", "businessDate", "businessDayStartHour", hour, shift,
            product, "productKey", category, outlet, channel, quantity, "salesValue", reason,
            "importBatchId", "sourceFile", "sourceType", "sourceSheet", "sourcePage", "sourceRow",
            fingerprint, "flagsJson", "createdAt", "updatedAt"
          ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26)`,
          [
            r.id, r.datasetType, r.rawTimestamp, r.transactionDate, r.businessDate, r.businessDayStartHour, r.hour, r.shift,
            r.product, productKey, r.category, r.outlet, r.channel, r.quantity, r.salesValue, r.reason,
            r.importBatchId, r.sourceFile, r.sourceType, r.sourceSheet, r.sourcePage, r.sourceRow,
            r.fingerprint, JSON.stringify(r.flags), r.createdAt, r.updatedAt,
          ]
        );
        inserted++;
        continue;
      }

      const same =
        Math.abs(row.quantity - r.quantity) < 0.005 &&
        Math.abs((row.salesValue ?? 0) - (r.salesValue ?? 0)) < 0.005;
      if (same) {
        duplicates++;
        continue;
      }

      await client.query(
        `UPDATE dataset_records SET
          "importBatchId" = $1, category = $2, product = $3, quantity = $4,
          "salesValue" = $5, reason = $6, "transactionDate" = $7,
          "rawTimestamp" = $8, hour = $9, shift = $10, outlet = $11,
          "businessDayStartHour" = $12, "flagsJson" = $13, "updatedAt" = $14
        WHERE id = $15`,
        [
          r.importBatchId, r.category, r.product, r.quantity,
          r.salesValue, r.reason, r.transactionDate,
          r.rawTimestamp, r.hour, r.shift, r.outlet,
          r.businessDayStartHour, JSON.stringify(r.flags), r.updatedAt,
          row.id,
        ]
      );
      updated++;
    }
  });

  return { inserted, updated, duplicates };
}

export async function insertImportBatch(batch: ImportBatch): Promise<ImportBatch> {
  await query(
    `INSERT INTO dataset_import_batches (
      id, "fileName", "fileSizeBytes", "sourceType", "fileHash", "datasetTypesJson", status,
      "businessDateFrom", "businessDateTo", "recordsFound", "recordsInserted", "recordsUpdated",
      "duplicatesSkipped", "recordsRejected", "qualityJson", "sheetsJson", "rejectedRowsJson",
      "reconciliationJson", "businessDayStartHour", "createdAt"
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20)`,
    [
      batch.id, batch.fileName, batch.fileSizeBytes, batch.sourceType, batch.fileHash,
      JSON.stringify(batch.datasetTypes), batch.status, batch.businessDateFrom, batch.businessDateTo,
      batch.recordsFound, batch.recordsInserted, batch.recordsUpdated, batch.duplicatesSkipped,
      batch.recordsRejected, JSON.stringify(batch.quality), JSON.stringify(batch.sheets),
      JSON.stringify(batch.rejectedRows), batch.reconciliation ? JSON.stringify(batch.reconciliation) : null,
      batch.businessDayStartHour, batch.createdAt,
    ]
  );
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

export async function listImportBatches(limit = 100): Promise<ImportBatch[]> {
  const rows = await query(`SELECT * FROM dataset_import_batches ORDER BY "createdAt" DESC LIMIT $1`, [limit]);
  return rows.map(rowToBatch);
}

export async function getImportBatch(id: string): Promise<ImportBatch | undefined> {
  const row = await queryOne(`SELECT * FROM dataset_import_batches WHERE id = $1`, [id]);
  return row ? rowToBatch(row) : undefined;
}

export async function findBatchByFileHash(fileHash: string): Promise<ImportBatch | undefined> {
  const row = await queryOne(
    `SELECT * FROM dataset_import_batches WHERE "fileHash" = $1 ORDER BY "createdAt" DESC LIMIT 1`,
    [fileHash]
  );
  return row ? rowToBatch(row) : undefined;
}

export async function deleteImportBatch(id: string): Promise<boolean> {
  return withTransaction(async (client) => {
    await client.query(`DELETE FROM dataset_records WHERE "importBatchId" = $1`, [id]);
    const result = await client.query(`DELETE FROM dataset_import_batches WHERE id = $1`, [id]);
    return (result.rowCount ?? 0) > 0;
  });
}

function buildWhere(filter: DatasetFilter): { clause: string; params: unknown[] } {
  const conds: string[] = [];
  const params: unknown[] = [];
  let i = 0;
  const next = () => `$${++i}`;
  if (filter.from) {
    conds.push(`"businessDate" >= ${next()}`);
    params.push(filter.from);
  }
  if (filter.to) {
    conds.push(`"businessDate" <= ${next()}`);
    params.push(filter.to);
  }
  if (filter.datasetType) {
    conds.push(`"datasetType" = ${next()}`);
    params.push(filter.datasetType);
  }
  if (filter.product) {
    conds.push(`"productKey" = ${next()}`);
    params.push(productKeyOf(filter.product));
  }
  if (filter.outlet) {
    conds.push(`outlet = ${next()}`);
    params.push(filter.outlet);
  }
  if (filter.shift) {
    conds.push(`shift = ${next()}`);
    params.push(filter.shift);
  }
  if (filter.search) {
    const like = `%${filter.search}%`;
    conds.push(`(product ILIKE ${next()} OR category ILIKE ${next()} OR "sourceFile" ILIKE ${next()} OR reason ILIKE ${next()})`);
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
    quantity: Number(row.quantity),
    salesValue: row.salesValue == null ? null : Number(row.salesValue),
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

export async function queryRecords(filter: DatasetFilter): Promise<PaginatedRecords> {
  const { clause, params } = buildWhere(filter);
  const totalRow = await queryOne<{ c: string }>(`SELECT COUNT(*) as c FROM dataset_records ${clause}`, params);
  const total = Number(totalRow?.c ?? 0);
  const pageSize = Math.min(MAX_PAGE_SIZE, Math.max(1, filter.pageSize ?? 50));
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const page = Math.min(Math.max(1, filter.page ?? 1), totalPages);
  const limitIdx = params.length + 1;
  const offsetIdx = params.length + 2;
  const rows = await query(
    `SELECT * FROM dataset_records ${clause}
     ORDER BY "businessDate" DESC, COALESCE("rawTimestamp", '') DESC, "salesValue" DESC, quantity DESC
     LIMIT $${limitIdx} OFFSET $${offsetIdx}`,
    [...params, pageSize, (page - 1) * pageSize]
  );

  return { data: rows.map(mapRecord), pagination: { page, pageSize, totalItems: total, totalPages } };
}

/** Every record matching a filter, for CSV export. Hard-capped to stay safe. */
export async function exportRecords(filter: DatasetFilter, cap = 50000): Promise<DatasetRecord[]> {
  const { clause, params } = buildWhere(filter);
  const rows = await query(
    `SELECT * FROM dataset_records ${clause} ORDER BY "businessDate" DESC, product ASC LIMIT $${params.length + 1}`,
    [...params, cap]
  );
  return rows.map(mapRecord);
}

export interface DatasetTotals {
  quantity: number;
  value: number;
  recordCount: number;
}

export async function totalsFor(filter: DatasetFilter): Promise<DatasetTotals> {
  const { clause, params } = buildWhere(filter);
  const row = await queryOne<{ quantity: string; value: string; recordCount: string }>(
    `SELECT COALESCE(SUM(quantity),0) as quantity, COALESCE(SUM("salesValue"),0) as value, COUNT(*) as "recordCount"
     FROM dataset_records ${clause}`,
    params
  );
  return {
    quantity: Number(row?.quantity ?? 0),
    value: Number(row?.value ?? 0),
    recordCount: Number(row?.recordCount ?? 0),
  };
}

export async function dailyTotals(
  filter: DatasetFilter
): Promise<{ businessDate: string; quantity: number; value: number }[]> {
  const { clause, params } = buildWhere(filter);
  const rows = await query<{ businessDate: string; quantity: string; value: string }>(
    `SELECT "businessDate", COALESCE(SUM(quantity),0) as quantity, COALESCE(SUM("salesValue"),0) as value
     FROM dataset_records ${clause} GROUP BY "businessDate" ORDER BY "businessDate" ASC`,
    params
  );
  return rows.map((r) => ({ businessDate: r.businessDate, quantity: Number(r.quantity), value: Number(r.value) }));
}

export async function topProducts(
  filter: DatasetFilter,
  limit = 15,
  order: "desc" | "asc" = "desc"
): Promise<{ product: string; category: string | null; quantity: number; value: number }[]> {
  const { clause, params } = buildWhere(filter);
  const dir = order === "desc" ? "DESC" : "ASC";
  const rows = await query<{ product: string; category: string | null; quantity: string; value: string }>(
    `SELECT product, MAX(category) as category, COALESCE(SUM(quantity),0) as quantity, COALESCE(SUM("salesValue"),0) as value
     FROM dataset_records ${clause}
     GROUP BY "productKey", product
     ORDER BY value ${dir}, quantity ${dir}
     LIMIT $${params.length + 1}`,
    [...params, limit]
  );
  return rows.map((r) => ({ product: r.product, category: r.category, quantity: Number(r.quantity), value: Number(r.value) }));
}

export async function categoryTotals(
  filter: DatasetFilter
): Promise<{ category: string; quantity: number; value: number }[]> {
  const { clause, params } = buildWhere(filter);
  const rows = await query<{ category: string; quantity: string; value: string }>(
    `SELECT COALESCE(category, 'Uncategorised') as category, COALESCE(SUM(quantity),0) as quantity,
            COALESCE(SUM("salesValue"),0) as value
     FROM dataset_records ${clause} GROUP BY COALESCE(category, 'Uncategorised') ORDER BY value DESC`,
    params
  );
  return rows.map((r) => ({ category: r.category, quantity: Number(r.quantity), value: Number(r.value) }));
}

export async function channelTotals(
  filter: DatasetFilter
): Promise<{ channel: string; quantity: number; value: number }[]> {
  const { clause, params } = buildWhere(filter);
  const extra = clause ? `${clause} AND channel IS NOT NULL` : `WHERE channel IS NOT NULL`;
  const rows = await query<{ channel: string; quantity: string; value: string }>(
    `SELECT channel, COALESCE(SUM(quantity),0) as quantity, COALESCE(SUM("salesValue"),0) as value
     FROM dataset_records ${extra} GROUP BY channel ORDER BY value DESC`,
    params
  );
  return rows.map((r) => ({ channel: r.channel, quantity: Number(r.quantity), value: Number(r.value) }));
}

/**
 * Hourly buckets keyed on the RAW clock hour, ordered by position within the
 * trading window. A 01:00 transaction on a 05:00-start day therefore appears
 * at the end of its own business day's curve, with its real clock time intact.
 * Returns [] when no record in range carries a timestamp.
 */
export async function hourlyBuckets(filter: DatasetFilter): Promise<HourlyBucket[]> {
  const startHour = await getBusinessDayStartHour();
  const { clause, params } = buildWhere({ ...filter, datasetType: undefined });
  const where = clause ? `${clause} AND hour IS NOT NULL` : `WHERE hour IS NOT NULL`;

  const rows = await query<{ hour: number; datasetType: DatasetType; quantity: string; value: string; recordCount: string }>(
    `SELECT hour, "datasetType",
            COALESCE(SUM(quantity),0) as quantity,
            COALESCE(SUM("salesValue"),0) as value,
            COUNT(*) as "recordCount"
     FROM dataset_records ${where}
     GROUP BY hour, "datasetType"`,
    params
  );

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
    const quantity = Number(r.quantity);
    const value = Number(r.value);
    const recordCount = Number(r.recordCount);
    if (r.datasetType === "sales") {
      b.salesValue += value;
      b.salesQty += quantity;
    } else if (r.datasetType === "production") b.productionQty += quantity;
    else if (r.datasetType === "wastage") b.wastageQty += quantity;
    b.recordCount += recordCount;
  }

  return [...byHour.values()].sort((a, b) => a.slot - b.slot);
}

/** Per-product sales/production/wastage side by side, for cross-dataset analysis. */
export async function productPerformance(filter: DatasetFilter, limit = 200): Promise<ProductPerformanceRow[]> {
  const base: DatasetFilter = { ...filter, datasetType: undefined };
  const { clause, params } = buildWhere(base);
  const rows = await query<any>(
    `SELECT product, MAX(category) as category,
            COALESCE(SUM(CASE WHEN "datasetType"='sales' THEN quantity END),0) as "salesQty",
            COALESCE(SUM(CASE WHEN "datasetType"='sales' THEN "salesValue" END),0) as "salesValue",
            COALESCE(SUM(CASE WHEN "datasetType"='production' THEN quantity END),0) as "productionQty",
            COALESCE(SUM(CASE WHEN "datasetType"='wastage' THEN quantity END),0) as "wastageQty"
     FROM dataset_records ${clause}
     GROUP BY "productKey", product
     ORDER BY "salesValue" DESC, "salesQty" DESC
     LIMIT $${params.length + 1}`,
    [...params, limit]
  );

  return rows.map((r) => {
    const productionQty = Number(r.productionQty);
    const salesQty = Number(r.salesQty);
    const wastageQty = Number(r.wastageQty);
    return {
      product: r.product,
      category: r.category,
      salesQty,
      salesValue: Number(r.salesValue),
      productionQty,
      wastageQty,
      sellThroughPct: productionQty > 0 ? (salesQty / productionQty) * 100 : null,
      wastagePct: productionQty > 0 ? (wastageQty / productionQty) * 100 : null,
      variancePct: productionQty > 0 ? ((productionQty - salesQty - wastageQty) / productionQty) * 100 : null,
    };
  });
}

export interface SegmentPerformanceRow {
  segment: string;
  salesQty: number;
  salesValue: number;
  productionQty: number;
  wastageQty: number;
  sellThroughPct: number | null;
  wastagePct: number | null;
  variancePct: number | null;
  recordCount: number;
}

/**
 * Cross-dataset rollup grouped by shift or outlet, mirroring productPerformance.
 */
async function segmentPerformance(column: "shift" | "outlet", filter: DatasetFilter): Promise<SegmentPerformanceRow[]> {
  const base: DatasetFilter = { ...filter, datasetType: undefined };
  const { clause, params } = buildWhere(base);
  const where = clause ? `${clause} AND ${column} IS NOT NULL` : `WHERE ${column} IS NOT NULL`;

  const rows = await query<any>(
    `SELECT ${column} as segment,
            COALESCE(SUM(CASE WHEN "datasetType"='sales' THEN quantity END),0) as "salesQty",
            COALESCE(SUM(CASE WHEN "datasetType"='sales' THEN "salesValue" END),0) as "salesValue",
            COALESCE(SUM(CASE WHEN "datasetType"='production' THEN quantity END),0) as "productionQty",
            COALESCE(SUM(CASE WHEN "datasetType"='wastage' THEN quantity END),0) as "wastageQty",
            COUNT(*) as "recordCount"
     FROM dataset_records ${where}
     GROUP BY ${column}
     ORDER BY "salesValue" DESC`,
    params
  );

  return rows.map((r) => {
    const productionQty = Number(r.productionQty);
    const salesQty = Number(r.salesQty);
    const wastageQty = Number(r.wastageQty);
    return {
      segment: r.segment,
      salesQty,
      salesValue: Number(r.salesValue),
      productionQty,
      wastageQty,
      recordCount: Number(r.recordCount),
      sellThroughPct: productionQty > 0 ? (salesQty / productionQty) * 100 : null,
      wastagePct: productionQty > 0 ? (wastageQty / productionQty) * 100 : null,
      variancePct: productionQty > 0 ? ((productionQty - salesQty - wastageQty) / productionQty) * 100 : null,
    };
  });
}

export function shiftPerformance(filter: DatasetFilter): Promise<SegmentPerformanceRow[]> {
  return segmentPerformance("shift", filter);
}

export function outletPerformance(filter: DatasetFilter): Promise<SegmentPerformanceRow[]> {
  return segmentPerformance("outlet", filter);
}

export async function wastageByReason(
  filter: DatasetFilter
): Promise<{ reason: string; quantity: number; recordCount: number }[]> {
  const { clause, params } = buildWhere({ ...filter, datasetType: "wastage" });
  const rows = await query<{ reason: string; quantity: string; recordCount: string }>(
    `SELECT COALESCE(reason, 'Not recorded') as reason, COALESCE(SUM(quantity),0) as quantity, COUNT(*) as "recordCount"
     FROM dataset_records ${clause} GROUP BY COALESCE(reason, 'Not recorded') ORDER BY quantity DESC`,
    params
  );
  return rows.map((r) => ({ reason: r.reason, quantity: Number(r.quantity), recordCount: Number(r.recordCount) }));
}

/** What data actually exists -- drives every "Insufficient data" decision. */
export async function datasetCoverage(): Promise<DatasetCoverage[]> {
  const rows = await query<any>(
    `SELECT "datasetType", COUNT(*) as "recordCount", MIN("businessDate") as "businessDateFrom",
            MAX("businessDate") as "businessDateTo",
            SUM(CASE WHEN "rawTimestamp" IS NOT NULL THEN 1 ELSE 0 END) as "tsCount",
            COUNT(DISTINCT "productKey") as "distinctProducts"
     FROM dataset_records GROUP BY "datasetType"`
  );

  return rows.map((r) => ({
    datasetType: r.datasetType,
    recordCount: Number(r.recordCount),
    businessDateFrom: r.businessDateFrom,
    businessDateTo: r.businessDateTo,
    hasTimestamps: Number(r.tsCount) > 0,
    distinctProducts: Number(r.distinctProducts),
  }));
}

export async function distinctValues(column: "product" | "outlet" | "shift"): Promise<string[]> {
  const rows = await query<{ v: string }>(
    `SELECT DISTINCT ${column} as v FROM dataset_records WHERE ${column} IS NOT NULL ORDER BY v ASC LIMIT 500`
  );
  return rows.map((r) => r.v);
}

export async function latestBusinessDate(datasetType?: DatasetType): Promise<string | null> {
  const row = datasetType
    ? await queryOne<{ d: string | null }>(`SELECT MAX("businessDate") as d FROM dataset_records WHERE "datasetType" = $1`, [datasetType])
    : await queryOne<{ d: string | null }>(`SELECT MAX("businessDate") as d FROM dataset_records`);
  return row?.d ?? null;
}

export { getBusinessDayStartHour };
