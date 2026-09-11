---
source_file: "shared-types/datasets.ts"
type: "code"
community: "Dataset Import & Normalization Pipeline"
location: "L139"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Dataset_Import__Normalization_Pipeline
---

# ImportStatus

## Connections
- [[ImportCenterPage.tsx]] - `imports` [EXTRACTED]
- [[datasetsimportPipeline.ts]] - `imports` [EXTRACTED]
- [[shared-typesdatasets.ts]] - `contains` [EXTRACTED]

## Source
**From** `shared-types/datasets.ts` **(starting line 139):**
```typescript
export type ImportStatus = "passed" | "warning" | "failed";

/** One upload = one ImportBatch, covering every sheet/page inside the file. */
export interface ImportBatch {
  id: string;
  fileName: string;
  fileSizeBytes: number;
  sourceType: SourceType;
  /** sha256 of the file bytes -- catches re-uploading the identical file. */
  fileHash: string;
  datasetTypes: DatasetType[];
  status: ImportStatus;
  businessDateFrom: string | null;
  businessDateTo: string | null;
  recordsFound: number;
  recordsInserted: number;
  recordsUpdated: number;
  duplicatesSkipped: number;
  recordsRejected: number;
  quality: ImportQuality;
  sheets: SheetImportSummary[];
  rejectedRows: RejectedRow[];
  /** Totals the source itself printed, when present, vs what we computed. */
  reconciliation: {
    expectedQuantity: number | null;
    expectedAmount: number | null;
    actualQuantity: number;
    actualAmount: number;
    quantityDiff: number | null;
    amountDiff: number | null;
  } | null;
  businessDayStartHour: number;
  createdAt: string;
}
```

#graphify/code #graphify/EXTRACTED #community/Dataset_Import__Normalization_Pipeline