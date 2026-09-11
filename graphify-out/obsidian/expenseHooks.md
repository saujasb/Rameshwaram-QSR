---
source_file: "client/src/lib/api/expenses.ts"
type: "code"
community: "Expenses UI"
location: "L4"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Expenses_UI
---

# expenseHooks

## Connections
- [[ExpensesPage.tsx]] - `imports` [EXTRACTED]
- [[expenses.ts]] - `contains` [EXTRACTED]

## Source
**From** `client/src/lib/api/expenses.ts` **(starting line 4):**
```typescript
export const expenseHooks = createEntityHooks<ExpenseRecord>("expenses");
```

#graphify/code #graphify/EXTRACTED #community/Expenses_UI