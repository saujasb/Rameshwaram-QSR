---
source_file: "server/src/entities/datasets/repository.ts"
type: "code"
community: "Ramesh AI Query Engine"
location: "L318"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Ramesh_AI_Query_Engine
---

# dailyTotals()

## Connections
- [[analysis.ts]] - `imports` [EXTRACTED]
- [[anomalies.ts]] - `imports` [EXTRACTED]
- [[answerCompareDatasets()]] - `calls` [EXTRACTED]
- [[answerCompareDates()]] - `calls` [EXTRACTED]
- [[answerSeries()]] - `calls` [EXTRACTED]
- [[answerTotals()]] - `calls` [EXTRACTED]
- [[buildInsights()]] - `calls` [EXTRACTED]
- [[buildWhere()]] - `calls` [EXTRACTED]
- [[datasetsrepository.ts]] - `contains` [EXTRACTED]
- [[datasetsroutes.ts]] - `imports` [EXTRACTED]
- [[engine.ts]] - `imports` [EXTRACTED]
- [[insights.ts]] - `imports` [EXTRACTED]
- [[perDateFacts()]] - `calls` [EXTRACTED]
- [[productAnalysis()]] - `calls` [EXTRACTED]
- [[productStalls()]] - `calls` [EXTRACTED]
- [[productionVariance()]] - `calls` [EXTRACTED]
- [[reconciliation.ts]] - `imports` [EXTRACTED]
- [[rootCause()]] - `calls` [EXTRACTED]
- [[salesMovement()]] - `calls` [EXTRACTED]
- [[spanOf()]] - `calls` [EXTRACTED]
- [[wastageSurges()]] - `calls` [EXTRACTED]

## Source
**From** `server/src/entities/datasets/repository.ts` **(starting line 318):**
```typescript
export function dailyTotals(filter: DatasetFilter): { businessDate: string; quantity: number; value: number }[] {
  const { clause, params } = buildWhere(filter);
  return db
    .prepare(
      `SELECT businessDate, COALESCE(SUM(quantity),0) as quantity, COALESCE(SUM(salesValue),0) as value
       FROM dataset_records ${clause} GROUP BY businessDate ORDER BY businessDate ASC`
    )
    .all(...params) as { businessDate: string; quantity: number; value: number }[];
}
```

#graphify/code #graphify/EXTRACTED #community/Ramesh_AI_Query_Engine