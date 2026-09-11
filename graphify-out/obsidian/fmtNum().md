---
source_file: "client/src/modules/intelligence/IntelligencePage.tsx"
type: "code"
community: "Business Intelligence Engine"
location: "L15"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Business_Intelligence_Engine
---

# fmtNum()

## Connections
- [[AnomalyCard()]] - `calls` [EXTRACTED]
- [[IntelligencePage.tsx]] - `contains` [EXTRACTED]

## Source
**From** `client/src/modules/intelligence/IntelligencePage.tsx` **(starting line 15):**
```tsx
function fmtNum(n: number, unit: Anomaly["unit"]): string {
  if (unit === "rupees") return `₹${n.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
  if (unit === "pct") return `${n.toFixed(1)}%`;
  return n.toLocaleString("en-IN", { maximumFractionDigits: 2 });
}
```

#graphify/code #graphify/EXTRACTED #community/Business_Intelligence_Engine