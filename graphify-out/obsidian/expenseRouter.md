---
source_file: "server/src/entities/expenses/routes.ts"
type: "code"
community: "Generic CRUD Backend"
location: "L4"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Generic_CRUD_Backend
---

# expenseRouter

## Connections
- [[expensesroutes.ts]] - `contains` [EXTRACTED]
- [[index.ts]] - `imports` [EXTRACTED]

## Source
**From** `server/src/entities/expenses/routes.ts` **(starting line 4):**
```typescript
export const expenseRouter = createCrudRouter(expenseRepository);
```

#graphify/code #graphify/EXTRACTED #community/Generic_CRUD_Backend