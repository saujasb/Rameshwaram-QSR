---
source_file: "client/src/lib/api/orders.ts"
type: "code"
community: "Order Operations Pages"
location: "L1"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Order_Operations_Pages
---

# orders.ts

## Connections
- [[DashboardPage.tsx]] - `imports_from` [EXTRACTED]
- [[DeliveryPage.tsx]] - `imports_from` [EXTRACTED]
- [[FrontCounterPage.tsx]] - `imports_from` [EXTRACTED]
- [[KitchenPage.tsx]] - `imports_from` [EXTRACTED]
- [[ManualOrderEntry]] - `imports` [EXTRACTED]
- [[OrdersPage.tsx]] - `imports_from` [EXTRACTED]
- [[ShiftPerformancePage.tsx]] - `imports_from` [EXTRACTED]
- [[createEntityHooks()]] - `imports` [EXTRACTED]
- [[createEntityHooks.ts]] - `imports_from` [EXTRACTED]
- [[entities.ts]] - `imports_from` [EXTRACTED]
- [[orderHooks]] - `contains` [EXTRACTED]

## Source
**Full file:** `client/src/lib/api/orders.ts`
```typescript
import { createEntityHooks } from "../createEntityHooks";
import type { ManualOrderEntry } from "@shared/entities";

export const orderHooks = createEntityHooks<ManualOrderEntry>("orders");
```

#graphify/code #graphify/EXTRACTED #community/Order_Operations_Pages