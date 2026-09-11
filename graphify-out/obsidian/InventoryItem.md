---
source_file: "shared-types/entities.ts"
type: "code"
community: "Inventory Management UI"
location: "L70"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Inventory_Management_UI
---

# InventoryItem

## Connections
- [[BaseRecord]] - `inherits` [EXTRACTED]
- [[InventoryDetailModal.tsx]] - `imports` [EXTRACTED]
- [[InventoryPage.tsx]] - `imports` [EXTRACTED]
- [[entities.ts]] - `contains` [EXTRACTED]
- [[inventory.ts]] - `imports` [EXTRACTED]
- [[inventoryrepository.ts]] - `imports` [EXTRACTED]
- [[inventoryStatus.ts]] - `imports` [EXTRACTED]

## Source
**From** `shared-types/entities.ts` **(starting line 70):**
```typescript
export interface InventoryItem extends BaseRecord {
  name: string;
  category: string;
  unit: string;
  parLevel: number | null;
  minLevel: number | null;
  reorderLevel: number | null;
  supplierId: string | null;
  onHandQty: number | null;
  lastCountedAt: string | null;
  source: RecordSource;
}
```

#graphify/code #graphify/EXTRACTED #community/Inventory_Management_UI