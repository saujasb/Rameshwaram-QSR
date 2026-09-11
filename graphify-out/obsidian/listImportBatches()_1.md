---
source_file: "server/src/entities/sales/repository.ts"
type: "code"
community: "Sales Import Parsing Pipeline"
location: "L195"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Sales_Import_Parsing_Pipeline
---

# listImportBatches()

## Connections
- [[rowToBatch()_1]] - `indirect_call` [INFERRED]
- [[salesrepository.ts]] - `contains` [EXTRACTED]
- [[salesroutes.ts]] - `imports` [EXTRACTED]

## Source
**From** `server/src/entities/sales/repository.ts` **(starting line 195):**
```typescript
export function listImportBatches(): SalesImportBatch[] {
  const rows = db.prepare(`SELECT * FROM sales_import_batches ORDER BY createdAt DESC`).all();
  return rows.map(rowToBatch);
}
```

#graphify/code #graphify/EXTRACTED #community/Sales_Import_Parsing_Pipeline