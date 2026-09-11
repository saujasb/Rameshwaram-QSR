---
source_file: "shared-types/entities.ts"
type: "code"
community: "Expenses UI"
location: "L189"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Expenses_UI
---

# ExpenseRecord

## Connections
- [[BaseRecord]] - `inherits` [EXTRACTED]
- [[ExpensesPage.tsx]] - `imports` [EXTRACTED]
- [[entities.ts]] - `contains` [EXTRACTED]
- [[expenses.ts]] - `imports` [EXTRACTED]
- [[expensesrepository.ts]] - `imports` [EXTRACTED]

## Source
**From** `shared-types/entities.ts` **(starting line 189):**
```typescript
export interface ExpenseRecord extends BaseRecord {
  category: ExpenseCategory;
  description: string;
  amount: number;
  date: string;
  paymentMethod: string;
  notes: string;
}
```

#graphify/code #graphify/EXTRACTED #community/Expenses_UI