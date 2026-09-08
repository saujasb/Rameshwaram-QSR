---
source_file: "client/src/lib/api/expenses.ts"
type: "code"
community: "Expenses UI"
location: "L1"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Expenses_UI
---

# expenses.ts

## Connections
- [[ExpenseRecord]] - `imports` [EXTRACTED]
- [[ExpensesPage.tsx]] - `imports_from` [EXTRACTED]
- [[createEntityHooks()]] - `imports` [EXTRACTED]
- [[createEntityHooks.ts]] - `imports_from` [EXTRACTED]
- [[entities.ts]] - `imports_from` [EXTRACTED]
- [[expenseHooks]] - `contains` [EXTRACTED]

## Source
**Full file:** `client/src/lib/api/expenses.ts`
```typescript
import { createEntityHooks } from "../createEntityHooks";
import type { ExpenseRecord } from "@shared/entities";

export const expenseHooks = createEntityHooks<ExpenseRecord>("expenses");
```

#graphify/code #graphify/EXTRACTED #community/Expenses_UI