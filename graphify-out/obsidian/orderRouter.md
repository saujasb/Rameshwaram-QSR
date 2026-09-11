---
source_file: "server/src/entities/orders/routes.ts"
type: "code"
community: "Generic CRUD Backend"
location: "L4"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Generic_CRUD_Backend
---

# orderRouter

## Connections
- [[index.ts]] - `imports` [EXTRACTED]
- [[ordersroutes.ts]] - `contains` [EXTRACTED]

## Source
**From** `server/src/entities/orders/routes.ts` **(starting line 4):**
```typescript
export const orderRouter = createCrudRouter(orderRepository);
```

#graphify/code #graphify/EXTRACTED #community/Generic_CRUD_Backend