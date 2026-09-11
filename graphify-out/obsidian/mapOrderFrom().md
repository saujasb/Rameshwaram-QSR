---
source_file: "server/src/entities/provider-orders/providers/petpooja.ts"
type: "code"
community: "Provider Order Integration (Petpooja/GoSelfServe)"
location: "L39"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Provider_Order_Integration_Petpooja/GoSelfServe
---

# mapOrderFrom()

## Connections
- [[normalizePetpoojaPayload()]] - `calls` [EXTRACTED]
- [[providerspetpooja.ts]] - `contains` [EXTRACTED]

## Source
**From** `server/src/entities/provider-orders/providers/petpooja.ts` **(starting line 39):**
```typescript
function mapOrderFrom(raw: string): ProviderOrderSource {
  const v = raw.trim().toLowerCase();
  if (v === "pos") return "pos";
  if (v === "zomato") return "zomato";
  if (v === "swiggy") return "swiggy";
  return "other";
}
```

#graphify/code #graphify/EXTRACTED #community/Provider_Order_Integration_Petpooja/GoSelfServe