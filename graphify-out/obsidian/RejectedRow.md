---
source_file: "shared-types/datasets.ts"
type: "code"
community: "Dataset Import & Normalization Pipeline"
location: "L90"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Dataset_Import__Normalization_Pipeline
---

# RejectedRow

## Connections
- [[datasetsimportPipeline.ts]] - `imports` [EXTRACTED]
- [[shared-typesdatasets.ts]] - `contains` [EXTRACTED]

## Source
**From** `shared-types/datasets.ts` **(starting line 90):**
```typescript
export interface RejectedRow {
  sourceSheet: string | null;
  sourceRow: number | null;
  reason: string;
  raw: string;
}
```

#graphify/code #graphify/EXTRACTED #community/Dataset_Import__Normalization_Pipeline