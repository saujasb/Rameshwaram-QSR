---
source_file: "shared-types/datasets.ts"
type: "code"
community: "Dataset Import & Normalization Pipeline"
location: "L24"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Dataset_Import__Normalization_Pipeline
---

# RecordFlag

## Connections
- [[QualityInput]] - `references` [EXTRACTED]
- [[normalize.ts]] - `imports` [EXTRACTED]
- [[shared-typesdatasets.ts]] - `contains` [EXTRACTED]

## Source
**From** `shared-types/datasets.ts` **(starting line 24):**
```typescript
export type RecordFlag =
  | "missing_timestamp"
  | "missing_product"
  | "negative_quantity"
  | "zero_quantity"
  | "negative_value"
  | "invalid_date"
  | "unparsed_quantity"
  | "suspicious_outlier"
  | "duplicate_in_file";
```

#graphify/code #graphify/EXTRACTED #community/Dataset_Import__Normalization_Pipeline