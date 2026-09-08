---
source_file: "server/src/entities/sales/repository.ts"
type: "code"
community: "Sales Import Parsing Pipeline"
location: "L48"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Sales_Import_Parsing_Pipeline
---

# insertLineItemStmt

## Connections
- [[salesrepository.ts]] - `contains` [EXTRACTED]

## Source
**From** `server/src/entities/sales/repository.ts` **(starting line 48):**
```typescript
const insertLineItemStmt = db.prepare(`
  INSERT INTO sales_line_items (
    id, importBatchId, channel, category, itemName, itemNameKey, quantity, amount,
    calendarDate, businessDate, businessDayStart, businessDayEnd,
    transactionTimestamp, transactionTime, fingerprint, createdAt, updatedAt
  ) VALUES (@id, @importBatchId, @channel, @category, @itemName, @itemNameKey, @quantity, @amount,
    @calendarDate, @businessDate, @businessDayStart, @businessDayEnd,
    @transactionTimestamp, @transactionTime, @fingerprint, @createdAt, @updatedAt)
`);
```

#graphify/code #graphify/EXTRACTED #community/Sales_Import_Parsing_Pipeline