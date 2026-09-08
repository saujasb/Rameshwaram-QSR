---
source_file: "server/src/entities/ramesh/analysis.ts"
type: "code"
community: "Ramesh AI Query Engine"
location: "L96"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Ramesh_AI_Query_Engine
---

# executiveAnalysis()

## Connections
- [[analysis.ts]] - `contains` [EXTRACTED]
- [[anomalyToLine()]] - `calls` [EXTRACTED]
- [[answer()]] - `calls` [EXTRACTED]
- [[buildInsights()]] - `calls` [EXTRACTED]
- [[coverageEvidence()]] - `calls` [EXTRACTED]
- [[detectAnomalies()]] - `calls` [EXTRACTED]
- [[engine.ts]] - `imports` [EXTRACTED]
- [[insightToLine()]] - `calls` [EXTRACTED]
- [[money()_1]] - `calls` [EXTRACTED]
- [[pct()]] - `calls` [EXTRACTED]
- [[totalsFor()]] - `calls` [EXTRACTED]
- [[units()]] - `calls` [EXTRACTED]

## Source
**From** `server/src/entities/ramesh/analysis.ts` **(starting line 96):**
```typescript
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
```

#graphify/code #graphify/EXTRACTED #community/Ramesh_AI_Query_Engine