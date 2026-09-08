---
source_file: "client/src/lib/api/sales.ts"
type: "code"
community: "Sales Import UI"
location: "L80"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Sales_Import_UI
---

# useDeleteImportBatch()

## Connections
- [[SalesImportPage()]] - `calls` [EXTRACTED]
- [[SalesImportPage.tsx]] - `imports` [EXTRACTED]
- [[apisales.ts]] - `contains` [EXTRACTED]
- [[apiDelete()]] - `calls` [EXTRACTED]

## Source
**From** `client/src/lib/api/sales.ts` **(starting line 80):**
```typescript
export function useDeleteImportBatch() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiDelete(`/sales/import-batches/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["sales-summary"] });
      qc.invalidateQueries({ queryKey: ["sales-import-batches"] });
    },
  });
}
```

#graphify/code #graphify/EXTRACTED #community/Sales_Import_UI