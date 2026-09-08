---
source_file: "client/src/modules/dashboard/DashboardPage.tsx"
type: "code"
community: "Dashboard & Sales Trend Visualization"
location: "L59"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Dashboard__Sales_Trend_Visualization
---

# targetTone()

## Connections
- [[DashboardPage()]] - `calls` [EXTRACTED]
- [[DashboardPage.tsx]] - `contains` [EXTRACTED]

## Source
**From** `client/src/modules/dashboard/DashboardPage.tsx` **(starting line 59):**
```tsx
function targetTone(pct: number | null): Tone {
  if (pct == null) return "notconn";
  if (pct >= 100) return "good";
  if (pct >= 85) return "warn";
  return "crit";
}
```

#graphify/code #graphify/EXTRACTED #community/Dashboard__Sales_Trend_Visualization