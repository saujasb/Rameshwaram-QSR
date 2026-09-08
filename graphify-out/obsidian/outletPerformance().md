---
source_file: "server/src/entities/datasets/repository.ts"
type: "code"
community: "Ramesh AI Query Engine"
location: "L493"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Ramesh_AI_Query_Engine
---

# outletPerformance()

## Connections
- [[analysis.ts]] - `imports` [EXTRACTED]
- [[datasetsrepository.ts]] - `contains` [EXTRACTED]
- [[segmentAnalysis()]] - `calls` [EXTRACTED]
- [[segmentPerformance()]] - `calls` [EXTRACTED]

## Source
**From** `server/src/entities/datasets/repository.ts` **(starting line 493):**
```typescript
export function outletPerformance(filter: DatasetFilter): SegmentPerformanceRow[] {
  return segmentPerformance("outlet", filter);
}
```

#graphify/code #graphify/EXTRACTED #community/Ramesh_AI_Query_Engine