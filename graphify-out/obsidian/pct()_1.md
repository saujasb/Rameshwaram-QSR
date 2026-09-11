---
source_file: "server/src/entities/ramesh/engine.ts"
type: "code"
community: "Ramesh AI Query Engine"
location: "L48"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Ramesh_AI_Query_Engine
---

# pct()

## Connections
- [[answerCompareDatasets()]] - `calls` [EXTRACTED]
- [[answerCompareDates()]] - `calls` [EXTRACTED]
- [[answerPeakHour()]] - `calls` [EXTRACTED]
- [[answerRanked()]] - `calls` [EXTRACTED]
- [[answerSeries()]] - `calls` [EXTRACTED]
- [[answerVariance()]] - `calls` [EXTRACTED]
- [[answerWastageReason()]] - `calls` [EXTRACTED]
- [[engine.ts]] - `contains` [EXTRACTED]

## Source
**From** `server/src/entities/ramesh/engine.ts` **(starting line 48):**
```typescript
const pct = (n: number): string => `${n.toFixed(1)}%`;
```

#graphify/code #graphify/EXTRACTED #community/Ramesh_AI_Query_Engine