import { query, withTransaction } from "../../db/client.js";
import { getBusinessDayStartHour } from "./db.js";
import type {
  DatasetCoverage,
  DatasetFilter,
  DatasetRecord,
  DatasetType,
  ImportBatch,
  PaginatedRecords,
  SourceType,
} from "../../../../shared-types/datasets.js";
import type { HourlyBucket, ProductPerformanceRow } from "../../../../shared-types/intelligence.js";
import { formatHourBucket, getBusinessHourSlot } from "../../../../shared-types/businessDate.js";

// ---------------------------------------------------------------- writes ----

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
      const existingRes = await client.query<{ id: string; quantity: number; salesValue: number | null }>(
        `SELECT id, quantity, "salesValue" FROM dataset_records WHERE fingerprint = $1`,
        [r.fingerprint]
      );
      const existing = existingRes.rows[0];
      const productKey = productKeyOf(r.product);

      if (!existing) {
        await client.query(
          `INSERT INTO dataset_records (
            id, "datasetType", "rawTimestamp", "transactionDate", "businessDate", "businessDayStartHour", hour, shift,
            product, "productKey", category, outlet, channel, quantity, "salesValue", reason,
            "importBatchId", "sourceFile", "sourceType", "sourceSheet", "sourcePage", "sourceRow",
            fingerprint, "flagsJson", "createdAt", "updatedAt"
          ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26)`,
          [
            r.id,
            r.datasetType,
            r.rawTimestamp,
            r.transactionDate,
            r.businessDate,
            r.businessDayStartHour,
            r.hour,
            r.shift,
            r.product,
            productKey,
            r.category,
            r.outlet,
            r.channel,
            r.quantity,
            r.salesValue,
            r.reason,
            r.importBatchId,
            r.sourceFile,
            r.sourceType,
            r.sourceSheet,
            r.sourcePage,
            r.sourceRow,
            r.fingerprint,
            JSON.stringify(r.flags),
            r.createdAt,
            r.updatedAt,
          ]
        );
        inserted++;
        continue;
      }

      const same =
        Math.abs(existing.quantity - r.quantity) < 0.005 && Math.abs((existing.salesValue ?? 0) - (r.salesValue ?? 0)) < 0.005;
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
          r.importBatchId,
          r.category,
          r.product,
          r.quantity,
          r.salesValue,
          r.reason,
          r.transactionDate,
          r.rawTimestamp,
          r.hour,
          r.shift,
          r.outlet,
          r.businessDayStartHour,
          JSON.stringify(r.flags),
          r.updatedAt,
          existing.id,
        ]
      );
      updated++;
    }
  });

  return { inserted, updated, duplicates };
}

// -------------------------------------------------------------- batches ----

export async function insertImportBatch(batch: ImportBatch): Promise<ImportBatch> {
  await query(
    `INSERT INTO dataset_import_batches (
      id, "fileName", "fileSizeBytes", "sourceType", "fileHash", "datasetTypesJson", status,
      "businessDateFrom", "businessDateTo", "recordsFound", "recordsInserted", "recordsUpdated",
      "duplicatesSkipped", "recordsRejected", "qualityJson", "sheetsJson", "rejectedRowsJson",
      "reconciliationJson", "businessDayStartHour", "createdAt"
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20)`,
    [
      batch.id,
      batch.fileName,
      batch.fileSizeBytes,
      batch.sourceType,
      batch.fileHash,
      JSON.stringify(batch.datasetTypes),
      batch.status,
      batch.businessDateFrom,
      batch.businessDateTo,
      batch.recordsFound,
      batch.recordsInserted,
      batch.recordsUpdated,
      batch.duplicatesSkipped,
      batch.recordsRejected,
      JSON.stringify(batch.quality),
      JSON.stringify(batch.sheets),
      JSON.stringify(batch.rejectedRows),
      batch.reconciliation ? JSON.stringify(batch.reconciliation) : null,
      batch.businessDayStartHour,
      batch.createdAt,
    ]
  );
  return batch;
}

