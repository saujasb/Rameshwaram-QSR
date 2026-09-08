---
source_file: "client/src/lib/api/providerOrders.ts"
type: "code"
community: "Provider Order Integration (Petpooja/GoSelfServe)"
location: "L5"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Provider_Order_Integration_Petpooja/GoSelfServe
---

# filterToParams()

## Connections
- [[apiproviderOrders.ts]] - `contains` [EXTRACTED]
- [[useProviderOrders()]] - `calls` [EXTRACTED]

## Source
**From** `client/src/lib/api/providerOrders.ts` **(starting line 5):**
```typescript
function filterToParams(filter: ProviderOrderFilter): string {
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(filter)) {
    if (v) p.set(k, String(v));
  }
  const qs = p.toString();
  return qs ? `?${qs}` : "";
}
```

#graphify/code #graphify/EXTRACTED #community/Provider_Order_Integration_Petpooja/GoSelfServe