import { CrudModulePage } from "../../components/crud/CrudModulePage";
import { expenseHooks } from "../../lib/api/expenses";
import type { ExpenseRecord } from "@shared/entities";
import type { ColumnConfig, FormFieldConfig } from "../../components/crud/types";

const CATEGORY_OPTIONS = [
  { value: "food_cost", label: "Food cost" },
  { value: "labour", label: "Labour" },
  { value: "utilities", label: "Utilities" },
  { value: "rent", label: "Rent" },
  { value: "maintenance", label: "Maintenance" },
  { value: "marketing", label: "Marketing" },
  { value: "other", label: "Other" },
];

const columns: ColumnConfig<ExpenseRecord>[] = [
  { key: "date", label: "Date" },
  { key: "category", label: "Category", render: (r) => CATEGORY_OPTIONS.find((o) => o.value === r.category)?.label ?? r.category },
  { key: "description", label: "Description" },
  { key: "amount", label: "Amount", numeric: true, render: (r) => `₹${r.amount.toLocaleString()}` },
  { key: "paymentMethod", label: "Payment method" },
];

const formFields: FormFieldConfig[] = [
  { key: "date", label: "Date", type: "date", required: true },
  { key: "category", label: "Category", type: "select", required: true, options: CATEGORY_OPTIONS },
  { key: "description", label: "Description", type: "text", required: true },
  { key: "amount", label: "Amount (₹)", type: "number", required: true },
  { key: "paymentMethod", label: "Payment method", type: "text", placeholder: "Cash, UPI, bank transfer…" },
  { key: "notes", label: "Notes", type: "textarea" },
];

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
