---
source_file: "client/src/modules/dashboard/DashboardPage.tsx"
type: "code"
community: "Dashboard & Sales Trend Visualization"
location: "L54"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Dashboard__Sales_Trend_Visualization
---

# growthTone()

## Connections
- [[DashboardPage()]] - `calls` [EXTRACTED]
- [[DashboardPage.tsx]] - `contains` [EXTRACTED]

## Source
**From** `client/src/modules/dashboard/DashboardPage.tsx` **(starting line 54):**
```tsx
function growthTone(pct: number | null): Tone {
  if (pct == null) return "notconn";
  return pct >= 0 ? "good" : "warn";
}
```

#graphify/code #graphify/EXTRACTED #community/Dashboard__Sales_Trend_Visualization