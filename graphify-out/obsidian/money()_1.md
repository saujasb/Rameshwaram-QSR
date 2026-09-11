---
source_file: "server/src/entities/ramesh/analysis.ts"
type: "code"
community: "Ramesh AI Query Engine"
location: "L22"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Ramesh_AI_Query_Engine
---

# money()

## Connections
- [[analysis.ts]] - `contains` [EXTRACTED]
- [[executiveAnalysis()]] - `calls` [EXTRACTED]
- [[rootCause()]] - `calls` [EXTRACTED]
- [[segmentAnalysis()]] - `calls` [EXTRACTED]

## Source
**From** `server/src/entities/ramesh/analysis.ts` **(starting line 22):**
```typescript
const money = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;
```

#graphify/code #graphify/EXTRACTED #community/Ramesh_AI_Query_Engine