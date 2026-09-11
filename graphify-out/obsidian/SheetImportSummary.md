---
source_file: "shared-types/datasets.ts"
type: "code"
community: "Dataset Import & Normalization Pipeline"
location: "L126"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Dataset_Import__Normalization_Pipeline
---

# SheetImportSummary

## Connections
- [[ExcelSheetResult]] - `references` [EXTRACTED]
- [[ImportCenterPage.tsx]] - `imports` [EXTRACTED]
- [[PdfAdaptResult]] - `references` [EXTRACTED]
- [[datasetsimportPipeline.ts]] - `imports` [EXTRACTED]
- [[excel.ts]] - `imports` [EXTRACTED]
- [[pdfAdapter.ts]] - `imports` [EXTRACTED]
- [[shared-typesdatasets.ts]] - `contains` [EXTRACTED]

## Source
**From** `shared-types/datasets.ts` **(starting line 126):**
```typescript
export interface SheetImportSummary {
  sheetName: string;
  detectedDatasetType: DatasetType | null;
  detectionConfidence: number;
  rowsDetected: number;
  rowsImported: number;
  rowsRejected: number;
  columnMappings: ColumnMapping[];
  businessDateFrom: string | null;
  businessDateTo: string | null;
  skippedReason: string | null;
}
```

#graphify/code #graphify/EXTRACTED #community/Dataset_Import__Normalization_Pipeline