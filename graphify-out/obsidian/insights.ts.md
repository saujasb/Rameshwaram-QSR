---
source_file: "server/src/entities/intelligence/insights.ts"
type: "code"
community: "Business Intelligence Engine"
location: "L1"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Business_Intelligence_Engine
---

# insights.ts

## Connections
- [[Anomaly]] - `imports` [EXTRACTED]
- [[AnomalyEvidence]] - `imports` [EXTRACTED]
- [[DatasetFilter]] - `imports` [EXTRACTED]
- [[DatasetType]] - `imports` [EXTRACTED]
- [[ImportBatch]] - `imports` [EXTRACTED]
- [[Insight]] - `imports` [EXTRACTED]
- [[ProductPerformanceRow]] - `imports` [EXTRACTED]
- [[Window]] - `contains` [EXTRACTED]
- [[analysis.ts]] - `imports_from` [EXTRACTED]
- [[anomalies.ts]] - `imports_from` [EXTRACTED]
- [[anomalyAction()]] - `contains` [EXTRACTED]
- [[anomalyInsight()]] - `contains` [EXTRACTED]
- [[buildInsights()]] - `contains` [EXTRACTED]
- [[businessDate.ts]] - `imports_from` [EXTRACTED]
- [[businessDateRange()]] - `imports` [EXTRACTED]
- [[compact()]] - `contains` [EXTRACTED]
- [[concentrationInsight()]] - `contains` [EXTRACTED]
- [[dailyTotals()]] - `imports` [EXTRACTED]
- [[datasetCoverage()]] - `imports` [EXTRACTED]
- [[datasetsrepository.ts]] - `imports_from` [EXTRACTED]
- [[detectAnomalies()]] - `imports` [EXTRACTED]
- [[distinctValues()]] - `imports` [EXTRACTED]
- [[drill()]] - `contains` [EXTRACTED]
- [[evidenceFor()]] - `contains` [EXTRACTED]
- [[formatBusinessDateLong()]] - `imports` [EXTRACTED]
- [[formatHourBucket()]] - `imports` [EXTRACTED]
- [[hourlyBuckets()]] - `imports` [EXTRACTED]
- [[importQualityInsight()]] - `contains` [EXTRACTED]
- [[intelligenceroutes.ts]] - `imports_from` [EXTRACTED]
- [[listImportBatches()]] - `imports` [EXTRACTED]
- [[missingDatesInsight()]] - `contains` [EXTRACTED]
- [[money()]] - `imports` [EXTRACTED]
- [[movementInsight()]] - `contains` [EXTRACTED]
- [[pctText()]] - `imports` [EXTRACTED]
- [[peakHourInsight()]] - `contains` [EXTRACTED]
- [[productPerformance()]] - `imports` [EXTRACTED]
- [[qtyText()]] - `imports` [EXTRACTED]
- [[reconciliation.ts]] - `imports_from` [EXTRACTED]
- [[round2()_1]] - `contains` [EXTRACTED]
- [[salesInsights()]] - `contains` [EXTRACTED]
- [[share()]] - `contains` [EXTRACTED]
- [[shared-typesdatasets.ts]] - `imports_from` [EXTRACTED]
- [[shared-typesintelligence.ts]] - `imports_from` [EXTRACTED]
- [[totalsFor()]] - `imports` [EXTRACTED]
- [[wastageByReason()]] - `imports` [EXTRACTED]
- [[wastageInsights()]] - `contains` [EXTRACTED]
- [[whereLabel()]] - `contains` [EXTRACTED]
- [[windowFor()]] - `contains` [EXTRACTED]

