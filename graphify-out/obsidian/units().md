---
source_file: "server/src/entities/ramesh/analysis.ts"
type: "code"
community: "Ramesh AI Query Engine"
location: "L23"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Ramesh_AI_Query_Engine
---

# units()

## Connections
- [[analysis.ts]] - `contains` [EXTRACTED]
- [[efficiencyAnalysis()]] - `calls` [EXTRACTED]
- [[executiveAnalysis()]] - `calls` [EXTRACTED]
- [[productAnalysis()]] - `calls` [EXTRACTED]
- [[reconciliationAnalysis()]] - `calls` [EXTRACTED]
- [[rootCause()]] - `calls` [EXTRACTED]
- [[segmentAnalysis()]] - `calls` [EXTRACTED]

## Source
**From** `server/src/entities/ramesh/analysis.ts` **(starting line 23):**
```typescript
const units = (n: number) => `${Number(n.toFixed(2)).toLocaleString("en-IN")} units`;
```

#graphify/code #graphify/EXTRACTED #community/Ramesh_AI_Query_Engine