---
source_file: "server/src/entities/ramesh/analysis.ts"
type: "code"
community: "Ramesh AI Query Engine"
location: "L1"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Ramesh_AI_Query_Engine
---

# analysis.ts

## Connections
- [[AnalysisResult]] - `contains` [EXTRACTED]
- [[Anomaly]] - `imports` [EXTRACTED]
- [[AnomalyEvidence]] - `imports` [EXTRACTED]
- [[DATASET_LABELS]] - `imports` [EXTRACTED]
- [[DatasetFilter]] - `imports` [EXTRACTED]
- [[DatasetType]] - `imports` [EXTRACTED]
- [[Insight]] - `imports` [EXTRACTED]
- [[RameshCalculationStep]] - `imports` [EXTRACTED]
- [[RameshInsightLine]] - `imports` [EXTRACTED]
- [[ReconciliationRow]] - `imports` [EXTRACTED]
- [[SegmentPerformanceRow]] - `imports` [EXTRACTED]
- [[anomalies.ts]] - `imports_from` [EXTRACTED]
- [[anomalyAnalysis()]] - `contains` [EXTRACTED]
- [[anomalyToLine()]] - `contains` [EXTRACTED]
- [[buildInsights()]] - `imports` [EXTRACTED]
- [[businessDate.ts]] - `imports_from` [EXTRACTED]
- [[changeAnalysis()]] - `contains` [EXTRACTED]
- [[computeReconciliation()]] - `imports` [EXTRACTED]
- [[coverageEvidence()]] - `contains` [EXTRACTED]
- [[dailyTotals()]] - `imports` [EXTRACTED]
- [[datasetsrepository.ts]] - `re_exports` [EXTRACTED]
- [[detectAnomalies()]] - `imports` [EXTRACTED]
- [[efficiencyAnalysis()]] - `contains` [EXTRACTED]
- [[engine.ts]] - `imports_from` [EXTRACTED]
- [[executiveAnalysis()]] - `contains` [EXTRACTED]
- [[formatBusinessDateLong()]] - `imports` [EXTRACTED]
- [[formatHourBucket()]] - `imports` [EXTRACTED]
- [[hourlyBuckets()]] - `imports` [EXTRACTED]
- [[insightToLine()]] - `contains` [EXTRACTED]
- [[insights.ts]] - `imports_from` [EXTRACTED]
- [[money()_1]] - `contains` [EXTRACTED]
- [[outletPerformance()]] - `imports` [EXTRACTED]
- [[pct()]] - `contains` [EXTRACTED]
- [[productAnalysis()]] - `contains` [EXTRACTED]
- [[productPerformance()]] - `imports` [EXTRACTED]
- [[reconciliation.ts]] - `imports_from` [EXTRACTED]
- [[reconciliationAnalysis()]] - `contains` [EXTRACTED]
- [[rootCause()]] - `contains` [EXTRACTED]
- [[segmentAnalysis()]] - `contains` [EXTRACTED]
- [[shared-typesdatasets.ts]] - `imports_from` [EXTRACTED]
- [[shared-typesintelligence.ts]] - `imports_from` [EXTRACTED]
- [[shared-typesramesh.ts]] - `imports_from` [EXTRACTED]
- [[shiftPerformance()]] - `imports` [EXTRACTED]
- [[totalsFor()]] - `imports` [EXTRACTED]
- [[units()]] - `contains` [EXTRACTED]
- [[wastageByReason()]] - `imports` [EXTRACTED]

## Source
**Full file:** `server/src/entities/ramesh/analysis.ts`
```typescript
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

function coverageEvidence(filter: DatasetFilter): { evidence: AnomalyEvidence[]; datasets: DatasetType[]; recordCount: number } {
  const evidence: AnomalyEvidence[] = [];
  const datasets: DatasetType[] = [];
  let recordCount = 0;
  for (const t of ["sales", "production", "wastage"] as DatasetType[]) {
    const tot = totalsFor({ ...filter, datasetType: t });
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
export function executiveAnalysis(filter: DatasetFilter, limit = 5): AnalysisResult {
  const cov = coverageEvidence(filter);
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

  const insights = buildInsights(filter);
  const anomalies = detectAnomalies(filter);

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

  const sales = totalsFor({ ...filter, datasetType: "sales" });
  const production = totalsFor({ ...filter, datasetType: "production" });
  const wastage = totalsFor({ ...filter, datasetType: "wastage" });

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
export function rootCause(metric: DatasetType, filter: DatasetFilter): AnalysisResult {
  const own = totalsFor({ ...filter, datasetType: metric });
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

  const cov = coverageEvidence(filter);
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
  const perf = productPerformance(filter, 200);
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
  const buckets = hourlyBuckets(filter);
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
  const shifts = shiftPerformance(filter).filter((s) => (metric === "wastage" ? s.wastageQty : metric === "production" ? s.productionQty : s.salesValue) > 0);
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
  const datesOf = (t: DatasetType) => new Set(dailyTotals({ ...filter, datasetType: t }).map((d) => d.businessDate));
  const prodDates = datesOf("production");
  const saleDates = datesOf("sales");
  const wasteDates = datesOf("wastage");
  const overlap = [...prodDates].filter((d) => saleDates.has(d) && wasteDates.has(d)).sort();

  const prod = overlap.length ? totalsFor({ ...filter, datasetType: "production", from: overlap[0], to: overlap[overlap.length - 1] }) : { quantity: 0, value: 0, recordCount: 0 };
  const sales = overlap.length ? totalsFor({ ...filter, datasetType: "sales", from: overlap[0], to: overlap[overlap.length - 1] }) : { quantity: 0, value: 0, recordCount: 0 };
  const wasteOverlap = overlap.length ? totalsFor({ ...filter, datasetType: "wastage", from: overlap[0], to: overlap[overlap.length - 1] }) : { quantity: 0, value: 0, recordCount: 0 };

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
export function efficiencyAnalysis(filter: DatasetFilter): AnalysisResult {
  const recon = computeReconciliation(filter);
  const cov = coverageEvidence(filter);

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
export function segmentAnalysis(kind: "shift" | "outlet", filter: DatasetFilter): AnalysisResult {
  const rows = kind === "shift" ? shiftPerformance(filter) : outletPerformance(filter);
  const cov = coverageEvidence(filter);

  if (rows.length === 0) {
```
*(truncated, showing first 400 of 765 lines)*

#graphify/code #graphify/EXTRACTED #community/Ramesh_AI_Query_Engine