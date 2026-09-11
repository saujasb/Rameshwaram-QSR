---
source_file: "client/src/modules/intelligence/TodaysIntelligencePanel.tsx"
type: "code"
community: "Business Intelligence Engine"
location: "L23"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Business_Intelligence_Engine
---

# fmtQty()

## Connections
- [[IntelligencePage.tsx]] - `imports` [EXTRACTED]
- [[TodaysIntelligencePanel()]] - `calls` [EXTRACTED]
- [[TodaysIntelligencePanel.tsx]] - `contains` [EXTRACTED]

## Source
**From** `client/src/modules/intelligence/TodaysIntelligencePanel.tsx` **(starting line 23):**
```tsx
export function fmtQty(v: number): string {
  return v.toLocaleString("en-IN", { maximumFractionDigits: 2 });
}
```

#graphify/code #graphify/EXTRACTED #community/Business_Intelligence_Engine