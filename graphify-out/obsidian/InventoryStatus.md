---
source_file: "shared-types/entities.ts"
type: "code"
community: "Inventory Management UI"
location: "L68"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Inventory_Management_UI
---

# InventoryStatus

## Connections
- [[InventoryPage.tsx]] - `imports` [EXTRACTED]
- [[entities.ts]] - `contains` [EXTRACTED]
- [[inventoryStatus.ts]] - `imports` [EXTRACTED]
- [[inventoryStatusUi.ts]] - `imports` [EXTRACTED]

## Source
**From** `shared-types/entities.ts` **(starting line 68):**
```typescript
export type InventoryStatus = "not_counted" | "healthy" | "low" | "critical" | "out_of_stock";

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