---
source_file: "server/src/entities/datasets/columnMap.ts"
type: "code"
community: "Dataset Import & Normalization Pipeline"
location: "L8"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Dataset_Import__Normalization_Pipeline
---

# NormalizedField

## Connections
- [[columnMap.ts]] - `contains` [EXTRACTED]
- [[excel.ts]] - `imports` [EXTRACTED]

## Source
**From** `server/src/entities/datasets/columnMap.ts` **(starting line 8):**
```typescript
export type NormalizedField =
  | "timestamp"
  | "date"
  | "time"
  | "product"
  | "category"
  | "quantity"
  | "salesValue"
  | "outlet"
  | "shift"
  | "reason";
```

#graphify/code #graphify/EXTRACTED #community/Dataset_Import__Normalization_Pipeline