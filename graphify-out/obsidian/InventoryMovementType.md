---
source_file: "shared-types/entities.ts"
type: "code"
community: "Complaints & Shared Entity Enums"
location: "L83"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Complaints__Shared_Entity_Enums
---

# InventoryMovementType

## Connections
- [[entities.ts]] - `contains` [EXTRACTED]

## Source
**From** `shared-types/entities.ts` **(starting line 83):**
```typescript
export type InventoryMovementType = "receive" | "adjustment" | "count" | "wastage_deduction";

export interface InventoryMovement extends BaseRecord {
  itemId: string;
  type: InventoryMovementType;
  quantityDelta: number;
  resultingQty: number;
  note: string;
  employeeName: string;
}
```

#graphify/code #graphify/EXTRACTED #community/Complaints__Shared_Entity_Enums