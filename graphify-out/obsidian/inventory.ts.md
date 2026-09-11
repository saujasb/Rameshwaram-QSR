---
source_file: "client/src/lib/api/inventory.ts"
type: "code"
community: "Inventory Management UI"
location: "L1"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Inventory_Management_UI
---

# inventory.ts

## Connections
- [[DashboardPage.tsx]] - `imports_from` [EXTRACTED]
- [[InventoryDetailModal.tsx]] - `imports_from` [EXTRACTED]
- [[InventoryItem]] - `imports` [EXTRACTED]
- [[InventoryMovement]] - `imports` [EXTRACTED]
- [[InventoryPage.tsx]] - `imports_from` [EXTRACTED]
- [[createEntityHooks()]] - `imports` [EXTRACTED]
- [[createEntityHooks.ts]] - `imports_from` [EXTRACTED]
- [[entities.ts]] - `imports_from` [EXTRACTED]
- [[inventoryHooks]] - `contains` [EXTRACTED]
- [[inventoryMovementHooks]] - `contains` [EXTRACTED]

## Source
**Full file:** `client/src/lib/api/inventory.ts`
```typescript
import { createEntityHooks } from "../createEntityHooks";
import type { InventoryItem, InventoryMovement } from "@shared/entities";

export const inventoryHooks = createEntityHooks<InventoryItem>("inventory");
export const inventoryMovementHooks = createEntityHooks<InventoryMovement>("inventory-movements");
```

#graphify/code #graphify/EXTRACTED #community/Inventory_Management_UI