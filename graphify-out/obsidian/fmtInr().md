---
source_file: "client/src/modules/intelligence/TodaysIntelligencePanel.tsx"
type: "code"
community: "Business Intelligence Engine"
location: "L27"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Business_Intelligence_Engine
---

# fmtInr()

## Connections
- [[TodaysIntelligencePanel()]] - `calls` [EXTRACTED]
- [[TodaysIntelligencePanel.tsx]] - `contains` [EXTRACTED]

## Source
**From** `client/src/modules/intelligence/TodaysIntelligencePanel.tsx` **(starting line 27):**
```tsx
export function fmtInr(v: number): string {
  return `₹${Math.round(v).toLocaleString("en-IN")}`;
}
```

#graphify/code #graphify/EXTRACTED #community/Business_Intelligence_Engine