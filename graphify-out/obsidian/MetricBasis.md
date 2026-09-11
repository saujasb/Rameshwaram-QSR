---
source_file: "shared-types/intelligence.ts"
type: "code"
community: "Business Intelligence Engine"
location: "L5"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Business_Intelligence_Engine
---

# MetricBasis

## Connections
- [[TodaysIntelligencePanel.tsx]] - `imports` [EXTRACTED]
- [[shared-typesintelligence.ts]] - `contains` [EXTRACTED]

## Source
**From** `shared-types/intelligence.ts` **(starting line 5):**
```typescript
export type MetricBasis =
  | "observed" // read directly from imported records
  | "calculated" // arithmetic over observed records
  | "estimated" // inferred from a model/assumption -- must say so
  | "unavailable"; // not enough data; render "Insufficient data", never a number

```

#graphify/code #graphify/EXTRACTED #community/Business_Intelligence_Engine