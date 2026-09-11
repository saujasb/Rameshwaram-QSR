---
source_file: "server/src/entities/datasets/normalize.ts"
type: "code"
community: "Dataset Import & Normalization Pipeline"
location: "L169"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Dataset_Import__Normalization_Pipeline
---

# QualityInput

## Connections
- [[QualityIssue]] - `references` [EXTRACTED]
- [[RecordFlag]] - `references` [EXTRACTED]
- [[normalize.ts]] - `contains` [EXTRACTED]

## Source
**From** `server/src/entities/datasets/normalize.ts` **(starting line 169):**
```typescript
export interface QualityInput {
  rowsDetected: number;
  rowsInserted: number;
  rowsUpdated: number;
  rowsDuplicate: number;
  rowsRejected: number;
  flagCounts: Partial<Record<RecordFlag, number>>;
  mappingConfidencePct: number;
  extraIssues?: QualityIssue[];
}
```

#graphify/code #graphify/EXTRACTED #community/Dataset_Import__Normalization_Pipeline