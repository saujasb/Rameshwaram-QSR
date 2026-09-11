---
source_file: "server/src/entities/ramesh/analysis.ts"
type: "code"
community: "Ramesh AI Query Engine"
location: "L182"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Ramesh_AI_Query_Engine
---

# rootCause()

## Connections
- [[analysis.ts]] - `contains` [EXTRACTED]
- [[answer()]] - `calls` [EXTRACTED]
- [[coverageEvidence()]] - `calls` [EXTRACTED]
- [[dailyTotals()]] - `calls` [EXTRACTED]
- [[engine.ts]] - `imports` [EXTRACTED]
- [[hourlyBuckets()]] - `calls` [EXTRACTED]
- [[money()_1]] - `calls` [EXTRACTED]
- [[pct()]] - `calls` [EXTRACTED]
- [[productPerformance()]] - `calls` [EXTRACTED]
- [[shiftPerformance()]] - `calls` [EXTRACTED]
- [[totalsFor()]] - `calls` [EXTRACTED]
- [[units()]] - `calls` [EXTRACTED]

## Source
**From** `server/src/entities/ramesh/analysis.ts` **(starting line 182):**
```typescript
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
```

#graphify/code #graphify/EXTRACTED #community/Ramesh_AI_Query_Engine