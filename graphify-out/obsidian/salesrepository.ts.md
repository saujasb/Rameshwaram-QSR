---
source_file: "server/src/entities/sales/repository.ts"
type: "code"
community: "Sales Import Pipeline, Parsers & UI"
location: "L1"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Sales_Import_Pipeline_Parsers__UI
---

# sales/repository.ts

## Connections
- [[CandidateLineItem]] - `contains` [EXTRACTED]
- [[SalesChannel]] - `imports` [EXTRACTED]
- [[SalesFilter]] - `contains` [EXTRACTED]
- [[SalesImportBatch]] - `imports` [EXTRACTED]
- [[SalesLineItem]] - `imports` [EXTRACTED]
- [[SalesSummary]] - `imports` [EXTRACTED]
- [[UpsertResult_1]] - `contains` [EXTRACTED]
- [[deleteImportBatch()_1]] - `contains` [EXTRACTED]
- [[fingerprintFor()]] - `contains` [EXTRACTED]
- [[getDailyTarget()]] - `contains` [EXTRACTED]
- [[getImportBatch()_1]] - `contains` [EXTRACTED]
- [[getSalesSummary()]] - `contains` [EXTRACTED]
- [[insertImportBatch()_1]] - `contains` [EXTRACTED]
- [[listImportBatches()_1]] - `contains` [EXTRACTED]
- [[listLineItems()]] - `contains` [EXTRACTED]
- [[normalizeKey()]] - `contains` [EXTRACTED]
- [[pg.ts]] - `imports_from` [EXTRACTED]
- [[query()]] - `imports` [EXTRACTED]
- [[queryOne()]] - `imports` [EXTRACTED]
- [[rowToBatch()_1]] - `contains` [EXTRACTED]
- [[salesimportPipeline.ts]] - `imports_from` [EXTRACTED]
- [[salesroutes.ts]] - `imports_from` [EXTRACTED]
- [[setDailyTarget()]] - `contains` [EXTRACTED]
- [[shared-typessales.ts]] - `imports_from` [EXTRACTED]
- [[upsertLineItems()]] - `contains` [EXTRACTED]
- [[whereClause()]] - `contains` [EXTRACTED]
- [[withTransaction()]] - `imports` [EXTRACTED]

#graphify/code #graphify/EXTRACTED #community/Sales_Import_Pipeline_Parsers__UI