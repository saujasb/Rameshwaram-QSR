import type { DatasetFilter, DatasetType } from "../../../../shared-types/datasets.js";
import { DATASET_LABELS } from "../../../../shared-types/datasets.js";
import type { Anomaly, AnomalyEvidence, Insight, ReconciliationRow } from "../../../../shared-types/intelligence.js";
import type { RameshCalculationStep, RameshInsightLine } from "../../../../shared-types/ramesh.js";
import { formatBusinessDateLong, formatHourBucket } from "../../../../shared-types/businessDate.js";
import {
  dailyTotals,
  hourlyBuckets,
  outletPerformance,
  productPerformance,
  shiftPerformance,
  totalsFor,
  wastageByReason,
  type SegmentPerformanceRow,
} from "../datasets/repository.js";
// The whole point of this module: Ramesh reads the SAME analytical engine the
// dashboard's Intelligence page reads, rather than re-deriving metrics.
import { buildInsights } from "../intelligence/insights.js";
import { detectAnomalies } from "../intelligence/anomalies.js";
import { computeReconciliation } from "../intelligence/reconciliation.js";

const money = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;
const units = (n: number) => `${Number(n.toFixed(2)).toLocaleString("en-IN")} units`;
const pct = (n: number) => `${n >= 0 ? "" : ""}${n.toFixed(1)}%`;

/** Insight (dashboard shape) -> RameshInsightLine (chat shape). Same numbers, no recomputation. */
export function insightToLine(i: Insight, rank: number): RameshInsightLine {
  return {
    rank,
    severity: i.severity,
    category: i.category,
    headline: i.what,
    magnitude: i.howMuch,
    scope: [i.when, i.where, i.product].filter(Boolean).join(" · "),
    impact: i.impact,
    action: i.action,
    evidence: i.evidence,
    drilldownQuery: i.drilldownQuery ?? null,
  };
}

export function anomalyToLine(a: Anomaly, rank: number): RameshInsightLine {
  const unit = a.unit === "rupees" ? money : a.unit === "pct" ? (n: number) => pct(n) : units;
  return {
    rank,
    severity: a.severity,
    category: a.kind,
    headline: a.headline,
    magnitude: `expected ${unit(a.expected)}, actual ${unit(a.actual)} (${a.variancePct >= 0 ? "+" : ""}${a.variancePct.toFixed(1)}%)`,
    scope: [formatBusinessDateLong(a.businessDate), a.hour != null ? formatHourBucket(a.hour) : null, a.product, a.shift, a.outlet]
      .filter(Boolean)
      .join(" · "),
    impact: `${a.absoluteVariance >= 0 ? "+" : ""}${unit(a.absoluteVariance)} against the baseline (${a.expectedBasisNote})`,
    action: "Check the proving records before acting; this is a measured deviation, not a forecast.",
    evidence: a.evidence,
    drilldownQuery: a.drilldownQuery ?? null,
  };
}

export interface AnalysisResult {
  answer: string;
  calculation: RameshCalculationStep[];
  insights: RameshInsightLine[];
  conclusion: string;
  evidence: AnomalyEvidence[];
  datasets: DatasetType[];
  recordCount: number;
  insufficientData: boolean;
}

async function coverageEvidence(filter: DatasetFilter): Promise<{ evidence: AnomalyEvidence[]; datasets: DatasetType[]; recordCount: number }> {
  const evidence: AnomalyEvidence[] = [];
  const datasets: DatasetType[] = [];
  let recordCount = 0;
  for (const t of ["sales", "production", "wastage"] as DatasetType[]) {
    const tot = await totalsFor({ ...filter, datasetType: t });
    if (tot.recordCount === 0) continue;
    datasets.push(t);
    recordCount += tot.recordCount;
    evidence.push({
      datasetType: t,
      description: `${DATASET_LABELS[t]} records in scope`,
      recordCount: tot.recordCount,
      quantity: tot.quantity,
      amount: t === "sales" ? tot.value : null,
    });
  }
  return { evidence, datasets, recordCount };
}

/**
 * EXECUTIVE ANALYSIS — "analyse today", "biggest problems", "top 5 insights",
 * "what should management look at". Composes the dashboard's own insight and
 * anomaly engines, ranks the result, and reports only what the data proves.
 */
