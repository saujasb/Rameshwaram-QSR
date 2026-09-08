---
source_file: "client/src/modules/live-orders/LiveOrdersPage.tsx"
type: "code"
community: "Provider Order Integration (Petpooja/GoSelfServe)"
location: "L14"
tags:
  - graphify/code
  - graphify/INFERRED
  - community/Provider_Order_Integration_Petpooja/GoSelfServe
---

# itemsSummary()

## Connections
- [[LiveOrdersPage.tsx]] - `indirect_call` [INFERRED]

## Source
**From** `client/src/modules/live-orders/LiveOrdersPage.tsx` **(starting line 14):**
```tsx
function itemsSummary(order: ProviderOrder): string {
  if (order.items.length === 0) return "—";
  const first = order.items[0];
  const extra = order.items.length - 1;
  return `${first.quantity}× ${first.name}${extra > 0 ? ` +${extra} more` : ""}`;
}
```

#graphify/code #graphify/INFERRED #community/Provider_Order_Integration_Petpooja/GoSelfServe