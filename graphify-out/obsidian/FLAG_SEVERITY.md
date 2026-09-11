---
source_file: "server/src/entities/datasets/normalize.ts"
type: "code"
community: "Dataset Import & Normalization Pipeline"
location: "L180"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Dataset_Import__Normalization_Pipeline
---

# FLAG_SEVERITY

## Connections
- [[normalize.ts]] - `contains` [EXTRACTED]

## Source
**From** `server/src/entities/datasets/normalize.ts` **(starting line 180):**
```typescript
const FLAG_SEVERITY: Record<RecordFlag, "error" | "warning" | "info"> = {
  missing_timestamp: "info",
  missing_product: "error",
  negative_quantity: "warning",
  zero_quantity: "info",
  negative_value: "warning",
  invalid_date: "error",
  unparsed_quantity: "error",
  suspicious_outlier: "warning",
  duplicate_in_file: "warning",
};
```

#graphify/code #graphify/EXTRACTED #community/Dataset_Import__Normalization_Pipeline