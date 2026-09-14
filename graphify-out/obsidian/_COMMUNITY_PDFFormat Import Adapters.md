---
type: community
members: 33
---

# PDF/Format Import Adapters

**Members:** 33 nodes

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
- [[TextItem]] - code - server/src/entities/sales/pdfExtract.ts
- [[adaptPdf()]] - code - server/src/entities/datasets/pdfAdapter.ts
- [[approxEqual()]] - code - server/src/entities/sales/numbers.ts
- [[detectFormat()]] - code - server/src/entities/sales/detectFormat.ts
- [[detectFormat.ts]] - code - server/src/entities/sales/detectFormat.ts
- [[extractPdfRows()]] - code - server/src/entities/sales/pdfExtract.ts
- [[groupIntoRows()]] - code - server/src/entities/sales/pdfExtract.ts
- [[insertImportBatch()_1]] - code - server/src/entities/sales/repository.ts
- [[isValueHeader()]] - code - server/src/entities/sales/parsers/petpooja.ts
- [[kiosk.ts]] - code - server/src/entities/sales/parsers/kiosk.ts
- [[lastTwoNumbers()]] - code - server/src/entities/sales/parsers/petpooja.ts
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
- [[runSalesImport()]] - code - server/src/entities/sales/importPipeline.ts
- [[salesimportPipeline.ts]] - code - server/src/entities/sales/importPipeline.ts
- [[sumItems()]] - code - server/src/entities/sales/parseTypes.ts

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/PDF/Format_Import_Adapters
SORT file.name ASC
```

## Connections to other communities
- 8 edges to [[_COMMUNITY_Sales Database Repository]]
- 7 edges to [[_COMMUNITY_Sales Data Hooks]]
- 5 edges to [[_COMMUNITY_Dataset Import Pipeline]]
- 3 edges to [[_COMMUNITY_Import Result Types]]
- 3 edges to [[_COMMUNITY_Business Day & Sales Trend Charts]]
- 1 edge to [[_COMMUNITY_Sales Analytics Core]]

## Top bridge nodes
- [[salesimportPipeline.ts]] - degree 25, connects to 3 communities
- [[pdfAdapter.ts]] - degree 18, connects to 3 communities
- [[runSalesImport()]] - degree 11, connects to 2 communities
- [[SalesChannel]] - degree 7, connects to 2 communities
- [[parserspetpooja.ts]] - degree 16, connects to 1 community