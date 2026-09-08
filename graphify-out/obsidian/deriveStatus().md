---
source_file: "client/src/modules/dashboard/DashboardPage.tsx"
type: "code"
community: "Dashboard & Sales Trend Visualization"
location: "L66"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Dashboard__Sales_Trend_Visualization
---

# deriveStatus()

## Connections
- [[DashboardPage()]] - `calls` [EXTRACTED]
- [[DashboardPage.tsx]] - `contains` [EXTRACTED]

## Source
**From** `client/src/modules/dashboard/DashboardPage.tsx` **(starting line 66):**
```tsx
function deriveStatus(pct: number | null, criticalCount: number): { label: string; tone: Tone } {
  if (criticalCount > 0) return { label: "Attention required", tone: "crit" };
  if (pct == null) return { label: "Not connected", tone: "notconn" };
  if (pct >= 100) return { label: "On track", tone: "good" };
  if (pct >= 85) return { label: "Watch", tone: "warn" };
  return { label: "Attention required", tone: "crit" };
}
```

#graphify/code #graphify/EXTRACTED #community/Dashboard__Sales_Trend_Visualization