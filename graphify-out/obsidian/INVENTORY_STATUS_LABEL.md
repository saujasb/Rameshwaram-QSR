---
source_file: "client/src/modules/inventory/inventoryStatusUi.ts"
type: "code"
community: "Inventory Management UI"
location: "L4"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Inventory_Management_UI
---

# INVENTORY_STATUS_LABEL

## Connections
- [[InventoryDetailModal.tsx]] - `imports` [EXTRACTED]
- [[InventoryPage.tsx]] - `imports` [EXTRACTED]
- [[inventoryStatusUi.ts]] - `contains` [EXTRACTED]

## Source
**From** `client/src/modules/inventory/inventoryStatusUi.ts` **(starting line 4):**
```typescript
export const INVENTORY_STATUS_LABEL: Record<InventoryStatus, string> = {
  not_counted: "Not counted",
  healthy: "Healthy",
  low: "Low",
  critical: "Critical",
  out_of_stock: "Out of stock",
};
```

#graphify/code #graphify/EXTRACTED #community/Inventory_Management_UI