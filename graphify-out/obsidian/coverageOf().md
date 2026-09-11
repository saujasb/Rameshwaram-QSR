---
source_file: "server/src/entities/ramesh/engine.ts"
type: "code"
community: "Ramesh AI Query Engine"
location: "L183"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Ramesh_AI_Query_Engine
---

# coverageOf()

## Connections
- [[answerCompareDatasets()]] - `calls` [EXTRACTED]
- [[answerCompareDates()]] - `calls` [EXTRACTED]
- [[answerRanked()]] - `calls` [EXTRACTED]
- [[answerSeries()]] - `calls` [EXTRACTED]
- [[answerTotals()]] - `calls` [EXTRACTED]
- [[answerVariance()]] - `calls` [EXTRACTED]
- [[answerWastageReason()]] - `calls` [EXTRACTED]
- [[engine.ts]] - `contains` [EXTRACTED]

## Source
**From** `server/src/entities/ramesh/engine.ts` **(starting line 183):**
```typescript
function coverageOf(c: Ctx, type: DatasetType): DatasetCoverage | undefined {
  const cov = c.coverage.find((x) => x.datasetType === type);
  return cov && cov.recordCount > 0 ? cov : undefined;
}
```

#graphify/code #graphify/EXTRACTED #community/Ramesh_AI_Query_Engine