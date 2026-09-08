---
source_file: "server/src/entities/intelligence/reconciliation.ts"
type: "code"
community: "Business Intelligence Engine"
location: "L59"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Business_Intelligence_Engine
---

# TypeFacts

## Connections
- [[reconciliation.ts]] - `contains` [EXTRACTED]

## Source
**From** `server/src/entities/intelligence/reconciliation.ts` **(starting line 59):**
```typescript
interface TypeFacts {
  /** False when zero records matched -- the difference between "0 units" and "unknown". */
  present: boolean;
  quantity: number;
  value: number;
  recordCount: number;
}
```

#graphify/code #graphify/EXTRACTED #community/Business_Intelligence_Engine