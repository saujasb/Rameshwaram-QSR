---
source_file: "shared-types/entities.ts"
type: "code"
community: "Order Operations Pages"
location: "L208"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Order_Operations_Pages
---

# ManualOrderEntry

## Connections
- [[BaseRecord]] - `inherits` [EXTRACTED]
- [[DeliveryPage.tsx]] - `imports` [EXTRACTED]
- [[FrontCounterPage.tsx]] - `imports` [EXTRACTED]
- [[KitchenPage.tsx]] - `imports` [EXTRACTED]
- [[OrdersPage.tsx]] - `imports` [EXTRACTED]
- [[entities.ts]] - `contains` [EXTRACTED]
- [[orders.ts]] - `imports` [EXTRACTED]
- [[ordersrepository.ts]] - `imports` [EXTRACTED]

## Source
**From** `shared-types/entities.ts` **(starting line 208):**
```typescript
export interface ManualOrderEntry extends BaseRecord {
  channel: OrderChannel;
  itemsSummary: string;
  totalAmount: number | null;
  status: OrderStatus;
  receivedAt: string;
  completedAt: string | null;
  notes: string;
  source: "manual";
}
```

#graphify/code #graphify/EXTRACTED #community/Order_Operations_Pages