---
source_file: "shared-types/businessDate.ts"
type: "code"
community: "Dashboard & Sales Trend Visualization"
location: "L26"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Dashboard__Sales_Trend_Visualization
---

# shiftDateKey()

## Connections
- [[BusinessDayTimeline()]] - `calls` [EXTRACTED]
- [[BusinessDayTimeline.tsx]] - `imports` [EXTRACTED]
- [[DashboardPage()]] - `calls` [EXTRACTED]
- [[DashboardPage.tsx]] - `imports` [EXTRACTED]
- [[LiveSalesSection()]] - `calls` [EXTRACTED]
- [[SalesAnalyticsPage.tsx]] - `imports` [EXTRACTED]
- [[anomalies.ts]] - `imports` [EXTRACTED]
- [[businessDate.ts]] - `contains` [EXTRACTED]
- [[businessDateRange()]] - `calls` [EXTRACTED]
- [[computeRange()]] - `calls` [EXTRACTED]
- [[getBusinessDate()]] - `calls` [EXTRACTED]
- [[getBusinessDayBounds()]] - `calls` [EXTRACTED]
- [[intents.ts]] - `imports` [EXTRACTED]
- [[productStalls()]] - `calls` [EXTRACTED]
- [[relativeRange()]] - `calls` [EXTRACTED]
- [[toDateKey()]] - `calls` [EXTRACTED]
- [[weekStart()]] - `calls` [EXTRACTED]

## Source
**From** `shared-types/businessDate.ts` **(starting line 26):**
```typescript
export function shiftDateKey(dateKey: string, days: number): string {
  const [y, m, d] = dateKey.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + days);
  return toDateKey(dt);
}
```

#graphify/code #graphify/EXTRACTED #community/Dashboard__Sales_Trend_Visualization