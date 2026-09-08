---
source_file: "shared-types/datasets.ts"
type: "code"
community: "Dataset Import & Normalization Pipeline"
location: "L104"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Dataset_Import__Normalization_Pipeline
---

# ImportQuality

## Connections
- [[ImportCenterPage.tsx]] - `imports` [EXTRACTED]
- [[normalize.ts]] - `imports` [EXTRACTED]
- [[shared-typesdatasets.ts]] - `contains` [EXTRACTED]

## Source
**From** `shared-types/datasets.ts` **(starting line 104):**
```typescript
export interface ImportQuality {
  /** 0-100. Share of detected rows that imported cleanly, penalized by flags. */
  confidencePct: number;
  /** 0-100. How confident the column/dataset detection was (Excel). 100 for known PDF layouts. */
  mappingConfidencePct: number;
  rowsDetected: number;
  rowsValid: number;
  rowsFlagged: number;
  rowsRejected: number;
  rowsDuplicate: number;
  rowsMissingTimestamp: number;
  issues: QualityIssue[];
}
```

#graphify/code #graphify/EXTRACTED #community/Dataset_Import__Normalization_Pipeline