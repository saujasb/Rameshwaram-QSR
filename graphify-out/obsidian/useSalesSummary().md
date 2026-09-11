---
source_file: "client/src/lib/api/sales.ts"
type: "code"
community: "Sales Import UI"
location: "L11"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Sales_Import_UI
---

# useSalesSummary()

## Connections
- [[DashboardPage()]] - `calls` [EXTRACTED]
- [[DashboardPage.tsx]] - `imports` [EXTRACTED]
- [[LiveSalesSection()]] - `calls` [EXTRACTED]
- [[SalesAnalyticsPage.tsx]] - `imports` [EXTRACTED]
- [[apisales.ts]] - `contains` [EXTRACTED]
- [[apiGet()]] - `calls` [EXTRACTED]
- [[summaryKey()]] - `calls` [EXTRACTED]

## Source
**From** `client/src/lib/api/sales.ts` **(starting line 11):**
```typescript
export function useSalesSummary(from?: string, to?: string) {
  const params = new URLSearchParams();
  if (from) params.set("from", from);
  if (to) params.set("to", to);
  const qs = params.toString();
  return useQuery({
    queryKey: summaryKey(from, to),
    queryFn: () => apiGet<SalesSummary>(`/sales/summary${qs ? `?${qs}` : ""}`),
  });
}
```

#graphify/code #graphify/EXTRACTED #community/Sales_Import_UI