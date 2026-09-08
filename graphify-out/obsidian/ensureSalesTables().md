---
source_file: "server/src/entities/sales/db.ts"
type: "code"
community: "Sales Import Parsing Pipeline"
location: "L3"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Sales_Import_Parsing_Pipeline
---

# ensureSalesTables()

## Connections
- [[salesdb.ts]] - `contains` [EXTRACTED]
- [[salesrepository.ts]] - `imports` [EXTRACTED]

## Source
**From** `server/src/entities/sales/db.ts` **(starting line 3):**
```typescript
export function ensureSalesTables(): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS sales_import_batches (
      id TEXT PRIMARY KEY,
      fileName TEXT NOT NULL,
      channel TEXT NOT NULL,
      businessDate TEXT NOT NULL,
      recordsFound INTEGER NOT NULL,
      recordsInserted INTEGER NOT NULL,
      recordsUpdated INTEGER NOT NULL,
      duplicatesSkipped INTEGER NOT NULL,
      parsingErrorsJson TEXT NOT NULL,
      validationStatus TEXT NOT NULL,
      validationExpectedQuantity REAL,
      validationExpectedAmount REAL,
      validationActualQuantity REAL NOT NULL,
      validationActualAmount REAL NOT NULL,
      validationNotesJson TEXT NOT NULL,
      hasHourlyData INTEGER NOT NULL DEFAULT 0,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS sales_line_items (
      id TEXT PRIMARY KEY,
      importBatchId TEXT NOT NULL,
      channel TEXT NOT NULL,
      category TEXT NOT NULL,
      itemName TEXT NOT NULL,
      itemNameKey TEXT NOT NULL,
      quantity REAL NOT NULL,
      amount REAL NOT NULL,
      calendarDate TEXT NOT NULL,
      businessDate TEXT NOT NULL,
      businessDayStart TEXT NOT NULL,
      businessDayEnd TEXT NOT NULL,
      transactionTimestamp TEXT,
      transactionTime TEXT,
      fingerprint TEXT NOT NULL UNIQUE,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    )
  `);

  db.exec(`CREATE INDEX IF NOT EXISTS idx_sales_line_items_business_date ON sales_line_items(businessDate)`);
  db.exec(`CREATE INDEX IF NOT EXISTS idx_sales_line_items_import_batch ON sales_line_items(importBatchId)`);
  db.exec(`CREATE INDEX IF NOT EXISTS idx_sales_import_batches_business_date ON sales_import_batches(businessDate)`);

  // Single-row settings table -- currently just the daily sales target, kept
  // generic (key/value) so future dashboard settings don't need a new table.
  db.exec(`
    CREATE TABLE IF NOT EXISTS sales_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    )
  `);
}
```

#graphify/code #graphify/EXTRACTED #community/Sales_Import_Parsing_Pipeline