// "...Json" columns and every date/time column on these tables stayed plain
// TEXT in Postgres (Stage 1 deliberately did not change these to jsonb/
// timestamptz), so they come back from node-postgres as plain strings, same
// as they did from better-sqlite3.
function rowToBatch(row: Record<string, unknown>): ImportBatch {
  return {
    id: row.id as string,
    fileName: row.fileName as string,
    fileSizeBytes: row.fileSizeBytes as number,
    sourceType: row.sourceType as ImportBatch["sourceType"],
    fileHash: row.fileHash as string,
    datasetTypes: JSON.parse(row.datasetTypesJson as string),
    status: row.status as ImportBatch["status"],
    businessDateFrom: row.businessDateFrom as string | null,
    businessDateTo: row.businessDateTo as string | null,
    recordsFound: row.recordsFound as number,
    recordsInserted: row.recordsInserted as number,
    recordsUpdated: row.recordsUpdated as number,
    duplicatesSkipped: row.duplicatesSkipped as number,
    recordsRejected: row.recordsRejected as number,
    quality: JSON.parse(row.qualityJson as string),
    sheets: JSON.parse(row.sheetsJson as string),
    rejectedRows: JSON.parse(row.rejectedRowsJson as string),
    reconciliation: row.reconciliationJson ? JSON.parse(row.reconciliationJson as string) : null,
    businessDayStartHour: row.businessDayStartHour as number,
    createdAt: row.createdAt as string,
  };
}

export async function listImportBatches(limit = 100): Promise<ImportBatch[]> {
  const { rows } = await query(`SELECT * FROM dataset_import_batches ORDER BY "createdAt" DESC LIMIT $1`, [limit]);
  return rows.map(rowToBatch);
}

export async function getImportBatch(id: string): Promise<ImportBatch | undefined> {
  const { rows } = await query(`SELECT * FROM dataset_import_batches WHERE id = $1`, [id]);
  return rows[0] ? rowToBatch(rows[0]) : undefined;
}

export async function findBatchByFileHash(fileHash: string): Promise<ImportBatch | undefined> {
  const { rows } = await query(
    `SELECT * FROM dataset_import_batches WHERE "fileHash" = $1 ORDER BY "createdAt" DESC LIMIT 1`,
    [fileHash]
  );
  return rows[0] ? rowToBatch(rows[0]) : undefined;
}

export async function deleteImportBatch(id: string): Promise<boolean> {
  return withTransaction(async (client) => {
    await client.query(`DELETE FROM dataset_records WHERE "importBatchId" = $1`, [id]);
    const res = await client.query(`DELETE FROM dataset_import_batches WHERE id = $1`, [id]);
    return (res.rowCount ?? 0) > 0;
  });
}

// ---------------------------------------------------------------- reads ----

function buildWhere(filter: DatasetFilter): { clause: string; params: unknown[] } {
  const conds: string[] = [];
  const params: unknown[] = [];
  if (filter.from) {
    params.push(filter.from);
    conds.push(`"businessDate" >= $${params.length}`);
  }
  if (filter.to) {
    params.push(filter.to);
    conds.push(`"businessDate" <= $${params.length}`);
  }
  if (filter.datasetType) {
    params.push(filter.datasetType);
    conds.push(`"datasetType" = $${params.length}`);
  }
  if (filter.product) {
    params.push(productKeyOf(filter.product));
    conds.push(`"productKey" = $${params.length}`);
  }
  if (filter.outlet) {
    params.push(filter.outlet);
    conds.push(`outlet = $${params.length}`);
  }
  if (filter.shift) {
    params.push(filter.shift);
    conds.push(`shift = $${params.length}`);
  }
  if (filter.search) {
    const like = `%${filter.search}%`;
    params.push(like, like, like, like);
    const n = params.length;
    conds.push(`(product LIKE $${n - 3} OR category LIKE $${n - 2} OR "sourceFile" LIKE $${n - 1} OR reason LIKE $${n})`);
  }
  return { clause: conds.length ? `WHERE ${conds.join(" AND ")}` : "", params };
}

