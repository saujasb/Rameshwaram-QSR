---
source_file: "server/src/entities/datasets/repository.ts"
type: "code"
community: "Ramesh AI Query Engine"
location: "L445"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Ramesh_AI_Query_Engine
---

# SegmentPerformanceRow

## Connections
- [[analysis.ts]] - `imports` [EXTRACTED]
- [[datasetsrepository.ts]] - `contains` [EXTRACTED]

## Source
**From** `server/src/entities/datasets/repository.ts` **(starting line 445):**
```typescript
export interface SegmentPerformanceRow {
  segment: string;
  salesQty: number;
  salesValue: number;
  productionQty: number;
  wastageQty: number;
  sellThroughPct: number | null;
  wastagePct: number | null;
  variancePct: number | null;
  recordCount: number;
}
```

#graphify/code #graphify/EXTRACTED #community/Ramesh_AI_Query_Engine