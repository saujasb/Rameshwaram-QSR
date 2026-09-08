---
source_file: "server/src/entities/datasets/columnMap.ts"
type: "code"
community: "Dataset Import & Normalization Pipeline"
location: "L134"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Dataset_Import__Normalization_Pipeline
---

# missingRequiredFields()

## Connections
- [[columnMap.ts]] - `contains` [EXTRACTED]
- [[excel.ts]] - `imports` [EXTRACTED]
- [[parseWorkbook()]] - `calls` [EXTRACTED]

## Source
**From** `server/src/entities/datasets/columnMap.ts` **(starting line 134):**
```typescript
export function missingRequiredFields(plan: HeaderPlan, datasetType: DatasetType): NormalizedField[] {
  return REQUIRED_BY_DATASET[datasetType].filter((f) => plan.indexes[f] == null);
}
```

#graphify/code #graphify/EXTRACTED #community/Dataset_Import__Normalization_Pipeline