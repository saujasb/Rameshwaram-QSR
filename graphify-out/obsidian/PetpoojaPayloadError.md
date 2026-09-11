---
source_file: "server/src/entities/provider-orders/providers/petpooja.ts"
type: "code"
community: "Provider Order Integration (Petpooja/GoSelfServe)"
location: "L18"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Provider_Order_Integration_Petpooja/GoSelfServe
---

# PetpoojaPayloadError

## Connections
- [[mapOrderType()]] - `calls` [EXTRACTED]
- [[mapStatus()]] - `calls` [EXTRACTED]
- [[normalizePetpoojaPayload()]] - `calls` [EXTRACTED]
- [[providerspetpooja.ts]] - `contains` [EXTRACTED]
- [[webhook.ts]] - `imports` [EXTRACTED]

## Source
**From** `server/src/entities/provider-orders/providers/petpooja.ts` **(starting line 18):**
```typescript
export class PetpoojaPayloadError extends Error {}
```

#graphify/code #graphify/EXTRACTED #community/Provider_Order_Integration_Petpooja/GoSelfServe