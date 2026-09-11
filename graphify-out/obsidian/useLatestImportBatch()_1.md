---
source_file: "client/src/lib/api/datasets.ts"
type: "code"
community: "App Shell & Bootstrap"
location: "L69"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/App_Shell__Bootstrap
---

# useLatestImportBatch()

## Connections
- [[AppShell.tsx]] - `imports` [EXTRACTED]
- [[OpsStatusStrip()]] - `calls` [EXTRACTED]
- [[apidatasets.ts]] - `contains` [EXTRACTED]
- [[apiGet()]] - `calls` [EXTRACTED]

## Source
**From** `client/src/lib/api/datasets.ts` **(starting line 69):**
```typescript
export function useLatestImportBatch() {
  return useQuery({
    queryKey: ["dataset-import-batches"],
    queryFn: () => apiGet<ImportBatch[]>("/datasets/import-batches"),
    select: (b) => b[0] ?? null,
  });
}
```

#graphify/code #graphify/EXTRACTED #community/App_Shell__Bootstrap