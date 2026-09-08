---
source_file: "server/src/entities/datasets/repository.ts"
type: "code"
community: "Ramesh AI Query Engine"
location: "L207"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Ramesh_AI_Query_Engine
---

# buildWhere()

## Connections
- [[categoryTotals()]] - `calls` [EXTRACTED]
- [[channelTotals()]] - `calls` [EXTRACTED]
- [[dailyTotals()]] - `calls` [EXTRACTED]
- [[datasetsrepository.ts]] - `contains` [EXTRACTED]
- [[exportRecords()]] - `calls` [EXTRACTED]
- [[hourlyBuckets()]] - `calls` [EXTRACTED]
- [[productKeyOf()]] - `calls` [EXTRACTED]
- [[productPerformance()]] - `calls` [EXTRACTED]
- [[queryRecords()]] - `calls` [EXTRACTED]
- [[segmentPerformance()]] - `calls` [EXTRACTED]
- [[topProducts()]] - `calls` [EXTRACTED]
- [[totalsFor()]] - `calls` [EXTRACTED]
- [[wastageByReason()]] - `calls` [EXTRACTED]

## Source
**From** `server/src/entities/datasets/repository.ts` **(starting line 207):**
```typescript
function buildWhere(filter: DatasetFilter): { clause: string; params: unknown[] } {
  const conds: string[] = [];
  const params: unknown[] = [];
  if (filter.from) {
    conds.push("businessDate >= ?");
    params.push(filter.from);
  }
  if (filter.to) {
    conds.push("businessDate <= ?");
    params.push(filter.to);
  }
  if (filter.datasetType) {
    conds.push("datasetType = ?");
    params.push(filter.datasetType);
  }
  if (filter.product) {
    conds.push("productKey = ?");
    params.push(productKeyOf(filter.product));
  }
  if (filter.outlet) {
    conds.push("outlet = ?");
    params.push(filter.outlet);
  }
  if (filter.shift) {
    conds.push("shift = ?");
    params.push(filter.shift);
  }
  if (filter.search) {
    conds.push("(product LIKE ? OR category LIKE ? OR sourceFile LIKE ? OR reason LIKE ?)");
    const like = `%${filter.search}%`;
    params.push(like, like, like, like);
  }
  return { clause: conds.length ? `WHERE ${conds.join(" AND ")}` : "", params };
}
```

#graphify/code #graphify/EXTRACTED #community/Ramesh_AI_Query_Engine