export async function executiveAnalysis(filter: DatasetFilter, limit = 5): Promise<AnalysisResult> {
  const cov = await coverageEvidence(filter);
  if (cov.recordCount === 0) {
    return {
      answer: "There are no records in this scope, so there is nothing for me to analyse.",
      calculation: [],
      insights: [],
      conclusion: "Import a report for this period, or widen the date range, and I can run the full analysis.",
      evidence: [],
      datasets: [],
      recordCount: 0,
      insufficientData: true,
    };
  }

  const [insights, anomalies] = await Promise.all([buildInsights(filter), detectAnomalies(filter)]);

  // Anomalies the insight engine already surfaced would otherwise appear twice.
  const insightHeadlines = new Set(insights.map((i) => i.what));
  const extraAnomalies = anomalies.filter((a) => !insightHeadlines.has(a.headline));

  const lines: RameshInsightLine[] = [
    ...insights.map((i, n) => insightToLine(i, n + 1)),
    ...extraAnomalies.map((a, n) => anomalyToLine(a, insights.length + n + 1)),
  ];

  const sevRank: Record<string, number> = { high: 0, medium: 1, low: 2, info: 3 };
  const ranked = lines
    .sort((a, b) => sevRank[a.severity] - sevRank[b.severity])
    .slice(0, limit)
    .map((l, n) => ({ ...l, rank: n + 1 }));

  const [sales, production, wastage] = await Promise.all([
    totalsFor({ ...filter, datasetType: "sales" }),
    totalsFor({ ...filter, datasetType: "production" }),
    totalsFor({ ...filter, datasetType: "wastage" }),
  ]);

  const calculation: RameshCalculationStep[] = [];
  if (sales.recordCount > 0) {
    calculation.push({
      label: "Sales in scope",
      expression: `sum over ${sales.recordCount} sales record(s)`,
      result: `${money(sales.value)} on ${units(sales.quantity)}`,
    });
  }
  if (production.recordCount > 0) {
    calculation.push({ label: "Production in scope", expression: `sum over ${production.recordCount} record(s)`, result: units(production.quantity) });
  }
  if (wastage.recordCount > 0) {
    calculation.push({ label: "Wastage in scope", expression: `sum over ${wastage.recordCount} record(s)`, result: units(wastage.quantity) });
  }
  if (production.recordCount > 0 && production.quantity > 0) {
    const unaccounted = production.quantity - sales.quantity - wastage.quantity;
    calculation.push({
      label: "Reconciliation (production − sales − wastage)",
      expression: `${units(production.quantity)} − ${units(sales.quantity)} − ${units(wastage.quantity)}`,
      result: units(unaccounted),
    });
    calculation.push({
      label: "Sell-through",
      expression: `${sales.quantity.toLocaleString("en-IN")} ÷ ${production.quantity.toLocaleString("en-IN")} × 100`,
      result: pct((sales.quantity / production.quantity) * 100),
    });
  }

  const missing = (["production", "wastage"] as DatasetType[]).filter((t) => !cov.datasets.includes(t));
  const gapNote = missing.length
    ? ` Production/wastage analysis is limited because no ${missing.map((m) => DATASET_LABELS[m].toLowerCase()).join(" or ")} records exist in this scope.`
    : "";

  const answer = ranked.length
    ? `I found ${ranked.length} finding${ranked.length === 1 ? "" : "s"} worth management attention across ${cov.datasets.map((d) => DATASET_LABELS[d].toLowerCase()).join(", ")} (${cov.recordCount.toLocaleString()} records).${gapNote}`
    : `I analysed ${cov.recordCount.toLocaleString()} record(s) across ${cov.datasets.map((d) => DATASET_LABELS[d].toLowerCase()).join(", ")} and found nothing that deviates enough to flag.${gapNote}`;

  const conclusion = ranked.length
    ? `The most significant issue is: ${ranked[0].headline} (${ranked[0].magnitude}).`
    : "Nothing in this scope breaches the thresholds used for anomaly and variance detection.";

  return { answer, calculation, insights: ranked, conclusion, evidence: cov.evidence, datasets: cov.datasets, recordCount: cov.recordCount, insufficientData: false };
}

/**
 * ROOT CAUSE — "why is wastage high", "why did sales drop". Walks the metric
 * down through product -> hour -> shift -> production-vs-demand and reports the
 * strongest evidenced contributor. Never asserts a cause the data can't carry.
 */
