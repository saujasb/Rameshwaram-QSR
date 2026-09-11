---
source_file: "server/src/entities/inventory-movements/repository.ts"
type: "code"
community: "Generic CRUD Backend"
location: "L4"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Generic_CRUD_Backend
---

# inventoryMovementRepository

## Connections
- [[inventory-movementsrepository.ts]] - `contains` [EXTRACTED]
- [[inventory-movementsroutes.ts]] - `imports` [EXTRACTED]
- [[inventoryroutes.ts]] - `imports` [EXTRACTED]

## Source
**From** `server/src/entities/inventory-movements/repository.ts` **(starting line 4):**
```typescript
export const inventoryMovementRepository = createRepository<InventoryMovement>("inventory_movements");
```

#graphify/code #graphify/EXTRACTED #community/Generic_CRUD_Backend