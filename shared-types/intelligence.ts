import type { DatasetType } from "./datasets.js";

// Every figure the intelligence layer emits carries a provenance marker, so the
// UI can never present a derived guess as an observation.
export type MetricBasis =
  | "observed" // read directly from imported records
  | "calculated" // arithmetic over observed records
  | "estimated" // inferred from a model/assumption -- must say so
  | "unavailable"; // not enough data; render "Insufficient data", never a number

export interface Metric {
  value: number | null;
  basis: MetricBasis;
  /** Plain-English note shown on hover, e.g. which datasets fed this. */
  note: string;
}

/** Production - Sales - Wastage for one business date (and optionally one product). */
export interface ReconciliationRow {
  businessDate: string;
  product: string | null;
  productionQty: Metric;
  salesQty: Metric;
  wastageQty: Metric;
  /** production - sales - wastage */
  expectedBalance: Metric;
  /** wastage / production * 100 */
  wastagePct: Metric;
  /** sales / production * 100 */
  sellThroughPct: Metric;
  /** (sales + wastage) vs production; 100% = everything produced accounted for */
  efficiencyPct: Metric;
  /** (production - sales - wastage) / production * 100 */
  variancePct: Metric;
  recordCounts: { production: number; sales: number; wastage: number };
}

export interface ReconciliationSummary {
  businessDateFrom: string | null;
  businessDateTo: string | null;
  rows: ReconciliationRow[];
  totals: ReconciliationRow | null;
  /** Which datasets were actually present -- drives "Insufficient data" messaging. */
  availableDatasets: DatasetType[];
  missingDatasets: DatasetType[];
}

export type AnomalySeverity = "high" | "medium" | "low";

export type AnomalyKind =
  | "sales_drop"
  | "sales_spike"
  | "overproduction"
  | "underproduction"
  | "wastage_surge"
  | "product_stall"
  | "variance_breach";

export const ANOMALY_KIND_LABELS: Record<AnomalyKind, string> = {
  sales_drop: "Sales drop",
  sales_spike: "Sales spike",
  overproduction: "Overproduction",
  underproduction: "Underproduction",
  wastage_surge: "Wastage surge",
  product_stall: "Product stalled",
  variance_breach: "Variance breach",
};

/** An anomaly is only emitted when expected AND actual are both real numbers. */
export interface Anomaly {
  id: string;
  kind: AnomalyKind;
  severity: AnomalySeverity;
  headline: string;
  businessDate: string;
  /** Raw clock-hour bucket when the underlying data has timestamps. */
  hour: number | null;
  product: string | null;
  outlet: string | null;
  shift: string | null;
  expected: number;
  actual: number;
  absoluteVariance: number;
  variancePct: number;
  unit: "qty" | "rupees" | "pct";
  /** How `expected` was derived -- e.g. "mean of 7 prior business days". */
  expectedBasisNote: string;
  /** Human-readable list of the record groups that prove this. */
  evidence: AnomalyEvidence[];
  /** Deep link into the Data Explorer, pre-filtered to the proving records. */
  drilldownQuery: Record<string, string>;
}

export interface AnomalyEvidence {
  datasetType: DatasetType;
  description: string;
  recordCount: number;
  quantity: number;
  amount: number | null;
}

export type InsightCategory = "sales" | "production" | "wastage" | "product" | "time" | "quality";

/**
 * Insights answer WHAT / HOW MUCH / WHEN / WHERE / WHICH PRODUCT / IMPACT /
 * ACTION. Every field is filled from real records, or the insight isn't emitted.
 */
export interface Insight {
  id: string;
  category: InsightCategory;
  severity: AnomalySeverity | "info";
  /** WHAT happened, stated with the number in it. */
  what: string;
  /** HOW MUCH -- the quantified magnitude. */
  howMuch: string;
  /** WHEN -- business date or range, plus hour when known. */
  when: string;
  /** WHERE -- outlet/shift/channel, or "single branch" when that's all there is. */
  where: string;
  /** WHICH product, or null for whole-business insights. */
  product: string | null;
  /** IMPACT -- measurable consequence, in rupees or qty. */
  impact: string;
  /** ACTION -- only what the data actually supports. */
  action: string;
  evidence: AnomalyEvidence[];
  drilldownQuery: Record<string, string>;
  /** Ranking weight; higher surfaces first on the dashboard. */
  score: number;
}

export interface TodaysIntelligence {
  businessDate: string;
  businessDayStartHour: number;
  salesValue: Metric;
  salesQty: Metric;
  productionQty: Metric;
  wastageQty: Metric;
  efficiencyPct: Metric;
  variancePct: Metric;
  sellThroughPct: Metric;
  wastagePct: Metric;
  /** Peak hour by sales value; null when no timestamped data exists. */
  peakHour: { hour: number; label: string; salesValue: number } | null;
  hasTimestampedData: boolean;
}

export interface HourlyBucket {
  /** Raw clock hour 0-23, exactly as on the transaction. */
  hour: number;
  label: string;
  /** Position within the trading window, 0 = business-day start. Ordering key. */
  slot: number;
  /** True for buckets after midnight -- rendered distinctly, same business day. */
  isAfterMidnight: boolean;
  salesValue: number;
  salesQty: number;
  productionQty: number;
  wastageQty: number;
  recordCount: number;
}

export interface ProductPerformanceRow {
  product: string;
  category: string | null;
  salesQty: number;
  salesValue: number;
  productionQty: number;
  wastageQty: number;
  sellThroughPct: number | null;
  wastagePct: number | null;
  variancePct: number | null;
}
