---
source_file: "shared-types/intelligence.ts"
type: "code"
community: "Business Intelligence Engine"
location: "L163"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Business_Intelligence_Engine
---

# ProductPerformanceRow

## Connections
- [[apidatasets.ts]] - `imports` [EXTRACTED]
- [[datasetsrepository.ts]] - `imports` [EXTRACTED]
- [[insights.ts]] - `imports` [EXTRACTED]
- [[shared-typesintelligence.ts]] - `contains` [EXTRACTED]

## Source
**From** `shared-types/intelligence.ts` **(starting line 163):**
```typescript
export interface ProductPerformanceRow {
  product: string;
  category: string | null;
  salesQty: number;
  salesValue: number;
  productionQty: number;
  wastageQty: number;
  sellThroughPct: number | null;
  wastagePct: number | null;
  variancePct: number | null;
}
```

#graphify/code #graphify/EXTRACTED #community/Business_Intelligence_Engine