---
source_file: "server/src/entities/provider-orders/providers/petpooja.ts"
type: "code"
community: "Provider Order Integration (Petpooja/GoSelfServe)"
location: "L47"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Provider_Order_Integration_Petpooja/GoSelfServe
---

# mapStatus()

## Connections
- [[PetpoojaPayloadError]] - `calls` [EXTRACTED]
- [[normalizePetpoojaPayload()]] - `calls` [EXTRACTED]
- [[providerspetpooja.ts]] - `contains` [EXTRACTED]

## Source
**From** `server/src/entities/provider-orders/providers/petpooja.ts` **(starting line 47):**
```typescript
function mapStatus(raw: string): ProviderOrderStatus {
  const v = raw.trim().toLowerCase();
  if (v === "success") return "success";
  if (v === "cancelled") return "cancelled";
  throw new PetpoojaPayloadError(`Order.status: unrecognized value ${JSON.stringify(raw)}`);
}
```

#graphify/code #graphify/EXTRACTED #community/Provider_Order_Integration_Petpooja/GoSelfServe