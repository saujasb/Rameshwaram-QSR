---
source_file: "client/src/lib/format.ts"
type: "code"
community: "Dashboard & Sales Trend Visualization"
location: "L1"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Dashboard__Sales_Trend_Visualization
---

# format.ts

## Connections
- [[DashboardPage.tsx]] - `imports_from` [EXTRACTED]
- [[SalesAnalyticsPage.tsx]] - `imports_from` [EXTRACTED]
- [[formatInrCompact()]] - `contains` [EXTRACTED]
- [[formatSignedPct()]] - `contains` [EXTRACTED]
- [[formatTrendArrow()]] - `contains` [EXTRACTED]

## Source
**Full file:** `client/src/lib/format.ts`
```typescript
/** "₹8.42L" / "₹42.5k" / "₹850" -- for large dominant KPI numbers. Exact values still show in the note/tooltip. */
export function formatInrCompact(amount: number): string {
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)}L`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}k`;
  return `₹${Math.round(amount).toLocaleString("en-IN")}`;
}

export function formatSignedPct(pct: number, digits = 1): string {
  return `${pct >= 0 ? "+" : ""}${pct.toFixed(digits)}%`;
}

export function formatTrendArrow(pct: number | null): string {
  if (pct == null) return "—";
  return `${pct >= 0 ? "↑" : "↓"} ${Math.abs(pct).toFixed(1)}%`;
}
```

#graphify/code #graphify/EXTRACTED #community/Dashboard__Sales_Trend_Visualization