---
source_file: "server/src/entities/ramesh/analysis.ts"
type: "code"
community: "Ramesh AI Query Engine"
location: "L24"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Ramesh_AI_Query_Engine
---

# pct()

## Connections
- [[analysis.ts]] - `contains` [EXTRACTED]
- [[anomalyToLine()]] - `calls` [EXTRACTED]
- [[efficiencyAnalysis()]] - `calls` [EXTRACTED]
- [[executiveAnalysis()]] - `calls` [EXTRACTED]
- [[productAnalysis()]] - `calls` [EXTRACTED]
- [[reconciliationAnalysis()]] - `calls` [EXTRACTED]
- [[rootCause()]] - `calls` [EXTRACTED]
- [[segmentAnalysis()]] - `calls` [EXTRACTED]

## Source
**From** `server/src/entities/ramesh/analysis.ts` **(starting line 24):**
```typescript
const pct = (n: number) => `${n >= 0 ? "" : ""}${n.toFixed(1)}%`;
```

#graphify/code #graphify/EXTRACTED #community/Ramesh_AI_Query_Engine