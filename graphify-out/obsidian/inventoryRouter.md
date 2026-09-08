---
source_file: "server/src/entities/inventory/routes.ts"
type: "code"
community: "Generic CRUD Backend"
location: "L6"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Generic_CRUD_Backend
---

# inventoryRouter

## Connections
- [[index.ts]] - `imports` [EXTRACTED]
- [[inventoryroutes.ts]] - `contains` [EXTRACTED]

## Source
**From** `server/src/entities/inventory/routes.ts` **(starting line 6):**
```typescript
export const inventoryRouter: Router = createCrudRouter(inventoryRepository);
```

#graphify/code #graphify/EXTRACTED #community/Generic_CRUD_Backend