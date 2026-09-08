---
source_file: "server/src/entities/intelligence/reconciliation.ts"
type: "code"
community: "Business Intelligence Engine"
location: "L142"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Business_Intelligence_Engine
---

# perDateFacts()

## Connections
- [[computeReconciliation()]] - `calls` [EXTRACTED]
- [[dailyTotals()]] - `calls` [EXTRACTED]
- [[reconciliation.ts]] - `contains` [EXTRACTED]
- [[totalsFor()]] - `calls` [EXTRACTED]

## Source
**From** `server/src/entities/intelligence/reconciliation.ts` **(starting line 142):**
```typescript
function perDateFacts(filter: DatasetFilter, datasetType: DatasetType): Map<string, TypeFacts> {
  const out = new Map<string, TypeFacts>();
  for (const day of dailyTotals({ ...filter, datasetType })) {
    // recordCount is only obtainable per date via a scoped totals read; the
    // repository is the data layer, so no raw SQL is written here.
    const t = totalsFor({ ...filter, datasetType, from: day.businessDate, to: day.businessDate });
    out.set(day.businessDate, { present: t.recordCount > 0, quantity: t.quantity, value: t.value, recordCount: t.recordCount });
  }
  return out;
}
```

#graphify/code #graphify/EXTRACTED #community/Business_Intelligence_Engine