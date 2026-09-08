---
source_file: "server/src/entities/intelligence/reconciliation.ts"
type: "code"
community: "Business Intelligence Engine"
location: "L133"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Business_Intelligence_Engine
---

# emptyRow()

## Connections
- [[buildRow()]] - `calls` [EXTRACTED]
- [[reconciliation.ts]] - `contains` [EXTRACTED]

## Source
**From** `server/src/entities/intelligence/reconciliation.ts` **(starting line 133):**
```typescript
export function emptyRow(businessDate: string, scopeLabel: string): ReconciliationRow {
  return buildRow(businessDate, scopeLabel, { sales: ABSENT, production: ABSENT, wastage: ABSENT });
}
```

#graphify/code #graphify/EXTRACTED #community/Business_Intelligence_Engine