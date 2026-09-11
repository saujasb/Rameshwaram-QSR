---
source_file: "server/src/entities/datasets/excel.ts"
type: "code"
community: "Dataset Import & Normalization Pipeline"
location: "L143"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Dataset_Import__Normalization_Pipeline
---

# emptySheet()

## Connections
- [[excel.ts]] - `contains` [EXTRACTED]
- [[parseWorkbook()]] - `calls` [EXTRACTED]

## Source
**From** `server/src/entities/datasets/excel.ts` **(starting line 143):**
```typescript
function emptySheet(sheetName: string, reason: string): ExcelSheetResult {
  return {
    summary: {
      sheetName,
      detectedDatasetType: null,
      detectionConfidence: 0,
      rowsDetected: 0,
      rowsImported: 0,
      rowsRejected: 0,
      columnMappings: [],
      businessDateFrom: null,
      businessDateTo: null,
      skippedReason: reason,
    },
    rows: [],
    formulaCells: 0,
  };
}
```

#graphify/code #graphify/EXTRACTED #community/Dataset_Import__Normalization_Pipeline