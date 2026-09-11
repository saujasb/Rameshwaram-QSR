---
source_file: "client/src/components/StatusBadge.tsx"
type: "code"
community: "Order Operations Pages"
location: "L3"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Order_Operations_Pages
---

# StatusBadge()

## Connections
- [[AttendancePage.tsx]] - `imports` [EXTRACTED]
- [[ComplaintsPage.tsx]] - `imports` [EXTRACTED]
- [[DeliveryPage.tsx]] - `imports` [EXTRACTED]
- [[FrontCounterPage.tsx]] - `imports` [EXTRACTED]
- [[InventoryDetailModal.tsx]] - `imports` [EXTRACTED]
- [[InventoryPage.tsx]] - `imports` [EXTRACTED]
- [[KitchenPage.tsx]] - `imports` [EXTRACTED]
- [[LiveOrdersPage.tsx]] - `imports` [EXTRACTED]
- [[MaintenancePage.tsx]] - `imports` [EXTRACTED]
- [[OrdersPage.tsx]] - `imports` [EXTRACTED]
- [[ProviderOrderDetailModal.tsx]] - `imports` [EXTRACTED]
- [[PurchasesPage.tsx]] - `imports` [EXTRACTED]
- [[StaffPage.tsx]] - `imports` [EXTRACTED]
- [[StatusBadge.tsx]] - `contains` [EXTRACTED]
- [[TaskDetailModal.tsx]] - `imports` [EXTRACTED]
- [[TasksPage.tsx]] - `imports` [EXTRACTED]
- [[VegIndentPage.tsx]] - `imports` [EXTRACTED]

## Source
**From** `client/src/components/StatusBadge.tsx` **(starting line 3):**
```tsx
export function StatusBadge({ label, tone }: { label: string; tone: BadgeTone }) {
  return <span className={`tag ${tone}`}>{label}</span>;
}
```

#graphify/code #graphify/EXTRACTED #community/Order_Operations_Pages