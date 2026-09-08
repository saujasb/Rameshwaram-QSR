---
source_file: "server/src/entities/purchases/routes.ts"
type: "code"
community: "Generic CRUD Backend"
location: "L5"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Generic_CRUD_Backend
---

# purchaseRouter

## Connections
- [[index.ts]] - `imports` [EXTRACTED]
- [[purchasesroutes.ts]] - `contains` [EXTRACTED]

## Source
**From** `server/src/entities/purchases/routes.ts` **(starting line 5):**
```typescript
export const purchaseRouter: Router = createCrudRouter(purchaseRepository);

purchaseRouter.post("/:id/receive", (req, res) => {
  const purchase = purchaseRepository.get(req.params.id);
  if (!purchase) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  const receivedQuantity = Number(req.body?.receivedQuantity ?? purchase.quantity);
  const status = receivedQuantity >= purchase.quantity ? "received" : "partially_received";
  const updated = purchaseRepository.update(purchase.id, { receivedQuantity, status });
  res.json(updated);
});
```

#graphify/code #graphify/EXTRACTED #community/Generic_CRUD_Backend