---
source_file: "shared-types/intelligence.ts"
type: "code"
community: "Business Intelligence Engine"
location: "L132"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Business_Intelligence_Engine
---

# TodaysIntelligence

## Connections
- [[apiintelligence.ts]] - `imports` [EXTRACTED]
- [[intelligenceroutes.ts]] - `imports` [EXTRACTED]
- [[shared-typesintelligence.ts]] - `contains` [EXTRACTED]

## Source
**From** `shared-types/intelligence.ts` **(starting line 132):**
```typescript
export interface TodaysIntelligence {
  businessDate: string;
  businessDayStartHour: number;
  salesValue: Metric;
  salesQty: Metric;
  productionQty: Metric;
  wastageQty: Metric;
  efficiencyPct: Metric;
  variancePct: Metric;
  sellThroughPct: Metric;
  wastagePct: Metric;
  /** Peak hour by sales value; null when no timestamped data exists. */
  peakHour: { hour: number; label: string; salesValue: number } | null;
  hasTimestampedData: boolean;
}
```

#graphify/code #graphify/EXTRACTED #community/Business_Intelligence_Engine