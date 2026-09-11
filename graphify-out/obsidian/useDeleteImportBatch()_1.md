---
source_file: "client/src/lib/api/datasets.ts"
type: "code"
community: "Data Explorer & Import UI"
location: "L130"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Data_Explorer__Import_UI
---

# useDeleteImportBatch()

## Connections
- [[ImportCenterPage.tsx]] - `imports` [EXTRACTED]
- [[ImportHistory()]] - `calls` [EXTRACTED]
- [[apidatasets.ts]] - `contains` [EXTRACTED]
- [[useInvalidateDataLayer()]] - `calls` [EXTRACTED]

## Source
**From** `client/src/lib/api/datasets.ts` **(starting line 130):**
```typescript
export function useDeleteImportBatch() {
  const invalidate = useInvalidateDataLayer();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`${BASE}/datasets/import-batches/${id}`, { method: "DELETE" });
      if (!res.ok && res.status !== 204) throw new Error(`Delete failed with ${res.status}`);
    },
    onSuccess: invalidate,
  });
}
```

#graphify/code #graphify/EXTRACTED #community/Data_Explorer__Import_UI