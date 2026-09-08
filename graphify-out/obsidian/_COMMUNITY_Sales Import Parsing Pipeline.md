---
type: community
members: 58
---

# Sales Import Parsing Pipeline

**Members:** 58 nodes

## Members
- [[CandidateLineItem]] - code - server/src/entities/sales/repository.ts
- [[DetectedFormat]] - code - server/src/entities/sales/detectFormat.ts
- [[ImportOptions]] - code - server/src/entities/sales/importPipeline.ts
- [[ImportOutcome_1]] - code - server/src/entities/sales/importPipeline.ts
- [[ParsedLineItem]] - code - server/src/entities/sales/parseTypes.ts
- [[ParsedReport]] - code - server/src/entities/sales/parseTypes.ts
- [[ParsedSubtotalCheck]] - code - server/src/entities/sales/parseTypes.ts
- [[STAT_LABELS]] - code - server/src/entities/sales/parsers/petpooja.ts
- [[SalesChannel]] - code - shared-types/sales.ts
- [[SalesFilter]] - code - server/src/entities/sales/repository.ts
- [[TextItem]] - code - server/src/entities/sales/pdfExtract.ts
- [[UpsertResult_1]] - code - server/src/entities/sales/repository.ts
- [[adaptPdf()]] - code - server/src/entities/datasets/pdfAdapter.ts
- [[approxEqual()]] - code - server/src/entities/sales/numbers.ts
- [[deleteImportBatch()_1]] - code - server/src/entities/sales/repository.ts
- [[detectFormat()]] - code - server/src/entities/sales/detectFormat.ts
- [[detectFormat.ts]] - code - server/src/entities/sales/detectFormat.ts
- [[ensureSalesTables()]] - code - server/src/entities/sales/db.ts
- [[extractPdfRows()]] - code - server/src/entities/sales/pdfExtract.ts
- [[findByFingerprint_1]] - code - server/src/entities/sales/repository.ts
- [[fingerprintFor()_1]] - code - server/src/entities/sales/repository.ts
- [[getBusinessDayBounds()]] - code - shared-types/businessDate.ts
- [[getDailyTarget()]] - code - server/src/entities/sales/repository.ts
- [[getImportBatch()_1]] - code - server/src/entities/sales/repository.ts
- [[getSalesSummary()]] - code - server/src/entities/sales/repository.ts
- [[groupIntoRows()]] - code - server/src/entities/sales/pdfExtract.ts
- [[insertBatchStmt]] - code - server/src/entities/sales/repository.ts
- [[insertImportBatch()_1]] - code - server/src/entities/sales/repository.ts
- [[insertLineItemStmt]] - code - server/src/entities/sales/repository.ts
- [[isValueHeader()]] - code - server/src/entities/sales/parsers/petpooja.ts
- [[kiosk.ts]] - code - server/src/entities/sales/parsers/kiosk.ts
- [[lastTwoNumbers()]] - code - server/src/entities/sales/parsers/petpooja.ts
- [[listImportBatches()_1]] - code - server/src/entities/sales/repository.ts
- [[listLineItems()]] - code - server/src/entities/sales/repository.ts
- [[normalizeKey()]] - code - server/src/entities/sales/repository.ts
- [[numbers.ts]] - code - server/src/entities/sales/numbers.ts
- [[parseDateRange()]] - code - server/src/entities/sales/parsers/petpooja.ts
- [[parseKiosk()]] - code - server/src/entities/sales/parsers/kiosk.ts
- [[parseNumber()]] - code - server/src/entities/sales/numbers.ts
- [[parsePetpooja()]] - code - server/src/entities/sales/parsers/petpooja.ts
- [[parseTypes.ts]] - code - server/src/entities/sales/parseTypes.ts
- [[parserspetpooja.ts]] - code - server/src/entities/sales/parsers/petpooja.ts
- [[pdfAdapter.ts]] - code - server/src/entities/datasets/pdfAdapter.ts
- [[pdfExtract.ts]] - code - server/src/entities/sales/pdfExtract.ts
- [[round2()_3]] - code - server/src/entities/sales/numbers.ts
- [[rowToBatch()_1]] - code - server/src/entities/sales/repository.ts
- [[runSalesImport()]] - code - server/src/entities/sales/importPipeline.ts
- [[salesdb.ts]] - code - server/src/entities/sales/db.ts
- [[salesimportPipeline.ts]] - code - server/src/entities/sales/importPipeline.ts
- [[salesrepository.ts]] - code - server/src/entities/sales/repository.ts
- [[salesroutes.ts]] - code - server/src/entities/sales/routes.ts
- [[salesRouter]] - code - server/src/entities/sales/routes.ts
- [[setDailyTarget()]] - code - server/src/entities/sales/repository.ts
- [[sumItems()]] - code - server/src/entities/sales/parseTypes.ts
- [[updateLineItemStmt]] - code - server/src/entities/sales/repository.ts
- [[upload_1]] - code - server/src/entities/sales/routes.ts
- [[upsertLineItems()]] - code - server/src/entities/sales/repository.ts
- [[whereClause()]] - code - server/src/entities/sales/repository.ts

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/Sales_Import_Parsing_Pipeline
SORT file.name ASC
```

## Connections to other communities
- 11 edges to [[_COMMUNITY_Sales Import UI]]
- 9 edges to [[_COMMUNITY_Dataset Import & Normalization Pipeline]]
- 6 edges to [[_COMMUNITY_Generic CRUD Backend]]
- 2 edges to [[_COMMUNITY_Ramesh AI Query Engine]]
- 2 edges to [[_COMMUNITY_Business Intelligence Engine]]
- 1 edge to [[_COMMUNITY_Dashboard & Sales Trend Visualization]]
- 1 edge to [[_COMMUNITY_Data Explorer & Import UI]]

## Top bridge nodes
- [[salesrepository.ts]] - degree 33, connects to 3 communities
- [[getBusinessDayBounds()]] - degree 5, connects to 3 communities
- [[salesimportPipeline.ts]] - degree 25, connects to 2 communities
- [[pdfAdapter.ts]] - degree 18, connects to 1 community
- [[parserspetpooja.ts]] - degree 16, connects to 1 community