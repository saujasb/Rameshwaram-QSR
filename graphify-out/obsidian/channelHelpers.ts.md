---
source_file: "client/src/modules/orders/channelHelpers.ts"
type: "code"
community: "Order Operations Pages"
location: "L1"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Order_Operations_Pages
---

# channelHelpers.ts

## Connections
- [[CHANNEL_OPTIONS]] - `contains` [EXTRACTED]
- [[DeliveryPage.tsx]] - `imports_from` [EXTRACTED]
- [[FrontCounterPage.tsx]] - `imports_from` [EXTRACTED]
- [[KitchenPage.tsx]] - `imports_from` [EXTRACTED]
- [[NEXT_STATUS]] - `contains` [EXTRACTED]
- [[OrderChannel]] - `imports` [EXTRACTED]
- [[OrderStatus]] - `imports` [EXTRACTED]
- [[OrdersPage.tsx]] - `imports_from` [EXTRACTED]
- [[STATUS_OPTIONS_1]] - `contains` [EXTRACTED]
- [[entities.ts]] - `imports_from` [EXTRACTED]

## Source
**Full file:** `client/src/modules/orders/channelHelpers.ts`
```typescript
import type { OrderChannel, OrderStatus } from "@shared/entities";

export const CHANNEL_OPTIONS: { value: OrderChannel; label: string }[] = [
  { value: "dine_in", label: "Dine-in" },
  { value: "takeaway", label: "Takeaway" },
  { value: "delivery", label: "Delivery" },
];

export const STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
  { value: "received", label: "Received" },
  { value: "accepted", label: "Accepted" },
  { value: "preparing", label: "Preparing" },
  { value: "ready", label: "Ready" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "delayed", label: "Delayed" },
];

export const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  received: "accepted",
  accepted: "preparing",
  preparing: "ready",
  ready: "completed",
};
```

#graphify/code #graphify/EXTRACTED #community/Order_Operations_Pages