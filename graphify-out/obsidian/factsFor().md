---
source_file: "server/src/entities/intelligence/reconciliation.ts"
type: "code"
community: "Business Intelligence Engine"
location: "L71"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Business_Intelligence_Engine
---

# factsFor()

## Connections
- [[computeReconciliation()]] - `calls` [EXTRACTED]
- [[reconciliation.ts]] - `contains` [EXTRACTED]
- [[totalsFor()]] - `calls` [EXTRACTED]

## Source
**From** `server/src/entities/intelligence/reconciliation.ts` **(starting line 71):**
```typescript
function factsFor(filter: DatasetFilter, datasetType: DatasetType): TypeFacts {
  const t = totalsFor({ ...filter, datasetType });
  return { present: t.recordCount > 0, quantity: t.quantity, value: t.value, recordCount: t.recordCount };
}
```

#graphify/code #graphify/EXTRACTED #community/Business_Intelligence_Engine