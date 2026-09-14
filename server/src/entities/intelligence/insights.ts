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
async function evidenceFor(
  filter: DatasetFilter,
  datasetType: DatasetType,
  from: string,
  to: string,
  product: string | null,
  description: string
): Promise<AnomalyEvidence | null> {
  const t = await totalsFor({ ...filter, datasetType, from, to, product: product ?? filter.product });
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
async function whereLabel(filter: DatasetFilter): Promise<string> {
  if (filter.outlet) return `${filter.outlet} (outlet filter applied)`;
  const outlets = await distinctValues("outlet");
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

async function salesInsights(
  filter: DatasetFilter,
  win: Window,
  where: string,
  products: ProductPerformanceRow[],
  totalRevenue: number,
  totalQty: number,
  missingProduction: boolean
): Promise<Insight[]> {
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
      await evidenceFor(filter, "sales", win.from, win.to, top.product, `Sales records for ${top.product} between ${win.from} and ${win.to}`),
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
        await evidenceFor(filter, "sales", win.from, win.to, bottom.product, `Sales records for ${bottom.product} between ${win.from} and ${win.to}`),
      ]),
      drilldownQuery: drill(filter, { from: win.from, to: win.to, datasetType: "sales", product: bottom.product }),
      score: 44,
    });
  }

  return out;
}

/** Movement between the two most recent business dates that actually have data. */
async function movementInsight(
  filter: DatasetFilter,
  daily: { businessDate: string; quantity: number; value: number }[],
  where: string
): Promise<Insight | null> {
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
      await evidenceFor(filter, "sales", prev.businessDate, prev.businessDate, null, `Sales records on ${prev.businessDate}`),
      await evidenceFor(filter, "sales", last.businessDate, last.businessDate, null, `Sales records on ${last.businessDate}`),
    ]),
    drilldownQuery: drill(filter, { from: prev.businessDate, to: last.businessDate, datasetType: "sales" }),
    score: 76,
  };
}

// ---------------------------------------------------------------- product ----

async function concentrationInsight(
  filter: DatasetFilter,
  win: Window,
  where: string,
  products: ProductPerformanceRow[],
  totalRevenue: number
): Promise<Insight | null> {
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
      await Promise.all(top3.map((p) => evidenceFor(filter, "sales", win.from, win.to, p.product, `Sales records for ${p.product} between ${win.from} and ${win.to}`)))
    ),
    drilldownQuery: drill(filter, { from: win.from, to: win.to, datasetType: "sales" }),
    score: 62,
  };
}

// ---------------------------------------------------------------- wastage ----

async function wastageInsights(
  filter: DatasetFilter,
  win: Window,
  where: string,
  products: ProductPerformanceRow[]
): Promise<Insight[]> {
  const totals = await totalsFor({ ...filter, datasetType: "wastage" });
  if (totals.recordCount === 0) return []; // no wastage imports -> no wastage claims

  const out: Insight[] = [];
  const reasonRows = await wastageByReason(filter);
  const reasons = reasonRows.filter((r) => r.quantity > 0);
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
      evidence: compact([await evidenceFor(filter, "wastage", win.from, win.to, null, `Wastage records between ${win.from} and ${win.to}`)]),
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
        await evidenceFor(filter, "wastage", win.from, win.to, top.product, `Wastage records for ${top.product} between ${win.from} and ${win.to}`),
      ]),
      drilldownQuery: drill(filter, { from: win.from, to: win.to, datasetType: "wastage", product: top.product }),
      score: 68,
    });
  }

  return out;
}

// ------------------------------------------------------------------- time ----

/** Emitted only when records carry real timestamps; there is no derived hour. */
async function peakHourInsight(filter: DatasetFilter, win: Window, where: string): Promise<Insight | null> {
  const buckets = await hourlyBuckets(filter);
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
    evidence: compact([await evidenceFor(filter, "sales", win.from, win.to, null, `Timestamped sales records between ${win.from} and ${win.to}`)]),
    drilldownQuery: drill(filter, { from: win.from, to: win.to, datasetType: "sales" }),
    score: 58,
  };
}

// ---------------------------------------------------------------- quality ----

async function importQualityInsight(filter: DatasetFilter, where: string, batch: ImportBatch): Promise<Insight | null> {
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
    evidence: compact([await evidenceFor(filter, "sales", from, to, null, `Sales records imported for ${from} to ${to}`)]),
    drilldownQuery: drill(filter, { from, to }),
    score: 52,
  };
}

/** Gaps inside an otherwise continuous imported range make any per-day average wrong. */
async function missingDatesInsight(filter: DatasetFilter, win: Window, where: string, dates: string[]): Promise<Insight | null> {
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
    howMuch: `${dates.length} of ${span.length} business dates present; missing ${missing.slice(0, 5).join(", ")}${missing.length > 5 ? ` and ${missing.length - 5} more` : ""}`,
    when: `${formatBusinessDateLong(win.from)} to ${formatBusinessDateLong(win.to)}`,
    where,
    product: null,
    impact: `Period totals cover ${dates.length} of ${span.length} business dates, so any per-day average is computed over ${dates.length} days and understates a ${span.length}-day period`,
    action: `Import the sales report(s) for ${missing.slice(0, 5).join(", ")}${missing.length > 5 ? " and the other missing dates" : ""} before comparing period totals or daily averages.`,
    evidence: compact([await evidenceFor(filter, "sales", win.from, win.to, null, `Sales records present between ${win.from} and ${win.to}`)]),
    drilldownQuery: drill(filter, { from: win.from, to: win.to }),
    score: 66,
  };
}

