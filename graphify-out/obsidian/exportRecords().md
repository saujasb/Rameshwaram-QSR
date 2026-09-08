---
source_file: "server/src/entities/datasets/repository.ts"
type: "code"
community: "Ramesh AI Query Engine"
location: "L293"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Ramesh_AI_Query_Engine
---

# exportRecords()

## Connections
- [[buildWhere()]] - `calls` [EXTRACTED]
- [[datasetsrepository.ts]] - `contains` [EXTRACTED]
- [[datasetsroutes.ts]] - `imports` [EXTRACTED]
- [[mapRecord()]] - `indirect_call` [INFERRED]

## Source
**From** `server/src/entities/datasets/repository.ts` **(starting line 293):**
```typescript
export function exportRecords(filter: DatasetFilter, cap = 50000): DatasetRecord[] {
  const { clause, params } = buildWhere(filter);
  return db
    .prepare(`SELECT * FROM dataset_records ${clause} ORDER BY businessDate DESC, product ASC LIMIT ?`)
    .all(...params, cap)
    .map(mapRecord);
}
```

#graphify/code #graphify/EXTRACTED #community/Ramesh_AI_Query_Engine