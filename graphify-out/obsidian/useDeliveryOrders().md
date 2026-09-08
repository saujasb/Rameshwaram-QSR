---
source_file: "client/src/modules/delivery/DeliveryPage.tsx"
type: "code"
community: "Order Operations Pages"
location: "L9"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Order_Operations_Pages
---

# useDeliveryOrders()

## Connections
- [[DeliveryPage()]] - `indirect_call` [INFERRED]
- [[DeliveryPage.tsx]] - `contains` [EXTRACTED]

## Source
**From** `client/src/modules/delivery/DeliveryPage.tsx` **(starting line 9):**
```tsx
function useDeliveryOrders() {
  const { data, ...rest } = orderHooks.useList();
  return { ...rest, data: data?.filter((o) => o.channel === "delivery") };
}
```

#graphify/code #graphify/EXTRACTED #community/Order_Operations_Pages