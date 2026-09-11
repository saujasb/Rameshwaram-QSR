---
source_file: "server/src/entities/datasets/repository.ts"
type: "code"
community: "Ramesh AI Query Engine"
location: "L356"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Ramesh_AI_Query_Engine
---

# channelTotals()

## Connections
- [[buildWhere()]] - `calls` [EXTRACTED]
- [[datasetsrepository.ts]] - `contains` [EXTRACTED]
- [[datasetsroutes.ts]] - `imports` [EXTRACTED]

## Source
**From** `server/src/entities/datasets/repository.ts` **(starting line 356):**
```typescript
export function channelTotals(filter: DatasetFilter): { channel: string; quantity: number; value: number }[] {
  const { clause, params } = buildWhere(filter);
  const extra = clause ? `${clause} AND channel IS NOT NULL` : `WHERE channel IS NOT NULL`;
  return db
    .prepare(
      `SELECT channel, COALESCE(SUM(quantity),0) as quantity, COALESCE(SUM(salesValue),0) as value
       FROM dataset_records ${extra} GROUP BY channel ORDER BY value DESC`
    )
    .all(...params) as { channel: string; quantity: number; value: number }[];
}
```

#graphify/code #graphify/EXTRACTED #community/Ramesh_AI_Query_Engine