function mapRecord(row: Record<string, unknown>): DatasetRecord {
  return {
    id: row.id as string,
    datasetType: row.datasetType as DatasetType,
    rawTimestamp: row.rawTimestamp as string | null,
    transactionDate: row.transactionDate as string | null,
    businessDate: row.businessDate as string,
    businessDayStartHour: row.businessDayStartHour as number,
    hour: row.hour as number | null,
    shift: row.shift as string | null,
    product: row.product as string,
    category: row.category as string | null,
    outlet: row.outlet as string | null,
    channel: row.channel as string | null,
    quantity: row.quantity as number,
    salesValue: row.salesValue as number | null,
    reason: row.reason as string | null,
    importBatchId: row.importBatchId as string,
    sourceFile: row.sourceFile as string,
    sourceType: row.sourceType as SourceType,
    sourceSheet: row.sourceSheet as string | null,
    sourcePage: row.sourcePage as number | null,
    sourceRow: row.sourceRow as number | null,
    fingerprint: row.fingerprint as string,
    flags: JSON.parse((row.flagsJson as string) ?? "[]"),
    createdAt: row.createdAt as string,
    updatedAt: row.updatedAt as string,
  };
}

const MAX_PAGE_SIZE = 200;

export async function queryRecords(filter: DatasetFilter): Promise<PaginatedRecords> {
  const { clause, params } = buildWhere(filter);
  const countRes = await query<{ c: number }>(`SELECT COUNT(*)::int as c FROM dataset_records ${clause}`, params);
  const total = countRes.rows[0].c;
  const pageSize = Math.min(MAX_PAGE_SIZE, Math.max(1, filter.pageSize ?? 50));
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const page = Math.min(Math.max(1, filter.page ?? 1), totalPages);

  const limitParamIdx = params.length + 1;
  const offsetParamIdx = params.length + 2;
  const { rows } = await query(
    `SELECT * FROM dataset_records ${clause}
     ORDER BY "businessDate" DESC, COALESCE("rawTimestamp", '') DESC, "salesValue" DESC, quantity DESC
     LIMIT $${limitParamIdx} OFFSET $${offsetParamIdx}`,
    [...params, pageSize, (page - 1) * pageSize]
  );

  return { data: rows.map(mapRecord), pagination: { page, pageSize, totalItems: total, totalPages } };
}

