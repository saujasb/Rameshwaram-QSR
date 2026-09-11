---
source_file: "client/src/components/crud/types.ts"
type: "code"
community: "Order Operations Pages"
location: "L15"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Order_Operations_Pages
---

# ColumnConfig

## Connections
- [[AttendancePage.tsx]] - `imports` [EXTRACTED]
- [[ComplaintsPage.tsx]] - `imports` [EXTRACTED]
- [[CrudModulePage.tsx]] - `imports` [EXTRACTED]
- [[DataTable.tsx]] - `imports` [EXTRACTED]
- [[DeliveryPage.tsx]] - `imports` [EXTRACTED]
- [[ExpensesPage.tsx]] - `imports` [EXTRACTED]
- [[FrontCounterPage.tsx]] - `imports` [EXTRACTED]
- [[InventoryPage.tsx]] - `imports` [EXTRACTED]
- [[KitchenPage.tsx]] - `imports` [EXTRACTED]
- [[LiveOrdersPage.tsx]] - `imports` [EXTRACTED]
- [[MaintenancePage.tsx]] - `imports` [EXTRACTED]
- [[OrdersPage.tsx]] - `imports` [EXTRACTED]
- [[PurchasesPage.tsx]] - `imports` [EXTRACTED]
- [[StaffPage.tsx]] - `imports` [EXTRACTED]
- [[SuppliersPage.tsx]] - `imports` [EXTRACTED]
- [[TasksPage.tsx]] - `imports` [EXTRACTED]
- [[WastagePage.tsx]] - `imports` [EXTRACTED]
- [[types.ts]] - `contains` [EXTRACTED]

## Source
**From** `client/src/components/crud/types.ts` **(starting line 15):**
```typescript
export interface ColumnConfig<T> {
  key: string;
  label: string;
  numeric?: boolean;
  render?: (record: T) => import("react").ReactNode;
  sortable?: boolean;
  sortValue?: (record: T) => string | number | null | undefined;
}
```

#graphify/code #graphify/EXTRACTED #community/Order_Operations_Pages