export async function rootCause(metric: DatasetType, filter: DatasetFilter): Promise<AnalysisResult> {
  const own = await totalsFor({ ...filter, datasetType: metric });
  if (own.recordCount === 0) {
    return {
      answer: `I cannot determine the cause because no ${DATASET_LABELS[metric].toLowerCase()} records exist in this scope.`,
      calculation: [],
      insights: [],
      conclusion: `Import a ${DATASET_LABELS[metric].toLowerCase()} report for this period and I can trace the drivers.`,
      evidence: [],
      datasets: [],
      recordCount: 0,
      insufficientData: true,
    };
  }

  const cov = await coverageEvidence(filter);
  const calculation: RameshCalculationStep[] = [
    {
      label: `Total ${DATASET_LABELS[metric].toLowerCase()} in scope`,
      expression: `sum over ${own.recordCount} record(s)`,
      result: metric === "sales" ? money(own.value) : units(own.quantity),
    },
  ];
  const insights: RameshInsightLine[] = [];
  let rank = 1;

  // 1. Product concentration -- which item drives the number.
  const perf = await productPerformance(filter, 200);
  const keyed = perf
    .map((p) => ({ name: p.product, value: metric === "wastage" ? p.wastageQty : metric === "production" ? p.productionQty : p.salesValue }))
    .filter((p) => p.value > 0)
    .sort((a, b) => b.value - a.value);

  if (keyed.length > 0) {
    const total = keyed.reduce((s, p) => s + p.value, 0);
    const top = keyed[0];
    const sharePct = total > 0 ? (top.value / total) * 100 : 0;
    calculation.push({
      label: "Largest single contributor",
      expression: `${top.name}: ${metric === "sales" ? money(top.value) : units(top.value)} ÷ ${metric === "sales" ? money(total) : units(total)} × 100`,
      result: pct(sharePct),
    });
    insights.push({
      rank: rank++,
      severity: sharePct >= 50 ? "high" : sharePct >= 30 ? "medium" : "low",
      category: "product",
      headline: `${top.name} accounts for the largest share of ${DATASET_LABELS[metric].toLowerCase()}`,
      magnitude: `${metric === "sales" ? money(top.value) : units(top.value)} — ${pct(sharePct)} of the ${DATASET_LABELS[metric].toLowerCase()} total`,
      scope: `${cov.datasets.length} dataset(s) in scope`,
      impact: `Concentration this high means ${top.name} alone moves the headline number.`,
      action: `Start the investigation at ${top.name}; the remaining ${keyed.length - 1} product(s) split the balance.`,
      evidence: cov.evidence,
      drilldownQuery: { product: top.name, datasetType: metric, ...(filter.from ? { from: filter.from } : {}), ...(filter.to ? { to: filter.to } : {}) },
    });
  }

  // 2. Time concentration -- only when records actually carry a clock time.
  const buckets = await hourlyBuckets(filter);
  if (buckets.length > 0) {
    const pick = (b: (typeof buckets)[number]) =>
      metric === "wastage" ? b.wastageQty : metric === "production" ? b.productionQty : b.salesValue;
    const timed = buckets.filter((b) => pick(b) > 0).sort((a, b) => pick(b) - pick(a));
    if (timed.length > 0) {
      const worst = timed[0];
      const timedTotal = timed.reduce((s, b) => s + pick(b), 0);
      const hourShare = timedTotal > 0 ? (pick(worst) / timedTotal) * 100 : 0;
      calculation.push({
        label: "Peak hour for this metric",
        expression: `${worst.label}: ${metric === "sales" ? money(pick(worst)) : units(pick(worst))} ÷ ${metric === "sales" ? money(timedTotal) : units(timedTotal)} × 100`,
        result: pct(hourShare),
      });
      insights.push({
        rank: rank++,
        severity: hourShare >= 40 ? "medium" : "low",
        category: "time",
        headline: `${DATASET_LABELS[metric]} concentrates in the ${worst.label} hour`,
        magnitude: `${metric === "sales" ? money(pick(worst)) : units(pick(worst))} — ${pct(hourShare)} of all timestamped ${DATASET_LABELS[metric].toLowerCase()}`,
        scope: worst.isAfterMidnight ? `${worst.label} (after midnight, same business day)` : worst.label,
        impact: `The window is narrow enough to staff or batch against.`,
        action: `Review what happens at ${worst.label}; that hour carries the largest share.`,
        evidence: cov.evidence,
        drilldownQuery: { datasetType: metric, ...(filter.from ? { from: filter.from } : {}), ...(filter.to ? { to: filter.to } : {}) },
      });
    }
  }

  // 3. Shift concentration.
  const shiftRows = await shiftPerformance(filter);
  const shifts = shiftRows.filter((s) => (metric === "wastage" ? s.wastageQty : metric === "production" ? s.productionQty : s.salesValue) > 0);
  if (shifts.length > 1) {
    const key = (s: SegmentPerformanceRow) => (metric === "wastage" ? s.wastageQty : metric === "production" ? s.productionQty : s.salesValue);
    const worst = [...shifts].sort((a, b) => key(b) - key(a))[0];
    calculation.push({
      label: "Heaviest shift",
      expression: `${worst.segment}: ${metric === "sales" ? money(key(worst)) : units(key(worst))}`,
      result: worst.segment,
    });
  }

  // 4. Production vs observed demand -- the actual causal test, when possible.
  // Restricted to business dates where production, sales AND wastage all have
  // records: mixing 5 days of sales with 1 day of production produces a
  // reconciliation figure in the thousands of percent, which is noise, not signal.
  const datesOf = async (t: DatasetType) => new Set((await dailyTotals({ ...filter, datasetType: t })).map((d) => d.businessDate));
  const prodDates = await datesOf("production");
  const saleDates = await datesOf("sales");
  const wasteDates = await datesOf("wastage");
  const overlap = [...prodDates].filter((d) => saleDates.has(d) && wasteDates.has(d)).sort();

  const [prod, sales, wasteOverlap] = overlap.length
    ? await Promise.all([
        totalsFor({ ...filter, datasetType: "production", from: overlap[0], to: overlap[overlap.length - 1] }),
        totalsFor({ ...filter, datasetType: "sales", from: overlap[0], to: overlap[overlap.length - 1] }),
        totalsFor({ ...filter, datasetType: "wastage", from: overlap[0], to: overlap[overlap.length - 1] }),
      ])
    : [{ quantity: 0, value: 0, recordCount: 0 }, { quantity: 0, value: 0, recordCount: 0 }, { quantity: 0, value: 0, recordCount: 0 }];

  let conclusion: string;
  if (metric === "wastage" && overlap.length > 0 && prod.quantity > 0) {
    const unaccounted = prod.quantity - sales.quantity - wasteOverlap.quantity;
    const overPct = (unaccounted / prod.quantity) * 100;
    const spanNote = `over the ${overlap.length} business day(s) with production, sales and wastage all on file`;
    calculation.push({
      label: `Production against observed demand (${spanNote})`,
      expression: `${units(prod.quantity)} produced − ${units(sales.quantity)} sold − ${units(wasteOverlap.quantity)} wasted`,
      result: `${units(unaccounted)} unaccounted (${pct(overPct)} of production)`,
    });
    conclusion =
      overPct > 5
        ? `The data associates the wastage with production running ahead of observed demand: ${units(unaccounted)} of production is unaccounted for by sales or wastage (${pct(overPct)} of everything produced), measured ${spanNote}.`
        : `Production, sales and wastage reconcile to within ${pct(Math.abs(overPct))} of production ${spanNote}, so overproduction does not explain the wastage here — the concentration above is the stronger lead.`;
  } else if (metric === "wastage" && prodDates.size > 0 && overlap.length === 0) {
    conclusion = `I can show where the wastage sits, but not whether overproduction caused it: production and wastage never fall on the same business day in this scope, so the reconciliation would compare unrelated periods.`;
  } else if (metric === "wastage") {
    conclusion = `I can show where the wastage sits (product, and hour where timestamps exist) but not *why*: that needs production records for the same period to test overproduction, and ${prod.recordCount === 0 ? "none are imported" : "sales records are missing"}.`;
  } else {
    conclusion = insights.length
      ? `The strongest evidenced driver is ${insights[0].headline.toLowerCase()}.`
      : `The records in scope don't concentrate enough in any product, hour or shift for me to name a driver.`;
  }

  return {
    answer: insights.length
      ? `${DATASET_LABELS[metric]} in this scope totals ${metric === "sales" ? money(own.value) : units(own.quantity)}. Tracing it down: ${insights[0].headline}.`
      : `${DATASET_LABELS[metric]} totals ${metric === "sales" ? money(own.value) : units(own.quantity)}, but it doesn't concentrate in any single product, hour or shift.`,
    calculation,
    insights,
    conclusion,
    evidence: cov.evidence,
    datasets: cov.datasets,
    recordCount: cov.recordCount,
    insufficientData: false,
  };
}