## Source
**Full file:** `server/src/entities/intelligence/insights.ts`
```typescript
// Insights: WHAT / HOW MUCH / WHEN / WHERE / WHICH PRODUCT / IMPACT / ACTION.
//
// An insight is only emitted when every one of those fields can be filled from
// imported records. That constraint is what keeps `action` honest: where the
// data cannot support a business decision, the action says which dataset to
// import or which figure to verify instead of offering generic advice.

import type { DatasetFilter, DatasetType, ImportBatch } from "../../../../shared-types/datasets.js";
import type { Anomaly, AnomalyEvidence, Insight, ProductPerformanceRow } from "../../../../shared-types/intelligence.js";
import {
  businessDateRange,
  formatBusinessDateLong,
  formatHourBucket,
} from "../../../../shared-types/businessDate.js";
import {
  dailyTotals,
  datasetCoverage,
  distinctValues,
  hourlyBuckets,
  listImportBatches,
  productPerformance,
  totalsFor,
  wastageByReason,
} from "../datasets/repository.js";
import { money, pctText, qtyText } from "./reconciliation.js";
import { detectAnomalies } from "./anomalies.js";

const MAX_INSIGHTS = 12;
const MAX_ANOMALY_INSIGHTS = 4;

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

function share(part: number, whole: number): number | null {
  return whole > 0 ? (part / whole) * 100 : null;
}

function compact(items: (AnomalyEvidence | null)[]): AnomalyEvidence[] {
  return items.filter((e): e is AnomalyEvidence => e !== null);
}

/** Evidence rows carry real record counts; an empty group is dropped, never zero-padded. */
function evidenceFor(
  filter: DatasetFilter,
  datasetType: DatasetType,
  from: string,
  to: string,
  product: string | null,
  description: string
): AnomalyEvidence | null {
  const t = totalsFor({ ...filter, datasetType, from, to, product: product ?? filter.product });
  if (t.recordCount === 0) return null;
  return {
    datasetType,
    description,
    recordCount: t.recordCount,
    quantity: round2(t.quantity),
    amount: datasetType === "sales" && t.value !== 0 ? round2(t.value) : null,
  };
}

function drill(
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

/** Outlet is frequently absent from the source PDFs; say so rather than inventing a location. */
function whereLabel(filter: DatasetFilter): string {
  if (filter.outlet) return `${filter.outlet} (outlet filter applied)`;
  const outlets = distinctValues("outlet");
  if (outlets.length === 0) return "Outlet is not recorded in the imported files, so this covers all imported records";
  if (outlets.length === 1) return `${outlets[0]} branch (single outlet in the data)`;
  return `${outlets.length} outlets present in the data (${outlets.slice(0, 3).join(", ")})`;
}

interface Window {
  from: string;
  to: string;
  days: number;
  label: string;
}

function windowFor(dates: string[]): Window | null {
  if (dates.length === 0) return null;
  const from = dates[0];
  const to = dates[dates.length - 1];
  return {
    from,
    to,
    days: dates.length,
    label:
      from === to
        ? `${formatBusinessDateLong(from)} business day`
        : `${formatBusinessDateLong(from)} to ${formatBusinessDateLong(to)} (${dates.length} business days with data)`,
  };
}

// ------------------------------------------------------------------ sales ----

function salesInsights(
  filter: DatasetFilter,
  win: Window,
  where: string,
  products: ProductPerformanceRow[],
  totalRevenue: number,
  totalQty: number,
  missingProduction: boolean
): Insight[] {
  const sold = products.filter((p) => p.salesQty > 0);
  if (sold.length === 0) return [];
  const out: Insight[] = [];

  const byRevenue = [...sold].sort((a, b) => b.salesValue - a.salesValue);
  const top = byRevenue[0];
  const topShare = share(top.salesValue, totalRevenue);
  const topUnit = top.salesQty > 0 && top.salesValue > 0 ? top.salesValue / top.salesQty : null;

  out.push({
    id: `sales-top:${win.from}:${win.to}`,
    category: "sales",
    severity: "info",
    what: `${top.product} generated the highest revenue of any item`,
    howMuch: `${money(top.salesValue)} across ${qtyText(top.salesQty)} units`,
    when: win.label,
    where,
    product: top.product,
    impact:
      topShare === null
        ? `${qtyText(top.salesQty)} of ${qtyText(totalQty)} units sold in the period`
        : `${pctText(topShare)} of the ${money(totalRevenue)} total imported revenue for the period`,
    action:
      `Treat ${top.product} as the first availability check of every trading day` +
      (topUnit ? `: at its imported average of ${money(topUnit)} per unit, each unit not sold forgoes that much revenue.` : ".") +
      (missingProduction ? ` Production and wastage are not imported, so its sell-through cannot be verified yet -- import those to size the loss.` : ""),
    evidence: compact([
      evidenceFor(filter, "sales", win.from, win.to, top.product, `Sales records for ${top.product} between ${win.from} and ${win.to}`),
    ]),
    drilldownQuery: drill(filter, { from: win.from, to: win.to, datasetType: "sales", product: top.product }),
    score: 88,
  });

  // "Weakest seller" is only meaningful once there is a field to be last in.
  if (byRevenue.length >= 5) {
    const bottom = byRevenue[byRevenue.length - 1];
    const bottomShare = share(bottom.salesValue, totalRevenue);
    const perDay = bottom.salesQty / win.days;
    out.push({
      id: `sales-bottom:${win.from}:${win.to}`,
      category: "sales",
      severity: "low",
      what: `${bottom.product} is the weakest of the ${byRevenue.length} items with any recorded sales`,
      howMuch: `${money(bottom.salesValue)} across ${qtyText(bottom.salesQty)} units`,
      when: win.label,
      where,
      product: bottom.product,
      impact:
        bottomShare === null
          ? `${qtyText(bottom.salesQty)} units of the ${qtyText(totalQty)} sold in the period`
          : `${pctText(bottomShare)} of imported revenue, at ${qtyText(perDay)} units per business day with data`,
      action: missingProduction
        ? `Before delisting ${bottom.product}, import production and wastage for it -- ${qtyText(bottom.salesQty)} units sold over ${win.days} day(s) shows demand, but nothing in the data shows what it costs to keep on the menu.`
        : `Compare ${bottom.product}'s ${qtyText(bottom.salesQty)} units sold against its recorded production before deciding whether to keep making it daily.`,
      evidence: compact([
        evidenceFor(filter, "sales", win.from, win.to, bottom.product, `Sales records for ${bottom.product} between ${win.from} and ${win.to}`),
      ]),
      drilldownQuery: drill(filter, { from: win.from, to: win.to, datasetType: "sales", product: bottom.product }),
      score: 44,
    });
  }

  return out;
}

