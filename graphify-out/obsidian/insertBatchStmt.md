---
source_file: "server/src/entities/sales/repository.ts"
type: "code"
community: "Sales Import Parsing Pipeline"
location: "L131"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Sales_Import_Parsing_Pipeline
---

# insertBatchStmt

## Connections
- [[salesrepository.ts]] - `contains` [EXTRACTED]

## Source
**From** `server/src/entities/sales/repository.ts` **(starting line 131):**
```typescript
const insertBatchStmt = db.prepare(`
  INSERT INTO sales_import_batches (
    id, fileName, channel, businessDate, recordsFound, recordsInserted, recordsUpdated,
    duplicatesSkipped, parsingErrorsJson, validationStatus, validationExpectedQuantity,
    validationExpectedAmount, validationActualQuantity, validationActualAmount,
    validationNotesJson, hasHourlyData, createdAt, updatedAt
  ) VALUES (@id, @fileName, @channel, @businessDate, @recordsFound, @recordsInserted, @recordsUpdated,
    @duplicatesSkipped, @parsingErrorsJson, @validationStatus, @validationExpectedQuantity,
    @validationExpectedAmount, @validationActualQuantity, @validationActualAmount,
    @validationNotesJson, @hasHourlyData, @createdAt, @updatedAt)
`);
```

#graphify/code #graphify/EXTRACTED #community/Sales_Import_Parsing_Pipeline