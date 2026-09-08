---
source_file: "server/src/entities/datasets/normalize.ts"
type: "code"
community: "Dataset Import & Normalization Pipeline"
location: "L192"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Dataset_Import__Normalization_Pipeline
---

# FLAG_MESSAGES

## Connections
- [[normalize.ts]] - `contains` [EXTRACTED]

## Source
**From** `server/src/entities/datasets/normalize.ts` **(starting line 192):**
```typescript
const FLAG_MESSAGES: Record<RecordFlag, string> = {
  missing_timestamp: "row(s) had no transaction time; business date taken from the report/row date",
  missing_product: "row(s) missing a product name",
  negative_quantity: "row(s) had a negative quantity",
  zero_quantity: "row(s) had a zero quantity",
  negative_value: "row(s) had a negative value",
  invalid_date: "row(s) had an unparseable date",
  unparsed_quantity: "row(s) had a non-numeric quantity",
  suspicious_outlier: "row(s) look far outside the rest of the file",
  duplicate_in_file: "row(s) repeat inside this same file",
};
```

#graphify/code #graphify/EXTRACTED #community/Dataset_Import__Normalization_Pipeline