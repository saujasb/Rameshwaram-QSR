---
source_file: "shared-types/inventoryStatus.ts"
type: "code"
community: "Inventory Management UI"
location: "L1"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Inventory_Management_UI
---

# inventoryStatus.ts

## Connections
- [[DashboardPage.tsx]] - `imports_from` [EXTRACTED]
- [[InventoryDetailModal.tsx]] - `imports_from` [EXTRACTED]
- [[InventoryItem]] - `imports` [EXTRACTED]
- [[InventoryPage.tsx]] - `imports_from` [EXTRACTED]
- [[InventoryStatus]] - `imports` [EXTRACTED]
- [[computeInventoryStatus()]] - `contains` [EXTRACTED]
- [[entities.ts]] - `imports_from` [EXTRACTED]
- [[sharedactionCenter.ts]] - `imports_from` [EXTRACTED]

## Source
**Full file:** `shared-types/inventoryStatus.ts`
```typescript
import type { InventoryItem, InventoryStatus } from "./entities.js";

export function computeInventoryStatus(item: Pick<InventoryItem, "onHandQty" | "minLevel" | "reorderLevel">): InventoryStatus {
  if (item.onHandQty === null) return "not_counted";
  if (item.onHandQty <= 0) return "out_of_stock";
  if (item.minLevel !== null && item.onHandQty <= item.minLevel) return "critical";
  if (item.reorderLevel !== null && item.onHandQty <= item.reorderLevel) return "low";
  return "healthy";
}
```

#graphify/code #graphify/EXTRACTED #community/Inventory_Management_UI