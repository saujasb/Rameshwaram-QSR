---
source_file: "client/src/modules/intelligence/TopInsightsPanel.tsx"
type: "code"
community: "Business Intelligence Engine"
location: "L26"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Business_Intelligence_Engine
---

# drilldownPath()

## Connections
- [[AnomalyCard()]] - `calls` [EXTRACTED]
- [[InsightRow()]] - `calls` [EXTRACTED]
- [[IntelligencePage.tsx]] - `imports` [EXTRACTED]
- [[TopInsightsPanel.tsx]] - `contains` [EXTRACTED]

## Source
**From** `client/src/modules/intelligence/TopInsightsPanel.tsx` **(starting line 26):**
```tsx
export function drilldownPath(query: Record<string, string> | null | undefined): string {
  if (!query) return "/data-explorer";
  const qs = new URLSearchParams(query).toString();
  return qs ? `/data-explorer?${qs}` : "/data-explorer";
}
```

#graphify/code #graphify/EXTRACTED #community/Business_Intelligence_Engine