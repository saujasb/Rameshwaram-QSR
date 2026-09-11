---
source_file: "server/src/entities/intelligence/anomalies.ts"
type: "code"
community: "Business Intelligence Engine"
location: "L46"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Business_Intelligence_Engine
---

# drilldown()

## Connections
- [[anomalies.ts]] - `contains` [EXTRACTED]
- [[productStalls()]] - `calls` [EXTRACTED]
- [[productionVariance()]] - `calls` [EXTRACTED]
- [[salesMovement()]] - `calls` [EXTRACTED]
- [[wastageSurges()]] - `calls` [EXTRACTED]

## Source
**From** `server/src/entities/intelligence/anomalies.ts` **(starting line 46):**
```typescript
function drilldown(
  filter: DatasetFilter,
  parts: { from: string; to: string; datasetType?: DatasetType; product?: string | null }
```

#graphify/code #graphify/EXTRACTED #community/Business_Intelligence_Engine