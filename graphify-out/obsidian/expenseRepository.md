---
source_file: "server/src/entities/expenses/repository.ts"
type: "code"
community: "Generic CRUD Backend"
location: "L4"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Generic_CRUD_Backend
---

# expenseRepository

## Connections
- [[expensesrepository.ts]] - `contains` [EXTRACTED]
- [[expensesroutes.ts]] - `imports` [EXTRACTED]

## Source
**From** `server/src/entities/expenses/repository.ts` **(starting line 4):**
```typescript
export const expenseRepository = createRepository<ExpenseRecord>("expenses");
```

#graphify/code #graphify/EXTRACTED #community/Generic_CRUD_Backend