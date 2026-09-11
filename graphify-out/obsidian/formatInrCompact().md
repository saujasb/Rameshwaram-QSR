---
source_file: "client/src/lib/format.ts"
type: "code"
community: "Dashboard & Sales Trend Visualization"
location: "L2"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Dashboard__Sales_Trend_Visualization
---

# formatInrCompact()

## Connections
- [[DashboardPage()]] - `calls` [EXTRACTED]
- [[DashboardPage.tsx]] - `imports` [EXTRACTED]
- [[LiveSalesSection()]] - `calls` [EXTRACTED]
- [[SalesAnalyticsPage.tsx]] - `imports` [EXTRACTED]
- [[format.ts]] - `contains` [EXTRACTED]

## Source
**From** `client/src/lib/format.ts` **(starting line 2):**
```typescript
export function formatInrCompact(amount: number): string {
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)}L`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}k`;
  return `₹${Math.round(amount).toLocaleString("en-IN")}`;
}
```

#graphify/code #graphify/EXTRACTED #community/Dashboard__Sales_Trend_Visualization