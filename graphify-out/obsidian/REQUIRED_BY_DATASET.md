---
source_file: "server/src/entities/datasets/columnMap.ts"
type: "code"
community: "Dataset Import & Normalization Pipeline"
location: "L100"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Dataset_Import__Normalization_Pipeline
---

# REQUIRED_BY_DATASET

## Connections
- [[columnMap.ts]] - `contains` [EXTRACTED]

## Source
**From** `server/src/entities/datasets/columnMap.ts` **(starting line 100):**
```typescript
const REQUIRED_BY_DATASET: Record<DatasetType, NormalizedField[]> = {
  sales: ["product", "quantity"],
  production: ["product", "quantity"],
  wastage: ["product", "quantity"],
};
```

#graphify/code #graphify/EXTRACTED #community/Dataset_Import__Normalization_Pipeline