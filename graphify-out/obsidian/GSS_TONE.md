---
source_file: "client/src/modules/live-orders/ProviderOrderDetailModal.tsx"
type: "code"
community: "Provider Order Integration (Petpooja/GoSelfServe)"
location: "L10"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Provider_Order_Integration_Petpooja/GoSelfServe
---

# GSS_TONE

## Connections
- [[ProviderOrderDetailModal.tsx]] - `contains` [EXTRACTED]

## Source
**From** `client/src/modules/live-orders/ProviderOrderDetailModal.tsx` **(starting line 10):**
```tsx
const GSS_TONE: Record<ProviderOrder["goselfserveSyncStatus"], "ok" | "over" | "under" | "neutral"> = {
  sent: "ok",
  failed: "over",
  pending: "under",
  not_configured: "neutral",
};
```

#graphify/code #graphify/EXTRACTED #community/Provider_Order_Integration_Petpooja/GoSelfServe