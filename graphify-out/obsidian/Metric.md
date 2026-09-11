---
source_file: "shared-types/intelligence.ts"
type: "code"
community: "Business Intelligence Engine"
location: "L11"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Business_Intelligence_Engine
---

# Metric

## Connections
- [[TodaysIntelligencePanel.tsx]] - `imports` [EXTRACTED]
- [[reconciliation.ts]] - `imports` [EXTRACTED]
- [[shared-typesintelligence.ts]] - `contains` [EXTRACTED]

## Source
**From** `shared-types/intelligence.ts` **(starting line 11):**
```typescript
export interface Metric {
  value: number | null;
  basis: MetricBasis;
  /** Plain-English note shown on hover, e.g. which datasets fed this. */
  note: string;
}
```

#graphify/code #graphify/EXTRACTED #community/Business_Intelligence_Engine