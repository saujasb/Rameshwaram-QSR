---
source_file: "client/src/lib/format.ts"
type: "code"
community: "Dashboard & Sales Trend Visualization"
location: "L8"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Dashboard__Sales_Trend_Visualization
---

# formatSignedPct()

## Connections
- [[format.ts]] - `contains` [EXTRACTED]

## Source
**From** `client/src/lib/format.ts` **(starting line 8):**
```typescript
export function formatSignedPct(pct: number, digits = 1): string {
  return `${pct >= 0 ? "+" : ""}${pct.toFixed(digits)}%`;
}
```

#graphify/code #graphify/EXTRACTED #community/Dashboard__Sales_Trend_Visualization