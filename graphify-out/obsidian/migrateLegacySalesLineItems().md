---
source_file: "server/src/entities/datasets/db.ts"
type: "code"
community: "Ramesh AI Query Engine"
location: "L93"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Ramesh_AI_Query_Engine
---

# migrateLegacySalesLineItems()

## Connections
- [[datasetsdb.ts]] - `contains` [EXTRACTED]
- [[ensureDatasetTables()]] - `calls` [EXTRACTED]
- [[tableExists()]] - `calls` [EXTRACTED]

## Source
**From** `server/src/entities/datasets/db.ts` **(starting line 93):**
```typescript
function migrateLegacySalesLineItems(): void {
  if (!tableExists("sales_line_items")) return;

  const already = db
    .prepare(`SELECT COUNT(*) as c FROM dataset_records WHERE sourceType = 'pdf' AND sourceSheet IS NULL AND importBatchId LIKE 'legacy-%'`)
    .get() as { c: number };
  if (already.c > 0) return;

  const legacy = db.prepare(`SELECT * FROM sales_line_items`).all() as Record<string, any>[];
  if (legacy.length === 0) return;

  const insert = db.prepare(`
    INSERT OR IGNORE INTO dataset_records (
      id, datasetType, rawTimestamp, transactionDate, businessDate, businessDayStartHour, hour, shift,
      product, productKey, category, outlet, channel, quantity, salesValue, reason,
      importBatchId, sourceFile, sourceType, sourceSheet, sourcePage, sourceRow,
      fingerprint, flagsJson, createdAt, updatedAt
    ) VALUES (
      @id, 'sales', @rawTimestamp, @transactionDate, @businessDate, 5, @hour, NULL,
      @product, @productKey, @category, NULL, @channel, @quantity, @salesValue, NULL,
      @importBatchId, @sourceFile, 'pdf', NULL, NULL, NULL,
      @fingerprint, @flagsJson, @createdAt, @updatedAt
    )
  `);

  const run = db.transaction((rows: Record<string, any>[]) => {
    for (const r of rows) {
      insert.run({
        id: r.id,
        rawTimestamp: r.transactionTimestamp ?? null,
        transactionDate: r.calendarDate ?? null,
        businessDate: r.businessDate,
        hour: null,
        product: r.itemName,
        productKey: String(r.itemName ?? "").trim().toLowerCase().replace(/\s+/g, " "),
        category: r.category ?? null,
        channel: r.channel ?? null,
        quantity: r.quantity,
        salesValue: r.amount,
        importBatchId: `legacy-${r.importBatchId}`,
        sourceFile: "legacy sales import",
        fingerprint: `agg::sales::${r.channel}::${r.businessDate}::${String(r.itemName ?? "").trim().toLowerCase().replace(/\s+/g, " ")}`,
        flagsJson: JSON.stringify(["missing_timestamp"]),
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
      });
    }
  });
  run(legacy);
  console.log(`[datasets] migrated ${legacy.length} legacy sales rows into dataset_records`);
}
```

#graphify/code #graphify/EXTRACTED #community/Ramesh_AI_Query_Engine