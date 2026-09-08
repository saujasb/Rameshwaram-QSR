---
source_file: "server/src/entities/ramesh/engine.ts"
type: "code"
community: "Ramesh AI Query Engine"
location: "L75"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Ramesh_AI_Query_Engine
---

# drilldown()

## Connections
- [[answerCompareDatasets()]] - `calls` [EXTRACTED]
- [[answerCompareDates()]] - `calls` [EXTRACTED]
- [[answerPeakHour()]] - `calls` [EXTRACTED]
- [[answerRanked()]] - `calls` [EXTRACTED]
- [[answerSeries()]] - `calls` [EXTRACTED]
- [[answerTotals()]] - `calls` [EXTRACTED]
- [[answerVariance()]] - `calls` [EXTRACTED]
- [[answerWastageReason()]] - `calls` [EXTRACTED]
- [[engine.ts]] - `contains` [EXTRACTED]
- [[fromAnalysis()]] - `calls` [EXTRACTED]
- [[insufficient()]] - `calls` [EXTRACTED]

## Source
**From** `server/src/entities/ramesh/engine.ts` **(starting line 75):**
```typescript
function drilldown(filter: DatasetFilter, type?: DatasetType): Record<string, string> {
  const out: Record<string, string> = {};
  if (filter.from) out.from = filter.from;
  if (filter.to) out.to = filter.to;
  if (type) out.datasetType = type;
  if (filter.product) out.product = filter.product;
  if (filter.search) out.search = filter.search;
  if (filter.outlet) out.outlet = filter.outlet;
  if (filter.shift) out.shift = filter.shift;
  return out;
}
```

#graphify/code #graphify/EXTRACTED #community/Ramesh_AI_Query_Engine