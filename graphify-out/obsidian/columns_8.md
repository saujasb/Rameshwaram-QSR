---
source_file: "client/src/modules/delivery/DeliveryPage.tsx"
type: "code"
community: "Order Operations Pages"
location: "L14"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Order_Operations_Pages
---

# columns

## Connections
- [[DeliveryPage.tsx]] - `contains` [EXTRACTED]

## Source
**From** `client/src/modules/delivery/DeliveryPage.tsx` **(starting line 14):**
```tsx
const columns: ColumnConfig<ManualOrderEntry>[] = [
  { key: "receivedAt", label: "Received", render: (r) => new Date(r.receivedAt).toLocaleString() },
```

#graphify/code #graphify/EXTRACTED #community/Order_Operations_Pages