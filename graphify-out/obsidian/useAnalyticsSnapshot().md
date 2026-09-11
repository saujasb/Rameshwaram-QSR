---
source_file: "client/src/lib/api/analytics.ts"
type: "code"
community: "KPI Scorecard & Analytics Snapshot"
location: "L5"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/KPI_Scorecard__Analytics_Snapshot
---

# useAnalyticsSnapshot()

## Connections
- [[DashboardPage()]] - `calls` [EXTRACTED]
- [[DashboardPage.tsx]] - `imports` [EXTRACTED]
- [[KpiScorecardPage()]] - `calls` [EXTRACTED]
- [[KpiScorecardPage.tsx]] - `imports` [EXTRACTED]
- [[SalesAnalyticsPage()]] - `calls` [EXTRACTED]
- [[SalesAnalyticsPage.tsx]] - `imports` [EXTRACTED]
- [[VegIndentPage()]] - `calls` [EXTRACTED]
- [[VegIndentPage.tsx]] - `imports` [EXTRACTED]
- [[apianalytics.ts]] - `contains` [EXTRACTED]
- [[apiGet()]] - `calls` [EXTRACTED]

## Source
**From** `client/src/lib/api/analytics.ts` **(starting line 5):**
```typescript
export function useAnalyticsSnapshot() {
  return useQuery({ queryKey: ["analytics-snapshot"], queryFn: () => apiGet<AnalyticsSnapshot>("/analytics/snapshot") });
}
```

#graphify/code #graphify/EXTRACTED #community/KPI_Scorecard__Analytics_Snapshot