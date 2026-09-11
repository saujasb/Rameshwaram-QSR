---
source_file: "client/src/modules/sales-analytics/SalesAnalyticsPage.tsx"
type: "code"
community: "Sales Analytics Charts"
location: "L28"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Sales_Analytics_Charts
---

# RangePreset

## Connections
- [[SalesAnalyticsPage.tsx]] - `contains` [EXTRACTED]

## Source
**From** `client/src/modules/sales-analytics/SalesAnalyticsPage.tsx` **(starting line 28):**
```tsx
type RangePreset = "today" | "yesterday" | "week" | "month" | "all" | "custom";

function computeRange(preset: RangePreset, customFrom: string, customTo: string): { from?: string; to?: string } {
  const today = getCurrentBusinessDate();
  if (preset === "today") return { from: today, to: today };
  if (preset === "yesterday") {
    const y = shiftDateKey(today, -1);
    return { from: y, to: y };
  }
  if (preset === "week") return { from: shiftDateKey(today, -6), to: today };
  if (preset === "month") return { from: shiftDateKey(today, -29), to: today };
  if (preset === "all") return {};
  return { from: customFrom || undefined, to: customTo || undefined };
}
```

#graphify/code #graphify/EXTRACTED #community/Sales_Analytics_Charts