// Anomaly detection over imported records only.
//
// The bar for emitting an anomaly is deliberately high: BOTH `expected` and
// `actual` must be real computed numbers, and `expectedBasisNote` must state
// exactly how `expected` was derived. A baseline built from one or two prior
// days is noise, not a baseline, so anything with fewer than three prior
// business days of real data is skipped rather than compared.

import type { DatasetFilter, DatasetType } from "../../../../shared-types/datasets.js";
import { DATASET_LABELS } from "../../../../shared-types/datasets.js";
import type { Anomaly, AnomalyEvidence, AnomalySeverity } from "../../../../shared-types/intelligence.js";
import { formatBusinessDateLong, shiftDateKey } from "../../../../shared-types/businessDate.js";
import { dailyTotals, datasetCoverage, productPerformance, totalsFor } from "../datasets/repository.js";
import { money, pctText, qtyText } from "./reconciliation.js";

const MIN_PRIOR_DAYS = 3;
const MAX_PRIOR_DAYS = 7;
const THRESHOLD_PCT = 20;
const HIGH_PCT = 40;
const MEDIUM_PCT = 25;
const MAX_ANOMALIES = 50;

/** Bounds on how many scoped reads a single request can trigger. */
const MAX_PRODUCTION_DAYS = 60;
const MAX_WASTAGE_PRODUCTS = 25;
const MAX_STALL_DAYS = 30;

/** Evidence is attached only to anomalies that survive ranking, to keep reads down. */
type Candidate = Omit<Anomaly, "evidence"> & { evidenceTypes: DatasetType[] };

function severityFor(absPct: number): AnomalySeverity {
  if (absPct >= HIGH_PCT) return "high";
  if (absPct >= MEDIUM_PCT) return "medium";
  return "low";
}

