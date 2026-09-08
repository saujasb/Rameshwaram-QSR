---
source_file: "client/src/modules/inventory/inventoryStatusUi.ts"
type: "code"
community: "Inventory Management UI"
location: "L12"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Inventory_Management_UI
---

# INVENTORY_STATUS_TONE

## Connections
- [[InventoryDetailModal.tsx]] - `imports` [EXTRACTED]
- [[InventoryPage.tsx]] - `imports` [EXTRACTED]
- [[inventoryStatusUi.ts]] - `contains` [EXTRACTED]

## Source
**From** `client/src/modules/inventory/inventoryStatusUi.ts` **(starting line 12):**
```typescript
export const INVENTORY_STATUS_TONE: Record<InventoryStatus, BadgeTone> = {
  not_counted: "neutral",
  healthy: "ok",
  low: "under",
  critical: "over",
  out_of_stock: "over",
};
```

#graphify/code #graphify/EXTRACTED #community/Inventory_Management_UI