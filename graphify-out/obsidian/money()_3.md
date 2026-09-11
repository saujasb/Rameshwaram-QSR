---
source_file: "client/src/modules/live-orders/LiveOrdersPage.tsx"
type: "code"
community: "Provider Order Integration (Petpooja/GoSelfServe)"
location: "L10"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Provider_Order_Integration_Petpooja/GoSelfServe
---

# money()

## Connections
- [[LiveOrdersPage.tsx]] - `contains` [EXTRACTED]

## Source
**From** `client/src/modules/live-orders/LiveOrdersPage.tsx` **(starting line 10):**
```tsx
function money(n: number): string {
  return `₹${n.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
}
```

#graphify/code #graphify/EXTRACTED #community/Provider_Order_Integration_Petpooja/GoSelfServe