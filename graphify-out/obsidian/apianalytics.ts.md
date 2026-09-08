---
source_file: "client/src/lib/api/analytics.ts"
type: "code"
community: "KPI Scorecard & Analytics Snapshot"
location: "L1"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/KPI_Scorecard__Analytics_Snapshot
---

# api/analytics.ts

## Connections
- [[AnalyticsSnapshot]] - `imports` [EXTRACTED]
- [[DashboardPage.tsx]] - `imports_from` [EXTRACTED]
- [[KpiScorecardPage.tsx]] - `imports_from` [EXTRACTED]
- [[PrioritizedAction]] - `imports` [EXTRACTED]
- [[SalesAnalyticsPage.tsx]] - `imports_from` [EXTRACTED]
- [[VegIndentPage.tsx]] - `imports_from` [EXTRACTED]
- [[apiclient.ts]] - `imports_from` [EXTRACTED]
- [[apiGet()]] - `imports` [EXTRACTED]
- [[shared-typesanalytics.ts]] - `imports_from` [EXTRACTED]
- [[useAnalyticsSnapshot()]] - `contains` [EXTRACTED]
- [[usePrioritizedActions()]] - `contains` [EXTRACTED]

## Source
**From** `client/src/lib/api/analytics.ts` **(starting line 1):**
```typescript
import { useQuery } from "@tanstack/react-query";
```

#graphify/code #graphify/EXTRACTED #community/KPI_Scorecard__Analytics_Snapshot