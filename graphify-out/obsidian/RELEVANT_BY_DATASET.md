---
source_file: "server/src/entities/datasets/columnMap.ts"
type: "code"
community: "Dataset Import & Normalization Pipeline"
location: "L106"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Dataset_Import__Normalization_Pipeline
---

# RELEVANT_BY_DATASET

## Connections
- [[columnMap.ts]] - `contains` [EXTRACTED]

## Source
**From** `server/src/entities/datasets/columnMap.ts` **(starting line 106):**
```typescript
const RELEVANT_BY_DATASET: Record<DatasetType, NormalizedField[]> = {
  sales: ["timestamp", "date", "time", "product", "category", "quantity", "salesValue", "outlet", "shift"],
  production: ["timestamp", "date", "time", "product", "category", "quantity", "outlet", "shift"],
  wastage: ["timestamp", "date", "time", "product", "category", "quantity", "reason", "outlet", "shift"],
};
```

#graphify/code #graphify/EXTRACTED #community/Dataset_Import__Normalization_Pipeline