/** Every record matching a filter, for CSV export. Hard-capped to stay safe. */
export async function exportRecords(filter: DatasetFilter, cap = 50000): Promise<DatasetRecord[]> {
  const { clause, params } = buildWhere(filter);
  const { rows } = await query(
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
  const { rows } = await query<DatasetTotals>(
    `SELECT COALESCE(SUM(quantity),0) as quantity, COALESCE(SUM("salesValue"),0) as value, COUNT(*)::int as "recordCount"
     FROM dataset_records ${clause}`,
    params
  );
  const row = rows[0];
  return { quantity: Number(row.quantity), value: Number(row.value), recordCount: row.recordCount };
}

export async function dailyTotals(
  filter: DatasetFilter
): Promise<{ businessDate: string; quantity: number; value: number }[]> {
  const { clause, params } = buildWhere(filter);
  const { rows } = await query<{ businessDate: string; quantity: number; value: number }>(
    `SELECT "businessDate", COALESCE(SUM(quantity),0) as quantity, COALESCE(SUM("salesValue"),0) as value
     FROM dataset_records ${clause} GROUP BY "businessDate" ORDER BY "businessDate" ASC`,
    params
  );
  return rows.map((r) => ({ ...r, quantity: Number(r.quantity), value: Number(r.value) }));
}

export async function topProducts(
  filter: DatasetFilter,
  limit = 15,
  order: "desc" | "asc" = "desc"
): Promise<{ product: string; category: string | null; quantity: number; value: number }[]> {
  const { clause, params } = buildWhere(filter);
  const dir = order === "desc" ? "DESC" : "ASC";
  const { rows } = await query<{ product: string; category: string | null; quantity: number; value: number }>(
    `SELECT product, MAX(category) as category, COALESCE(SUM(quantity),0) as quantity, COALESCE(SUM("salesValue"),0) as value
     FROM dataset_records ${clause}
     GROUP BY "productKey", product
     ORDER BY value ${dir}, quantity ${dir}
     LIMIT $${params.length + 1}`,
    [...params, limit]
  );
  return rows.map((r) => ({ ...r, quantity: Number(r.quantity), value: Number(r.value) }));
}

export async function categoryTotals(
  filter: DatasetFilter
): Promise<{ category: string; quantity: number; value: number }[]> {
  const { clause, params } = buildWhere(filter);
  const { rows } = await query<{ category: string; quantity: number; value: number }>(
    `SELECT COALESCE(category, 'Uncategorised') as category, COALESCE(SUM(quantity),0) as quantity,
            COALESCE(SUM("salesValue"),0) as value
     FROM dataset_records ${clause} GROUP BY COALESCE(category, 'Uncategorised') ORDER BY value DESC`,
    params
  );
  return rows.map((r) => ({ ...r, quantity: Number(r.quantity), value: Number(r.value) }));
}

export async function channelTotals(
  filter: DatasetFilter
): Promise<{ channel: string; quantity: number; value: number }[]> {
  const { clause, params } = buildWhere(filter);
  const extra = clause ? `${clause} AND channel IS NOT NULL` : `WHERE channel IS NOT NULL`;
  const { rows } = await query<{ channel: string; quantity: number; value: number }>(
    `SELECT channel, COALESCE(SUM(quantity),0) as quantity, COALESCE(SUM("salesValue"),0) as value
     FROM dataset_records ${extra} GROUP BY channel ORDER BY value DESC`,
    params
  );
  return rows.map((r) => ({ ...r, quantity: Number(r.quantity), value: Number(r.value) }));
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

  const { rows } = await query<{ hour: number; datasetType: DatasetType; quantity: number; value: number; recordCount: number }>(
    `SELECT hour, "datasetType",
            COALESCE(SUM(quantity),0) as quantity,
            COALESCE(SUM("salesValue"),0) as value,
            COUNT(*)::int as "recordCount"
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
    if (r.datasetType === "sales") {
      b.salesValue += Number(r.value);
      b.salesQty += Number(r.quantity);
    } else if (r.datasetType === "production") b.productionQty += Number(r.quantity);
    else if (r.datasetType === "wastage") b.wastageQty += Number(r.quantity);
    b.recordCount += r.recordCount;
  }

  return [...byHour.values()].sort((a, b) => a.slot - b.slot);
}

/** Per-product sales/production/wastage side by side, for cross-dataset analysis. */
export async function productPerformance(filter: DatasetFilter, limit = 200): Promise<ProductPerformanceRow[]> {
  const base: DatasetFilter = { ...filter, datasetType: undefined };
  const { clause, params } = buildWhere(base);
  const { rows } = await query<Omit<ProductPerformanceRow, "sellThroughPct" | "wastagePct" | "variancePct">>(
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
    const salesQty = Number(r.salesQty);
    const salesValue = Number(r.salesValue);
    const productionQty = Number(r.productionQty);
    const wastageQty = Number(r.wastageQty);
    return {
      ...r,
      salesQty,
      salesValue,
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
 * `column` is always a hardcoded literal ("shift" | "outlet") from the two
 * wrapper functions below, never request input, so it is safe to
 * interpolate directly (as the original SQLite version also did).
 */
async function segmentPerformance(column: "shift" | "outlet", filter: DatasetFilter): Promise<SegmentPerformanceRow[]> {
  const base: DatasetFilter = { ...filter, datasetType: undefined };
  const { clause, params } = buildWhere(base);
  const where = clause ? `${clause} AND ${column} IS NOT NULL` : `WHERE ${column} IS NOT NULL`;

  const { rows } = await query<Omit<SegmentPerformanceRow, "sellThroughPct" | "wastagePct" | "variancePct">>(
    `SELECT ${column} as segment,
            COALESCE(SUM(CASE WHEN "datasetType"='sales' THEN quantity END),0) as "salesQty",
            COALESCE(SUM(CASE WHEN "datasetType"='sales' THEN "salesValue" END),0) as "salesValue",
            COALESCE(SUM(CASE WHEN "datasetType"='production' THEN quantity END),0) as "productionQty",
            COALESCE(SUM(CASE WHEN "datasetType"='wastage' THEN quantity END),0) as "wastageQty",
            COUNT(*)::int as "recordCount"
     FROM dataset_records ${where}
     GROUP BY ${column}
     ORDER BY "salesValue" DESC`,
    params
  );

  return rows.map((r) => {
    const salesQty = Number(r.salesQty);
    const salesValue = Number(r.salesValue);
    const productionQty = Number(r.productionQty);
    const wastageQty = Number(r.wastageQty);
    return {
      ...r,
      salesQty,
      salesValue,
      productionQty,
      wastageQty,
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
  const { rows } = await query<{ reason: string; quantity: number; recordCount: number }>(
    `SELECT COALESCE(reason, 'Not recorded') as reason, COALESCE(SUM(quantity),0) as quantity, COUNT(*)::int as "recordCount"
     FROM dataset_records ${clause} GROUP BY COALESCE(reason, 'Not recorded') ORDER BY quantity DESC`,
    params
  );
  return rows.map((r) => ({ ...r, quantity: Number(r.quantity) }));
}

/** What data actually exists -- drives every "Insufficient data" decision. */
export async function datasetCoverage(): Promise<DatasetCoverage[]> {
  const { rows } = await query<{
    datasetType: DatasetType;
    recordCount: number;
    businessDateFrom: string | null;
    businessDateTo: string | null;
    tsCount: number;
    distinctProducts: number;
  }>(
    `SELECT "datasetType", COUNT(*)::int as "recordCount", MIN("businessDate") as "businessDateFrom",
            MAX("businessDate") as "businessDateTo",
            SUM(CASE WHEN "rawTimestamp" IS NOT NULL THEN 1 ELSE 0 END)::int as "tsCount",
            COUNT(DISTINCT "productKey")::int as "distinctProducts"
     FROM dataset_records GROUP BY "datasetType"`
  );

  return rows.map((r) => ({
    datasetType: r.datasetType,
    recordCount: r.recordCount,
    businessDateFrom: r.businessDateFrom,
    businessDateTo: r.businessDateTo,
    hasTimestamps: r.tsCount > 0,
    distinctProducts: r.distinctProducts,
  }));
}

export async function distinctValues(column: "product" | "outlet" | "shift"): Promise<string[]> {
  const col = column === "product" ? "product" : column;
  const { rows } = await query<{ v: string }>(
    `SELECT DISTINCT ${col} as v FROM dataset_records WHERE ${col} IS NOT NULL ORDER BY v ASC LIMIT 500`
  );
  return rows.map((r) => r.v);
}

export async function latestBusinessDate(datasetType?: DatasetType): Promise<string | null> {
  const { rows } = datasetType
    ? await query<{ d: string | null }>(`SELECT MAX("businessDate") as d FROM dataset_records WHERE "datasetType" = $1`, [
        datasetType,
      ])
    : await query<{ d: string | null }>(`SELECT MAX("businessDate") as d FROM dataset_records`);
  return rows[0]?.d ?? null;
}

export { getBusinessDayStartHour };
