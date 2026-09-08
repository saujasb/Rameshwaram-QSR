---
source_file: "server/src/entities/datasets/db.ts"
type: "code"
community: "Ramesh AI Query Engine"
location: "L9"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Ramesh_AI_Query_Engine
---

# ensureDatasetTables()

## Connections
- [[datasetsdb.ts]] - `contains` [EXTRACTED]
- [[datasetsrepository.ts]] - `imports` [EXTRACTED]
- [[migrateLegacySalesLineItems()]] - `calls` [EXTRACTED]
- [[salesrepository.ts]] - `imports` [EXTRACTED]

## Source
**From** `server/src/entities/datasets/db.ts` **(starting line 9):**
```typescript
export function ensureDatasetTables(): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS dataset_records (
      id TEXT PRIMARY KEY,
      datasetType TEXT NOT NULL,
      rawTimestamp TEXT,
      transactionDate TEXT,
      businessDate TEXT NOT NULL,
      businessDayStartHour INTEGER NOT NULL,
      hour INTEGER,
      shift TEXT,
      product TEXT NOT NULL,
      productKey TEXT NOT NULL,
      category TEXT,
      outlet TEXT,
      channel TEXT,
      quantity REAL NOT NULL,
      salesValue REAL,
      reason TEXT,
      importBatchId TEXT NOT NULL,
      sourceFile TEXT NOT NULL,
      sourceType TEXT NOT NULL,
      sourceSheet TEXT,
      sourcePage INTEGER,
      sourceRow INTEGER,
      fingerprint TEXT NOT NULL UNIQUE,
      flagsJson TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS dataset_import_batches (
      id TEXT PRIMARY KEY,
      fileName TEXT NOT NULL,
      fileSizeBytes INTEGER NOT NULL,
      sourceType TEXT NOT NULL,
      fileHash TEXT NOT NULL,
      datasetTypesJson TEXT NOT NULL,
      status TEXT NOT NULL,
      businessDateFrom TEXT,
      businessDateTo TEXT,
      recordsFound INTEGER NOT NULL,
      recordsInserted INTEGER NOT NULL,
      recordsUpdated INTEGER NOT NULL,
      duplicatesSkipped INTEGER NOT NULL,
      recordsRejected INTEGER NOT NULL,
      qualityJson TEXT NOT NULL,
      sheetsJson TEXT NOT NULL,
      rejectedRowsJson TEXT NOT NULL,
      reconciliationJson TEXT,
      businessDayStartHour INTEGER NOT NULL,
      createdAt TEXT NOT NULL
    )
  `);

  db.exec(`CREATE INDEX IF NOT EXISTS idx_dr_business_date ON dataset_records(businessDate)`);
  db.exec(`CREATE INDEX IF NOT EXISTS idx_dr_type_date ON dataset_records(datasetType, businessDate)`);
  db.exec(`CREATE INDEX IF NOT EXISTS idx_dr_product ON dataset_records(productKey)`);
  db.exec(`CREATE INDEX IF NOT EXISTS idx_dr_batch ON dataset_records(importBatchId)`);
  db.exec(`CREATE INDEX IF NOT EXISTS idx_dib_created ON dataset_import_batches(createdAt DESC)`);

  db.exec(`
    CREATE TABLE IF NOT EXISTS app_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    )
  `);

  migrateLegacySalesLineItems();
}
```

#graphify/code #graphify/EXTRACTED #community/Ramesh_AI_Query_Engine