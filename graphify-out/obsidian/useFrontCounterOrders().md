---
source_file: "client/src/modules/front-counter/FrontCounterPage.tsx"
type: "code"
community: "Order Operations Pages"
location: "L9"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Order_Operations_Pages
---

# useFrontCounterOrders()

## Connections
- [[FrontCounterPage()]] - `indirect_call` [INFERRED]
- [[FrontCounterPage.tsx]] - `contains` [EXTRACTED]

## Source
**From** `client/src/modules/front-counter/FrontCounterPage.tsx` **(starting line 9):**
```tsx
function useFrontCounterOrders() {
  const { data, ...rest } = orderHooks.useList();
  return { ...rest, data: data?.filter((o) => o.channel === "dine_in" || o.channel === "takeaway") };
}
```

#graphify/code #graphify/EXTRACTED #community/Order_Operations_Pages