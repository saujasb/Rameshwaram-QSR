---
source_file: "server/src/entities/sales/repository.ts"
type: "code"
community: "Sales Import Parsing Pipeline"
location: "L200"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Sales_Import_Parsing_Pipeline
---

# getImportBatch()

## Connections
- [[rowToBatch()_1]] - `calls` [EXTRACTED]
- [[salesrepository.ts]] - `contains` [EXTRACTED]
- [[salesroutes.ts]] - `imports` [EXTRACTED]

## Source
**From** `server/src/entities/sales/repository.ts` **(starting line 200):**
```typescript
export function getImportBatch(id: string): SalesImportBatch | undefined {
  const row = db.prepare(`SELECT * FROM sales_import_batches WHERE id = ?`).get(id);
  return row ? rowToBatch(row) : undefined;
}
```

#graphify/code #graphify/EXTRACTED #community/Sales_Import_Parsing_Pipeline