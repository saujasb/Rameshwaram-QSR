---
source_file: "server/src/entities/ramesh/engine.ts"
type: "code"
community: "Ramesh AI Query Engine"
location: "L174"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Ramesh_AI_Query_Engine
---

# insufficient()

## Connections
- [[answerCompareDatasets()]] - `calls` [EXTRACTED]
- [[answerCompareDates()]] - `calls` [EXTRACTED]
- [[answerCoverage()]] - `calls` [EXTRACTED]
- [[answerPeakHour()]] - `calls` [EXTRACTED]
- [[answerSeries()]] - `calls` [EXTRACTED]
- [[answerWastageReason()]] - `calls` [EXTRACTED]
- [[drilldown()_1]] - `calls` [EXTRACTED]
- [[engine.ts]] - `contains` [EXTRACTED]
- [[missingDataset()]] - `calls` [EXTRACTED]
- [[noMatch()]] - `calls` [EXTRACTED]
- [[shell()]] - `calls` [EXTRACTED]

## Source
**From** `server/src/entities/ramesh/engine.ts` **(starting line 174):**
```typescript
function insufficient(c: Ctx, answer: string, conclusion: string, filter?: DatasetFilter, type?: DatasetType): RameshAnswer {
  return shell(c, {
    answer,
    conclusion,
    insufficientData: true,
    drilldownQuery: filter ? drilldown(filter, type) : null,
  });
}
```

#graphify/code #graphify/EXTRACTED #community/Ramesh_AI_Query_Engine