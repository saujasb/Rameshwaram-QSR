---
source_file: "server/src/entities/ramesh/analysis.ts"
type: "code"
community: "Ramesh AI Query Engine"
location: "L71"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Ramesh_AI_Query_Engine
---

# coverageEvidence()

## Connections
- [[analysis.ts]] - `contains` [EXTRACTED]
- [[anomalyAnalysis()]] - `calls` [EXTRACTED]
- [[changeAnalysis()]] - `calls` [EXTRACTED]
- [[efficiencyAnalysis()]] - `calls` [EXTRACTED]
- [[executiveAnalysis()]] - `calls` [EXTRACTED]
- [[productAnalysis()]] - `calls` [EXTRACTED]
- [[reconciliationAnalysis()]] - `calls` [EXTRACTED]
- [[rootCause()]] - `calls` [EXTRACTED]
- [[segmentAnalysis()]] - `calls` [EXTRACTED]
- [[totalsFor()]] - `calls` [EXTRACTED]

## Source
**From** `server/src/entities/ramesh/analysis.ts` **(starting line 71):**
```typescript
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
```

#graphify/code #graphify/EXTRACTED #community/Ramesh_AI_Query_Engine