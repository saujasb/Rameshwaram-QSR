---
source_file: "shared-types/datasets.ts"
type: "code"
community: "Dataset Import & Normalization Pipeline"
location: "L119"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Dataset_Import__Normalization_Pipeline
---

# ColumnMapping

## Connections
- [[FieldMatch]] - `references` [EXTRACTED]
- [[HeaderPlan]] - `references` [EXTRACTED]
- [[columnMap.ts]] - `imports` [EXTRACTED]
- [[shared-typesdatasets.ts]] - `contains` [EXTRACTED]

## Source
**From** `shared-types/datasets.ts` **(starting line 119):**
```typescript
export interface ColumnMapping {
  normalizedField: string;
  sourceColumn: string | null;
  confidence: number;
  matchedBy: "exact" | "alias" | "fuzzy" | "inferred" | "unmatched";
}
```

#graphify/code #graphify/EXTRACTED #community/Dataset_Import__Normalization_Pipeline