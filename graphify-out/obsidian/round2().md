---
source_file: "server/src/entities/intelligence/anomalies.ts"
type: "code"
community: "Business Intelligence Engine"
location: "L41"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Business_Intelligence_Engine
---

# round2()

## Connections
- [[anomalies.ts]] - `contains` [EXTRACTED]
- [[buildEvidence()]] - `calls` [EXTRACTED]
- [[productStalls()]] - `calls` [EXTRACTED]
- [[productionVariance()]] - `calls` [EXTRACTED]
- [[salesMovement()]] - `calls` [EXTRACTED]
- [[wastageSurges()]] - `calls` [EXTRACTED]

## Source
**From** `server/src/entities/intelligence/anomalies.ts` **(starting line 41):**
```typescript
function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
```

#graphify/code #graphify/EXTRACTED #community/Business_Intelligence_Engine