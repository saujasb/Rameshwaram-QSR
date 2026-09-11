---
source_file: "server/src/entities/datasets/importPipeline.ts"
type: "code"
community: "Dataset Import & Normalization Pipeline"
location: "L29"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Dataset_Import__Normalization_Pipeline
---

# ImportOutcome

## Connections
- [[datasetsimportPipeline.ts]] - `contains` [EXTRACTED]

## Source
**From** `server/src/entities/datasets/importPipeline.ts` **(starting line 29):**
```typescript
export type ImportOutcome =
  | { ok: true; batch: ImportBatch }
```

#graphify/code #graphify/EXTRACTED #community/Dataset_Import__Normalization_Pipeline