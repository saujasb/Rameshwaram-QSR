---
source_file: "client/src/modules/live-orders/LiveOrdersPage.tsx"
type: "code"
community: "Provider Order Integration (Petpooja/GoSelfServe)"
location: "L21"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Provider_Order_Integration_Petpooja/GoSelfServe
---

# columns

## Connections
- [[LiveOrdersPage.tsx]] - `contains` [EXTRACTED]

## Source
**From** `client/src/modules/live-orders/LiveOrdersPage.tsx` **(starting line 21):**
```tsx
const columns: ColumnConfig<ProviderOrder>[] = [
  {
    key: "providerCreatedAt",
    label: "Order Time",
    sortable: true,
    render: (r) => {
      const d = new Date(r.providerCreatedAt.replace(" ", "T"));
      return <span title={r.providerCreatedAt}>{Number.isNaN(d.getTime()) ? r.providerCreatedAt : d.toLocaleString()}</span>;
    },
  },
```

#graphify/code #graphify/EXTRACTED #community/Provider_Order_Integration_Petpooja/GoSelfServe