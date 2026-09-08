---
source_file: "server/src/entities/sales/repository.ts"
type: "code"
community: "Sales Import Parsing Pipeline"
location: "L57"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Sales_Import_Parsing_Pipeline
---

# updateLineItemStmt

## Connections
- [[salesrepository.ts]] - `contains` [EXTRACTED]

## Source
**From** `server/src/entities/sales/repository.ts` **(starting line 57):**
```typescript
const updateLineItemStmt = db.prepare(`
  UPDATE sales_line_items SET
    importBatchId = @importBatchId, category = @category, itemName = @itemName,
    quantity = @quantity, amount = @amount, calendarDate = @calendarDate,
    businessDayStart = @businessDayStart, businessDayEnd = @businessDayEnd,
    transactionTimestamp = @transactionTimestamp, transactionTime = @transactionTime,
    updatedAt = @updatedAt
  WHERE id = @id
`);
```

#graphify/code #graphify/EXTRACTED #community/Sales_Import_Parsing_Pipeline