---
source_file: "server/src/entities/datasets/repository.ts"
type: "code"
community: "Ramesh AI Query Engine"
location: "L18"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Ramesh_AI_Query_Engine
---

# insertStmt

## Connections
- [[datasetsrepository.ts]] - `contains` [EXTRACTED]

## Source
**From** `server/src/entities/datasets/repository.ts` **(starting line 18):**
```typescript
const insertStmt = db.prepare(`
  INSERT INTO dataset_records (
    id, datasetType, rawTimestamp, transactionDate, businessDate, businessDayStartHour, hour, shift,
    product, productKey, category, outlet, channel, quantity, salesValue, reason,
    importBatchId, sourceFile, sourceType, sourceSheet, sourcePage, sourceRow,
    fingerprint, flagsJson, createdAt, updatedAt
  ) VALUES (
    @id, @datasetType, @rawTimestamp, @transactionDate, @businessDate, @businessDayStartHour, @hour, @shift,
    @product, @productKey, @category, @outlet, @channel, @quantity, @salesValue, @reason,
    @importBatchId, @sourceFile, @sourceType, @sourceSheet, @sourcePage, @sourceRow,
    @fingerprint, @flagsJson, @createdAt, @updatedAt
  )
`);
```

#graphify/code #graphify/EXTRACTED #community/Ramesh_AI_Query_Engine