/** Movement between the two most recent business dates that actually have data. */
function movementInsight(
  filter: DatasetFilter,
  daily: { businessDate: string; quantity: number; value: number }[],
  where: string
): Insight | null {
  if (daily.length < 2) return null;
  const prev = daily[daily.length - 2];
  const last = daily[daily.length - 1];
  const useValue = last.value > 0 && prev.value > 0;
  const a = useValue ? prev.value : prev.quantity;
  const b = useValue ? last.value : last.quantity;
  if (a <= 0) return null;

  const pct = ((b - a) / a) * 100;
  const fmt = (n: number) => (useValue ? money(n) : `${qtyText(n)} units`);
  const gapDays = businessDateRange(prev.businessDate, last.businessDate).length - 2;
  const dropped = pct < 0;

  return {
    id: `sales-movement:${prev.businessDate}:${last.businessDate}`,
    category: "sales",
    severity: Math.abs(pct) >= 40 ? "high" : Math.abs(pct) >= 25 ? "medium" : "info",
    what: `Sales ${dropped ? "fell" : "rose"} ${pctText(Math.abs(pct))} from the previous business day with data`,
    howMuch: `${fmt(b)} on ${formatBusinessDateLong(last.businessDate)} versus ${fmt(a)} on ${formatBusinessDateLong(prev.businessDate)}`,
    when: `${formatBusinessDateLong(prev.businessDate)} to ${formatBusinessDateLong(last.businessDate)}`,
    where,
    product: null,
    impact: `${dropped ? "Shortfall" : "Gain"} of ${fmt(Math.abs(b - a))} between the two most recent imported business days`,
    action:
      gapDays > 0
        ? `Import the ${gapDays} business date(s) between ${prev.businessDate} and ${last.businessDate} before reading this as a trend -- these are simply the two most recent dates with data, not consecutive days.`
        : `${dropped ? "Check" : "Record"} what changed on ${formatBusinessDateLong(last.businessDate)} against ${formatBusinessDateLong(prev.businessDate)}; both dates are fully imported, so the ${fmt(Math.abs(b - a))} difference is real and traceable in the Data Explorer.`,
    evidence: compact([
      evidenceFor(filter, "sales", prev.businessDate, prev.businessDate, null, `Sales records on ${prev.businessDate}`),
      evidenceFor(filter, "sales", last.businessDate, last.businessDate, null, `Sales records on ${last.businessDate}`),
    ]),
    drilldownQuery: drill(filter, { from: prev.businessDate, to: last.businessDate, datasetType: "sales" }),
    score: 76,
  };
}

// ---------------------------------------------------------------- product ----

