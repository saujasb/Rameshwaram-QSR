---
source_file: "shared-types/datasets.ts"
type: "code"
community: "Ramesh AI Query Engine"
location: "L191"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Ramesh_AI_Query_Engine
---

# DatasetCoverage

## Connections
- [[Ctx]] - `references` [EXTRACTED]
- [[apidatasets.ts]] - `imports` [EXTRACTED]
- [[datasetsrepository.ts]] - `imports` [EXTRACTED]
- [[engine.ts]] - `imports` [EXTRACTED]
- [[shared-typesdatasets.ts]] - `contains` [EXTRACTED]

## Source
**From** `shared-types/datasets.ts` **(starting line 191):**
```typescript
export interface DatasetCoverage {
  datasetType: DatasetType;
  recordCount: number;
  businessDateFrom: string | null;
  businessDateTo: string | null;
  hasTimestamps: boolean;
  distinctProducts: number;
}
```

#graphify/code #graphify/EXTRACTED #community/Ramesh_AI_Query_Engine