---
source_file: "server/src/entities/sales/repository.ts"
type: "code"
community: "Sales Import Parsing Pipeline"
location: "L205"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Sales_Import_Parsing_Pipeline
---

# deleteImportBatch()

## Connections
- [[salesrepository.ts]] - `contains` [EXTRACTED]
- [[salesroutes.ts]] - `imports` [EXTRACTED]

## Source
**From** `server/src/entities/sales/repository.ts` **(starting line 205):**
```typescript
export function deleteImportBatch(id: string): boolean {
  const run = db.transaction((batchId: string) => {
    db.prepare(`DELETE FROM sales_line_items WHERE importBatchId = ?`).run(batchId);
    return db.prepare(`DELETE FROM sales_import_batches WHERE id = ?`).run(batchId).changes > 0;
  });
  return run(id);
}
```

#graphify/code #graphify/EXTRACTED #community/Sales_Import_Parsing_Pipeline