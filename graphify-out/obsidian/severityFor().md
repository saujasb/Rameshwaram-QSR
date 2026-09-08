---
source_file: "server/src/entities/intelligence/anomalies.ts"
type: "code"
community: "Business Intelligence Engine"
location: "L31"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Business_Intelligence_Engine
---

# severityFor()

## Connections
- [[anomalies.ts]] - `contains` [EXTRACTED]
- [[productionVariance()]] - `calls` [EXTRACTED]
- [[salesMovement()]] - `calls` [EXTRACTED]
- [[wastageSurges()]] - `calls` [EXTRACTED]

## Source
**From** `server/src/entities/intelligence/anomalies.ts` **(starting line 31):**
```typescript
function severityFor(absPct: number): AnomalySeverity {
  if (absPct >= HIGH_PCT) return "high";
  if (absPct >= MEDIUM_PCT) return "medium";
  return "low";
}
```

#graphify/code #graphify/EXTRACTED #community/Business_Intelligence_Engine