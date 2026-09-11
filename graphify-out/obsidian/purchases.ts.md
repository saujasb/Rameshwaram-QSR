---
source_file: "client/src/lib/api/purchases.ts"
type: "code"
community: "Purchases UI"
location: "L1"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Purchases_UI
---

# purchases.ts

## Connections
- [[DashboardPage.tsx]] - `imports_from` [EXTRACTED]
- [[Purchase]] - `imports` [EXTRACTED]
- [[PurchasesPage.tsx]] - `imports_from` [EXTRACTED]
- [[createEntityHooks()]] - `imports` [EXTRACTED]
- [[createEntityHooks.ts]] - `imports_from` [EXTRACTED]
- [[entities.ts]] - `imports_from` [EXTRACTED]
- [[purchaseHooks]] - `contains` [EXTRACTED]

## Source
**Full file:** `client/src/lib/api/purchases.ts`
```typescript
import { createEntityHooks } from "../createEntityHooks";
import type { Purchase } from "@shared/entities";

export const purchaseHooks = createEntityHooks<Purchase>("purchases");
```

#graphify/code #graphify/EXTRACTED #community/Purchases_UI