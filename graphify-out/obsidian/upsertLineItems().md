---
source_file: "server/src/entities/sales/repository.ts"
type: "code"
community: "Sales Import Parsing Pipeline"
location: "L67"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Sales_Import_Parsing_Pipeline
---

# upsertLineItems()

## Connections
- [[fingerprintFor()_1]] - `calls` [EXTRACTED]
- [[normalizeKey()]] - `calls` [EXTRACTED]
- [[runSalesImport()]] - `calls` [EXTRACTED]
- [[salesimportPipeline.ts]] - `imports` [EXTRACTED]
- [[salesrepository.ts]] - `contains` [EXTRACTED]

## Source
**From** `server/src/entities/sales/repository.ts` **(starting line 67):**
```typescript
export function upsertLineItems(candidates: CandidateLineItem[], importBatchId: string): UpsertResult {
  const now = new Date().toISOString();
  let inserted = 0;
  let updated = 0;
  let duplicates = 0;

  const run = db.transaction((items: CandidateLineItem[]) => {
    for (const item of items) {
      const itemNameKey = normalizeKey(item.itemName);
      const fingerprint = fingerprintFor(item.channel, item.businessDate, itemNameKey);
      const existing = findByFingerprint.get(fingerprint) as { id: string; quantity: number; amount: number } | undefined;

      if (!existing) {
        insertLineItemStmt.run({
          id: randomUUID(),
          importBatchId,
          channel: item.channel,
          category: item.category,
          itemName: item.itemName,
          itemNameKey,
          quantity: item.quantity,
          amount: item.amount,
          calendarDate: item.calendarDate,
          businessDate: item.businessDate,
          businessDayStart: item.businessDayStart,
          businessDayEnd: item.businessDayEnd,
          transactionTimestamp: item.transactionTimestamp,
          transactionTime: item.transactionTime,
          fingerprint,
          createdAt: now,
          updatedAt: now,
        });
        inserted++;
        continue;
      }

      const sameValues = Math.abs(existing.quantity - item.quantity) < 0.005 && Math.abs(existing.amount - item.amount) < 0.005;
      if (sameValues) {
        duplicates++;
        continue;
      }

      updateLineItemStmt.run({
        id: existing.id,
        importBatchId,
        category: item.category,
        itemName: item.itemName,
        quantity: item.quantity,
        amount: item.amount,
        calendarDate: item.calendarDate,
        businessDayStart: item.businessDayStart,
        businessDayEnd: item.businessDayEnd,
        transactionTimestamp: item.transactionTimestamp,
        transactionTime: item.transactionTime,
        updatedAt: now,
      });
      updated++;
    }
  });

  run(candidates);
  return { inserted, updated, duplicates };
}
```

#graphify/code #graphify/EXTRACTED #community/Sales_Import_Parsing_Pipeline