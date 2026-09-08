---
source_file: "client/src/components/StatusBadge.tsx"
type: "code"
community: "Inventory Management UI"
location: "L1"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Inventory_Management_UI
---

# StatusBadge.tsx

## Connections
- [[AttendancePage.tsx]] - `imports_from` [EXTRACTED]
- [[BadgeTone]] - `contains` [EXTRACTED]
- [[ComplaintsPage.tsx]] - `imports_from` [EXTRACTED]
- [[DeliveryPage.tsx]] - `imports_from` [EXTRACTED]
- [[FrontCounterPage.tsx]] - `imports_from` [EXTRACTED]
- [[InventoryDetailModal.tsx]] - `imports_from` [EXTRACTED]
- [[InventoryPage.tsx]] - `imports_from` [EXTRACTED]
- [[KitchenPage.tsx]] - `imports_from` [EXTRACTED]
- [[LiveOrdersPage.tsx]] - `imports_from` [EXTRACTED]
- [[MaintenancePage.tsx]] - `imports_from` [EXTRACTED]
- [[OrdersPage.tsx]] - `imports_from` [EXTRACTED]
- [[ProviderOrderDetailModal.tsx]] - `imports_from` [EXTRACTED]
- [[PurchasesPage.tsx]] - `imports_from` [EXTRACTED]
- [[StaffPage.tsx]] - `imports_from` [EXTRACTED]
- [[StatusBadge()]] - `contains` [EXTRACTED]
- [[TaskDetailModal.tsx]] - `imports_from` [EXTRACTED]
- [[TasksPage.tsx]] - `imports_from` [EXTRACTED]
- [[VegIndentPage.tsx]] - `imports_from` [EXTRACTED]
- [[inventoryStatusUi.ts]] - `imports_from` [EXTRACTED]

## Source
**Full file:** `client/src/components/StatusBadge.tsx`
```tsx
export type BadgeTone = "ok" | "over" | "under" | "neutral";

export function StatusBadge({ label, tone }: { label: string; tone: BadgeTone }) {
  return <span className={`tag ${tone}`}>{label}</span>;
}
```

#graphify/code #graphify/EXTRACTED #community/Inventory_Management_UI