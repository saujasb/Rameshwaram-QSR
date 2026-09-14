---
type: community
members: 26
---

# Dataset Import Pipeline

**Members:** 26 nodes

## Members
- [[BuildContext]] - code - server/src/entities/datasets/normalize.ts
- [[BuildOutcome]] - code - server/src/entities/datasets/normalize.ts
- [[FLAG_MESSAGES]] - code - server/src/entities/datasets/normalize.ts
- [[FLAG_SEVERITY]] - code - server/src/entities/datasets/normalize.ts
- [[ImportOutcome]] - code - server/src/entities/datasets/importPipeline.ts
- [[ImportQuality]] - code - shared-types/datasets.ts
- [[ImportRequest]] - code - server/src/entities/datasets/importPipeline.ts
- [[QualityInput]] - code - server/src/entities/datasets/normalize.ts
- [[QualityIssue]] - code - shared-types/datasets.ts
- [[RecordFlag]] - code - shared-types/datasets.ts
- [[RejectedRow]] - code - shared-types/datasets.ts
- [[SourceType]] - code - shared-types/datasets.ts
- [[buildRecord()]] - code - server/src/entities/datasets/normalize.ts
- [[datasetsimportPipeline.ts]] - code - server/src/entities/datasets/importPipeline.ts
- [[findBatchByFileHash()]] - code - server/src/entities/datasets/repository.ts
- [[fingerprintFor()]] - code - server/src/entities/datasets/normalize.ts
- [[insertImportBatch()]] - code - server/src/entities/datasets/repository.ts
- [[isDateKey()]] - code - shared-types/businessDate.ts
- [[looksLikePdf()]] - code - server/src/entities/datasets/pdfAdapter.ts
- [[looksLikeSpreadsheet()]] - code - server/src/entities/datasets/excel.ts
- [[normalize.ts]] - code - server/src/entities/datasets/normalize.ts
- [[productKeyOf()_1]] - code - server/src/entities/datasets/coerce.ts
- [[runImport()]] - code - server/src/entities/datasets/importPipeline.ts
- [[scoreQuality()]] - code - server/src/entities/datasets/normalize.ts
- [[severityRank()]] - code - server/src/entities/datasets/normalize.ts
- [[tallyFlags()]] - code - server/src/entities/datasets/normalize.ts

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/Dataset_Import_Pipeline
SORT file.name ASC
```

## Connections to other communities
- 12 edges to [[_COMMUNITY_Sales Analytics Core]]
- 10 edges to [[_COMMUNITY_Dataset Schema & Migrations]]
- 7 edges to [[_COMMUNITY_Data Coercion Utilities]]
- 5 edges to [[_COMMUNITY_Business Day & Sales Trend Charts]]
- 5 edges to [[_COMMUNITY_PDFFormat Import Adapters]]
- 3 edges to [[_COMMUNITY_Import Result Types]]
- 2 edges to [[_COMMUNITY_Import Center Hooks]]
- 2 edges to [[_COMMUNITY_Query Intent Classification]]
- 1 edge to [[_COMMUNITY_Datasets API & Export]]

## Top bridge nodes
- [[datasetsimportPipeline.ts]] - degree 31, connects to 8 communities
- [[normalize.ts]] - degree 25, connects to 6 communities
- [[runImport()]] - degree 14, connects to 4 communities
- [[isDateKey()]] - degree 5, connects to 2 communities
- [[ImportQuality]] - degree 3, connects to 2 communities