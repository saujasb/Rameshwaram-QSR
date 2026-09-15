---
source_file: "server/src/entities/datasets/importPipeline.ts"
type: "code"
community: "Dataset Import Parsing & Normalization"
location: "L1"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Dataset_Import_Parsing__Normalization
---

# datasets/importPipeline.ts

## Connections
- [[DatasetRecord]] - `imports` [EXTRACTED]
- [[DatasetType]] - `imports` [EXTRACTED]
- [[ImportBatch]] - `imports` [EXTRACTED]
- [[ImportOutcome_1]] - `contains` [EXTRACTED]
- [[ImportRequest]] - `contains` [EXTRACTED]
- [[ImportStatus]] - `imports` [EXTRACTED]
- [[QualityIssue]] - `imports` [EXTRACTED]
- [[RawRowInput]] - `imports` [EXTRACTED]
- [[RejectedRow]] - `imports` [EXTRACTED]
- [[SheetImportSummary]] - `imports` [EXTRACTED]
- [[SourceType]] - `imports` [EXTRACTED]
- [[adaptPdf()]] - `imports` [EXTRACTED]
- [[buildRecord()]] - `imports` [EXTRACTED]
- [[businessDate.ts]] - `imports_from` [EXTRACTED]
- [[datasetsrepository.ts]] - `imports_from` [EXTRACTED]
- [[datasetsroutes.ts]] - `imports_from` [EXTRACTED]
- [[excel.ts]] - `imports_from` [EXTRACTED]
- [[findBatchByFileHash()]] - `imports` [EXTRACTED]
- [[getBusinessDayStartHour()]] - `imports` [EXTRACTED]
- [[insertImportBatch()]] - `imports` [EXTRACTED]
- [[isDateKey()]] - `imports` [EXTRACTED]
- [[looksLikePdf()]] - `imports` [EXTRACTED]
- [[looksLikeSpreadsheet()]] - `imports` [EXTRACTED]
- [[normalize.ts]] - `imports_from` [EXTRACTED]
- [[parseWorkbook()]] - `imports` [EXTRACTED]
- [[pdfAdapter.ts]] - `imports_from` [EXTRACTED]
- [[runImport()]] - `contains` [EXTRACTED]
- [[scoreQuality()]] - `imports` [EXTRACTED]
- [[shared-typesdatasets.ts]] - `imports_from` [EXTRACTED]
- [[tallyFlags()]] - `imports` [EXTRACTED]
- [[upsertRecords()]] - `imports` [EXTRACTED]

#graphify/code #graphify/EXTRACTED #community/Dataset_Import_Parsing__Normalization