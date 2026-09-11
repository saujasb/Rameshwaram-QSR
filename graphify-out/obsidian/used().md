---
source_file: "server/src/entities/ramesh/engine.ts"
type: "code"
community: "Ramesh AI Query Engine"
location: "L87"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Ramesh_AI_Query_Engine
---

# used()

## Connections
- [[answerCompareDatasets()]] - `calls` [EXTRACTED]
- [[answerCompareDates()]] - `calls` [EXTRACTED]
- [[answerCoverage()]] - `calls` [EXTRACTED]
- [[answerPeakHour()]] - `calls` [EXTRACTED]
- [[answerRanked()]] - `calls` [EXTRACTED]
- [[answerSeries()]] - `calls` [EXTRACTED]
- [[answerTotals()]] - `calls` [EXTRACTED]
- [[answerVariance()]] - `calls` [EXTRACTED]
- [[answerWastageReason()]] - `calls` [EXTRACTED]
- [[engine.ts]] - `contains` [EXTRACTED]

## Source
**From** `server/src/entities/ramesh/engine.ts` **(starting line 87):**
```typescript
function used(
  datasets: DatasetType[],
  filter: DatasetFilter,
  recordCount: number,
  span: { from: string | null; to: string | null }
```

#graphify/code #graphify/EXTRACTED #community/Ramesh_AI_Query_Engine