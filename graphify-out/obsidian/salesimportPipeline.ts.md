---
source_file: "server/src/entities/sales/importPipeline.ts"
type: "code"
community: "Sales Import Pipeline, Parsers & UI"
location: "L1"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Sales_Import_Pipeline_Parsers__UI
---

# sales/importPipeline.ts

## Connections
- [[CandidateLineItem]] - `imports` [EXTRACTED]
- [[ImportOptions]] - `contains` [EXTRACTED]
- [[ImportOutcome]] - `contains` [EXTRACTED]
- [[ImportValidationStatus]] - `imports` [EXTRACTED]
- [[SalesImportBatch]] - `imports` [EXTRACTED]
- [[approxEqual()]] - `imports` [EXTRACTED]
- [[businessDate.ts]] - `imports_from` [EXTRACTED]
- [[detectFormat()]] - `imports` [EXTRACTED]
- [[detectFormat.ts]] - `imports_from` [EXTRACTED]
- [[extractPdfRows()]] - `imports` [EXTRACTED]
- [[getBusinessDayBounds()]] - `imports` [EXTRACTED]
- [[insertImportBatch()_1]] - `imports` [EXTRACTED]
- [[kiosk.ts]] - `imports_from` [EXTRACTED]
- [[numbers.ts]] - `imports_from` [EXTRACTED]
- [[parseKiosk()]] - `imports` [EXTRACTED]
- [[parsePetpooja()]] - `imports` [EXTRACTED]
- [[parseTypes.ts]] - `imports_from` [EXTRACTED]
- [[parserspetpooja.ts]] - `imports_from` [EXTRACTED]
- [[pdfExtract.ts]] - `imports_from` [EXTRACTED]
- [[runSalesImport()]] - `contains` [EXTRACTED]
- [[salesrepository.ts]] - `imports_from` [EXTRACTED]
- [[salesroutes.ts]] - `imports_from` [EXTRACTED]
- [[shared-typessales.ts]] - `imports_from` [EXTRACTED]
- [[sumItems()]] - `imports` [EXTRACTED]
- [[upsertLineItems()]] - `imports` [EXTRACTED]

#graphify/code #graphify/EXTRACTED #community/Sales_Import_Pipeline_Parsers__UI