---
source_file: "client/src/lib/api/datasets.ts"
type: "code"
community: "Data Explorer & Import UI"
location: "L54"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Data_Explorer__Import_UI
---

# useDatasetCoverage()

## Connections
- [[CoverageCard()]] - `calls` [EXTRACTED]
- [[MissingDataNote()]] - `calls` [EXTRACTED]
- [[SettingsPage.tsx]] - `imports` [EXTRACTED]
- [[TopInsightsPanel.tsx]] - `imports` [EXTRACTED]
- [[apidatasets.ts]] - `contains` [EXTRACTED]
- [[apiGet()]] - `calls` [EXTRACTED]

## Source
**From** `client/src/lib/api/datasets.ts` **(starting line 54):**
```typescript
export function useDatasetCoverage() {
  return useQuery({ queryKey: ["dataset-coverage"], queryFn: () => apiGet<DatasetCoverage[]>("/datasets/coverage") });
}
```

#graphify/code #graphify/EXTRACTED #community/Data_Explorer__Import_UI