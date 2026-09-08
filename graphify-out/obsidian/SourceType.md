---
source_file: "shared-types/datasets.ts"
type: "code"
community: "Dataset Import & Normalization Pipeline"
location: "L7"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Dataset_Import__Normalization_Pipeline
---

# SourceType

## Connections
- [[BuildContext]] - `references` [EXTRACTED]
- [[datasetsimportPipeline.ts]] - `imports` [EXTRACTED]
- [[normalize.ts]] - `imports` [EXTRACTED]
- [[shared-typesdatasets.ts]] - `contains` [EXTRACTED]

## Source
**From** `shared-types/datasets.ts` **(starting line 7):**
```typescript
export type SourceType = "pdf" | "excel";

export const DATASET_LABELS: Record<DatasetType, string> = {
  sales: "Sales",
  production: "Production",
  wastage: "Wastage",
};
```

#graphify/code #graphify/EXTRACTED #community/Dataset_Import__Normalization_Pipeline