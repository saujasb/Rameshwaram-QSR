---
source_file: "client/src/lib/api/sales.ts"
type: "code"
community: "Dashboard & Sales Trend Visualization"
location: "L30"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Dashboard__Sales_Trend_Visualization
---

# useLatestImportBatch()

## Connections
- [[DashboardPage()]] - `calls` [EXTRACTED]
- [[DashboardPage.tsx]] - `imports` [EXTRACTED]
- [[SalesAnalyticsPage()]] - `calls` [EXTRACTED]
- [[SalesAnalyticsPage.tsx]] - `imports` [EXTRACTED]
- [[apisales.ts]] - `contains` [EXTRACTED]
- [[apiGet()]] - `calls` [EXTRACTED]

## Source
**From** `client/src/lib/api/sales.ts` **(starting line 30):**
```typescript
export function useLatestImportBatch() {
  return useQuery({
    queryKey: ["sales-import-batches"],
    queryFn: () => apiGet<SalesImportBatch[]>("/sales/import-batches"),
    select: (batches) => batches[0] ?? null,
  });
}
```

#graphify/code #graphify/EXTRACTED #community/Dashboard__Sales_Trend_Visualization