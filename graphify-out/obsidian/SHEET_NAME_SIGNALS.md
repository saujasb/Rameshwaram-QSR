---
source_file: "server/src/entities/datasets/columnMap.ts"
type: "code"
community: "Dataset Import & Normalization Pipeline"
location: "L40"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Dataset_Import__Normalization_Pipeline
---

# SHEET_NAME_SIGNALS

## Connections
- [[columnMap.ts]] - `contains` [EXTRACTED]

## Source
**From** `server/src/entities/datasets/columnMap.ts` **(starting line 40):**
```typescript
const SHEET_NAME_SIGNALS: Record<DatasetType, RegExp> = {
  sales: /\b(sales|revenue|bill|invoice|sold)\b/i,
  production: /\b(production|produced|prep|prepared|output)\b/i,
  wastage: /\b(wastage|waste|spoilage|discard|dump)\b/i,
};
```

#graphify/code #graphify/EXTRACTED #community/Dataset_Import__Normalization_Pipeline