function mean(values: number[]): number {
  return values.reduce((a, b) => a + b, 0) / values.length;
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

/** Params use DatasetFilter keys so the Data Explorer can be deep-linked as-is. */
function drilldown(
  filter: DatasetFilter,
  parts: { from: string; to: string; datasetType?: DatasetType; product?: string | null }
): Record<string, string> {
  const q: Record<string, string> = { from: parts.from, to: parts.to };
  if (parts.datasetType) q.datasetType = parts.datasetType;
  if (parts.product) q.product = parts.product;
  if (filter.outlet) q.outlet = filter.outlet;
  if (filter.shift) q.shift = filter.shift;
  return q;
}

// ------------------------------------------------------------ sales moves ----

/**
 * Day-level sales movement. The baseline reaches back beyond `filter.from` on
 * purpose: a one-day window would otherwise never have priors, and the prior
 * days used are always named in expectedBasisNote.
 */
function salesMovement(filter: DatasetFilter): Candidate[] {
  const history = dailyTotals({ ...filter, datasetType: "sales", from: undefined });
  if (history.length <= MIN_PRIOR_DAYS) return [];

  // Sales value is the honest measure when the imports carry amounts; when they
  // do not, quantity is the only thing that was actually recorded.
  const useValue = history.reduce((a, d) => a + d.value, 0) > 0;
  const measureOf = (d: { quantity: number; value: number }) => (useValue ? d.value : d.quantity);
  const fmt = (n: number) => (useValue ? money(n) : `${qtyText(n)} units`);

  const out: Candidate[] = [];
  for (let i = MIN_PRIOR_DAYS; i < history.length; i++) {
    const day = history[i];
    if (filter.from && day.businessDate < filter.from) continue;

    const priors = history.slice(Math.max(0, i - MAX_PRIOR_DAYS), i);
    if (priors.length < MIN_PRIOR_DAYS) continue;

    const expected = mean(priors.map(measureOf));
    if (expected <= 0) continue; // no baseline to divide by -- say nothing

    const actual = measureOf(day);
    const variancePct = ((actual - expected) / expected) * 100;
    if (Math.abs(variancePct) < THRESHOLD_PCT) continue;

    const kind = variancePct < 0 ? "sales_drop" : "sales_spike";
    out.push({
      id: `${kind}:${day.businessDate}`,
      kind,
      severity: severityFor(Math.abs(variancePct)),
      headline: `Sales on ${formatBusinessDateLong(day.businessDate)} came in ${pctText(variancePct)} versus the prior ${priors.length}-day mean (${fmt(actual)} vs ${fmt(expected)})`,
      businessDate: day.businessDate,
      hour: null,
      product: filter.product ?? null,
      outlet: filter.outlet ?? null,
      shift: filter.shift ?? null,
      expected: round2(expected),
      actual: round2(actual),
      absoluteVariance: round2(Math.abs(actual - expected)),
      variancePct: round2(variancePct),
      unit: useValue ? "rupees" : "qty",
      expectedBasisNote: `Mean of ${priors.length} prior business day(s) with imported sales data (${priors[0].businessDate} to ${priors[priors.length - 1].businessDate}), measured by ${useValue ? "sales value" : "quantity"}.`,
      evidenceTypes: ["sales"],
      drilldownQuery: drilldown(filter, {
        from: priors[0].businessDate,
        to: day.businessDate,
        datasetType: "sales",
        product: filter.product ?? null,
      }),
    });
  }
  return out;
}

// ------------------------------------------------------ production balance ----

/**
 * Production against what was accounted for (sales + wastage), per product per
 * business date. A date is only judged when sales AND wastage imports both
 * cover it -- otherwise a product's 0 wastage means "never imported", not
 * "nothing wasted", and the variance would be manufactured.
 */
function productionVariance(filter: DatasetFilter): Candidate[] {
  const productionDays = dailyTotals({ ...filter, datasetType: "production" });
  if (productionDays.length === 0) return [];

  const salesDays = new Set(dailyTotals({ ...filter, datasetType: "sales" }).map((d) => d.businessDate));
  const wastageDays = new Set(dailyTotals({ ...filter, datasetType: "wastage" }).map((d) => d.businessDate));

  const out: Candidate[] = [];
  for (const day of productionDays.slice(-MAX_PRODUCTION_DAYS)) {
    const date = day.businessDate;
    if (!salesDays.has(date) || !wastageDays.has(date)) continue;

    for (const row of productPerformance({ ...filter, from: date, to: date })) {
      if (row.productionQty <= 0) continue;

      const accounted = row.salesQty + row.wastageQty;
      const variancePct = ((accounted - row.productionQty) / row.productionQty) * 100;
      if (Math.abs(variancePct) < THRESHOLD_PCT) continue;

      const kind = variancePct < 0 ? "overproduction" : "underproduction";
      const direction = variancePct < 0 ? "more than was sold or wasted" : "less than was sold or wasted";
      out.push({
        id: `${kind}:${date}:${row.product}`,
        kind,
        severity: severityFor(Math.abs(variancePct)),
        headline: `${row.product} on ${formatBusinessDateLong(date)}: ${qtyText(row.productionQty)} produced, ${qtyText(accounted)} accounted for (${qtyText(Math.abs(row.productionQty - accounted))} units ${direction})`,
        businessDate: date,
        hour: null,
        product: row.product,
        outlet: filter.outlet ?? null,
        shift: filter.shift ?? null,
        expected: round2(row.productionQty),
        actual: round2(accounted),
        absoluteVariance: round2(Math.abs(accounted - row.productionQty)),
        variancePct: round2(variancePct),
        unit: "qty",
        expectedBasisNote: `Production quantity recorded for ${row.product} on ${date}; sales (${qtyText(row.salesQty)}) and wastage (${qtyText(row.wastageQty)}) imports both cover this business date, so the unaccounted quantity is measurable.`,
        evidenceTypes: ["production", "sales", "wastage"],
        drilldownQuery: drilldown(filter, { from: date, to: date, product: row.product }),
      });
    }
  }
  return out;
}

// --------------------------------------------------------- wastage surges ----

function wastageSurges(filter: DatasetFilter): Candidate[] {
  const products = productPerformance(filter)
    .filter((p) => p.wastageQty > 0)
    .sort((a, b) => b.wastageQty - a.wastageQty)
    .slice(0, MAX_WASTAGE_PRODUCTS);

  const out: Candidate[] = [];
  for (const p of products) {
    const series = dailyTotals({ ...filter, datasetType: "wastage", product: p.product, from: undefined });
    for (let i = MIN_PRIOR_DAYS; i < series.length; i++) {
      const day = series[i];
      if (filter.from && day.businessDate < filter.from) continue;

      const priors = series.slice(Math.max(0, i - MAX_PRIOR_DAYS), i);
      if (priors.length < MIN_PRIOR_DAYS) continue;

      const expected = mean(priors.map((d) => d.quantity));
      if (expected <= 0) continue;

      const variancePct = ((day.quantity - expected) / expected) * 100;
      if (variancePct < THRESHOLD_PCT) continue; // only surges are anomalous

      out.push({
        id: `wastage_surge:${day.businessDate}:${p.product}`,
        kind: "wastage_surge",
        severity: severityFor(variancePct),
        headline: `${p.product} wastage on ${formatBusinessDateLong(day.businessDate)} was ${pctText(variancePct)} above its prior ${priors.length}-day mean (${qtyText(day.quantity)} vs ${qtyText(expected)} units)`,
        businessDate: day.businessDate,
        hour: null,
        product: p.product,
        outlet: filter.outlet ?? null,
        shift: filter.shift ?? null,
        expected: round2(expected),
        actual: round2(day.quantity),
        absoluteVariance: round2(day.quantity - expected),
        variancePct: round2(variancePct),
        unit: "qty",
        expectedBasisNote: `Mean wastage quantity for ${p.product} across ${priors.length} prior business day(s) with imported wastage data (${priors[0].businessDate} to ${priors[priors.length - 1].businessDate}).`,
        evidenceTypes: ["wastage"],
        drilldownQuery: drilldown(filter, {
          from: priors[0].businessDate,
          to: day.businessDate,
          datasetType: "wastage",
          product: p.product,
        }),
      });
    }
  }
  return out;
}

// ---------------------------------------------------------- product stall ----

/**
 * A product that sold for days and then stopped. Zero sales rows are ambiguous
 * on their own -- "not sold" and "not imported" look identical -- so a stall is
 * only emitted when the product still appears for that date in the production
 * or wastage dataset. With no such dataset imported, nothing is emitted.
 */
function productStalls(filter: DatasetFilter): Candidate[] {
  const dates = [
    ...new Set(
      [
        ...dailyTotals({ ...filter, datasetType: "production" }).map((d) => d.businessDate),
        ...dailyTotals({ ...filter, datasetType: "wastage" }).map((d) => d.businessDate),
      ]
    ),
  ]
    .sort()
    .slice(-MAX_STALL_DAYS);

  const out: Candidate[] = [];
  for (const date of dates) {
    for (const row of productPerformance({ ...filter, from: date, to: date })) {
      const seenElsewhere = row.productionQty > 0 || row.wastageQty > 0;
      if (row.salesQty > 0 || !seenElsewhere) continue;

      const priorSales = dailyTotals({
        ...filter,
        datasetType: "sales",
        product: row.product,
        from: undefined,
        to: shiftDateKey(date, -1),
      }).filter((d) => d.quantity > 0);
      if (priorSales.length < MIN_PRIOR_DAYS) continue;

      const priors = priorSales.slice(-MAX_PRIOR_DAYS);
      const expected = mean(priors.map((d) => d.quantity));
      if (expected <= 0) continue;

      out.push({
        id: `product_stall:${date}:${row.product}`,
        kind: "product_stall",
        severity: "high",
        headline: `${row.product} sold nothing on ${formatBusinessDateLong(date)} despite ${qtyText(row.productionQty + row.wastageQty)} units recorded in production/wastage, after averaging ${qtyText(expected)} units/day`,
        businessDate: date,
        hour: null,
        product: row.product,
        outlet: filter.outlet ?? null,
        shift: filter.shift ?? null,
        expected: round2(expected),
        actual: 0,
        absoluteVariance: round2(expected),
        variancePct: -100,
        unit: "qty",
        expectedBasisNote: `Mean sales quantity for ${row.product} across its ${priors.length} most recent prior business day(s) with sales (${priors[0].businessDate} to ${priors[priors.length - 1].businessDate}). Zero sales is a real observation here because the product still appears in the production/wastage import for ${date}.`,
        evidenceTypes: ["sales", "production", "wastage"],
        drilldownQuery: drilldown(filter, { from: priors[0].businessDate, to: date, product: row.product }),
      });
    }
  }
  return out;
}

// ---------------------------------------------------------------- ranking ----

const SEVERITY_RANK: Record<AnomalySeverity, number> = { high: 0, medium: 1, low: 2 };

function buildEvidence(filter: DatasetFilter, candidate: Candidate): AnomalyEvidence[] {
  const out: AnomalyEvidence[] = [];
  for (const datasetType of candidate.evidenceTypes) {
    const totals = totalsFor({
      ...filter,
      datasetType,
      from: candidate.businessDate,
      to: candidate.businessDate,
      product: candidate.product ?? filter.product,
    });
    if (totals.recordCount === 0) continue; // never pad evidence with empty groups
    out.push({
      datasetType,
      description: `${totals.recordCount} imported ${DATASET_LABELS[datasetType].toLowerCase()} record(s) on ${candidate.businessDate}${candidate.product ? ` for ${candidate.product}` : ""}`,
      recordCount: totals.recordCount,
      quantity: round2(totals.quantity),
      amount: datasetType === "sales" && totals.value !== 0 ? round2(totals.value) : null,
    });
  }
  return out;
}

export function detectAnomalies(filter: DatasetFilter): Anomaly[] {
  const coverage = datasetCoverage();
  const has = (t: DatasetType) => (coverage.find((c) => c.datasetType === t)?.recordCount ?? 0) > 0;

  const candidates: Candidate[] = [];
  if (has("sales")) candidates.push(...salesMovement(filter));
  if (has("production")) candidates.push(...productionVariance(filter));
  if (has("wastage")) candidates.push(...wastageSurges(filter));
  if (has("production") || has("wastage")) candidates.push(...productStalls(filter));

  candidates.sort(
    (a, b) => SEVERITY_RANK[a.severity] - SEVERITY_RANK[b.severity] || Math.abs(b.variancePct) - Math.abs(a.variancePct)
  );

  return candidates.slice(0, MAX_ANOMALIES).map(({ evidenceTypes, ...rest }) => ({
    ...rest,
    evidence: buildEvidence(filter, { ...rest, evidenceTypes }),
  }));
}
