---
source_file: "shared-types/datasets.ts"
type: "code"
community: "Business Intelligence Engine"
location: "L174"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Business_Intelligence_Engine
---

# DatasetFilter

## Connections
- [[Ctx]] - `references` [EXTRACTED]
- [[DataExplorerPage.tsx]] - `imports` [EXTRACTED]
- [[TopInsightsPanel.tsx]] - `imports` [EXTRACTED]
- [[analysis.ts]] - `imports` [EXTRACTED]
- [[anomalies.ts]] - `imports` [EXTRACTED]
- [[apidatasets.ts]] - `imports` [EXTRACTED]
- [[apiintelligence.ts]] - `imports` [EXTRACTED]
- [[datasetsrepository.ts]] - `imports` [EXTRACTED]
- [[datasetsroutes.ts]] - `imports` [EXTRACTED]
- [[engine.ts]] - `imports` [EXTRACTED]
- [[insights.ts]] - `imports` [EXTRACTED]
- [[intelligenceroutes.ts]] - `imports` [EXTRACTED]
- [[reconciliation.ts]] - `imports` [EXTRACTED]
- [[shared-typesdatasets.ts]] - `contains` [EXTRACTED]

## Source
**From** `shared-types/datasets.ts` **(starting line 174):**
```typescript
export interface DatasetFilter {
  from?: string;
  to?: string;
  datasetType?: DatasetType;
  product?: string;
  outlet?: string;
  shift?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}
```

#graphify/code #graphify/EXTRACTED #community/Business_Intelligence_Engine