---
source_file: "server/src/shared/createCrudRouter.ts"
type: "code"
community: "Generic CRUD Backend"
location: "L1"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Generic_CRUD_Backend
---

# createCrudRouter.ts

## Connections
- [[BaseRecord]] - `imports` [EXTRACTED]
- [[Repository]] - `imports` [EXTRACTED]
- [[attendanceroutes.ts]] - `imports_from` [EXTRACTED]
- [[complaintsroutes.ts]] - `imports_from` [EXTRACTED]
- [[createCrudRouter()]] - `contains` [EXTRACTED]
- [[entities.ts]] - `imports_from` [EXTRACTED]
- [[expensesroutes.ts]] - `imports_from` [EXTRACTED]
- [[inventory-movementsroutes.ts]] - `imports_from` [EXTRACTED]
- [[inventoryroutes.ts]] - `imports_from` [EXTRACTED]
- [[maintenanceroutes.ts]] - `imports_from` [EXTRACTED]
- [[ordersroutes.ts]] - `imports_from` [EXTRACTED]
- [[purchasesroutes.ts]] - `imports_from` [EXTRACTED]
- [[sharedrepository.ts]] - `imports_from` [EXTRACTED]
- [[staffroutes.ts]] - `imports_from` [EXTRACTED]
- [[suppliersroutes.ts]] - `imports_from` [EXTRACTED]
- [[tasksroutes.ts]] - `imports_from` [EXTRACTED]
- [[wastageroutes.ts]] - `imports_from` [EXTRACTED]

## Source
**Full file:** `server/src/shared/createCrudRouter.ts`
```typescript
import { Router } from "express";
import type { BaseRecord } from "../../../shared-types/entities.js";
import type { Repository } from "./repository.js";

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