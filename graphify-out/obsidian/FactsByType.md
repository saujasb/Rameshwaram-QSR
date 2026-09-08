---
source_file: "server/src/entities/intelligence/reconciliation.ts"
type: "code"
community: "Business Intelligence Engine"
location: "L69"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Business_Intelligence_Engine
---

# FactsByType

## Connections
- [[reconciliation.ts]] - `contains` [EXTRACTED]

## Source
**From** `server/src/entities/intelligence/reconciliation.ts` **(starting line 69):**
```typescript
type FactsByType = Record<DatasetType, TypeFacts>;

function factsFor(filter: DatasetFilter, datasetType: DatasetType): TypeFacts {
  const t = totalsFor({ ...filter, datasetType });
  return { present: t.recordCount > 0, quantity: t.quantity, value: t.value, recordCount: t.recordCount };
}
```

#graphify/code #graphify/EXTRACTED #community/Business_Intelligence_Engine