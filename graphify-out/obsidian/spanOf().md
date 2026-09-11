---
source_file: "server/src/entities/ramesh/engine.ts"
type: "code"
community: "Ramesh AI Query Engine"
location: "L104"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Ramesh_AI_Query_Engine
---

# spanOf()

## Connections
- [[answerCompareDatasets()]] - `calls` [EXTRACTED]
- [[answerPeakHour()]] - `calls` [EXTRACTED]
- [[answerRanked()]] - `calls` [EXTRACTED]
- [[answerVariance()]] - `calls` [EXTRACTED]
- [[answerWastageReason()]] - `calls` [EXTRACTED]
- [[dailyTotals()]] - `calls` [EXTRACTED]
- [[engine.ts]] - `contains` [EXTRACTED]
- [[fromAnalysis()]] - `calls` [EXTRACTED]

## Source
**From** `server/src/entities/ramesh/engine.ts` **(starting line 104):**
```typescript
function spanOf(filter: DatasetFilter): { from: string | null; to: string | null } {
  const daily = dailyTotals(filter);
  if (daily.length === 0) return { from: filter.from ?? null, to: filter.to ?? null };
  return { from: daily[0].businessDate, to: daily[daily.length - 1].businessDate };
}
```

#graphify/code #graphify/EXTRACTED #community/Ramesh_AI_Query_Engine