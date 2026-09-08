---
source_file: "server/src/entities/ramesh/engine.ts"
type: "code"
community: "Ramesh AI Query Engine"
location: "L66"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Ramesh_AI_Query_Engine
---

# scopeNote()

## Connections
- [[answerCompareDatasets()]] - `calls` [EXTRACTED]
- [[answerPeakHour()]] - `calls` [EXTRACTED]
- [[answerRanked()]] - `calls` [EXTRACTED]
- [[answerSeries()]] - `calls` [EXTRACTED]
- [[answerTotals()]] - `calls` [EXTRACTED]
- [[answerVariance()]] - `calls` [EXTRACTED]
- [[answerWastageReason()]] - `calls` [EXTRACTED]
- [[engine.ts]] - `contains` [EXTRACTED]
- [[noMatch()]] - `calls` [EXTRACTED]

## Source
**From** `server/src/entities/ramesh/engine.ts` **(starting line 66):**
```typescript
function scopeNote(filter: DatasetFilter): string {
  const bits: string[] = [];
  if (filter.product) bits.push(`product “${filter.product}”`);
  else if (filter.search) bits.push(`products matching “${filter.search}”`);
  if (filter.outlet) bits.push(`outlet ${filter.outlet}`);
  if (filter.shift) bits.push(`shift ${filter.shift}`);
  return bits.length ? ` (${bits.join(", ")})` : "";
}
```

#graphify/code #graphify/EXTRACTED #community/Ramesh_AI_Query_Engine