function concentrationInsight(
  filter: DatasetFilter,
  win: Window,
  where: string,
  products: ProductPerformanceRow[],
  totalRevenue: number
): Insight | null {
  const sold = products.filter((p) => p.salesValue > 0).sort((a, b) => b.salesValue - a.salesValue);
  if (sold.length < 4 || totalRevenue <= 0) return null;

  const top3 = sold.slice(0, 3);
  const top3Revenue = top3.reduce((a, p) => a + p.salesValue, 0);
  const pct = (top3Revenue / totalRevenue) * 100;
  const names = top3.map((p) => p.product);

  return {
    id: `product-concentration:${win.from}:${win.to}`,
    category: "product",
    severity: pct >= 60 ? "medium" : "info",
    what: `The top 3 of ${sold.length} selling items carry ${pctText(pct)} of revenue`,
    howMuch: `${money(top3Revenue)} of ${money(totalRevenue)} from ${names.join(", ")}`,
    when: win.label,
    where,
    product: null,
    impact: `${pctText(pct)} of imported revenue depends on 3 items; a stockout in any one of them is measurable at the period level`,
    action: `Make ${names.join(", ")} a named daily availability checklist -- together they account for ${money(top3Revenue)} of recorded revenue, so they carry more risk than the remaining ${sold.length - 3} items combined.`,
    evidence: compact(
      top3.map((p) => evidenceFor(filter, "sales", win.from, win.to, p.product, `Sales records for ${p.product} between ${win.from} and ${win.to}`))
    ),
    drilldownQuery: drill(filter, { from: win.from, to: win.to, datasetType: "sales" }),
    score: 62,
  };
}

// ---------------------------------------------------------------- wastage ----

function wastageInsights(
  filter: DatasetFilter,
  win: Window,
  where: string,
  products: ProductPerformanceRow[]
): Insight[] {
  const totals = totalsFor({ ...filter, datasetType: "wastage" });
  if (totals.recordCount === 0) return []; // no wastage imports -> no wastage claims

  const out: Insight[] = [];
  const reasons = wastageByReason(filter).filter((r) => r.quantity > 0);
  if (reasons.length > 0) {
    const top = reasons[0];
    const pct = share(top.quantity, totals.quantity);
    out.push({
      id: `wastage-reason:${win.from}:${win.to}`,
      category: "wastage",
      severity: pct !== null && pct >= 50 ? "medium" : "info",
      what: `"${top.reason}" is the largest recorded wastage reason`,
      howMuch: `${qtyText(top.quantity)} units across ${top.recordCount} wastage record(s)`,
      when: win.label,
      where,
      product: null,
      impact:
        pct === null
          ? `${qtyText(top.quantity)} units of recorded wastage`
          : `${pctText(pct)} of the ${qtyText(totals.quantity)} units of wastage imported for the period`,
      action: `Attack "${top.reason}" first: it is ${pct === null ? "the largest" : pctText(pct)} of imported wastage. The ${top.recordCount} record(s) behind it are listed in the Data Explorer for the exact items and dates.`,
      evidence: compact([evidenceFor(filter, "wastage", win.from, win.to, null, `Wastage records between ${win.from} and ${win.to}`)]),
      drilldownQuery: drill(filter, { from: win.from, to: win.to, datasetType: "wastage" }),
      score: 70,
    });
  }

  const wasted = products.filter((p) => p.wastageQty > 0).sort((a, b) => b.wastageQty - a.wastageQty);
  if (wasted.length > 0) {
    const top = wasted[0];
    const pct = share(top.wastageQty, totals.quantity);
    out.push({
      id: `wastage-product:${win.from}:${win.to}`,
      category: "wastage",
      severity: top.wastagePct !== null && top.wastagePct >= 10 ? "medium" : "info",
      what: `${top.product} accounts for more recorded wastage than any other item`,
      howMuch: `${qtyText(top.wastageQty)} units wasted${top.productionQty > 0 ? ` against ${qtyText(top.productionQty)} produced` : ""}`,
      when: win.label,
      where,
      product: top.product,
      impact:
        top.wastagePct !== null
          ? `${pctText(top.wastagePct)} of ${top.product} production was wasted`
          : `${pct === null ? qtyText(top.wastageQty) + " units" : pctText(pct)} of the period's imported wastage`,
      action:
        top.productionQty > 0
          ? `Cut ${top.product} production toward the ${qtyText(top.salesQty)} units actually sold; ${qtyText(top.wastageQty)} of ${qtyText(top.productionQty)} produced units were recorded as waste.`
          : `Import production for ${top.product} -- ${qtyText(top.wastageQty)} units of waste are recorded but the produced quantity is not, so the waste rate cannot be computed.`,
      evidence: compact([
        evidenceFor(filter, "wastage", win.from, win.to, top.product, `Wastage records for ${top.product} between ${win.from} and ${win.to}`),
      ]),
      drilldownQuery: drill(filter, { from: win.from, to: win.to, datasetType: "wastage", product: top.product }),
      score: 68,
    });
  }

  return out;
}

