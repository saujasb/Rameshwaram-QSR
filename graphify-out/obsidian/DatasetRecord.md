---
source_file: "shared-types/datasets.ts"
type: "code"
community: "Dataset Import & Normalization Pipeline"
location: "L47"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Dataset_Import__Normalization_Pipeline
---

# DatasetRecord

## Connections
- [[DataExplorerPage.tsx]] - `imports` [EXTRACTED]
- [[datasetsimportPipeline.ts]] - `imports` [EXTRACTED]
- [[datasetsrepository.ts]] - `imports` [EXTRACTED]
- [[normalize.ts]] - `imports` [EXTRACTED]
- [[shared-typesdatasets.ts]] - `contains` [EXTRACTED]

## Source
**From** `shared-types/datasets.ts` **(starting line 47):**
```typescript
export interface DatasetRecord {
  id: string;
  datasetType: DatasetType;

  // --- time. rawTimestamp is NEVER overwritten or synthesized. ---
  /** Original transaction timestamp when the source carries one, else null. */
  rawTimestamp: string | null;
  /** Calendar date as it appears in the source. */
  transactionDate: string | null;
  /** Computed via the business-date engine. Always present. */
  businessDate: string;
  /** The start hour used when computing businessDate, recorded for audit. */
  businessDayStartHour: number;
  /** Clock hour 0-23 from rawTimestamp, or null when the source has no time. */
  hour: number | null;
  shift: string | null;

  // --- dimensions ---
  product: string;
  category: string | null;
  outlet: string | null;
  channel: string | null;

  // --- measures ---
  quantity: number;
  salesValue: number | null;
  /** Wastage reason, when the source provides one. */
  reason: string | null;

  // --- provenance ---
  importBatchId: string;
  sourceFile: string;
  sourceType: SourceType;
  sourceSheet: string | null;
  sourcePage: number | null;
  sourceRow: number | null;
  fingerprint: string;
  flags: RecordFlag[];
  createdAt: string;
  updatedAt: string;
}
```

#graphify/code #graphify/EXTRACTED #community/Dataset_Import__Normalization_Pipeline