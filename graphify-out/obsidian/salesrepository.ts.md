---
source_file: "server/src/entities/sales/repository.ts"
type: "code"
community: "Sales Import Parsing Pipeline"
location: "L1"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Sales_Import_Parsing_Pipeline
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
- [[datasetsdb.ts]] - `imports_from` [EXTRACTED]
- [[db]] - `imports` [EXTRACTED]
- [[dbclient.ts]] - `imports_from` [EXTRACTED]
- [[deleteImportBatch()_1]] - `contains` [EXTRACTED]
- [[ensureDatasetTables()]] - `imports` [EXTRACTED]
- [[ensureSalesTables()]] - `imports` [EXTRACTED]
- [[findByFingerprint_1]] - `contains` [EXTRACTED]
- [[fingerprintFor()_1]] - `contains` [EXTRACTED]
- [[getDailyTarget()]] - `contains` [EXTRACTED]
- [[getImportBatch()_1]] - `contains` [EXTRACTED]
- [[getSalesSummary()]] - `contains` [EXTRACTED]
- [[insertBatchStmt]] - `contains` [EXTRACTED]
- [[insertImportBatch()_1]] - `contains` [EXTRACTED]
- [[insertLineItemStmt]] - `contains` [EXTRACTED]
- [[listImportBatches()_1]] - `contains` [EXTRACTED]
- [[listLineItems()]] - `contains` [EXTRACTED]
- [[normalizeKey()]] - `contains` [EXTRACTED]
- [[rowToBatch()_1]] - `contains` [EXTRACTED]
- [[salesdb.ts]] - `imports_from` [EXTRACTED]
- [[salesimportPipeline.ts]] - `imports_from` [EXTRACTED]
- [[salesroutes.ts]] - `imports_from` [EXTRACTED]
- [[setDailyTarget()]] - `contains` [EXTRACTED]
- [[shared-typessales.ts]] - `imports_from` [EXTRACTED]
- [[updateLineItemStmt]] - `contains` [EXTRACTED]
- [[upsertLineItems()]] - `contains` [EXTRACTED]
- [[whereClause()]] - `contains` [EXTRACTED]

## Source
**From** `server/src/entities/sales/repository.ts` **(starting line 1):**
```typescript
import { randomUUID } from "node:crypto";
```

#graphify/code #graphify/EXTRACTED #community/Sales_Import_Parsing_Pipeline