/** EFFICIENCY — where performance is strongest/weakest, per the reconciliation engine. */
export async function efficiencyAnalysis(filter: DatasetFilter): Promise<AnalysisResult> {
  const [recon, cov] = await Promise.all([computeReconciliation(filter), coverageEvidence(filter)]);

  const usable = recon.rows.filter((r) => r.efficiencyPct.value != null);
  if (usable.length === 0) {
    const missing = recon.missingDatasets.map((m) => DATASET_LABELS[m].toLowerCase());
    return {
      answer: `I can't compute efficiency for this scope. Efficiency is (sales + wastage) ÷ production, and ${missing.length ? `no ${missing.join(" or ")} records are imported` : "production is recorded as zero"} — so the ratio has no denominator.`,
      calculation: [],
      insights: [],
      conclusion: "Import production data for this period and efficiency, sell-through, wastage % and variance all become computable.",
      evidence: cov.evidence,
      datasets: cov.datasets,
      recordCount: cov.recordCount,
      insufficientData: true,
    };
  }

  const sorted = [...usable].sort((a, b) => (b.efficiencyPct.value ?? 0) - (a.efficiencyPct.value ?? 0));
  const best = sorted[0];
  const worst = sorted[sorted.length - 1];

  const calculation: RameshCalculationStep[] = sorted.slice(0, 6).map((r) => ({
    label: `Efficiency on ${formatBusinessDateLong(r.businessDate)}`,
    expression: `(${(r.salesQty.value ?? 0).toLocaleString("en-IN")} sold + ${(r.wastageQty.value ?? 0).toLocaleString("en-IN")} wasted) ÷ ${(r.productionQty.value ?? 0).toLocaleString("en-IN")} produced × 100`,
    result: pct(r.efficiencyPct.value ?? 0),
  }));

  const line = (r: ReconciliationRow, rank: number, severity: RameshInsightLine["severity"], label: string): RameshInsightLine => ({
    rank,
    severity,
    category: "efficiency",
    headline: `${label} efficiency on ${formatBusinessDateLong(r.businessDate)}: ${pct(r.efficiencyPct.value ?? 0)}`,
    magnitude: `${(r.salesQty.value ?? 0).toLocaleString("en-IN")} sold + ${(r.wastageQty.value ?? 0).toLocaleString("en-IN")} wasted against ${(r.productionQty.value ?? 0).toLocaleString("en-IN")} produced`,
    scope: formatBusinessDateLong(r.businessDate),
    impact: `${units(Math.abs(r.expectedBalance.value ?? 0))} unaccounted for on this day.`,
    action: `Compare the ${label.toLowerCase()} day's batching against its demand to see what is repeatable.`,
    evidence: cov.evidence,
    drilldownQuery: { from: r.businessDate, to: r.businessDate },
  });

  const insights = usable.length > 1 ? [line(worst, 1, "high", "Lowest"), line(best, 2, "info", "Highest")] : [line(worst, 1, "info", "Only measured")];

  return {
    answer:
      usable.length > 1
        ? `Efficiency is lowest on ${formatBusinessDateLong(worst.businessDate)} at ${pct(worst.efficiencyPct.value ?? 0)} and highest on ${formatBusinessDateLong(best.businessDate)} at ${pct(best.efficiencyPct.value ?? 0)}.`
        : `Efficiency is computable for one business day only: ${formatBusinessDateLong(worst.businessDate)} at ${pct(worst.efficiencyPct.value ?? 0)}.`,
    calculation,
    insights,
    conclusion:
      usable.length > 1
        ? `The spread between best and worst day is ${pct(Math.abs((best.efficiencyPct.value ?? 0) - (worst.efficiencyPct.value ?? 0)))}, measured over ${usable.length} business day(s) that have both production and demand data.`
        : `With one comparable day there is no baseline to judge this against yet.`,
    evidence: cov.evidence,
    datasets: cov.datasets,
    recordCount: cov.recordCount,
    insufficientData: false,
  };
}

