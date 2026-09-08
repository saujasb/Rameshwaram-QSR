---
source_file: "server/src/entities/datasets/repository.ts"
type: "code"
community: "Dataset Import & Normalization Pipeline"
location: "L192"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Dataset_Import__Normalization_Pipeline
---

# findBatchByFileHash()

## Connections
- [[datasetsimportPipeline.ts]] - `imports` [EXTRACTED]
- [[datasetsrepository.ts]] - `contains` [EXTRACTED]
- [[rowToBatch()]] - `calls` [EXTRACTED]
- [[runImport()]] - `calls` [EXTRACTED]

## Source
**From** `server/src/entities/datasets/repository.ts` **(starting line 192):**
```typescript
export function findBatchByFileHash(fileHash: string): ImportBatch | undefined {
  const row = db.prepare(`SELECT * FROM dataset_import_batches WHERE fileHash = ? ORDER BY createdAt DESC LIMIT 1`).get(fileHash);
  return row ? rowToBatch(row) : undefined;
}
```

#graphify/code #graphify/EXTRACTED #community/Dataset_Import__Normalization_Pipeline