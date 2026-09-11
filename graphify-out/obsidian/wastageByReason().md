---
source_file: "server/src/entities/datasets/repository.ts"
type: "code"
community: "Ramesh AI Query Engine"
location: "L497"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Ramesh_AI_Query_Engine
---

# wastageByReason()

## Connections
- [[analysis.ts]] - `imports` [EXTRACTED]
- [[answerWastageReason()]] - `calls` [EXTRACTED]
- [[buildWhere()]] - `calls` [EXTRACTED]
- [[datasetsrepository.ts]] - `contains` [EXTRACTED]
- [[datasetsroutes.ts]] - `imports` [EXTRACTED]
- [[engine.ts]] - `imports` [EXTRACTED]
- [[insights.ts]] - `imports` [EXTRACTED]
- [[wastageInsights()]] - `calls` [EXTRACTED]

## Source
**From** `server/src/entities/datasets/repository.ts` **(starting line 497):**
```typescript
export function wastageByReason(filter: DatasetFilter): { reason: string; quantity: number; recordCount: number }[] {
  const { clause, params } = buildWhere({ ...filter, datasetType: "wastage" });
  return db
    .prepare(
      `SELECT COALESCE(reason, 'Not recorded') as reason, COALESCE(SUM(quantity),0) as quantity, COUNT(*) as recordCount
       FROM dataset_records ${clause} GROUP BY COALESCE(reason, 'Not recorded') ORDER BY quantity DESC`
    )
    .all(...params) as { reason: string; quantity: number; recordCount: number }[];
}
```

#graphify/code #graphify/EXTRACTED #community/Ramesh_AI_Query_Engine