---
source_file: "server/src/entities/intelligence/reconciliation.ts"
type: "code"
community: "Business Intelligence Engine"
location: "L34"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Business_Intelligence_Engine
---

# observed()

## Connections
- [[buildRow()]] - `calls` [EXTRACTED]
- [[buildTodaysIntelligence()]] - `calls` [EXTRACTED]
- [[intelligenceroutes.ts]] - `imports` [EXTRACTED]
- [[reconciliation.ts]] - `contains` [EXTRACTED]
- [[round2()_2]] - `calls` [EXTRACTED]
- [[salesValueMetric()]] - `calls` [EXTRACTED]

## Source
**From** `server/src/entities/intelligence/reconciliation.ts` **(starting line 34):**
```typescript
export function observed(value: number, note: string): Metric {
  return { value: round2(value), basis: "observed", note };
}
```

#graphify/code #graphify/EXTRACTED #community/Business_Intelligence_Engine