// -------------------------------------------------------- anomaly -> insight ----

function anomalyAction(a: Anomaly): string {
  const gap = a.unit === "rupees" ? money(a.absoluteVariance) : `${qtyText(a.absoluteVariance)} units`;
  switch (a.kind) {
    case "sales_drop":
      return `Confirm the ${a.businessDate} import is complete (${a.evidence.map((e) => `${e.recordCount} ${e.datasetType}`).join(", ") || "no supporting records"}) before treating this as demand: if the file is complete, the ${gap} shortfall against the stated baseline is real.`;
    case "sales_spike":
      return `Record what drove ${formatBusinessDateLong(a.businessDate)} (event, festival, bulk order) alongside the import -- ${gap} above the stated baseline is the size of the effect to plan for if it repeats.`;
    case "overproduction":
      return `Bring ${a.product ?? "this item"} production down toward the ${qtyText(a.actual)} units that were actually sold or wasted; ${gap} went unaccounted for on ${a.businessDate}.`;
    case "underproduction":
      return `${a.product ?? "This item"} sold or wasted ${gap} more than the production record shows for ${a.businessDate} -- either production was under-recorded or stock carried over; check the production sheet for that date.`;
    case "wastage_surge":
      return `Pull the ${a.evidence.find((e) => e.datasetType === "wastage")?.recordCount ?? 0} wastage record(s) for ${a.product ?? "this item"} on ${a.businessDate}: ${gap} above its own prior mean is a specific batch or reason, not noise.`;
    case "product_stall":
      return `${a.product ?? "This item"} was still recorded in production/wastage on ${a.businessDate} but sold nothing -- check availability at the counter and the POS item mapping for that date.`;
    default:
      return `Verify the ${a.businessDate} records behind this variance in the Data Explorer before acting on it.`;
  }
}

function anomalyInsight(a: Anomaly, where: string): Insight {
  const category = a.kind === "wastage_surge" ? "wastage" : a.kind === "overproduction" || a.kind === "underproduction" ? "production" : "sales";
  const fmt = (n: number) => (a.unit === "rupees" ? money(n) : `${qtyText(n)} units`);
  return {
    id: `insight-${a.id}`,
    category,
    severity: a.severity,
    what: a.headline,
    howMuch: `${fmt(a.actual)} actual versus ${fmt(a.expected)} expected (${pctText(a.variancePct)})`,
    when: `${formatBusinessDateLong(a.businessDate)}${a.hour !== null ? `, ${formatHourBucket(a.hour)}` : ""}`,
    where: a.outlet ? `${a.outlet}${a.shift ? ` / ${a.shift} shift` : ""}` : where,
    product: a.product,
    impact: `${fmt(a.absoluteVariance)} away from the baseline (${a.expectedBasisNote})`,
    action: anomalyAction(a),
    evidence: a.evidence,
    drilldownQuery: a.drilldownQuery,
    score: a.severity === "high" ? 95 : a.severity === "medium" ? 80 : 60,
  };
}

// ------------------------------------------------------------------- build ----

export async function buildInsights(filter: DatasetFilter): Promise<Insight[]> {
  const coverage = await datasetCoverage();
  const hasSales = (coverage.find((c) => c.datasetType === "sales")?.recordCount ?? 0) > 0;
  const missingProduction = (coverage.find((c) => c.datasetType === "production")?.recordCount ?? 0) === 0;

  const daily = hasSales ? await dailyTotals({ ...filter, datasetType: "sales" }) : [];
  const win = windowFor(daily.map((d) => d.businessDate));
  const where = await whereLabel(filter);
  const out: Insight[] = [];

  // Anomalies are the sharpest insights available, so they lead the list.
  const allAnomalies = await detectAnomalies(filter);
  const anomalies = allAnomalies.filter((a) => a.severity !== "low").slice(0, MAX_ANOMALY_INSIGHTS);
  for (const a of anomalies) out.push(anomalyInsight(a, where));

  if (win) {
    const rangeFilter: DatasetFilter = { ...filter, from: win.from, to: win.to };
    const products = await productPerformance(rangeFilter);
    const salesTotals = await totalsFor({ ...rangeFilter, datasetType: "sales" });

    out.push(...(await salesInsights(rangeFilter, win, where, products, salesTotals.value, salesTotals.quantity, missingProduction)));
    const movement = await movementInsight(filter, daily, where);
    if (movement) out.push(movement);
    const concentration = await concentrationInsight(rangeFilter, win, where, products, salesTotals.value);
    if (concentration) out.push(concentration);
    out.push(...(await wastageInsights(rangeFilter, win, where, products)));
    const peak = await peakHourInsight(rangeFilter, win, where);
    if (peak) out.push(peak);
    const gaps = await missingDatesInsight(rangeFilter, win, where, daily.map((d) => d.businessDate));
    if (gaps) out.push(gaps);
  }

  const [latestBatch] = await listImportBatches(1);
  if (latestBatch) {
    const quality = await importQualityInsight(filter, where, latestBatch);
    if (quality) out.push(quality);
  }

  // De-duplicate by id: an anomaly-derived insight can restate a movement.
  const seen = new Set<string>();
  return out
    .filter((i) => (seen.has(i.id) ? false : (seen.add(i.id), true)))
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_INSIGHTS);
}
