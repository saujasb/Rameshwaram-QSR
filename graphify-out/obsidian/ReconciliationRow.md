---
source_file: "shared-types/intelligence.ts"
type: "code"
community: "Business Intelligence Engine"
location: "L19"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Business_Intelligence_Engine
---

# ReconciliationRow

## Connections
- [[analysis.ts]] - `imports` [EXTRACTED]
- [[reconciliation.ts]] - `imports` [EXTRACTED]
- [[shared-typesintelligence.ts]] - `contains` [EXTRACTED]

## Source
**From** `shared-types/intelligence.ts` **(starting line 19):**
```typescript
export interface ReconciliationRow {
  businessDate: string;
  product: string | null;
  productionQty: Metric;
  salesQty: Metric;
  wastageQty: Metric;
  /** production - sales - wastage */
  expectedBalance: Metric;
  /** wastage / production * 100 */
  wastagePct: Metric;
  /** sales / production * 100 */
  sellThroughPct: Metric;
  /** (sales + wastage) vs production; 100% = everything produced accounted for */
  efficiencyPct: Metric;
  /** (production - sales - wastage) / production * 100 */
  variancePct: Metric;
  recordCounts: { production: number; sales: number; wastage: number };
}
```

#graphify/code #graphify/EXTRACTED #community/Business_Intelligence_Engine