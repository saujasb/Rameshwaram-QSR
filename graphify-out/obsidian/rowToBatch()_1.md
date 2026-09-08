---
source_file: "server/src/entities/sales/repository.ts"
type: "code"
community: "Sales Import Parsing Pipeline"
location: "L168"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Sales_Import_Parsing_Pipeline
---

# rowToBatch()

## Connections
- [[getImportBatch()_1]] - `calls` [EXTRACTED]
- [[listImportBatches()_1]] - `indirect_call` [INFERRED]
- [[salesrepository.ts]] - `contains` [EXTRACTED]

## Source
**From** `server/src/entities/sales/repository.ts` **(starting line 168):**
```typescript
function rowToBatch(row: any): SalesImportBatch {
  return {
    id: row.id,
    fileName: row.fileName,
    channel: row.channel,
    businessDate: row.businessDate,
    recordsFound: row.recordsFound,
    recordsInserted: row.recordsInserted,
    recordsUpdated: row.recordsUpdated,
    duplicatesSkipped: row.duplicatesSkipped,
    parsingErrors: JSON.parse(row.parsingErrorsJson),
    validation: {
      status: row.validationStatus,
      expectedQuantity: row.validationExpectedQuantity,
      expectedAmount: row.validationExpectedAmount,
      actualQuantity: row.validationActualQuantity,
      actualAmount: row.validationActualAmount,
      quantityDiff: row.validationExpectedQuantity != null ? row.validationActualQuantity - row.validationExpectedQuantity : null,
      amountDiff: row.validationExpectedAmount != null ? row.validationActualAmount - row.validationExpectedAmount : null,
      notes: JSON.parse(row.validationNotesJson),
    },
    hasHourlyData: Boolean(row.hasHourlyData),
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}
```

#graphify/code #graphify/EXTRACTED #community/Sales_Import_Parsing_Pipeline