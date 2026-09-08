---
source_file: "server/src/entities/ramesh/engine.ts"
type: "code"
community: "Ramesh AI Query Engine"
location: "L59"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Ramesh_AI_Query_Engine
---

# rangeLabel()

## Connections
- [[answerCompareDatasets()]] - `calls` [EXTRACTED]
- [[answerCoverage()]] - `calls` [EXTRACTED]
- [[answerPeakHour()]] - `calls` [EXTRACTED]
- [[answerRanked()]] - `calls` [EXTRACTED]
- [[answerTotals()]] - `calls` [EXTRACTED]
- [[answerVariance()]] - `calls` [EXTRACTED]
- [[answerWastageReason()]] - `calls` [EXTRACTED]
- [[engine.ts]] - `contains` [EXTRACTED]
- [[formatBusinessDateLong()]] - `calls` [EXTRACTED]
- [[noMatch()]] - `calls` [EXTRACTED]

## Source
**From** `server/src/entities/ramesh/engine.ts` **(starting line 59):**
```typescript
function rangeLabel(from: string | null | undefined, to: string | null | undefined): string {
  if (!from && !to) return "all imported business days";
  if (from && to && from === to) return formatBusinessDateLong(from);
  if (from && to) return `${formatBusinessDateLong(from)} – ${formatBusinessDateLong(to)}`;
  return formatBusinessDateLong((from ?? to) as string);
}
```

#graphify/code #graphify/EXTRACTED #community/Ramesh_AI_Query_Engine