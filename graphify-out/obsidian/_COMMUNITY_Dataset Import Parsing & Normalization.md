---
type: community
members: 62
---

# Dataset Import Parsing & Normalization

**Members:** 62 nodes

## Members
- [[ALIASES]] - code - server/src/entities/datasets/columnMap.ts
- [[BuildContext]] - code - server/src/entities/datasets/normalize.ts
- [[BuildOutcome]] - code - server/src/entities/datasets/normalize.ts
- [[ColumnMapping]] - code - shared-types/datasets.ts
- [[DATASET_SIGNALS]] - code - server/src/entities/datasets/columnMap.ts
- [[DATE_PATTERNS]] - code - server/src/entities/datasets/coerce.ts
- [[DatasetRecord]] - code - shared-types/datasets.ts
- [[EXCEL_EPOCH_MS]] - code - server/src/entities/datasets/coerce.ts
- [[ExcelParseResult]] - code - server/src/entities/datasets/excel.ts
- [[FLAG_MESSAGES]] - code - server/src/entities/datasets/normalize.ts
- [[FLAG_SEVERITY]] - code - server/src/entities/datasets/normalize.ts
- [[FieldMatch]] - code - server/src/entities/datasets/columnMap.ts
- [[HeaderPlan]] - code - server/src/entities/datasets/columnMap.ts
- [[ImportBatch]] - code - shared-types/datasets.ts
- [[ImportOutcome_1]] - code - server/src/entities/datasets/importPipeline.ts
- [[ImportQuality]] - code - shared-types/datasets.ts
- [[ImportRequest]] - code - server/src/entities/datasets/importPipeline.ts
- [[ImportStatus]] - code - shared-types/datasets.ts
- [[MONTHS]] - code - server/src/entities/datasets/coerce.ts
- [[NormalizedField]] - code - server/src/entities/datasets/columnMap.ts
- [[QualityInput]] - code - server/src/entities/datasets/normalize.ts
- [[QualityIssue]] - code - shared-types/datasets.ts
- [[RELEVANT_BY_DATASET]] - code - server/src/entities/datasets/columnMap.ts
- [[REQUIRED_BY_DATASET]] - code - server/src/entities/datasets/columnMap.ts
- [[RecordFlag]] - code - shared-types/datasets.ts
- [[RejectedRow]] - code - shared-types/datasets.ts
- [[SHEET_NAME_SIGNALS]] - code - server/src/entities/datasets/columnMap.ts
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
- [[findHeaderRow()]] - code - server/src/entities/datasets/columnMap.ts
- [[fingerprintFor()_1]] - code - server/src/entities/datasets/normalize.ts
- [[localIso()]] - code - server/src/entities/datasets/coerce.ts
- [[looksLikeFormula()]] - code - server/src/entities/datasets/coerce.ts
- [[looksLikeSpreadsheet()]] - code - server/src/entities/datasets/excel.ts
- [[matchField()]] - code - server/src/entities/datasets/columnMap.ts
- [[missingRequiredFields()]] - code - server/src/entities/datasets/columnMap.ts
- [[normalize.ts]] - code - server/src/entities/datasets/normalize.ts
- [[parseTextualDate()]] - code - server/src/entities/datasets/coerce.ts
- [[parseWorkbook()]] - code - server/src/entities/datasets/excel.ts
- [[productKeyOf()_1]] - code - server/src/entities/datasets/coerce.ts
- [[scoreQuality()]] - code - server/src/entities/datasets/normalize.ts
- [[severityRank()]] - code - server/src/entities/datasets/normalize.ts
- [[shared-typesdatasets.ts]] - code - shared-types/datasets.ts
- [[tallyFlags()]] - code - server/src/entities/datasets/normalize.ts
- [[validDateParts()]] - code - server/src/entities/datasets/coerce.ts

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/Dataset_Import_Parsing__Normalization
SORT file.name ASC
```

## Connections to other communities
- 21 edges to [[_COMMUNITY_Datasets & Intelligence Analytics (Postgres)]]
- 12 edges to [[_COMMUNITY_Sales Import Pipeline, Parsers & UI]]
- 10 edges to [[_COMMUNITY_Business Date & Settings]]
- 8 edges to [[_COMMUNITY_Ramesh AI Assistant Engine]]
- 5 edges to [[_COMMUNITY_Dataset API Hooks & Data Explorer]]
- 5 edges to [[_COMMUNITY_Intelligence Dashboard UI]]
- 4 edges to [[_COMMUNITY_Import Center Page]]
- 1 edge to [[_COMMUNITY_Server npm Dependencies (ExpressDBFile libs)]]

## Top bridge nodes
- [[shared-typesdatasets.ts]] - degree 40, connects to 7 communities
- [[datasetsimportPipeline.ts]] - degree 31, connects to 4 communities
- [[excel.ts]] - degree 26, connects to 3 communities
- [[normalize.ts]] - degree 25, connects to 3 communities
- [[ImportBatch]] - degree 6, connects to 3 communities