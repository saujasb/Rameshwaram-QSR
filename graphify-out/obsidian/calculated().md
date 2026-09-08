---
source_file: "server/src/entities/intelligence/reconciliation.ts"
type: "code"
community: "Business Intelligence Engine"
location: "L39"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Business_Intelligence_Engine
---

# calculated()

## Connections
- [[buildRow()]] - `calls` [EXTRACTED]
- [[buildTodaysIntelligence()]] - `calls` [EXTRACTED]
- [[intelligenceroutes.ts]] - `imports` [EXTRACTED]
- [[reconciliation.ts]] - `contains` [EXTRACTED]
- [[round2()_2]] - `calls` [EXTRACTED]

## Source
**From** `server/src/entities/intelligence/reconciliation.ts` **(starting line 39):**
```typescript
export function calculated(value: number, note: string): Metric {
  return { value: round2(value), basis: "calculated", note };
}
```

#graphify/code #graphify/EXTRACTED #community/Business_Intelligence_Engine