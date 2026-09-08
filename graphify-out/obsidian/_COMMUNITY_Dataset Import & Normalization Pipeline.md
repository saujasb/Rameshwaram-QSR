---
type: community
members: 71
---

# Dataset Import & Normalization Pipeline

**Members:** 71 nodes

## Members
- [[ALIASES]] - code - server/src/entities/datasets/columnMap.ts
- [[BuildContext]] - code - server/src/entities/datasets/normalize.ts
- [[BuildOutcome]] - code - server/src/entities/datasets/normalize.ts
- [[ColumnMapping]] - code - shared-types/datasets.ts
- [[DATASET_SIGNALS]] - code - server/src/entities/datasets/columnMap.ts
- [[DATE_PATTERNS]] - code - server/src/entities/datasets/coerce.ts
- [[DatasetRecord]] - code - shared-types/datasets.ts
- [[DatasetType]] - code - shared-types/datasets.ts
- [[EXCEL_EPOCH_MS]] - code - server/src/entities/datasets/coerce.ts
- [[ExcelParseResult]] - code - server/src/entities/datasets/excel.ts
- [[ExcelSheetResult]] - code - server/src/entities/datasets/excel.ts
- [[FLAG_MESSAGES]] - code - server/src/entities/datasets/normalize.ts
- [[FLAG_SEVERITY]] - code - server/src/entities/datasets/normalize.ts
- [[FieldMatch]] - code - server/src/entities/datasets/columnMap.ts
- [[HeaderPlan]] - code - server/src/entities/datasets/columnMap.ts
- [[ImportOutcome]] - code - server/src/entities/datasets/importPipeline.ts
- [[ImportQuality]] - code - shared-types/datasets.ts
- [[ImportRequest]] - code - server/src/entities/datasets/importPipeline.ts
- [[ImportStatus]] - code - shared-types/datasets.ts
- [[MONTHS_1]] - code - server/src/entities/datasets/coerce.ts
- [[NormalizedField]] - code - server/src/entities/datasets/columnMap.ts
- [[PdfAdaptResult]] - code - server/src/entities/datasets/pdfAdapter.ts
- [[QualityInput]] - code - server/src/entities/datasets/normalize.ts
- [[QualityIssue]] - code - shared-types/datasets.ts
- [[RELEVANT_BY_DATASET]] - code - server/src/entities/datasets/columnMap.ts
- [[REQUIRED_BY_DATASET]] - code - server/src/entities/datasets/columnMap.ts
- [[RawRowInput]] - code - server/src/entities/datasets/normalize.ts
- [[RecordFlag]] - code - shared-types/datasets.ts
- [[RejectedRow]] - code - shared-types/datasets.ts
- [[SHEET_NAME_SIGNALS]] - code - server/src/entities/datasets/columnMap.ts
- [[SheetImportSummary]] - code - shared-types/datasets.ts
- [[SourceRef]] - code - shared-types/datasets.ts
- [[SourceType]] - code - shared-types/datasets.ts
- [[buildHeaderPlan()]] - code - server/src/entities/datasets/columnMap.ts
- [[buildIso()]] - code - server/src/entities/datasets/coerce.ts
- [[buildRecord()]] - code - server/src/entities/datasets/normalize.ts
- [[canonical()]] - code - server/src/entities/datasets/columnMap.ts
- [[coerce.ts]] - code - server/src/entities/datasets/coerce.ts
- [[coerceDateKey()]] - code - server/src/entities/datasets/coerce.ts
- [[coerceNumber()]] - code - server/src/entities/datasets/coerce.ts
- [[coerceText()]] - code - server/src/entities/datasets/coerce.ts
- [[coerceTime()]] - code - server/src/entities/datasets/coerce.ts
- [[coerceTimestamp()]] - code - server/src/entities/datasets/coerce.ts
- [[columnMap.ts]] - code - server/src/entities/datasets/columnMap.ts
- [[datasetsimportPipeline.ts]] - code - server/src/entities/datasets/importPipeline.ts
- [[detectDatasetType()]] - code - server/src/entities/datasets/columnMap.ts
- [[emptySheet()]] - code - server/src/entities/datasets/excel.ts
- [[excel.ts]] - code - server/src/entities/datasets/excel.ts
- [[excelSerialToDate()]] - code - server/src/entities/datasets/coerce.ts
- [[extractRows()]] - code - server/src/entities/datasets/excel.ts
- [[findBatchByFileHash()]] - code - server/src/entities/datasets/repository.ts
- [[findHeaderRow()]] - code - server/src/entities/datasets/columnMap.ts
- [[fingerprintFor()]] - code - server/src/entities/datasets/normalize.ts
- [[insertImportBatch()]] - code - server/src/entities/datasets/repository.ts
- [[isDateKey()]] - code - shared-types/businessDate.ts
- [[localIso()]] - code - server/src/entities/datasets/coerce.ts
- [[looksLikeFormula()]] - code - server/src/entities/datasets/coerce.ts
- [[looksLikePdf()]] - code - server/src/entities/datasets/pdfAdapter.ts
- [[looksLikeSpreadsheet()]] - code - server/src/entities/datasets/excel.ts
- [[matchField()]] - code - server/src/entities/datasets/columnMap.ts
- [[missingRequiredFields()]] - code - server/src/entities/datasets/columnMap.ts
- [[normalize.ts]] - code - server/src/entities/datasets/normalize.ts
- [[parseTextualDate()]] - code - server/src/entities/datasets/coerce.ts
- [[parseWorkbook()]] - code - server/src/entities/datasets/excel.ts
- [[productKeyOf()_1]] - code - server/src/entities/datasets/coerce.ts
- [[runImport()]] - code - server/src/entities/datasets/importPipeline.ts
- [[scoreQuality()]] - code - server/src/entities/datasets/normalize.ts
- [[severityRank()]] - code - server/src/entities/datasets/normalize.ts
- [[shared-typesdatasets.ts]] - code - shared-types/datasets.ts
- [[tallyFlags()]] - code - server/src/entities/datasets/normalize.ts
- [[validDateParts()]] - code - server/src/entities/datasets/coerce.ts

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/Dataset_Import__Normalization_Pipeline
SORT file.name ASC
```

## Connections to other communities
- 24 edges to [[_COMMUNITY_Business Intelligence Engine]]
- 24 edges to [[_COMMUNITY_Ramesh AI Query Engine]]
- 20 edges to [[_COMMUNITY_Data Explorer & Import UI]]
- 9 edges to [[_COMMUNITY_Sales Import Parsing Pipeline]]
- 4 edges to [[_COMMUNITY_Ramesh Intent Classification]]

## Top bridge nodes
- [[shared-typesdatasets.ts]] - degree 40, connects to 5 communities
- [[datasetsimportPipeline.ts]] - degree 31, connects to 4 communities
- [[DatasetType]] - degree 27, connects to 4 communities
- [[normalize.ts]] - degree 25, connects to 3 communities
- [[runImport()]] - degree 14, connects to 3 communities