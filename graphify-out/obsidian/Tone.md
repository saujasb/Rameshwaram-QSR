---
source_file: "client/src/modules/intelligence/TopInsightsPanel.tsx"
type: "code"
community: "Business Intelligence Engine"
location: "L9"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Business_Intelligence_Engine
---

# Tone

## Connections
- [[TopInsightsPanel.tsx]] - `contains` [EXTRACTED]

## Source
**From** `client/src/modules/intelligence/TopInsightsPanel.tsx` **(starting line 9):**
```tsx
type Tone = "good" | "warn" | "ser" | "crit" | "notconn";

const SEVERITY_TONE: Record<AnomalySeverity | "info", Tone> = {
  high: "crit",
  medium: "ser",
  low: "warn",
  info: "notconn",
};
```

#graphify/code #graphify/EXTRACTED #community/Business_Intelligence_Engine