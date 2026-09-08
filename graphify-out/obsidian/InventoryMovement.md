---
source_file: "shared-types/entities.ts"
type: "code"
community: "Inventory Management UI"
location: "L85"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Inventory_Management_UI
---

# InventoryMovement

## Connections
- [[BaseRecord]] - `inherits` [EXTRACTED]
- [[InventoryDetailModal.tsx]] - `imports` [EXTRACTED]
- [[entities.ts]] - `contains` [EXTRACTED]
- [[inventory-movementsrepository.ts]] - `imports` [EXTRACTED]
- [[inventory.ts]] - `imports` [EXTRACTED]

## Source
**From** `shared-types/entities.ts` **(starting line 85):**
```typescript
export interface InventoryMovement extends BaseRecord {
  itemId: string;
  type: InventoryMovementType;
  quantityDelta: number;
  resultingQty: number;
  note: string;
  employeeName: string;
}
```

#graphify/code #graphify/EXTRACTED #community/Inventory_Management_UI