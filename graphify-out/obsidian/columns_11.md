---
source_file: "client/src/modules/orders/OrdersPage.tsx"
type: "code"
community: "Order Operations Pages"
location: "L9"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Order_Operations_Pages
---

# columns

## Connections
- [[OrdersPage.tsx]] - `contains` [EXTRACTED]

## Source
**From** `client/src/modules/orders/OrdersPage.tsx` **(starting line 9):**
```tsx
const columns: ColumnConfig<ManualOrderEntry>[] = [
  { key: "receivedAt", label: "Received", render: (r) => new Date(r.receivedAt).toLocaleString() },
```

#graphify/code #graphify/EXTRACTED #community/Order_Operations_Pages