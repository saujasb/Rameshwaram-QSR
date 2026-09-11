---
source_file: "client/src/lib/format.ts"
type: "code"
community: "Dashboard & Sales Trend Visualization"
location: "L12"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Dashboard__Sales_Trend_Visualization
---

# formatTrendArrow()

## Connections
- [[DashboardPage()]] - `calls` [EXTRACTED]
- [[DashboardPage.tsx]] - `imports` [EXTRACTED]
- [[format.ts]] - `contains` [EXTRACTED]

## Source
**From** `client/src/lib/format.ts` **(starting line 12):**
```typescript
export function formatTrendArrow(pct: number | null): string {
  if (pct == null) return "—";
  return `${pct >= 0 ? "↑" : "↓"} ${Math.abs(pct).toFixed(1)}%`;
}
```

#graphify/code #graphify/EXTRACTED #community/Dashboard__Sales_Trend_Visualization