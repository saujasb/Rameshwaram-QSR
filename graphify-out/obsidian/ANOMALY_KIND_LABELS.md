---
source_file: "shared-types/intelligence.ts"
type: "code"
community: "Business Intelligence Engine"
location: "L59"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Business_Intelligence_Engine
---

# ANOMALY_KIND_LABELS

## Connections
- [[IntelligencePage.tsx]] - `imports` [EXTRACTED]
- [[labels.ts]] - `imports` [EXTRACTED]
- [[shared-typesintelligence.ts]] - `contains` [EXTRACTED]

## Source
**From** `shared-types/intelligence.ts` **(starting line 59):**
```typescript
export const ANOMALY_KIND_LABELS: Record<AnomalyKind, string> = {
  sales_drop: "Sales drop",
  sales_spike: "Sales spike",
  overproduction: "Overproduction",
  underproduction: "Underproduction",
  wastage_surge: "Wastage surge",
  product_stall: "Product stalled",
  variance_breach: "Variance breach",
};
```

#graphify/code #graphify/EXTRACTED #community/Business_Intelligence_Engine