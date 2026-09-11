---
source_file: "shared-types/businessDate.ts"
type: "code"
community: "Dashboard & Sales Trend Visualization"
location: "L104"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Dashboard__Sales_Trend_Visualization
---

# formatBusinessDateShort()

## Connections
- [[BusinessDayExamples()]] - `calls` [EXTRACTED]
- [[BusinessDayTimeline()]] - `calls` [EXTRACTED]
- [[BusinessDayTimeline.tsx]] - `imports` [EXTRACTED]
- [[SalesTrendChart()]] - `calls` [EXTRACTED]
- [[SalesTrendChart.tsx]] - `imports` [EXTRACTED]
- [[SettingsPage.tsx]] - `imports` [EXTRACTED]
- [[businessDate.ts]] - `contains` [EXTRACTED]

## Source
**From** `shared-types/businessDate.ts` **(starting line 104):**
```typescript
export function formatBusinessDateShort(dateKey: string): string {
  const [y, m, d] = dateKey.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
}
```

#graphify/code #graphify/EXTRACTED #community/Dashboard__Sales_Trend_Visualization