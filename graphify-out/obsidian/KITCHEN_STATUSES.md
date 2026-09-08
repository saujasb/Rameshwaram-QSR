---
source_file: "client/src/modules/kitchen/KitchenPage.tsx"
type: "code"
community: "Order Operations Pages"
location: "L9"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Order_Operations_Pages
---

# KITCHEN_STATUSES

## Connections
- [[KitchenPage.tsx]] - `contains` [EXTRACTED]

## Source
**From** `client/src/modules/kitchen/KitchenPage.tsx` **(starting line 9):**
```tsx
const KITCHEN_STATUSES = new Set(["received", "accepted", "preparing", "ready", "delayed"]);

function useKitchenQueue() {
  const { data, ...rest } = orderHooks.useList();
  return { ...rest, data: data?.filter((o) => KITCHEN_STATUSES.has(o.status)) };
}
```

#graphify/code #graphify/EXTRACTED #community/Order_Operations_Pages