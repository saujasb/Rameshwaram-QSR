---
source_file: "client/src/modules/intelligence/IntelligencePage.tsx"
type: "code"
community: "Business Intelligence Engine"
location: "L9"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Business_Intelligence_Engine
---

# SEVERITY_TONE

## Connections
- [[IntelligencePage.tsx]] - `contains` [EXTRACTED]

## Source
**From** `client/src/modules/intelligence/IntelligencePage.tsx` **(starting line 9):**
```tsx
const SEVERITY_TONE: Record<Anomaly["severity"], "crit" | "warn" | "ser"> = {
  high: "crit",
  medium: "warn",
  low: "ser",
};
```

#graphify/code #graphify/EXTRACTED #community/Business_Intelligence_Engine