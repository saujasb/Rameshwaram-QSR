---
source_file: "server/src/entities/datasets/repository.ts"
type: "code"
community: "Ramesh AI Query Engine"
location: "L187"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Ramesh_AI_Query_Engine
---

# getImportBatch()

## Connections
- [[datasetsrepository.ts]] - `contains` [EXTRACTED]
- [[datasetsroutes.ts]] - `imports` [EXTRACTED]
- [[rowToBatch()]] - `calls` [EXTRACTED]

## Source
**From** `server/src/entities/datasets/repository.ts` **(starting line 187):**
```typescript
export function getImportBatch(id: string): ImportBatch | undefined {
  const row = db.prepare(`SELECT * FROM dataset_import_batches WHERE id = ?`).get(id);
  return row ? rowToBatch(row) : undefined;
}
```

#graphify/code #graphify/EXTRACTED #community/Ramesh_AI_Query_Engine