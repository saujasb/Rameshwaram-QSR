---
type: community
members: 4
---

# Import Result Types

**Members:** 4 nodes

## Members
- [[ExcelSheetResult]] - code - server/src/entities/datasets/excel.ts
- [[PdfAdaptResult]] - code - server/src/entities/datasets/pdfAdapter.ts
- [[RawRowInput]] - code - server/src/entities/datasets/normalize.ts
- [[SheetImportSummary]] - code - shared-types/datasets.ts

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/Import_Result_Types
SORT file.name ASC
```

## Connections to other communities
- 3 edges to [[_COMMUNITY_Data Coercion Utilities]]
- 3 edges to [[_COMMUNITY_Dataset Import Pipeline]]
- 3 edges to [[_COMMUNITY_PDFFormat Import Adapters]]
- 2 edges to [[_COMMUNITY_Sales Analytics Core]]
- 1 edge to [[_COMMUNITY_Import Center Hooks]]

## Top bridge nodes
- [[SheetImportSummary]] - degree 7, connects to 5 communities
- [[RawRowInput]] - degree 7, connects to 4 communities
- [[ExcelSheetResult]] - degree 3, connects to 1 community
- [[PdfAdaptResult]] - degree 3, connects to 1 community