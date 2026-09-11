---
source_file: "server/src/entities/intelligence/reconciliation.ts"
type: "code"
community: "Business Intelligence Engine"
location: "L47"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Business_Intelligence_Engine
---

# money()

## Connections
- [[anomalies.ts]] - `imports` [EXTRACTED]
- [[anomalyAction()]] - `calls` [EXTRACTED]
- [[anomalyInsight()]] - `calls` [EXTRACTED]
- [[concentrationInsight()]] - `calls` [EXTRACTED]
- [[insights.ts]] - `imports` [EXTRACTED]
- [[movementInsight()]] - `calls` [EXTRACTED]
- [[peakHourInsight()]] - `calls` [EXTRACTED]
- [[reconciliation.ts]] - `contains` [EXTRACTED]
- [[round2()_2]] - `calls` [EXTRACTED]
- [[salesInsights()]] - `calls` [EXTRACTED]
- [[salesMovement()]] - `calls` [EXTRACTED]

## Source
**From** `server/src/entities/intelligence/reconciliation.ts` **(starting line 47):**
```typescript
export function money(n: number): string {
  return INR.format(round2(n));
}
```

#graphify/code #graphify/EXTRACTED #community/Business_Intelligence_Engine