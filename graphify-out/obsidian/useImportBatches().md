---
source_file: "client/src/lib/api/sales.ts"
type: "code"
community: "Sales Import UI"
location: "L22"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Sales_Import_UI
---

# useImportBatches()

## Connections
- [[SalesImportPage()]] - `calls` [EXTRACTED]
- [[SalesImportPage.tsx]] - `imports` [EXTRACTED]
- [[apisales.ts]] - `contains` [EXTRACTED]
- [[apiGet()]] - `calls` [EXTRACTED]

## Source
**From** `client/src/lib/api/sales.ts` **(starting line 22):**
```typescript
export function useImportBatches() {
  return useQuery({
    queryKey: ["sales-import-batches"],
    queryFn: () => apiGet<SalesImportBatch[]>("/sales/import-batches"),
  });
}
```

#graphify/code #graphify/EXTRACTED #community/Sales_Import_UI