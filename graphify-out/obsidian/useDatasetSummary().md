---
source_file: "client/src/lib/api/datasets.ts"
type: "code"
community: "Data Explorer & Import UI"
location: "L33"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Data_Explorer__Import_UI
---

# useDatasetSummary()

## Connections
- [[apidatasets.ts]] - `contains` [EXTRACTED]
- [[apiGet()]] - `calls` [EXTRACTED]
- [[filterToParams()_1]] - `calls` [EXTRACTED]

## Source
**From** `client/src/lib/api/datasets.ts` **(starting line 33):**
```typescript
export function useDatasetSummary(filter: DatasetFilter) {
  return useQuery({
    queryKey: ["dataset-summary", filter],
    queryFn: () => apiGet<DatasetSummary>(`/datasets/summary${filterToParams(filter)}`),
  });
}
```

#graphify/code #graphify/EXTRACTED #community/Data_Explorer__Import_UI