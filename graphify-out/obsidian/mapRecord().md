---
source_file: "server/src/entities/datasets/repository.ts"
type: "code"
community: "Ramesh AI Query Engine"
location: "L242"
tags:
  - graphify/code
  - graphify/INFERRED
  - community/Ramesh_AI_Query_Engine
---

# mapRecord()

## Connections
- [[datasetsrepository.ts]] - `contains` [EXTRACTED]
- [[exportRecords()]] - `indirect_call` [INFERRED]
- [[queryRecords()]] - `indirect_call` [INFERRED]

## Source
**From** `server/src/entities/datasets/repository.ts` **(starting line 242):**
```typescript
function mapRecord(row: any): DatasetRecord {
  return {
    id: row.id,
    datasetType: row.datasetType,
    rawTimestamp: row.rawTimestamp,
    transactionDate: row.transactionDate,
    businessDate: row.businessDate,
    businessDayStartHour: row.businessDayStartHour,
    hour: row.hour,
    shift: row.shift,
    product: row.product,
    category: row.category,
    outlet: row.outlet,
    channel: row.channel,
    quantity: row.quantity,
    salesValue: row.salesValue,
    reason: row.reason,
    importBatchId: row.importBatchId,
    sourceFile: row.sourceFile,
    sourceType: row.sourceType,
    sourceSheet: row.sourceSheet,
    sourcePage: row.sourcePage,
    sourceRow: row.sourceRow,
    fingerprint: row.fingerprint,
    flags: JSON.parse(row.flagsJson ?? "[]"),
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}
```

#graphify/code #graphify/INFERRED #community/Ramesh_AI_Query_Engine