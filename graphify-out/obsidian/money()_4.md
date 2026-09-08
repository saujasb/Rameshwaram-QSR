---
source_file: "client/src/modules/live-orders/ProviderOrderDetailModal.tsx"
type: "code"
community: "Provider Order Integration (Petpooja/GoSelfServe)"
location: "L6"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Provider_Order_Integration_Petpooja/GoSelfServe
---

# money()

## Connections
- [[ProviderOrderDetailModal()]] - `calls` [EXTRACTED]
- [[ProviderOrderDetailModal.tsx]] - `contains` [EXTRACTED]

## Source
**From** `client/src/modules/live-orders/ProviderOrderDetailModal.tsx` **(starting line 6):**
```tsx
function money(n: number): string {
  return `₹${n.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
}
```

#graphify/code #graphify/EXTRACTED #community/Provider_Order_Integration_Petpooja/GoSelfServe