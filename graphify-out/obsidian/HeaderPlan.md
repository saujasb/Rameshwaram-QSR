---
source_file: "server/src/entities/datasets/columnMap.ts"
type: "code"
community: "Dataset Import & Normalization Pipeline"
location: "L92"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Dataset_Import__Normalization_Pipeline
---

# HeaderPlan

## Connections
- [[ColumnMapping]] - `references` [EXTRACTED]
- [[columnMap.ts]] - `contains` [EXTRACTED]
- [[excel.ts]] - `imports` [EXTRACTED]

## Source
**From** `server/src/entities/datasets/columnMap.ts` **(starting line 92):**
```typescript
export interface HeaderPlan {
  indexes: Partial<Record<NormalizedField, number>>;
  mappings: ColumnMapping[];
  /** 0-100 average confidence across the fields that matter for this dataset. */
  mappingConfidencePct: number;
}
```

#graphify/code #graphify/EXTRACTED #community/Dataset_Import__Normalization_Pipeline