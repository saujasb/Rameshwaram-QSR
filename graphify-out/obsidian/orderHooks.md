---
source_file: "client/src/lib/api/orders.ts"
type: "code"
community: "Order Operations Pages"
location: "L4"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Order_Operations_Pages
---

# orderHooks

## Connections
- [[DashboardPage.tsx]] - `imports` [EXTRACTED]
- [[DeliveryPage.tsx]] - `imports` [EXTRACTED]
- [[FrontCounterPage.tsx]] - `imports` [EXTRACTED]
- [[KitchenPage.tsx]] - `imports` [EXTRACTED]
- [[OrdersPage.tsx]] - `imports` [EXTRACTED]
- [[ShiftPerformancePage.tsx]] - `imports` [EXTRACTED]
- [[orders.ts]] - `contains` [EXTRACTED]

## Source
**From** `client/src/lib/api/orders.ts` **(starting line 4):**
```typescript
export const orderHooks = createEntityHooks<ManualOrderEntry>("orders");
```

#graphify/code #graphify/EXTRACTED #community/Order_Operations_Pages