// ------------------------------------------------------------------- time ----

/** Emitted only when records carry real timestamps; there is no derived hour. */
function peakHourInsight(filter: DatasetFilter, win: Window, where: string): Insight | null {
  const buckets = hourlyBuckets(filter);
  if (buckets.length === 0) return null;

  const dayValue = buckets.reduce((a, b) => a + b.salesValue, 0);
  const peak = [...buckets].sort((a, b) => b.salesValue - a.salesValue)[0];
  if (peak.salesValue <= 0) return null;

  const pct = share(peak.salesValue, dayValue);
  return {
    id: `time-peak:${win.from}:${win.to}:${peak.hour}`,
    category: "time",
    severity: "info",
    what: `${formatHourBucket(peak.hour)} is the highest-value trading hour on record`,
    howMuch: `${money(peak.salesValue)} from ${qtyText(peak.salesQty)} units across ${peak.recordCount} timestamped record(s)`,
    when: `${formatHourBucket(peak.hour)}${peak.isAfterMidnight ? " (after midnight, same business day)" : ""}, ${win.label}`,
    where,
    product: null,
    impact:
      pct === null
        ? `${money(peak.salesValue)} of timestamped sales fall in this hour`
        : `${pctText(pct)} of timestamped sales value falls in this single hour`,
    action: `Keep the counter fully staffed through ${formatHourBucket(peak.hour)} and schedule breaks or changeovers outside it -- ${pct === null ? money(peak.salesValue) : pctText(pct)} of timestamped sales value lands in that hour.`,
    evidence: compact([evidenceFor(filter, "sales", win.from, win.to, null, `Timestamped sales records between ${win.from} and ${win.to}`)]),
    drilldownQuery: drill(filter, { from: win.from, to: win.to, datasetType: "sales" }),
    score: 58,
  };
}

// ---------------------------------------------------------------- quality ----

function importQualityInsight(filter: DatasetFilter, where: string, batch: ImportBatch): Insight | null {
  const q = batch.quality;
  if (q.rowsRejected === 0 && q.rowsFlagged === 0) return null;
  const from = batch.businessDateFrom ?? batch.createdAt.slice(0, 10);
  const to = batch.businessDateTo ?? from;

  return {
    id: `quality-import:${batch.id}`,
    category: "quality",
    severity: q.rowsRejected > 0 ? "medium" : "low",
    what: `The most recent import (${batch.fileName}) rejected ${q.rowsRejected} row(s) and flagged ${q.rowsFlagged}`,
    howMuch: `${q.rowsValid} of ${q.rowsDetected} detected rows imported cleanly (${q.confidencePct}% confidence)`,
    when: `Imported ${new Date(batch.createdAt).toLocaleString("en-IN")}, covering ${from} to ${to}`,
    where,
    product: null,
    impact: `${q.rowsRejected} row(s) are absent from every figure on this dashboard; ${q.rowsFlagged} more are included but carry data-quality flags`,
    action:
      q.rowsRejected > 0
        ? `Open Import History for ${batch.fileName}, read the ${q.rowsRejected} rejected row(s) listed there, correct the source file and re-import it -- totals for ${from} to ${to} are understated until then.`
        : `Review the ${q.rowsFlagged} flagged row(s) from ${batch.fileName} in Import History; they are counted in totals, so confirm their quantities before relying on ${from} to ${to}.`,
    evidence: compact([evidenceFor(filter, "sales", from, to, null, `Sales records imported for ${from} to ${to}`)]),
    drilldownQuery: drill(filter, { from, to }),
    score: 52,
  };
}

/** Gaps inside an otherwise continuous imported range make any per-day average wrong. */
function missingDatesInsight(filter: DatasetFilter, win: Window, where: string, dates: string[]): Insight | null {
  if (win.from === win.to) return null;
  const present = new Set(dates);
  const span = businessDateRange(win.from, win.to);
  const missing = span.filter((d) => !present.has(d));
  if (missing.length === 0 || missing.length > span.length / 2) return null;

  return {
    id: `quality-gaps:${win.from}:${win.to}`,
    category: "quality",
    severity: "medium",
    what: `${missing.length} business date(s) inside the imported range have no records at all`,
```
*(truncated, showing first 400 of 502 lines)*

#graphify/code #graphify/EXTRACTED #community/Business_Intelligence_Engine