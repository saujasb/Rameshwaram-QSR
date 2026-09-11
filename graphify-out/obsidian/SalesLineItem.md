---
source_file: "shared-types/sales.ts"
type: "code"
community: "Sales Import UI"
location: "L11"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Sales_Import_UI
---

# SalesLineItem

## Connections
- [[BaseRecord]] - `inherits` [EXTRACTED]
- [[salesrepository.ts]] - `imports` [EXTRACTED]
- [[shared-typessales.ts]] - `contains` [EXTRACTED]

## Source
**From** `shared-types/sales.ts` **(starting line 11):**
```typescript
export interface SalesLineItem extends BaseRecord {
  importBatchId: string;
  channel: SalesChannel;
  category: string;
  itemName: string;
  quantity: number;
  amount: number;
  // Calendar date as printed/confirmed by the source report. Not necessarily
  // the trading day it belongs to -- see businessDate.
  calendarDate: string;
  // Computed via the shared business-date engine (shared-types/businessDate.ts).
  businessDate: string;
  businessDayStart: string;
  businessDayEnd: string;
  // These three source reports are pre-aggregated daily item totals with no
  // per-order clock time, so these stay null until a timestamped export format
  // is imported. Never fabricated.
  transactionTimestamp: string | null;
  transactionTime: string | null;
}
```

#graphify/code #graphify/EXTRACTED #community/Sales_Import_UI