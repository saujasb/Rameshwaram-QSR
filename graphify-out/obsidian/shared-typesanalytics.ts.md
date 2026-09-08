---
source_file: "shared-types/analytics.ts"
type: "code"
community: "Veg Indent & Analytics Engine"
location: "L1"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Veg_Indent__Analytics_Engine
---

# shared-types/analytics.ts

## Connections
- [[AnalyticsSnapshot]] - `contains` [EXTRACTED]
- [[ChannelMixItem]] - `contains` [EXTRACTED]
- [[CostVarianceItem]] - `contains` [EXTRACTED]
- [[KpiTargetRow]] - `contains` [EXTRACTED]
- [[PrioritizedAction]] - `contains` [EXTRACTED]
- [[TopSellerItem]] - `contains` [EXTRACTED]
- [[VarianceItem]] - `contains` [EXTRACTED]
- [[VegIndentItem]] - `contains` [EXTRACTED]
- [[VegIndentMatchKind]] - `contains` [EXTRACTED]
- [[WastageAnalyticsItem]] - `contains` [EXTRACTED]
- [[actions-data.ts]] - `imports_from` [EXTRACTED]
- [[apianalytics.ts]] - `imports_from` [EXTRACTED]
- [[data.ts]] - `imports_from` [EXTRACTED]
- [[vegIndentCompute.ts]] - `imports_from` [EXTRACTED]

## Source
**From** `shared-types/analytics.ts` **(starting line 1):**
```typescript
export interface VarianceItem {
  name: string;
  producedKg: number;
  consumedKg: number;
  soldPlates: number;
  netDiffKg: number;
  variancePct: number;
}
```

#graphify/code #graphify/EXTRACTED #community/Veg_Indent__Analytics_Engine