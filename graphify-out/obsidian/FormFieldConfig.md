---
source_file: "client/src/components/crud/types.ts"
type: "code"
community: "Generic CRUD UI Components"
location: "L6"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Generic_CRUD_UI_Components
---

# FormFieldConfig

## Connections
- [[AttendancePage.tsx]] - `imports` [EXTRACTED]
- [[ComplaintsPage.tsx]] - `imports` [EXTRACTED]
- [[CrudModulePage.tsx]] - `imports` [EXTRACTED]
- [[DeliveryPage.tsx]] - `imports` [EXTRACTED]
- [[ExpensesPage.tsx]] - `imports` [EXTRACTED]
- [[FrontCounterPage.tsx]] - `imports` [EXTRACTED]
- [[InventoryPage.tsx]] - `imports` [EXTRACTED]
- [[KitchenPage.tsx]] - `imports` [EXTRACTED]
- [[MaintenancePage.tsx]] - `imports` [EXTRACTED]
- [[OrdersPage.tsx]] - `imports` [EXTRACTED]
- [[PurchasesPage.tsx]] - `imports` [EXTRACTED]
- [[RecordForm.tsx]] - `imports` [EXTRACTED]
- [[StaffPage.tsx]] - `imports` [EXTRACTED]
- [[SuppliersPage.tsx]] - `imports` [EXTRACTED]
- [[WastagePage.tsx]] - `imports` [EXTRACTED]
- [[taskFields.ts]] - `imports` [EXTRACTED]
- [[types.ts]] - `contains` [EXTRACTED]

## Source
**From** `client/src/components/crud/types.ts` **(starting line 6):**
```typescript
export interface FormFieldConfig {
  key: string;
  label: string;
  type: "text" | "number" | "select" | "date" | "datetime" | "textarea" | "checkbox";
  options?: SelectOption[];
  required?: boolean;
  placeholder?: string;
}
```

#graphify/code #graphify/EXTRACTED #community/Generic_CRUD_UI_Components