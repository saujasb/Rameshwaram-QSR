---
source_file: "server/src/entities/datasets/excel.ts"
type: "code"
community: "Dataset Import & Normalization Pipeline"
location: "L7"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Dataset_Import__Normalization_Pipeline
---

# ExcelSheetResult

## Connections
- [[RawRowInput]] - `references` [EXTRACTED]
- [[SheetImportSummary]] - `references` [EXTRACTED]
- [[excel.ts]] - `contains` [EXTRACTED]

## Source
**From** `server/src/entities/datasets/excel.ts` **(starting line 7):**
```typescript
export interface ExcelSheetResult {
  summary: SheetImportSummary;
  rows: RawRowInput[];
  /** Cells whose text would be executed as a formula by a spreadsheet. */
  formulaCells: number;
}
```

#graphify/code #graphify/EXTRACTED #community/Dataset_Import__Normalization_Pipeline