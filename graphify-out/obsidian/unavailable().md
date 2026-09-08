---
source_file: "server/src/entities/intelligence/reconciliation.ts"
type: "code"
community: "Business Intelligence Engine"
location: "L29"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Business_Intelligence_Engine
---

# unavailable()

## Connections
- [[buildRow()]] - `calls` [EXTRACTED]
- [[buildTodaysIntelligence()]] - `calls` [EXTRACTED]
- [[intelligenceroutes.ts]] - `imports` [EXTRACTED]
- [[reconciliation.ts]] - `contains` [EXTRACTED]
- [[salesValueMetric()]] - `calls` [EXTRACTED]

## Source
**From** `server/src/entities/intelligence/reconciliation.ts` **(starting line 29):**
```typescript
export function unavailable(note: string): Metric {
  return { value: null, basis: "unavailable", note };
}
```

#graphify/code #graphify/EXTRACTED #community/Business_Intelligence_Engine