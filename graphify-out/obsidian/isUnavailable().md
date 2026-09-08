---
source_file: "client/src/modules/intelligence/TodaysIntelligencePanel.tsx"
type: "code"
community: "Business Intelligence Engine"
location: "L19"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Business_Intelligence_Engine
---

# isUnavailable()

## Connections
- [[MetricRow()]] - `calls` [EXTRACTED]
- [[MetricValue()]] - `calls` [EXTRACTED]
- [[TodaysIntelligencePanel()]] - `calls` [EXTRACTED]
- [[TodaysIntelligencePanel.tsx]] - `contains` [EXTRACTED]

## Source
**From** `client/src/modules/intelligence/TodaysIntelligencePanel.tsx` **(starting line 19):**
```tsx
export function isUnavailable(metric: Metric | null | undefined): boolean {
  return !metric || metric.basis === "unavailable" || metric.value === null;
}
```

#graphify/code #graphify/EXTRACTED #community/Business_Intelligence_Engine