---
source_file: "server/src/entities/datasets/repository.ts"
type: "code"
community: "Ramesh AI Query Engine"
location: "L34"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Ramesh_AI_Query_Engine
---

# updateStmt

## Connections
- [[datasetsrepository.ts]] - `contains` [EXTRACTED]

## Source
**From** `server/src/entities/datasets/repository.ts` **(starting line 34):**
```typescript
const updateStmt = db.prepare(`
  UPDATE dataset_records SET
    importBatchId = @importBatchId, category = @category, product = @product, quantity = @quantity,
    salesValue = @salesValue, reason = @reason, transactionDate = @transactionDate,
    rawTimestamp = @rawTimestamp, hour = @hour, shift = @shift, outlet = @outlet,
    businessDayStartHour = @businessDayStartHour, flagsJson = @flagsJson, updatedAt = @updatedAt
  WHERE id = @id
`);
```

#graphify/code #graphify/EXTRACTED #community/Ramesh_AI_Query_Engine