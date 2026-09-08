---
source_file: "server/src/shared/createCrudRouter.ts"
type: "code"
community: "Generic CRUD Backend"
location: "L5"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Generic_CRUD_Backend
---

# createCrudRouter()

## Connections
- [[attendanceroutes.ts]] - `imports` [EXTRACTED]
- [[complaintsroutes.ts]] - `imports` [EXTRACTED]
- [[createCrudRouter.ts]] - `contains` [EXTRACTED]
- [[expensesroutes.ts]] - `imports` [EXTRACTED]
- [[inventory-movementsroutes.ts]] - `imports` [EXTRACTED]
- [[inventoryroutes.ts]] - `imports` [EXTRACTED]
- [[maintenanceroutes.ts]] - `imports` [EXTRACTED]
- [[ordersroutes.ts]] - `imports` [EXTRACTED]
- [[purchasesroutes.ts]] - `imports` [EXTRACTED]
- [[staffroutes.ts]] - `imports` [EXTRACTED]
- [[suppliersroutes.ts]] - `imports` [EXTRACTED]
- [[tasksroutes.ts]] - `imports` [EXTRACTED]
- [[wastageroutes.ts]] - `imports` [EXTRACTED]

## Source
**From** `server/src/shared/createCrudRouter.ts` **(starting line 5):**
```typescript
export function createCrudRouter<T extends BaseRecord>(repo: Repository<T>): Router {
  const router = Router();

  router.get("/", (_req, res) => {
    res.json(repo.list());
  });

  router.get("/:id", (req, res) => {
    const record = repo.get(req.params.id);
    if (!record) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json(record);
  });

  router.post("/", (req, res) => {
    if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
      res.status(400).json({ error: "Request body must be an object" });
      return;
    }
    const record = repo.create(req.body);
    res.status(201).json(record);
  });

  router.put("/:id", (req, res) => {
    if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
      res.status(400).json({ error: "Request body must be an object" });
      return;
    }
    const record = repo.update(req.params.id, req.body);
    if (!record) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json(record);
  });

  router.delete("/:id", (req, res) => {
    const removed = repo.remove(req.params.id);
    if (!removed) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.status(204).end();
  });

  return router;
}
```

#graphify/code #graphify/EXTRACTED #community/Generic_CRUD_Backend