---
source_file: "server/src/entities/datasets/normalize.ts"
type: "code"
community: "Dataset Import & Normalization Pipeline"
location: "L256"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Dataset_Import__Normalization_Pipeline
---

# tallyFlags()

## Connections
- [[datasetsimportPipeline.ts]] - `imports` [EXTRACTED]
- [[normalize.ts]] - `contains` [EXTRACTED]
- [[runImport()]] - `calls` [EXTRACTED]

## Source
**From** `server/src/entities/datasets/normalize.ts` **(starting line 256):**
```typescript
export function tallyFlags(records: DatasetRecord[]): Partial<Record<RecordFlag, number>> {
  const counts: Partial<Record<RecordFlag, number>> = {};
  for (const r of records) {
    for (const f of r.flags) counts[f] = (counts[f] ?? 0) + 1;
  }
  return counts;
}
```

#graphify/code #graphify/EXTRACTED #community/Dataset_Import__Normalization_Pipeline