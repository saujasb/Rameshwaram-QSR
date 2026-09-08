---
source_file: "server/src/entities/intelligence/anomalies.ts"
type: "code"
community: "Business Intelligence Engine"
location: "L314"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Business_Intelligence_Engine
---

# detectAnomalies()

## Connections
- [[analysis.ts]] - `imports` [EXTRACTED]
- [[anomalies.ts]] - `contains` [EXTRACTED]
- [[anomalyAnalysis()]] - `calls` [EXTRACTED]
- [[buildEvidence()]] - `calls` [EXTRACTED]
- [[buildInsights()]] - `calls` [EXTRACTED]
- [[datasetCoverage()]] - `calls` [EXTRACTED]
- [[executiveAnalysis()]] - `calls` [EXTRACTED]
- [[insights.ts]] - `imports` [EXTRACTED]
- [[intelligenceroutes.ts]] - `imports` [EXTRACTED]
- [[productStalls()]] - `calls` [EXTRACTED]
- [[productionVariance()]] - `calls` [EXTRACTED]
- [[salesMovement()]] - `calls` [EXTRACTED]
- [[wastageSurges()]] - `calls` [EXTRACTED]

## Source
**From** `server/src/entities/intelligence/anomalies.ts` **(starting line 314):**
```typescript
export function detectAnomalies(filter: DatasetFilter): Anomaly[] {
  const coverage = datasetCoverage();
  const has = (t: DatasetType) => (coverage.find((c) => c.datasetType === t)?.recordCount ?? 0) > 0;

  const candidates: Candidate[] = [];
  if (has("sales")) candidates.push(...salesMovement(filter));
  if (has("production")) candidates.push(...productionVariance(filter));
  if (has("wastage")) candidates.push(...wastageSurges(filter));
  if (has("production") || has("wastage")) candidates.push(...productStalls(filter));

  candidates.sort(
    (a, b) => SEVERITY_RANK[a.severity] - SEVERITY_RANK[b.severity] || Math.abs(b.variancePct) - Math.abs(a.variancePct)
  );

  return candidates.slice(0, MAX_ANOMALIES).map(({ evidenceTypes, ...rest }) => ({
    ...rest,
    evidence: buildEvidence(filter, { ...rest, evidenceTypes }),
  }));
}
```

#graphify/code #graphify/EXTRACTED #community/Business_Intelligence_Engine