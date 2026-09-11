---
source_file: "server/src/entities/datasets/columnMap.ts"
type: "code"
community: "Dataset Import & Normalization Pipeline"
location: "L34"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Dataset_Import__Normalization_Pipeline
---

# DATASET_SIGNALS

## Connections
- [[columnMap.ts]] - `contains` [EXTRACTED]

## Source
**From** `server/src/entities/datasets/columnMap.ts` **(starting line 34):**
```typescript
const DATASET_SIGNALS: Record<DatasetType, string[]> = {
  sales: ["sales", "revenue", "amount", "bill", "invoice", "sold", "order"],
  production: ["production", "produced", "prepared", "prep", "batch", "output", "made"],
  wastage: ["wastage", "waste", "wasted", "spoilage", "discard", "dump", "reason"],
};
```

#graphify/code #graphify/EXTRACTED #community/Dataset_Import__Normalization_Pipeline