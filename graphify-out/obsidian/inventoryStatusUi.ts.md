---
source_file: "client/src/modules/inventory/inventoryStatusUi.ts"
type: "code"
community: "Inventory Management UI"
location: "L1"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Inventory_Management_UI
---

# inventoryStatusUi.ts

## Connections
- [[BadgeTone]] - `imports` [EXTRACTED]
- [[INVENTORY_STATUS_LABEL]] - `contains` [EXTRACTED]
- [[INVENTORY_STATUS_TONE]] - `contains` [EXTRACTED]
- [[InventoryDetailModal.tsx]] - `imports_from` [EXTRACTED]
- [[InventoryPage.tsx]] - `imports_from` [EXTRACTED]
- [[InventoryStatus]] - `imports` [EXTRACTED]
- [[StatusBadge.tsx]] - `imports_from` [EXTRACTED]
- [[entities.ts]] - `imports_from` [EXTRACTED]

## Source
**Full file:** `client/src/modules/inventory/inventoryStatusUi.ts`
```typescript
import type { InventoryStatus } from "@shared/entities";
import type { BadgeTone } from "../../components/StatusBadge";

export const INVENTORY_STATUS_LABEL: Record<InventoryStatus, string> = {
  not_counted: "Not counted",
  healthy: "Healthy",
  low: "Low",
  critical: "Critical",
  out_of_stock: "Out of stock",
};

export const INVENTORY_STATUS_TONE: Record<InventoryStatus, BadgeTone> = {
  not_counted: "neutral",
  healthy: "ok",
  low: "under",
  critical: "over",
  out_of_stock: "over",
};
```

#graphify/code #graphify/EXTRACTED #community/Inventory_Management_UI