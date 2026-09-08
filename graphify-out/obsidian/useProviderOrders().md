---
source_file: "client/src/lib/api/providerOrders.ts"
type: "code"
community: "Provider Order Integration (Petpooja/GoSelfServe)"
location: "L14"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Provider_Order_Integration_Petpooja/GoSelfServe
---

# useProviderOrders()

## Connections
- [[LiveOrdersPage()]] - `calls` [EXTRACTED]
- [[LiveOrdersPage.tsx]] - `imports` [EXTRACTED]
- [[apiproviderOrders.ts]] - `contains` [EXTRACTED]
- [[apiGet()]] - `calls` [EXTRACTED]
- [[filterToParams()]] - `calls` [EXTRACTED]

## Source
**From** `client/src/lib/api/providerOrders.ts` **(starting line 14):**
```typescript
export function useProviderOrders(filter: ProviderOrderFilter, refetchIntervalMs = 15000) {
  return useQuery({
    queryKey: ["provider-orders", filter],
    queryFn: () => apiGet<ProviderOrder[]>(`/provider-orders${filterToParams(filter)}`),
    refetchInterval: refetchIntervalMs,
  });
}
```

#graphify/code #graphify/EXTRACTED #community/Provider_Order_Integration_Petpooja/GoSelfServe