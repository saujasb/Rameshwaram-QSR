---
source_file: "client/src/lib/api/datasets.ts"
type: "code"
community: "Data Explorer & Import UI"
location: "L47"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Data_Explorer__Import_UI
---

# useProductPerformance()

## Connections
- [[apidatasets.ts]] - `contains` [EXTRACTED]
- [[apiGet()]] - `calls` [EXTRACTED]
- [[filterToParams()_1]] - `calls` [EXTRACTED]

## Source
**From** `client/src/lib/api/datasets.ts` **(starting line 47):**
```typescript
export function useProductPerformance(filter: DatasetFilter) {
  return useQuery({
    queryKey: ["dataset-products", filter],
    queryFn: () => apiGet<ProductPerformanceRow[]>(`/datasets/products${filterToParams(filter)}`),
  });
}
```

#graphify/code #graphify/EXTRACTED #community/Data_Explorer__Import_UI