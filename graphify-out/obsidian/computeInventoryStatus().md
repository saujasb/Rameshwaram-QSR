---
source_file: "shared-types/inventoryStatus.ts"
type: "code"
community: "Inventory Management UI"
location: "L3"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Inventory_Management_UI
---

# computeInventoryStatus()

## Connections
- [[DashboardPage()]] - `calls` [EXTRACTED]
- [[DashboardPage.tsx]] - `imports` [EXTRACTED]
- [[InventoryDetailModal()]] - `calls` [EXTRACTED]
- [[InventoryDetailModal.tsx]] - `imports` [EXTRACTED]
- [[InventoryPage()]] - `calls` [EXTRACTED]
- [[InventoryPage.tsx]] - `imports` [EXTRACTED]
- [[buildActionCenter()]] - `calls` [EXTRACTED]
- [[inventoryStatus.ts]] - `contains` [EXTRACTED]
- [[sharedactionCenter.ts]] - `imports` [EXTRACTED]

## Source
**From** `shared-types/inventoryStatus.ts` **(starting line 3):**
```typescript
export function computeInventoryStatus(item: Pick<InventoryItem, "onHandQty" | "minLevel" | "reorderLevel">): InventoryStatus {
  if (item.onHandQty === null) return "not_counted";
  if (item.onHandQty <= 0) return "out_of_stock";
  if (item.minLevel !== null && item.onHandQty <= item.minLevel) return "critical";
  if (item.reorderLevel !== null && item.onHandQty <= item.reorderLevel) return "low";
  return "healthy";
}
```

#graphify/code #graphify/EXTRACTED #community/Inventory_Management_UI