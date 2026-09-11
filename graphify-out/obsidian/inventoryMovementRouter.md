---
source_file: "server/src/entities/inventory-movements/routes.ts"
type: "code"
community: "Generic CRUD Backend"
location: "L4"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Generic_CRUD_Backend
---

# inventoryMovementRouter

## Connections
- [[index.ts]] - `imports` [EXTRACTED]
- [[inventory-movementsroutes.ts]] - `contains` [EXTRACTED]

## Source
**From** `server/src/entities/inventory-movements/routes.ts` **(starting line 4):**
```typescript
export const inventoryMovementRouter = createCrudRouter(inventoryMovementRepository);

inventoryMovementRouter.get("/by-item/:itemId", (req, res) => {
  const movements = inventoryMovementRepository
    .list()
    .filter((m) => m.itemId === req.params.itemId);
  res.json(movements);
});
```

#graphify/code #graphify/EXTRACTED #community/Generic_CRUD_Backend