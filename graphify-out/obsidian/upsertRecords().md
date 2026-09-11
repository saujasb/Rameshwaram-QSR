---
source_file: "server/src/entities/datasets/repository.ts"
type: "code"
community: "Ramesh AI Query Engine"
location: "L53"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Ramesh_AI_Query_Engine
---

# upsertRecords()

## Connections
- [[datasetsimportPipeline.ts]] - `imports` [EXTRACTED]
- [[datasetsrepository.ts]] - `contains` [EXTRACTED]
- [[productKeyOf()]] - `calls` [EXTRACTED]
- [[runImport()]] - `calls` [EXTRACTED]

## Source
**From** `server/src/entities/datasets/repository.ts` **(starting line 53):**
```typescript
export function upsertRecords(records: DatasetRecord[]): UpsertResult {
  let inserted = 0;
  let updated = 0;
  let duplicates = 0;

  const run = db.transaction((rows: DatasetRecord[]) => {
    for (const r of rows) {
      const existing = findByFingerprint.get(r.fingerprint) as
        | { id: string; quantity: number; salesValue: number | null }
        | undefined;

      const params = {
        id: existing?.id ?? r.id,
        datasetType: r.datasetType,
        rawTimestamp: r.rawTimestamp,
        transactionDate: r.transactionDate,
        businessDate: r.businessDate,
        businessDayStartHour: r.businessDayStartHour,
        hour: r.hour,
        shift: r.shift,
        product: r.product,
        productKey: productKeyOf(r.product),
        category: r.category,
        outlet: r.outlet,
        channel: r.channel,
        quantity: r.quantity,
        salesValue: r.salesValue,
        reason: r.reason,
        importBatchId: r.importBatchId,
        sourceFile: r.sourceFile,
        sourceType: r.sourceType,
        sourceSheet: r.sourceSheet,
        sourcePage: r.sourcePage,
        sourceRow: r.sourceRow,
        fingerprint: r.fingerprint,
        flagsJson: JSON.stringify(r.flags),
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
      };

      if (!existing) {
        insertStmt.run(params);
        inserted++;
        continue;
      }

      const same =
        Math.abs(existing.quantity - r.quantity) < 0.005 &&
        Math.abs((existing.salesValue ?? 0) - (r.salesValue ?? 0)) < 0.005;
      if (same) {
        duplicates++;
        continue;
      }
      updateStmt.run(params);
      updated++;
    }
  });

  run(records);
  return { inserted, updated, duplicates };
}
```

#graphify/code #graphify/EXTRACTED #community/Ramesh_AI_Query_Engine