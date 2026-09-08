---
source_file: "client/src/lib/api/datasets.ts"
type: "code"
community: "Data Explorer & Import UI"
location: "L58"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Data_Explorer__Import_UI
---

# useDatasetFacets()

## Connections
- [[DataExplorerPage()]] - `calls` [EXTRACTED]
- [[DataExplorerPage.tsx]] - `imports` [EXTRACTED]
- [[apidatasets.ts]] - `contains` [EXTRACTED]
- [[apiGet()]] - `calls` [EXTRACTED]

## Source
**From** `client/src/lib/api/datasets.ts` **(starting line 58):**
```typescript
export function useDatasetFacets() {
  return useQuery({
    queryKey: ["dataset-facets"],
    queryFn: () => apiGet<{ products: string[]; outlets: string[]; shifts: string[] }>("/datasets/facets"),
  });
}
```

#graphify/code #graphify/EXTRACTED #community/Data_Explorer__Import_UI