---
source_file: "client/src/modules/intelligence/TopInsightsPanel.tsx"
type: "code"
community: "Business Intelligence Engine"
location: "L11"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Business_Intelligence_Engine
---

# SEVERITY_TONE

## Connections
- [[TopInsightsPanel.tsx]] - `contains` [EXTRACTED]

## Source
**From** `client/src/modules/intelligence/TopInsightsPanel.tsx` **(starting line 11):**
```tsx
const SEVERITY_TONE: Record<AnomalySeverity | "info", Tone> = {
  high: "crit",
  medium: "ser",
  low: "warn",
  info: "notconn",
};
```

#graphify/code #graphify/EXTRACTED #community/Business_Intelligence_Engine