---
source_file: "server/src/entities/datasets/repository.ts"
type: "code"
community: "Ramesh AI Query Engine"
location: "L328"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Ramesh_AI_Query_Engine
---

# topProducts()

## Connections
- [[answerRanked()]] - `calls` [EXTRACTED]
- [[buildSuggestions()]] - `calls` [EXTRACTED]
- [[buildWhere()]] - `calls` [EXTRACTED]
- [[datasetsrepository.ts]] - `contains` [EXTRACTED]
- [[datasetsroutes.ts]] - `imports` [EXTRACTED]
- [[engine.ts]] - `imports` [EXTRACTED]

## Source
**From** `server/src/entities/datasets/repository.ts` **(starting line 328):**
```typescript
export function topProducts(
  filter: DatasetFilter,
  limit = 15,
  order: "desc" | "asc" = "desc"
): { product: string; category: string | null; quantity: number; value: number }[] {
  const { clause, params } = buildWhere(filter);
  return db
    .prepare(
      `SELECT product, MAX(category) as category, COALESCE(SUM(quantity),0) as quantity, COALESCE(SUM(salesValue),0) as value
       FROM dataset_records ${clause}
       GROUP BY productKey
       ORDER BY value ${order === "desc" ? "DESC" : "ASC"}, quantity ${order === "desc" ? "DESC" : "ASC"}
       LIMIT ?`
    )
    .all(...params, limit) as { product: string; category: string | null; quantity: number; value: number }[];
}
```

#graphify/code #graphify/EXTRACTED #community/Ramesh_AI_Query_Engine