/** SHIFT / OUTLET performance ranking. */
export async function segmentAnalysis(kind: "shift" | "outlet", filter: DatasetFilter): Promise<AnalysisResult> {
  const [rows, cov] = await Promise.all([
    kind === "shift" ? shiftPerformance(filter) : outletPerformance(filter),
    coverageEvidence(filter),
  ]);

  if (rows.length === 0) {
    return {
      answer: `None of the imported records carry a ${kind}, so I can't rank ${kind} performance.`,
      calculation: [],
      insights: [],
      conclusion: `The sources loaded so far don't include a ${kind} column. An export that has one will make this comparable.`,
      evidence: cov.evidence,
      datasets: cov.datasets,
      recordCount: cov.recordCount,
      insufficientData: true,
    };
  }

  const byValue = [...rows].sort((a, b) => b.salesValue - a.salesValue);
  const calculation: RameshCalculationStep[] = byValue.map((r) => ({
    label: `${r.segment}`,
    expression: `${units(r.salesQty)} sold${r.productionQty > 0 ? `, ${units(r.productionQty)} produced` : ""}${r.wastageQty > 0 ? `, ${units(r.wastageQty)} wasted` : ""} over ${r.recordCount} record(s)`,
    result: `${money(r.salesValue)}${r.sellThroughPct != null ? ` · sell-through ${pct(r.sellThroughPct)}` : ""}`,
  }));

  // Rank by sell-through when production exists (a real efficiency signal),
  // otherwise revenue is the only comparable measure available.
  const withSellThrough = rows.filter((r) => r.sellThroughPct != null);
  const ranked = withSellThrough.length > 1 ? [...withSellThrough].sort((a, b) => (a.sellThroughPct ?? 0) - (b.sellThroughPct ?? 0)) : byValue;
  const worst = ranked[0];

  const insights: RameshInsightLine[] = [
    {
      rank: 1,
      severity: withSellThrough.length > 1 ? "medium" : "info",
      category: kind,
      headline:
        withSellThrough.length > 1
          ? `${worst.segment} has the weakest sell-through of any ${kind}: ${pct(worst.sellThroughPct ?? 0)}`
          : `${byValue[0].segment} is the highest-revenue ${kind} at ${money(byValue[0].salesValue)}`,
      magnitude: `${units(worst.salesQty)} sold against ${units(worst.productionQty)} produced`,
      scope: `${rows.length} ${kind}(s) in scope`,
      impact:
        withSellThrough.length > 1
          ? `${units(worst.productionQty - worst.salesQty - worst.wastageQty)} unaccounted for in this ${kind}.`
          : `Revenue share is the only comparable measure without production data per ${kind}.`,
      action:
        withSellThrough.length > 1
          ? `Compare ${worst.segment}'s batching against the strongest ${kind} before changing targets.`
          : `Import production/wastage with a ${kind} column to rank on efficiency rather than revenue alone.`,
      evidence: cov.evidence,
      drilldownQuery: kind === "shift" ? { shift: worst.segment } : { outlet: worst.segment },
    },
  ];

  return {
    answer:
      withSellThrough.length > 1
        ? `Across ${rows.length} ${kind}s, ${worst.segment} is weakest on sell-through at ${pct(worst.sellThroughPct ?? 0)}; ${byValue[0].segment} leads on revenue with ${money(byValue[0].salesValue)}.`
        : `${byValue.length} ${kind}(s) in scope. ${byValue[0].segment} leads on revenue with ${money(byValue[0].salesValue)}.`,
    calculation,
    insights,
    conclusion:
      withSellThrough.length > 1
        ? `Ranked on sell-through, which is the closest thing to efficiency available per ${kind}.`
        : `Ranked on revenue — no ${kind} has production data, so efficiency can't be compared.`,
    evidence: cov.evidence,
    datasets: cov.datasets,
    recordCount: cov.recordCount,
    insufficientData: false,
  };
}

