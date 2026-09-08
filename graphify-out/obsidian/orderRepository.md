---
source_file: "server/src/entities/orders/repository.ts"
type: "code"
community: "Generic CRUD Backend"
location: "L4"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Generic_CRUD_Backend
---

# orderRepository

## Connections
- [[ordersrepository.ts]] - `contains` [EXTRACTED]
- [[ordersroutes.ts]] - `imports` [EXTRACTED]

## Source
**From** `server/src/entities/orders/repository.ts` **(starting line 4):**
```typescript
export const orderRepository = createRepository<ManualOrderEntry>("manual_orders");
```

#graphify/code #graphify/EXTRACTED #community/Generic_CRUD_Backend