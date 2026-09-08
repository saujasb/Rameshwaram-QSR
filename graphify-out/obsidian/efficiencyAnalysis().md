---
source_file: "server/src/entities/ramesh/analysis.ts"
type: "code"
community: "Ramesh AI Query Engine"
location: "L333"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Ramesh_AI_Query_Engine
---

# efficiencyAnalysis()

## Connections
- [[analysis.ts]] - `contains` [EXTRACTED]
- [[answer()]] - `calls` [EXTRACTED]
- [[computeReconciliation()]] - `calls` [EXTRACTED]
- [[coverageEvidence()]] - `calls` [EXTRACTED]
- [[engine.ts]] - `imports` [EXTRACTED]
- [[formatBusinessDateLong()]] - `calls` [EXTRACTED]
- [[pct()]] - `calls` [EXTRACTED]
- [[units()]] - `calls` [EXTRACTED]

## Source
**From** `server/src/entities/ramesh/analysis.ts` **(starting line 333):**
```typescript
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
```

#graphify/code #graphify/EXTRACTED #community/Ramesh_AI_Query_Engine