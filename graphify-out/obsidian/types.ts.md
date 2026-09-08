---
source_file: "client/src/components/crud/types.ts"
type: "code"
community: "Generic CRUD UI Components"
location: "L1"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Generic_CRUD_UI_Components
---

# types.ts

## Connections
- [[AttendancePage.tsx]] - `imports_from` [EXTRACTED]
- [[ColumnConfig]] - `contains` [EXTRACTED]
- [[ComplaintsPage.tsx]] - `imports_from` [EXTRACTED]
- [[CrudModulePage.tsx]] - `imports_from` [EXTRACTED]
- [[DataTable.tsx]] - `imports_from` [EXTRACTED]
- [[DeliveryPage.tsx]] - `imports_from` [EXTRACTED]
- [[ExpensesPage.tsx]] - `imports_from` [EXTRACTED]
- [[FormFieldConfig]] - `contains` [EXTRACTED]
- [[FrontCounterPage.tsx]] - `imports_from` [EXTRACTED]
- [[InventoryPage.tsx]] - `imports_from` [EXTRACTED]
- [[KitchenPage.tsx]] - `imports_from` [EXTRACTED]
- [[LiveOrdersPage.tsx]] - `imports_from` [EXTRACTED]
- [[MaintenancePage.tsx]] - `imports_from` [EXTRACTED]
- [[OrdersPage.tsx]] - `imports_from` [EXTRACTED]
- [[PurchasesPage.tsx]] - `imports_from` [EXTRACTED]
- [[RecordForm.tsx]] - `imports_from` [EXTRACTED]
- [[SelectOption]] - `contains` [EXTRACTED]
- [[StaffPage.tsx]] - `imports_from` [EXTRACTED]
- [[SuppliersPage.tsx]] - `imports_from` [EXTRACTED]
- [[TasksPage.tsx]] - `imports_from` [EXTRACTED]
- [[WastagePage.tsx]] - `imports_from` [EXTRACTED]
- [[taskFields.ts]] - `imports_from` [EXTRACTED]

## Source
**Full file:** `client/src/components/crud/types.ts`
```typescript
export interface SelectOption {
  value: string;
  label: string;
}

export interface FormFieldConfig {
  key: string;
  label: string;
  type: "text" | "number" | "select" | "date" | "datetime" | "textarea" | "checkbox";
  options?: SelectOption[];
  required?: boolean;
  placeholder?: string;
}

export interface ColumnConfig<T> {
  key: string;
  label: string;
  numeric?: boolean;
  render?: (record: T) => import("react").ReactNode;
  sortable?: boolean;
  sortValue?: (record: T) => string | number | null | undefined;
}
```

#graphify/code #graphify/EXTRACTED #community/Generic_CRUD_UI_Components