/** PRODUCT performance — "which products are overproduced / worst offenders". */
export async function productAnalysis(filter: DatasetFilter, focus: "overproduced" | "wastage" | "revenue"): Promise<AnalysisResult> {
  const perf = await productPerformance(filter, 200);
  const cov = await coverageEvidence(filter);

  if (perf.length === 0) {
    return {
      answer: "No product records in this scope.",
      calculation: [],
      insights: [],
      conclusion: "Import a report covering this period.",
      evidence: [],
      datasets: [],
      recordCount: 0,
      insufficientData: true,
    };
  }

  if (focus === "overproduced") {
    // Overproduction is only measurable on business dates that actually HAVE
    // production records. Aggregating sales from days with no production makes
    // every product look under-produced and hides real overproduction.
    const prodDatesRaw = await dailyTotals({ ...filter, datasetType: "production" });
    const prodDates = prodDatesRaw.map((d) => d.businessDate).sort();
    if (prodDates.length === 0) {
      return {
        answer: "I can't name overproduced products because no production records exist in this scope.",
        calculation: [],
        insights: [],
        conclusion: "Overproduction compares production against sales and wastage for the same product and business date.",
        evidence: cov.evidence,
        datasets: cov.datasets,
        recordCount: cov.recordCount,
        insufficientData: true,
      };
    }
    const scoped: DatasetFilter = { ...filter, from: prodDates[0], to: prodDates[prodDates.length - 1] };
    const perfScoped = await productPerformance(scoped, 200);
    const candidates = perfScoped.filter((p) => p.productionQty > 0 && p.variancePct != null && p.variancePct > 0).sort((a, b) => (b.variancePct ?? 0) - (a.variancePct ?? 0));
    if (candidates.length === 0) {
      const why = perf.every((p) => p.productionQty === 0)
        ? "no production records exist in this scope, so over- and under-production cannot be measured"
        : "no product produced more than it sold and wasted";
      return {
        answer: `I can't name overproduced products: ${why}.`,
        calculation: [],
        insights: [],
        conclusion: "Overproduction needs production and demand for the same product and business date.",
        evidence: cov.evidence,
        datasets: cov.datasets,
        recordCount: cov.recordCount,
        insufficientData: true,
      };
    }
    const calculation: RameshCalculationStep[] = candidates.slice(0, 5).map((p) => ({
      label: p.product,
      expression: `(${p.productionQty.toLocaleString("en-IN")} produced − ${p.salesQty.toLocaleString("en-IN")} sold − ${p.wastageQty.toLocaleString("en-IN")} wasted) ÷ ${p.productionQty.toLocaleString("en-IN")} × 100`,
      result: pct(p.variancePct ?? 0),
    }));
    const insights = candidates.slice(0, 5).map((p, n) => ({
      rank: n + 1,
      severity: (p.variancePct ?? 0) >= 40 ? "high" : (p.variancePct ?? 0) >= 20 ? "medium" : "low",
      category: "production",
      headline: `${p.product} produced ${units(p.productionQty - p.salesQty - p.wastageQty)} more than was sold or wasted`,
      magnitude: `${pct(p.variancePct ?? 0)} of its production went unaccounted for`,
      scope: [filter.from, filter.to].filter(Boolean).join(" → ") || "all imported dates",
      impact: `${units(p.productionQty - p.salesQty - p.wastageQty)} of ${p.product} unaccounted for.`,
      action: `Bring ${p.product} batching toward the ${units(p.salesQty + p.wastageQty)} actually consumed.`,
      evidence: cov.evidence,
      drilldownQuery: { product: p.product, ...(filter.from ? { from: filter.from } : {}), ...(filter.to ? { to: filter.to } : {}) },
    })) as RameshInsightLine[];

    return {
      answer: `${candidates.length} product(s) produced more than they sold and wasted. The largest gap is ${candidates[0].product} at ${pct(candidates[0].variancePct ?? 0)} of its production.`,
      calculation,
      insights,
      conclusion: `Ranked by unaccounted share of production, computed per product from production, sales and wastage on the same business dates.`,
      evidence: cov.evidence,
      datasets: cov.datasets,
      recordCount: cov.recordCount,
      insufficientData: false,
    };
  }

  const key = focus === "wastage" ? (p: (typeof perf)[number]) => p.wastageQty : (p: (typeof perf)[number]) => p.salesValue;
  const ranked = perf.filter((p) => key(p) > 0).sort((a, b) => key(b) - key(a));
  if (ranked.length === 0) {
    return {
      answer: `No ${focus} figures in this scope.`,
      calculation: [],
      insights: [],
      conclusion: `Import ${focus === "wastage" ? "wastage" : "sales"} data for this period.`,
      evidence: cov.evidence,
      datasets: cov.datasets,
      recordCount: cov.recordCount,
      insufficientData: true,
    };
  }
  const total = ranked.reduce((s, p) => s + key(p), 0);
  const fmt = focus === "wastage" ? units : money;
  return {
    answer: `${ranked[0].product} leads on ${focus} at ${fmt(key(ranked[0]))}, ${pct((key(ranked[0]) / total) * 100)} of the total.`,
    calculation: ranked.slice(0, 5).map((p) => ({
      label: p.product,
      expression: `${fmt(key(p))} ÷ ${fmt(total)} × 100`,
      result: pct((key(p) / total) * 100),
    })),
    insights: ranked.slice(0, 3).map((p, n) => ({
      rank: n + 1,
      severity: n === 0 ? "medium" : "low",
      category: "product",
      headline: `${p.product}: ${fmt(key(p))} of ${focus}`,
      magnitude: `${pct((key(p) / total) * 100)} of the ${focus} total`,
      scope: [filter.from, filter.to].filter(Boolean).join(" → ") || "all imported dates",
      impact: `${fmt(key(p))} attributable to this one product.`,
      action: `Review ${p.product} first — it carries the largest share.`,
      evidence: cov.evidence,
      drilldownQuery: { product: p.product, ...(filter.from ? { from: filter.from } : {}), ...(filter.to ? { to: filter.to } : {}) },
    })) as RameshInsightLine[],
    conclusion: `Ranked across ${ranked.length} product(s) with non-zero ${focus}.`,
    evidence: cov.evidence,
    datasets: cov.datasets,
    recordCount: cov.recordCount,
    insufficientData: false,
  };
}

