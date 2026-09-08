---
source_file: "shared-types/datasets.ts"
type: "code"
community: "Data Explorer & Import UI"
location: "L142"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Data_Explorer__Import_UI
---

# ImportBatch

## Connections
- [[ImportCenterPage.tsx]] - `imports` [EXTRACTED]
- [[ImportFileResult]] - `references` [EXTRACTED]
- [[apidatasets.ts]] - `imports` [EXTRACTED]
- [[datasetsimportPipeline.ts]] - `imports` [EXTRACTED]
- [[datasetsrepository.ts]] - `imports` [EXTRACTED]
- [[insights.ts]] - `imports` [EXTRACTED]
- [[shared-typesdatasets.ts]] - `contains` [EXTRACTED]

## Source
**From** `shared-types/datasets.ts` **(starting line 142):**
```typescript
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

#graphify/code #graphify/EXTRACTED #community/Data_Explorer__Import_UI