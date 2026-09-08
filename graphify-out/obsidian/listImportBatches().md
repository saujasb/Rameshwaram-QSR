---
source_file: "server/src/entities/datasets/repository.ts"
type: "code"
community: "Business Intelligence Engine"
location: "L180"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Business_Intelligence_Engine
---

# listImportBatches()

## Connections
- [[buildInsights()]] - `calls` [EXTRACTED]
- [[datasetsrepository.ts]] - `contains` [EXTRACTED]
- [[datasetsroutes.ts]] - `imports` [EXTRACTED]
- [[insights.ts]] - `imports` [EXTRACTED]
- [[rowToBatch()]] - `indirect_call` [INFERRED]

## Source
**From** `server/src/entities/datasets/repository.ts` **(starting line 180):**
```typescript
export function listImportBatches(limit = 100): ImportBatch[] {
  return db
    .prepare(`SELECT * FROM dataset_import_batches ORDER BY createdAt DESC LIMIT ?`)
    .all(limit)
    .map(rowToBatch);
}
```

#graphify/code #graphify/EXTRACTED #community/Business_Intelligence_Engine