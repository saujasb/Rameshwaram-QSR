---
source_file: "server/src/entities/datasets/repository.ts"
type: "code"
community: "Dataset Import & Normalization Pipeline"
location: "L117"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Dataset_Import__Normalization_Pipeline
---

# insertImportBatch()

## Connections
- [[datasetsimportPipeline.ts]] - `imports` [EXTRACTED]
- [[datasetsrepository.ts]] - `contains` [EXTRACTED]
- [[runImport()]] - `calls` [EXTRACTED]

## Source
**From** `server/src/entities/datasets/repository.ts` **(starting line 117):**
```typescript
export function insertImportBatch(batch: ImportBatch): ImportBatch {
  db.prepare(`
    INSERT INTO dataset_import_batches (
      id, fileName, fileSizeBytes, sourceType, fileHash, datasetTypesJson, status,
      businessDateFrom, businessDateTo, recordsFound, recordsInserted, recordsUpdated,
      duplicatesSkipped, recordsRejected, qualityJson, sheetsJson, rejectedRowsJson,
      reconciliationJson, businessDayStartHour, createdAt
    ) VALUES (
      @id, @fileName, @fileSizeBytes, @sourceType, @fileHash, @datasetTypesJson, @status,
      @businessDateFrom, @businessDateTo, @recordsFound, @recordsInserted, @recordsUpdated,
      @duplicatesSkipped, @recordsRejected, @qualityJson, @sheetsJson, @rejectedRowsJson,
      @reconciliationJson, @businessDayStartHour, @createdAt
    )
  `).run({
    id: batch.id,
    fileName: batch.fileName,
    fileSizeBytes: batch.fileSizeBytes,
    sourceType: batch.sourceType,
    fileHash: batch.fileHash,
    datasetTypesJson: JSON.stringify(batch.datasetTypes),
    status: batch.status,
    businessDateFrom: batch.businessDateFrom,
    businessDateTo: batch.businessDateTo,
    recordsFound: batch.recordsFound,
    recordsInserted: batch.recordsInserted,
    recordsUpdated: batch.recordsUpdated,
    duplicatesSkipped: batch.duplicatesSkipped,
    recordsRejected: batch.recordsRejected,
    qualityJson: JSON.stringify(batch.quality),
    sheetsJson: JSON.stringify(batch.sheets),
    rejectedRowsJson: JSON.stringify(batch.rejectedRows),
    reconciliationJson: batch.reconciliation ? JSON.stringify(batch.reconciliation) : null,
    businessDayStartHour: batch.businessDayStartHour,
    createdAt: batch.createdAt,
  });
  return batch;
}
```

#graphify/code #graphify/EXTRACTED #community/Dataset_Import__Normalization_Pipeline