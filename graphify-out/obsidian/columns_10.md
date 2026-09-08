---
source_file: "client/src/modules/kitchen/KitchenPage.tsx"
type: "code"
community: "Order Operations Pages"
location: "L16"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Order_Operations_Pages
---

# columns

## Connections
- [[KitchenPage.tsx]] - `contains` [EXTRACTED]

## Source
**From** `client/src/modules/kitchen/KitchenPage.tsx` **(starting line 16):**
```tsx
const columns: ColumnConfig<ManualOrderEntry>[] = [
  { key: "receivedAt", label: "Received", render: (r) => new Date(r.receivedAt).toLocaleTimeString() },
```

#graphify/code #graphify/EXTRACTED #community/Order_Operations_Pages