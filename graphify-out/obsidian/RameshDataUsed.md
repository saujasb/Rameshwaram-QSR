---
source_file: "shared-types/ramesh.ts"
type: "code"
community: "Ramesh AI Query Engine"
location: "L59"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Ramesh_AI_Query_Engine
---

# RameshDataUsed

## Connections
- [[DatasetType]] - `references` [EXTRACTED]
- [[engine.ts]] - `imports` [EXTRACTED]
- [[shared-typesramesh.ts]] - `contains` [EXTRACTED]

## Source
**From** `shared-types/ramesh.ts` **(starting line 59):**
```typescript
export interface RameshDataUsed {
  datasets: DatasetType[];
  businessDateFrom: string | null;
  businessDateTo: string | null;
  product: string | null;
  outlet: string | null;
  shift: string | null;
  recordCount: number;
}
```

#graphify/code #graphify/EXTRACTED #community/Ramesh_AI_Query_Engine