---
source_file: "client/src/lib/api/suppliers.ts"
type: "code"
community: "Maintenance & Suppliers UI"
location: "L4"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Maintenance__Suppliers_UI
---

# supplierHooks

## Connections
- [[InventoryPage.tsx]] - `imports` [EXTRACTED]
- [[SuppliersPage.tsx]] - `imports` [EXTRACTED]
- [[suppliers.ts]] - `contains` [EXTRACTED]

## Source
**From** `client/src/lib/api/suppliers.ts` **(starting line 4):**
```typescript
export const supplierHooks = createEntityHooks<Supplier>("suppliers");
```

#graphify/code #graphify/EXTRACTED #community/Maintenance__Suppliers_UI