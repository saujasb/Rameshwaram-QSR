---
source_file: "server/src/entities/datasets/repository.ts"
type: "code"
community: "Ramesh AI Query Engine"
location: "L155"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Ramesh_AI_Query_Engine
---

# rowToBatch()

## Connections
- [[datasetsrepository.ts]] - `contains` [EXTRACTED]
- [[findBatchByFileHash()]] - `calls` [EXTRACTED]
- [[getImportBatch()]] - `calls` [EXTRACTED]
- [[listImportBatches()]] - `indirect_call` [INFERRED]

## Source
**From** `server/src/entities/datasets/repository.ts` **(starting line 155):**
```typescript
function rowToBatch(row: any): ImportBatch {
  return {
    id: row.id,
    fileName: row.fileName,
    fileSizeBytes: row.fileSizeBytes,
    sourceType: row.sourceType,
    fileHash: row.fileHash,
    datasetTypes: JSON.parse(row.datasetTypesJson),
    status: row.status,
    businessDateFrom: row.businessDateFrom,
    businessDateTo: row.businessDateTo,
    recordsFound: row.recordsFound,
    recordsInserted: row.recordsInserted,
    recordsUpdated: row.recordsUpdated,
    duplicatesSkipped: row.duplicatesSkipped,
    recordsRejected: row.recordsRejected,
    quality: JSON.parse(row.qualityJson),
    sheets: JSON.parse(row.sheetsJson),
    rejectedRows: JSON.parse(row.rejectedRowsJson),
    reconciliation: row.reconciliationJson ? JSON.parse(row.reconciliationJson) : null,
    businessDayStartHour: row.businessDayStartHour,
    createdAt: row.createdAt,
  };
}
```

#graphify/code #graphify/EXTRACTED #community/Ramesh_AI_Query_Engine