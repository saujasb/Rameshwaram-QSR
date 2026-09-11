---
source_file: "shared-types/datasets.ts"
type: "code"
community: "Data Explorer & Import UI"
location: "L35"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Data_Explorer__Import_UI
---

# RECORD_FLAG_LABELS

## Connections
- [[DataExplorerPage.tsx]] - `imports` [EXTRACTED]
- [[shared-typesdatasets.ts]] - `contains` [EXTRACTED]

## Source
**From** `shared-types/datasets.ts` **(starting line 35):**
```typescript
export const RECORD_FLAG_LABELS: Record<RecordFlag, string> = {
  missing_timestamp: "No transaction time in source (business date derived from report date)",
  missing_product: "Product/item name missing",
  negative_quantity: "Negative quantity",
  zero_quantity: "Zero quantity",
  negative_value: "Negative sales value",
  invalid_date: "Date could not be parsed",
  unparsed_quantity: "Quantity could not be parsed as a number",
  suspicious_outlier: "Value far outside the rest of the file",
  duplicate_in_file: "Same row appears more than once in this file",
};
```

#graphify/code #graphify/EXTRACTED #community/Data_Explorer__Import_UI