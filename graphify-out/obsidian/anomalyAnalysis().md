---
source_file: "server/src/entities/ramesh/analysis.ts"
type: "code"
community: "Ramesh AI Query Engine"
location: "L653"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Ramesh_AI_Query_Engine
---

# anomalyAnalysis()

## Connections
- [[analysis.ts]] - `contains` [EXTRACTED]
- [[anomalyToLine()]] - `calls` [EXTRACTED]
- [[answer()]] - `calls` [EXTRACTED]
- [[coverageEvidence()]] - `calls` [EXTRACTED]
- [[detectAnomalies()]] - `calls` [EXTRACTED]
- [[engine.ts]] - `imports` [EXTRACTED]

## Source
**From** `server/src/entities/ramesh/analysis.ts` **(starting line 653):**
```typescript
export function anomalyAnalysis(filter: DatasetFilter): AnalysisResult {
  const anomalies = detectAnomalies(filter);
  const cov = coverageEvidence(filter);

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
```

#graphify/code #graphify/EXTRACTED #community/Ramesh_AI_Query_Engine