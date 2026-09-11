---
source_file: "client/src/modules/kitchen/KitchenPage.tsx"
type: "code"
community: "Order Operations Pages"
location: "L11"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Order_Operations_Pages
---

# useKitchenQueue()

## Connections
- [[KitchenPage()]] - `calls` [EXTRACTED]
- [[KitchenPage.tsx]] - `contains` [EXTRACTED]

## Source
**From** `client/src/modules/kitchen/KitchenPage.tsx` **(starting line 11):**
```tsx
function useKitchenQueue() {
  const { data, ...rest } = orderHooks.useList();
  return { ...rest, data: data?.filter((o) => KITCHEN_STATUSES.has(o.status)) };
}
```

#graphify/code #graphify/EXTRACTED #community/Order_Operations_Pages