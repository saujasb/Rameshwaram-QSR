---
source_file: "server/src/entities/intelligence/reconciliation.ts"
type: "code"
community: "Business Intelligence Engine"
location: "L55"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Business_Intelligence_Engine
---

# pctText()

## Connections
- [[anomalies.ts]] - `imports` [EXTRACTED]
- [[anomalyInsight()]] - `calls` [EXTRACTED]
- [[concentrationInsight()]] - `calls` [EXTRACTED]
- [[insights.ts]] - `imports` [EXTRACTED]
- [[movementInsight()]] - `calls` [EXTRACTED]
- [[peakHourInsight()]] - `calls` [EXTRACTED]
- [[reconciliation.ts]] - `contains` [EXTRACTED]
- [[salesInsights()]] - `calls` [EXTRACTED]
- [[salesMovement()]] - `calls` [EXTRACTED]
- [[wastageInsights()]] - `calls` [EXTRACTED]
- [[wastageSurges()]] - `calls` [EXTRACTED]

## Source
**From** `server/src/entities/intelligence/reconciliation.ts` **(starting line 55):**
```typescript
export function pctText(n: number): string {
  return `${n >= 0 ? "" : "-"}${Math.abs(n).toFixed(1)}%`;
}
```

#graphify/code #graphify/EXTRACTED #community/Business_Intelligence_Engine