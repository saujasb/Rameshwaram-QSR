---
source_file: "server/src/entities/intelligence/reconciliation.ts"
type: "code"
community: "Business Intelligence Engine"
location: "L25"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Business_Intelligence_Engine
---

# round2()

## Connections
- [[buildRow()]] - `calls` [EXTRACTED]
- [[calculated()]] - `calls` [EXTRACTED]
- [[money()]] - `calls` [EXTRACTED]
- [[observed()]] - `calls` [EXTRACTED]
- [[qtyText()]] - `calls` [EXTRACTED]
- [[reconciliation.ts]] - `contains` [EXTRACTED]

## Source
**From** `server/src/entities/intelligence/reconciliation.ts` **(starting line 25):**
```typescript
function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
```

#graphify/code #graphify/EXTRACTED #community/Business_Intelligence_Engine