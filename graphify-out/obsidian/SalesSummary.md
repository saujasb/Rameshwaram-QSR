---
source_file: "shared-types/sales.ts"
type: "code"
community: "Sales Import UI"
location: "L93"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Sales_Import_UI
---

# SalesSummary

## Connections
- [[apisales.ts]] - `imports` [EXTRACTED]
- [[salesrepository.ts]] - `imports` [EXTRACTED]
- [[shared-typessales.ts]] - `contains` [EXTRACTED]

## Source
**From** `shared-types/sales.ts` **(starting line 93):**
```typescript
export interface SalesSummary {
  businessDateFrom: string | null;
  businessDateTo: string | null;
  totalQuantity: number;
  totalAmount: number;
  byChannel: SalesChannelTotal[];
  byCategory: SalesCategoryTotal[];
  topItems: SalesItemTotal[];
  dailyTrend: SalesDailyTotal[];
  hasHourlyData: boolean;
}
```

#graphify/code #graphify/EXTRACTED #community/Sales_Import_UI