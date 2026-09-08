---
source_file: "shared-types/analytics.ts"
type: "code"
community: "Veg Indent & Analytics Engine"
location: "L62"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Veg_Indent__Analytics_Engine
---

# AnalyticsSnapshot

## Connections
- [[apianalytics.ts]] - `imports` [EXTRACTED]
- [[data.ts]] - `imports` [EXTRACTED]
- [[shared-typesanalytics.ts]] - `contains` [EXTRACTED]

## Source
**From** `shared-types/analytics.ts` **(starting line 62):**
```typescript
export interface AnalyticsSnapshot {
  reportDate: string;
  vegIndentRequirementDate: string;
  vegIndentOrderDate: string;
  itemsSold: number;
  productionKg: number;
  wastagePct: number;
  wastageKg: number;
  varianceBreaches: number;
  recipeVsActualRupees: number;
  variance: VarianceItem[];
  wastage: WastageAnalyticsItem[];
  channelMix: ChannelMixItem[];
  topSellers: TopSellerItem[];
  costVariance: CostVarianceItem[];
  vegIndent: VegIndentItem[];
  kpiTargets: KpiTargetRow[];
}
```

#graphify/code #graphify/EXTRACTED #community/Veg_Indent__Analytics_Engine