---
source_file: "server/src/entities/datasets/repository.ts"
type: "code"
community: "Ramesh AI Query Engine"
location: "L197"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Ramesh_AI_Query_Engine
---

# deleteImportBatch()

## Connections
- [[datasetsrepository.ts]] - `contains` [EXTRACTED]
- [[datasetsroutes.ts]] - `imports` [EXTRACTED]

## Source
**From** `server/src/entities/datasets/repository.ts` **(starting line 197):**
```typescript
export function deleteImportBatch(id: string): boolean {
  const run = db.transaction((batchId: string) => {
    db.prepare(`DELETE FROM dataset_records WHERE importBatchId = ?`).run(batchId);
    return db.prepare(`DELETE FROM dataset_import_batches WHERE id = ?`).run(batchId).changes > 0;
  });
  return run(id);
}
```

#graphify/code #graphify/EXTRACTED #community/Ramesh_AI_Query_Engine