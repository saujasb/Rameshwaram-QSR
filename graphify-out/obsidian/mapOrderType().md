---
source_file: "server/src/entities/provider-orders/providers/petpooja.ts"
type: "code"
community: "Provider Order Integration (Petpooja/GoSelfServe)"
location: "L31"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Provider_Order_Integration_Petpooja/GoSelfServe
---

# mapOrderType()

## Connections
- [[PetpoojaPayloadError]] - `calls` [EXTRACTED]
- [[normalizePetpoojaPayload()]] - `calls` [EXTRACTED]
- [[providerspetpooja.ts]] - `contains` [EXTRACTED]

## Source
**From** `server/src/entities/provider-orders/providers/petpooja.ts` **(starting line 31):**
```typescript
function mapOrderType(raw: string): ProviderOrderType {
  const v = raw.trim().toLowerCase();
  if (v === "dine in") return "dine_in";
  if (v === "pick up") return "pick_up";
  if (v === "delivery") return "delivery";
  throw new PetpoojaPayloadError(`Order.order_type: unrecognized value ${JSON.stringify(raw)}`);
}
```

#graphify/code #graphify/EXTRACTED #community/Provider_Order_Integration_Petpooja/GoSelfServe