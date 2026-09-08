---
source_file: "server/src/entities/sales/repository.ts"
type: "code"
community: "Sales Import Parsing Pipeline"
location: "L143"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Sales_Import_Parsing_Pipeline
---

# insertImportBatch()

## Connections
- [[runSalesImport()]] - `calls` [EXTRACTED]
- [[salesimportPipeline.ts]] - `imports` [EXTRACTED]
- [[salesrepository.ts]] - `contains` [EXTRACTED]

## Source
**From** `server/src/entities/sales/repository.ts` **(starting line 143):**
```typescript
export function insertImportBatch(batch: Omit<SalesImportBatch, "createdAt" | "updatedAt">): SalesImportBatch {
  const now = new Date().toISOString();
  insertBatchStmt.run({
    id: batch.id,
    fileName: batch.fileName,
    channel: batch.channel,
    businessDate: batch.businessDate,
    recordsFound: batch.recordsFound,
    recordsInserted: batch.recordsInserted,
    recordsUpdated: batch.recordsUpdated,
    duplicatesSkipped: batch.duplicatesSkipped,
    parsingErrorsJson: JSON.stringify(batch.parsingErrors),
    validationStatus: batch.validation.status,
    validationExpectedQuantity: batch.validation.expectedQuantity,
    validationExpectedAmount: batch.validation.expectedAmount,
    validationActualQuantity: batch.validation.actualQuantity,
    validationActualAmount: batch.validation.actualAmount,
    validationNotesJson: JSON.stringify(batch.validation.notes),
    hasHourlyData: batch.hasHourlyData ? 1 : 0,
    createdAt: now,
    updatedAt: now,
  });
  return { ...batch, createdAt: now, updatedAt: now };
}
```

#graphify/code #graphify/EXTRACTED #community/Sales_Import_Parsing_Pipeline