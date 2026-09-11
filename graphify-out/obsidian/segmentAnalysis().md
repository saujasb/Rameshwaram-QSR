---
source_file: "server/src/entities/ramesh/analysis.ts"
type: "code"
community: "Ramesh AI Query Engine"
location: "L396"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Ramesh_AI_Query_Engine
---

# segmentAnalysis()

## Connections
- [[analysis.ts]] - `contains` [EXTRACTED]
- [[answer()]] - `calls` [EXTRACTED]
- [[coverageEvidence()]] - `calls` [EXTRACTED]
- [[engine.ts]] - `imports` [EXTRACTED]
- [[money()_1]] - `calls` [EXTRACTED]
- [[outletPerformance()]] - `calls` [EXTRACTED]
- [[pct()]] - `calls` [EXTRACTED]
- [[shiftPerformance()]] - `calls` [EXTRACTED]
- [[units()]] - `calls` [EXTRACTED]

## Source
**From** `server/src/entities/ramesh/analysis.ts` **(starting line 396):**
```typescript
export function segmentAnalysis(kind: "shift" | "outlet", filter: DatasetFilter): AnalysisResult {
  const rows = kind === "shift" ? shiftPerformance(filter) : outletPerformance(filter);
  const cov = coverageEvidence(filter);

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
```

#graphify/code #graphify/EXTRACTED #community/Ramesh_AI_Query_Engine