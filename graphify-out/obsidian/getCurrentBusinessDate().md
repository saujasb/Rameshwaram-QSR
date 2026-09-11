---
source_file: "shared-types/businessDate.ts"
type: "code"
community: "Dashboard & Sales Trend Visualization"
location: "L48"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Dashboard__Sales_Trend_Visualization
---

# getCurrentBusinessDate()

## Connections
- [[AppShell.tsx]] - `imports` [EXTRACTED]
- [[DashboardPage()]] - `calls` [EXTRACTED]
- [[DashboardPage.tsx]] - `imports` [EXTRACTED]
- [[ImportCenterPage()]] - `calls` [EXTRACTED]
- [[ImportCenterPage.tsx]] - `imports` [EXTRACTED]
- [[LiveSalesSection()]] - `calls` [EXTRACTED]
- [[SalesAnalyticsPage.tsx]] - `imports` [EXTRACTED]
- [[SalesImportPage()]] - `calls` [EXTRACTED]
- [[SalesImportPage.tsx]] - `imports` [EXTRACTED]
- [[ShiftPerformancePage()]] - `calls` [EXTRACTED]
- [[ShiftPerformancePage.tsx]] - `imports` [EXTRACTED]
- [[businessDate.ts]] - `contains` [EXTRACTED]
- [[classify()]] - `calls` [EXTRACTED]
- [[computeRange()]] - `calls` [EXTRACTED]
- [[getBusinessDate()]] - `calls` [EXTRACTED]
- [[intelligenceroutes.ts]] - `imports` [EXTRACTED]
- [[intents.ts]] - `imports` [EXTRACTED]
- [[resolveBusinessDate()]] - `calls` [EXTRACTED]
- [[useLiveBusinessDate()]] - `calls` [EXTRACTED]

## Source
**From** `shared-types/businessDate.ts` **(starting line 48):**
```typescript
export function getCurrentBusinessDate(startHour = DEFAULT_BUSINESS_DAY_START_HOUR): string {
  return getBusinessDate(new Date(), startHour);
}
```

#graphify/code #graphify/EXTRACTED #community/Dashboard__Sales_Trend_Visualization