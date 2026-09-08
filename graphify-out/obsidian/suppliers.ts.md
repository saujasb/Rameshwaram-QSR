---
source_file: "client/src/lib/api/suppliers.ts"
type: "code"
community: "Maintenance & Suppliers UI"
location: "L1"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Maintenance__Suppliers_UI
---

# suppliers.ts

## Connections
- [[InventoryPage.tsx]] - `imports_from` [EXTRACTED]
- [[Supplier]] - `imports` [EXTRACTED]
- [[SuppliersPage.tsx]] - `imports_from` [EXTRACTED]
- [[createEntityHooks()]] - `imports` [EXTRACTED]
- [[createEntityHooks.ts]] - `imports_from` [EXTRACTED]
- [[entities.ts]] - `imports_from` [EXTRACTED]
- [[supplierHooks]] - `contains` [EXTRACTED]

## Source
**Full file:** `client/src/lib/api/suppliers.ts`
```typescript
import { createEntityHooks } from "../createEntityHooks";
import type { Supplier } from "@shared/entities";

export const supplierHooks = createEntityHooks<Supplier>("suppliers");
```

#graphify/code #graphify/EXTRACTED #community/Maintenance__Suppliers_UI