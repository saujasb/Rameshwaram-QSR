---
source_file: "client/src/lib/api/datasets.ts"
type: "code"
community: "Data Explorer & Import UI"
location: "L40"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Data_Explorer__Import_UI
---

# useDatasetRecords()

## Connections
- [[DataExplorerPage()]] - `calls` [EXTRACTED]
- [[DataExplorerPage.tsx]] - `imports` [EXTRACTED]
- [[apidatasets.ts]] - `contains` [EXTRACTED]
- [[apiGet()]] - `calls` [EXTRACTED]
- [[filterToParams()_1]] - `calls` [EXTRACTED]

## Source
**From** `client/src/lib/api/datasets.ts` **(starting line 40):**
```typescript
export function useDatasetRecords(filter: DatasetFilter) {
  return useQuery({
    queryKey: ["dataset-records", filter],
    queryFn: () => apiGet<PaginatedRecords>(`/datasets/records${filterToParams(filter)}`),
  });
}
```

#graphify/code #graphify/EXTRACTED #community/Data_Explorer__Import_UI