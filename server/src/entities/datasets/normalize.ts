import { randomUUID } from "node:crypto";
import { getBusinessDate } from "../../../../shared-types/businessDate.js";
import type {
  DatasetRecord,
  DatasetType,
  ImportQuality,
  QualityIssue,
  RecordFlag,
  SourceType,
} from "../../../../shared-types/datasets.js";
import { productKeyOf } from "./coerce.js";

export interface RawRowInput {
  datasetType: DatasetType;
  /** Full transaction timestamp when the source had one. Never synthesized. */
  rawTimestamp: string | null;
  /** Calendar date from the source (or the report's own date for aggregated rows). */
  transactionDate: string | null;
  hour: number | null;
  shift: string | null;
  product: string | null;
  category: string | null;
  outlet: string | null;
  channel: string | null;
  quantity: number | null;
  salesValue: number | null;
  reason: string | null;
  sourceSheet: string | null;
  sourcePage: number | null;
  sourceRow: number | null;
  /** True for pre-aggregated daily totals (PDF item-wise reports). */
  aggregated: boolean;
}

export interface BuildContext {
  importBatchId: string;
  sourceFile: string;
  sourceType: SourceType;
  businessDayStartHour: number;
  /** Fallback business date for aggregated rows with no per-row date. */
  fallbackBusinessDate: string | null;
}

export type BuildOutcome =
  | { ok: true; record: DatasetRecord }
  | { ok: false; reason: string; sourceRow: number | null; sourceSheet: string | null; raw: string };

/**
 * Turns one raw row into a normalized record, or rejects it with a reason.
 * Rows are rejected only when they cannot be made meaningful (no product, no
 * usable quantity, no resolvable business date). Everything else that looks
 * off is imported but *flagged*, never silently corrected.
 */
export function buildRecord(input: RawRowInput, ctx: BuildContext): BuildOutcome {
  const flags: RecordFlag[] = [];
  const rawSummary = JSON.stringify({
    product: input.product,
    qty: input.quantity,
    value: input.salesValue,
    date: input.transactionDate,
    ts: input.rawTimestamp,
  });

  const product = input.product?.trim();
  if (!product) {
    return { ok: false, reason: "No product/item name in this row", sourceRow: input.sourceRow, sourceSheet: input.sourceSheet, raw: rawSummary };
  }

  if (input.quantity == null) {
    return { ok: false, reason: "Quantity missing or not numeric", sourceRow: input.sourceRow, sourceSheet: input.sourceSheet, raw: rawSummary };
  }

  // Resolve the business date. A per-row timestamp always wins; otherwise the
  // row's own calendar date; otherwise the batch-level date the user confirmed.
  let businessDate: string | null = null;
  if (input.rawTimestamp) {
    businessDate = getBusinessDate(input.rawTimestamp, ctx.businessDayStartHour);
  } else if (input.transactionDate) {
    // No clock time: the source's calendar date IS the business date. We do not
    // invent an hour, so the 05:00 rule has nothing to shift.
    businessDate = input.transactionDate;
    flags.push("missing_timestamp");
  } else if (ctx.fallbackBusinessDate) {
    businessDate = ctx.fallbackBusinessDate;
    flags.push("missing_timestamp");
  }

  if (!businessDate) {
    return {
      ok: false,
      reason: "No date on the row and no business date supplied for the file",
      sourceRow: input.sourceRow,
      sourceSheet: input.sourceSheet,
      raw: rawSummary,
    };
  }

  if (input.quantity < 0) flags.push("negative_quantity");
  else if (input.quantity === 0) flags.push("zero_quantity");
  if (input.salesValue != null && input.salesValue < 0) flags.push("negative_value");

  const now = new Date().toISOString();
  const productKey = productKeyOf(product);

  const record: DatasetRecord = {
    id: randomUUID(),
    datasetType: input.datasetType,
    rawTimestamp: input.rawTimestamp,
    transactionDate: input.transactionDate,
    businessDate,
    businessDayStartHour: ctx.businessDayStartHour,
    hour: input.hour,
    shift: input.shift,
    product,
    category: input.category,
    outlet: input.outlet,
    channel: input.channel,
    quantity: input.quantity,
    salesValue: input.salesValue,
    reason: input.reason,
    importBatchId: ctx.importBatchId,
    sourceFile: ctx.sourceFile,
    sourceType: ctx.sourceType,
    sourceSheet: input.sourceSheet,
    sourcePage: input.sourcePage,
    sourceRow: input.sourceRow,
    fingerprint: fingerprintFor(input, ctx, businessDate, productKey),
    flags,
    createdAt: now,
    updatedAt: now,
  };

  return { ok: true, record };
}

