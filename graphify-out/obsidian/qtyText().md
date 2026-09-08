---
source_file: "server/src/entities/intelligence/reconciliation.ts"
type: "code"
community: "Business Intelligence Engine"
location: "L51"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Business_Intelligence_Engine
---

# qtyText()

## Connections
- [[anomalies.ts]] - `imports` [EXTRACTED]
- [[anomalyAction()]] - `calls` [EXTRACTED]
- [[anomalyInsight()]] - `calls` [EXTRACTED]
- [[insights.ts]] - `imports` [EXTRACTED]
- [[movementInsight()]] - `calls` [EXTRACTED]
- [[peakHourInsight()]] - `calls` [EXTRACTED]
- [[productStalls()]] - `calls` [EXTRACTED]
- [[productionVariance()]] - `calls` [EXTRACTED]
- [[reconciliation.ts]] - `contains` [EXTRACTED]
- [[round2()_2]] - `calls` [EXTRACTED]
- [[salesInsights()]] - `calls` [EXTRACTED]
- [[salesMovement()]] - `calls` [EXTRACTED]
- [[wastageInsights()]] - `calls` [EXTRACTED]
- [[wastageSurges()]] - `calls` [EXTRACTED]

## Source
**From** `server/src/entities/intelligence/reconciliation.ts` **(starting line 51):**
```typescript
export function qtyText(n: number): string {
  return round2(n).toLocaleString("en-IN", { maximumFractionDigits: 2 });
}
```

#graphify/code #graphify/EXTRACTED #community/Business_Intelligence_Engine