/** RECONCILIATION in chat form, straight from the dashboard's own engine. */
export async function reconciliationAnalysis(filter: DatasetFilter): Promise<AnalysisResult> {
  const [recon, cov] = await Promise.all([computeReconciliation(filter), coverageEvidence(filter)]);
  const t = recon.totals;

  if (!t || t.productionQty.value == null) {
    const missing = recon.missingDatasets.map((m) => DATASET_LABELS[m].toLowerCase());
    return {
      answer: `A full reconciliation needs production, sales and wastage for the same period. ${missing.length ? `No ${missing.join(" or ")} records are imported` : "Production is zero"}, so production − sales − wastage can't be computed.`,
      calculation: [],
      insights: [],
      conclusion: "I won't estimate the missing side.",
      evidence: cov.evidence,
      datasets: cov.datasets,
      recordCount: cov.recordCount,
      insufficientData: true,
    };
  }

  return {
    answer: `Across ${recon.rows.length} business day(s): ${units(t.productionQty.value)} produced, ${units(t.salesQty.value ?? 0)} sold, ${units(t.wastageQty.value ?? 0)} wasted, leaving ${units(t.expectedBalance.value ?? 0)} unaccounted for.`,
    calculation: [
      {
        label: "Expected balance",
        expression: `${units(t.productionQty.value)} − ${units(t.salesQty.value ?? 0)} − ${units(t.wastageQty.value ?? 0)}`,
        result: units(t.expectedBalance.value ?? 0),
      },
      ...(t.sellThroughPct.value != null
        ? [{ label: "Sell-through", expression: `${(t.salesQty.value ?? 0).toLocaleString("en-IN")} ÷ ${t.productionQty.value.toLocaleString("en-IN")} × 100`, result: pct(t.sellThroughPct.value) }]
        : []),
      ...(t.wastagePct.value != null
        ? [{ label: "Wastage %", expression: `${(t.wastageQty.value ?? 0).toLocaleString("en-IN")} ÷ ${t.productionQty.value.toLocaleString("en-IN")} × 100`, result: pct(t.wastagePct.value) }]
        : []),
    ],
    insights: recon.rows
      .filter((r) => (r.variancePct.value ?? 0) > 10)
      .slice(0, 3)
      .map((r, n) => ({
        rank: n + 1,
        severity: (r.variancePct.value ?? 0) >= 30 ? "high" : "medium",
        category: "reconciliation",
        headline: `${formatBusinessDateLong(r.businessDate)}: ${pct(r.variancePct.value ?? 0)} of production unaccounted for`,
        magnitude: units(r.expectedBalance.value ?? 0),
        scope: formatBusinessDateLong(r.businessDate),
        impact: `${units(r.expectedBalance.value ?? 0)} neither sold nor recorded as wastage.`,
        action: "Check whether that quantity was consumed, transferred, or simply not logged.",
        evidence: cov.evidence,
        drilldownQuery: { from: r.businessDate, to: r.businessDate },
      })) as RameshInsightLine[],
    conclusion: `Unaccounted quantity is production minus everything the records explain; it is not a loss estimate.`,
    evidence: cov.evidence,
    datasets: cov.datasets,
    recordCount: cov.recordCount,
    insufficientData: false,
  };
}