/**
 * Deduplication identity.
 *
 * Aggregated rows (one per product per day, from item-wise PDF reports) key on
 * dataset+channel+date+product, so re-importing the same report updates rather
 * than doubles.
 *
 * Row-level rows key on their position in the source as well, because two
 * genuinely separate transactions can be byte-identical -- collapsing those
 * would destroy real sales. Re-importing the same file still lands on the same
 * fingerprints and dedupes; the file-hash check catches the exact re-upload
 * case earlier and more cheaply.
 */
function fingerprintFor(input: RawRowInput, ctx: BuildContext, businessDate: string, productKey: string): string {
  if (input.aggregated) {
    return ["agg", input.datasetType, input.channel ?? "na", businessDate, productKey].join("::");
  }
  return [
    "row",
    input.datasetType,
    businessDate,
    productKey,
    input.rawTimestamp ?? "nots",
    input.outlet ?? "na",
    input.shift ?? "na",
    String(input.quantity),
    String(input.salesValue ?? ""),
    ctx.sourceFile,
    input.sourceSheet ?? "na",
    String(input.sourceRow ?? "na"),
  ].join("::");
}

export interface QualityInput {
  rowsDetected: number;
  rowsInserted: number;
  rowsUpdated: number;
  rowsDuplicate: number;
  rowsRejected: number;
  flagCounts: Partial<Record<RecordFlag, number>>;
  mappingConfidencePct: number;
  extraIssues?: QualityIssue[];
}

const FLAG_SEVERITY: Record<RecordFlag, "error" | "warning" | "info"> = {
  missing_timestamp: "info",
  missing_product: "error",
  negative_quantity: "warning",
  zero_quantity: "info",
  negative_value: "warning",
  invalid_date: "error",
  unparsed_quantity: "error",
  suspicious_outlier: "warning",
  duplicate_in_file: "warning",
};

const FLAG_MESSAGES: Record<RecordFlag, string> = {
  missing_timestamp: "row(s) had no transaction time; business date taken from the report/row date",
  missing_product: "row(s) missing a product name",
  negative_quantity: "row(s) had a negative quantity",
  zero_quantity: "row(s) had a zero quantity",
  negative_value: "row(s) had a negative value",
  invalid_date: "row(s) had an unparseable date",
  unparsed_quantity: "row(s) had a non-numeric quantity",
  suspicious_outlier: "row(s) look far outside the rest of the file",
  duplicate_in_file: "row(s) repeat inside this same file",
};

/**
 * Extraction Quality Score. Rejected rows cost full weight; genuinely
 * suspicious flags cost partial weight; purely informational flags (like a
 * report simply not carrying clock times) cost nothing, because that is a
 * property of the source format, not a defect in the extraction.
 */
export function scoreQuality(input: QualityInput): ImportQuality {
  const { rowsDetected, rowsRejected, rowsDuplicate, flagCounts, mappingConfidencePct } = input;
  const issues: QualityIssue[] = [...(input.extraIssues ?? [])];

  let weightedProblems = rowsRejected;
  let flaggedRows = 0;

  for (const [flag, count] of Object.entries(flagCounts) as [RecordFlag, number][]) {
    if (!count) continue;
    const severity = FLAG_SEVERITY[flag];
    if (severity !== "info") flaggedRows += count;
    weightedProblems += severity === "error" ? count : severity === "warning" ? count * 0.5 : 0;
    issues.push({ code: flag, severity, message: `${count} ${FLAG_MESSAGES[flag]}`, count });
  }

  if (rowsDuplicate > 0) {
    issues.push({
      code: "duplicates_skipped",
      severity: "info",
      message: `${rowsDuplicate} row(s) already on file were skipped rather than double-counted`,
      count: rowsDuplicate,
    });
  }

  const denom = Math.max(1, rowsDetected);
  const extractionPct = Math.max(0, 1 - weightedProblems / denom) * 100;
  // Blend extraction cleanliness with how sure we were about column mapping.
  const confidencePct = Math.round(extractionPct * 0.75 + mappingConfidencePct * 0.25);

  return {
    confidencePct: Math.max(0, Math.min(100, confidencePct)),
    mappingConfidencePct,
    rowsDetected,
    rowsValid: input.rowsInserted + input.rowsUpdated,
    rowsFlagged: flaggedRows,
    rowsRejected,
    rowsDuplicate,
    rowsMissingTimestamp: flagCounts.missing_timestamp ?? 0,
    issues: issues.sort((a, b) => severityRank(a.severity) - severityRank(b.severity)),
  };
}

function severityRank(s: QualityIssue["severity"]): number {
  return s === "error" ? 0 : s === "warning" ? 1 : 2;
}

export function tallyFlags(records: DatasetRecord[]): Partial<Record<RecordFlag, number>> {
  const counts: Partial<Record<RecordFlag, number>> = {};
  for (const r of records) {
    for (const f of r.flags) counts[f] = (counts[f] ?? 0) + 1;
  }
  return counts;
}
