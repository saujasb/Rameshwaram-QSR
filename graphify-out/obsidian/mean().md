---
source_file: "server/src/entities/intelligence/anomalies.ts"
type: "code"
community: "Business Intelligence Engine"
location: "L37"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Business_Intelligence_Engine
---

# mean()

## Connections
- [[anomalies.ts]] - `contains` [EXTRACTED]
- [[productStalls()]] - `calls` [EXTRACTED]
- [[salesMovement()]] - `calls` [EXTRACTED]
- [[wastageSurges()]] - `calls` [EXTRACTED]

## Source
**From** `server/src/entities/intelligence/anomalies.ts` **(starting line 37):**
```typescript
function mean(values: number[]): number {
  return values.reduce((a, b) => a + b, 0) / values.length;
}
```

#graphify/code #graphify/EXTRACTED #community/Business_Intelligence_Engine