/** ANOMALIES in chat form, from the dashboard's own detector. */
export async function anomalyAnalysis(filter: DatasetFilter): Promise<AnalysisResult> {
  const [anomalies, cov] = await Promise.all([detectAnomalies(filter), coverageEvidence(filter)]);

  if (anomalies.length === 0) {
    return {
      answer: "Nothing in this scope deviates enough from its baseline for me to call it an anomaly.",
      calculation: [],
      insights: [],
      conclusion:
        cov.recordCount === 0
          ? "There are no records in scope at all."
          : "Detection compares each business day against prior days, so it needs several days of imported history before it can flag anything.",
      evidence: cov.evidence,
      datasets: cov.datasets,
      recordCount: cov.recordCount,
      insufficientData: cov.recordCount === 0,
    };
  }

  return {
    answer: `${anomalies.length} anomaly/anomalies detected. The most severe: ${anomalies[0].headline}.`,
    calculation: anomalies.slice(0, 5).map((a) => ({
      label: `${a.kind} — ${a.product ?? "all products"} on ${a.businessDate}`,
      expression: `actual ${a.actual.toLocaleString("en-IN")} vs expected ${a.expected.toLocaleString("en-IN")} (${a.expectedBasisNote})`,
      result: `${a.variancePct >= 0 ? "+" : ""}${a.variancePct.toFixed(1)}%`,
    })),
    insights: anomalies.slice(0, 5).map((a, n) => anomalyToLine(a, n + 1)),
    conclusion: `Each figure is a measured deviation against a stated baseline, not a forecast.`,
    evidence: cov.evidence,
    datasets: cov.datasets,
    recordCount: cov.recordCount,
    insufficientData: false,
  };
}

/** Day-over-day movement across every dataset — "what changed vs yesterday". */
export async function changeAnalysis(current: string, previous: string, filter: DatasetFilter): Promise<AnalysisResult> {
  const cov = await coverageEvidence({ ...filter, from: previous, to: current });
  const calculation: RameshCalculationStep[] = [];
  const insights: RameshInsightLine[] = [];
  let rank = 1;
  let any = false;

  for (const t of ["sales", "production", "wastage"] as DatasetType[]) {
    const [now, then] = await Promise.all([
      totalsFor({ ...filter, datasetType: t, from: current, to: current }),
      totalsFor({ ...filter, datasetType: t, from: previous, to: previous }),
    ]);
    if (now.recordCount === 0 && then.recordCount === 0) continue;
    if (then.recordCount === 0 || now.recordCount === 0) {
      calculation.push({
        label: `${DATASET_LABELS[t]} comparison`,
        expression: `${now.recordCount} record(s) on ${current} vs ${then.recordCount} on ${previous}`,
        result: "not comparable — one side has no data",
      });
      continue;
    }
    any = true;
    const useValue = t === "sales";
    const a = useValue ? now.value : now.quantity;
    const b = useValue ? then.value : then.quantity;
    const deltaPct = b !== 0 ? ((a - b) / b) * 100 : null;
    const fmt = useValue ? money : units;
    calculation.push({
      label: `${DATASET_LABELS[t]} change`,
      expression: `(${fmt(a)} − ${fmt(b)}) ÷ ${fmt(b)} × 100`,
      result: deltaPct != null ? `${deltaPct >= 0 ? "+" : ""}${deltaPct.toFixed(1)}%` : "baseline is zero",
    });
    if (deltaPct != null && Math.abs(deltaPct) >= 5) {
      insights.push({
        rank: rank++,
        severity: Math.abs(deltaPct) >= 25 ? "high" : "medium",
        category: t,
        headline: `${DATASET_LABELS[t]} ${deltaPct >= 0 ? "rose" : "fell"} ${Math.abs(deltaPct).toFixed(1)}% versus ${formatBusinessDateLong(previous)}`,
        magnitude: `${fmt(b)} → ${fmt(a)}`,
        scope: `${formatBusinessDateLong(previous)} → ${formatBusinessDateLong(current)}`,
        impact: `${deltaPct >= 0 ? "+" : ""}${fmt(a - b)} day over day.`,
        action: `Confirm whether the ${DATASET_LABELS[t].toLowerCase()} shift was planned before reacting to it.`,
        evidence: cov.evidence,
        drilldownQuery: { datasetType: t, from: previous, to: current },
      });
    }
  }

  if (!any) {
    return {
      answer: `I can't compare ${formatBusinessDateLong(current)} with ${formatBusinessDateLong(previous)} — no dataset has records on both days.`,
      calculation,
      insights: [],
      conclusion: "Historical comparison needs the same dataset present on both business dates.",
      evidence: cov.evidence,
      datasets: cov.datasets,
      recordCount: cov.recordCount,
      insufficientData: true,
    };
  }

  return {
    answer: insights.length
      ? `Comparing ${formatBusinessDateLong(current)} with ${formatBusinessDateLong(previous)}: ${insights.map((i) => i.headline.toLowerCase()).join("; ")}.`
      : `${formatBusinessDateLong(current)} is within 5% of ${formatBusinessDateLong(previous)} on every dataset that has records on both days.`,
    calculation,
    insights,
    conclusion: insights.length
      ? `Movements above 5% are listed; each is computed from the two days' own totals.`
      : `No dataset moved more than 5%.`,
    evidence: cov.evidence,
    datasets: cov.datasets,
    recordCount: cov.recordCount,
    insufficientData: false,
  };
}

export { wastageByReason, dailyTotals };
