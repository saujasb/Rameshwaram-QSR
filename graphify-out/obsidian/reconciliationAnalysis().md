---
source_file: "server/src/entities/ramesh/analysis.ts"
type: "code"
community: "Ramesh AI Query Engine"
location: "L595"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Ramesh_AI_Query_Engine
---

# reconciliationAnalysis()

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
**From** `server/src/entities/ramesh/analysis.ts` **(starting line 595):**
```typescript
export function reconciliationAnalysis(filter: DatasetFilter): AnalysisResult {
  const recon = computeReconciliation(filter);
  const cov = coverageEvidence(filter);
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
```

#graphify/code #graphify/EXTRACTED #community/Ramesh_AI_Query_Engine