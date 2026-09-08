---
source_file: "server/src/entities/provider-orders/goselfserve.ts"
type: "code"
community: "Provider Order Integration (Petpooja/GoSelfServe)"
location: "L24"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Provider_Order_Integration_Petpooja/GoSelfServe
---

# buildStatusPayload()

## Connections
- [[goselfserve.ts]] - `contains` [EXTRACTED]
- [[syncOrderStatusToGoSelfServe()]] - `calls` [EXTRACTED]

## Source
**From** `server/src/entities/provider-orders/goselfserve.ts` **(starting line 24):**
```typescript
function buildStatusPayload(order: ProviderOrder): Record<string, unknown> {
  return {
    order_id: order.providerOrderId,
    status: order.status,
    updated_at: order.updatedAt,
    additional_data: {
      provider: order.provider,
      order_type: order.orderType,
      order_from: order.orderFromLabel,
      total: order.totalAmount,
    },
  };
}
```

#graphify/code #graphify/EXTRACTED #community/Provider_Order_Integration_Petpooja/GoSelfServe