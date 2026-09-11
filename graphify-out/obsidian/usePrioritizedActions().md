---
source_file: "client/src/lib/api/analytics.ts"
type: "code"
community: "KPI Scorecard & Analytics Snapshot"
location: "L9"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/KPI_Scorecard__Analytics_Snapshot
---

# usePrioritizedActions()

## Connections
- [[SalesAnalyticsPage()]] - `calls` [EXTRACTED]
- [[SalesAnalyticsPage.tsx]] - `imports` [EXTRACTED]
- [[apianalytics.ts]] - `contains` [EXTRACTED]
- [[apiGet()]] - `calls` [EXTRACTED]

## Source
**From** `client/src/lib/api/analytics.ts` **(starting line 9):**
```typescript
export function usePrioritizedActions() {
  return useQuery({ queryKey: ["analytics-actions"], queryFn: () => apiGet<PrioritizedAction[]>("/analytics/actions") });
}
```

#graphify/code #graphify/EXTRACTED #community/KPI_Scorecard__Analytics_Snapshot