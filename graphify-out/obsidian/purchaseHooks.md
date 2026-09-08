---
source_file: "client/src/lib/api/purchases.ts"
type: "code"
community: "Purchases UI"
location: "L4"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Purchases_UI
---

# purchaseHooks

## Connections
- [[DashboardPage.tsx]] - `imports` [EXTRACTED]
- [[PurchasesPage.tsx]] - `imports` [EXTRACTED]
- [[purchases.ts]] - `contains` [EXTRACTED]

## Source
**From** `client/src/lib/api/purchases.ts` **(starting line 4):**
```typescript
export const purchaseHooks = createEntityHooks<Purchase>("purchases");
```

#graphify/code #graphify/EXTRACTED #community/Purchases_UI