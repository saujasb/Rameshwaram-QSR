---
source_file: "server/src/entities/datasets/repository.ts"
type: "code"
community: "Ramesh AI Query Engine"
location: "L345"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Ramesh_AI_Query_Engine
---

# categoryTotals()

## Connections
- [[buildWhere()]] - `calls` [EXTRACTED]
- [[datasetsrepository.ts]] - `contains` [EXTRACTED]
- [[datasetsroutes.ts]] - `imports` [EXTRACTED]

## Source
**From** `server/src/entities/datasets/repository.ts` **(starting line 345):**
```typescript
export function categoryTotals(filter: DatasetFilter): { category: string; quantity: number; value: number }[] {
  const { clause, params } = buildWhere(filter);
  return db
    .prepare(
      `SELECT COALESCE(category, 'Uncategorised') as category, COALESCE(SUM(quantity),0) as quantity,
              COALESCE(SUM(salesValue),0) as value
       FROM dataset_records ${clause} GROUP BY COALESCE(category, 'Uncategorised') ORDER BY value DESC`
    )
    .all(...params) as { category: string; quantity: number; value: number }[];
}
```

#graphify/code #graphify/EXTRACTED #community/Ramesh_AI_Query_Engine