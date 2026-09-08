---
source_file: "client/src/modules/live-orders/ProviderOrderDetailModal.tsx"
type: "code"
community: "Provider Order Integration (Petpooja/GoSelfServe)"
location: "L17"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Provider_Order_Integration_Petpooja/GoSelfServe
---

# GSS_LABEL

## Connections
- [[ProviderOrderDetailModal.tsx]] - `contains` [EXTRACTED]

## Source
**From** `client/src/modules/live-orders/ProviderOrderDetailModal.tsx` **(starting line 17):**
```tsx
const GSS_LABEL: Record<ProviderOrder["goselfserveSyncStatus"], string> = {
  sent: "Synced",
  failed: "Sync failed",
  pending: "Sync pending",
  not_configured: "GoSelfServe not configured",
};
```

#graphify/code #graphify/EXTRACTED #community/Provider_Order_Integration_Petpooja/GoSelfServe