---
source_file: "client/src/modules/orders/channelHelpers.ts"
type: "code"
community: "Order Operations Pages"
location: "L19"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Order_Operations_Pages
---

# NEXT_STATUS

## Connections
- [[KitchenPage.tsx]] - `imports` [EXTRACTED]
- [[channelHelpers.ts]] - `contains` [EXTRACTED]

## Source
**From** `client/src/modules/orders/channelHelpers.ts` **(starting line 19):**
```typescript
export const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  received: "accepted",
  accepted: "preparing",
  preparing: "ready",
  ready: "completed",
};
```

#graphify/code #graphify/EXTRACTED #community/Order_Operations_Pages