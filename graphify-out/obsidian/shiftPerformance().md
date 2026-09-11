---
source_file: "server/src/entities/datasets/repository.ts"
type: "code"
community: "Ramesh AI Query Engine"
location: "L489"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Ramesh_AI_Query_Engine
---

# shiftPerformance()

## Connections
- [[analysis.ts]] - `imports` [EXTRACTED]
- [[datasetsrepository.ts]] - `contains` [EXTRACTED]
- [[rootCause()]] - `calls` [EXTRACTED]
- [[segmentAnalysis()]] - `calls` [EXTRACTED]
- [[segmentPerformance()]] - `calls` [EXTRACTED]

## Source
**From** `server/src/entities/datasets/repository.ts` **(starting line 489):**
```typescript
export function shiftPerformance(filter: DatasetFilter): SegmentPerformanceRow[] {
  return segmentPerformance("shift", filter);
}
```

#graphify/code #graphify/EXTRACTED #community/Ramesh_AI_Query_Engine