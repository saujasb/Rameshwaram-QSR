---
source_file: "client/src/modules/expenses/ExpensesPage.tsx"
type: "code"
community: "Expenses UI"
location: "L33"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Expenses_UI
---

# ExpensesPage()

## Connections
- [[ExpensesPage.tsx]] - `contains` [EXTRACTED]
- [[routes.tsx]] - `imports` [EXTRACTED]

## Source
**From** `client/src/modules/expenses/ExpensesPage.tsx` **(starting line 33):**
```tsx
export function ExpensesPage() {
  return (
    <CrudModulePage<ExpenseRecord>
      title="Expenses"
      description="Operating expenses by category — the cost-control complement to the wastage and purchase data. No pre-filled figures; log every real expense as it happens."
      hooks={expenseHooks}
      columns={columns}
      formFields={formFields}
      defaultValues={{
        date: new Date().toISOString().slice(0, 10),
        category: "other",
        description: "",
        amount: 0,
        paymentMethod: "",
        notes: "",
      }}
      emptyMessage="No expenses logged yet."
      addButtonLabel="Log expense"
    />
  );
}
```

#graphify/code #graphify/EXTRACTED #community/Expenses_UI