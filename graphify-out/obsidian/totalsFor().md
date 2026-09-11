---
source_file: "server/src/entities/datasets/repository.ts"
type: "code"
community: "Ramesh AI Query Engine"
location: "L307"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Ramesh_AI_Query_Engine
---

# totalsFor()

## Connections
- [[analysis.ts]] - `imports` [EXTRACTED]
- [[anomalies.ts]] - `imports` [EXTRACTED]
- [[answerCompareDatasets()]] - `calls` [EXTRACTED]
- [[answerCompareDates()]] - `calls` [EXTRACTED]
- [[answerRanked()]] - `calls` [EXTRACTED]
- [[answerSeries()]] - `calls` [EXTRACTED]
- [[answerTotals()]] - `calls` [EXTRACTED]
- [[answerVariance()]] - `calls` [EXTRACTED]
- [[answerWastageReason()]] - `calls` [EXTRACTED]
- [[buildEvidence()]] - `calls` [EXTRACTED]
- [[buildInsights()]] - `calls` [EXTRACTED]
- [[buildTodaysIntelligence()]] - `calls` [EXTRACTED]
- [[buildWhere()]] - `calls` [EXTRACTED]
- [[changeAnalysis()]] - `calls` [EXTRACTED]
- [[coverageEvidence()]] - `calls` [EXTRACTED]
- [[datasetsrepository.ts]] - `contains` [EXTRACTED]
- [[datasetsroutes.ts]] - `imports` [EXTRACTED]
- [[engine.ts]] - `imports` [EXTRACTED]
- [[evidenceFor()]] - `calls` [EXTRACTED]
- [[executiveAnalysis()]] - `calls` [EXTRACTED]
- [[factsFor()]] - `calls` [EXTRACTED]
- [[insights.ts]] - `imports` [EXTRACTED]
- [[intelligenceroutes.ts]] - `imports` [EXTRACTED]
- [[perDateFacts()]] - `calls` [EXTRACTED]
- [[reconciliation.ts]] - `imports` [EXTRACTED]
- [[rootCause()]] - `calls` [EXTRACTED]
- [[salesValueMetric()]] - `calls` [EXTRACTED]
- [[wastageInsights()]] - `calls` [EXTRACTED]

## Source
**From** `server/src/entities/datasets/repository.ts` **(starting line 307):**
```typescript
export function totalsFor(filter: DatasetFilter): DatasetTotals {
  const { clause, params } = buildWhere(filter);
  const row = db
    .prepare(
      `SELECT COALESCE(SUM(quantity),0) as quantity, COALESCE(SUM(salesValue),0) as value, COUNT(*) as recordCount
       FROM dataset_records ${clause}`
    )
    .get(...params) as DatasetTotals;
  return row;
}
```

#graphify/code #graphify/EXTRACTED #community/Ramesh_AI_Query_Engine