---
source_file: "client/src/lib/api/datasets.ts"
type: "code"
community: "Data Explorer & Import UI"
location: "L65"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Data_Explorer__Import_UI
---

# useImportBatches()

## Connections
- [[ImportCenterPage.tsx]] - `imports` [EXTRACTED]
- [[ImportHistory()]] - `calls` [EXTRACTED]
- [[apidatasets.ts]] - `contains` [EXTRACTED]
- [[apiGet()]] - `calls` [EXTRACTED]

## Source
**From** `client/src/lib/api/datasets.ts` **(starting line 65):**
```typescript
export function useImportBatches() {
  return useQuery({ queryKey: ["dataset-import-batches"], queryFn: () => apiGet<ImportBatch[]>("/datasets/import-batches") });
}
```

#graphify/code #graphify/EXTRACTED #community/Data_Explorer__Import_UI