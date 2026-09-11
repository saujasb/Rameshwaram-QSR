---
source_file: "server/src/entities/sales/importPipeline.ts"
type: "code"
community: "Sales Import Parsing Pipeline"
location: "L1"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Sales_Import_Parsing_Pipeline
---

# sales/importPipeline.ts

## Connections
- [[CandidateLineItem]] - `imports` [EXTRACTED]
- [[ImportOptions]] - `contains` [EXTRACTED]
- [[ImportOutcome_1]] - `contains` [EXTRACTED]
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

## Source
**From** `server/src/entities/sales/importPipeline.ts` **(starting line 1):**
```typescript
import { randomUUID } from "node:crypto";
```

#graphify/code #graphify/EXTRACTED #community/Sales_Import_Parsing_Pipeline