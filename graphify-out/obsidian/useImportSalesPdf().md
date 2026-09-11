---
source_file: "client/src/lib/api/sales.ts"
type: "code"
community: "Sales Import UI"
location: "L42"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Sales_Import_UI
---

# useImportSalesPdf()

## Connections
- [[SalesImportPage()]] - `calls` [EXTRACTED]
- [[SalesImportPage.tsx]] - `imports` [EXTRACTED]
- [[apisales.ts]] - `contains` [EXTRACTED]

## Source
**From** `client/src/lib/api/sales.ts` **(starting line 42):**
```typescript
export function useImportSalesPdf() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ file, businessDate }: { file: File; businessDate?: string }) => {
      const formData = new FormData();
      formData.append("file", file);
      if (businessDate) formData.append("businessDate", businessDate);
      const res = await fetch(`${BASE}/sales/import`, { method: "POST", body: formData });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        const err = new Error(body.error ?? `Request failed with ${res.status}`) as ImportError;
        err.detail = body.detail;
        throw err;
      }
      return body as SalesImportBatch;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["sales-summary"] });
      qc.invalidateQueries({ queryKey: ["sales-import-batches"] });
    },
  });
}
```

#graphify/code #graphify/EXTRACTED #community/Sales_Import_UI