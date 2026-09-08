---
source_file: "server/src/entities/provider-orders/repository.ts"
type: "code"
community: "Provider Order Integration (Petpooja/GoSelfServe)"
location: "L233"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Provider_Order_Integration_Petpooja/GoSelfServe
---

# listProviderOrders()

## Connections
- [[provider-ordersrepository.ts]] - `contains` [EXTRACTED]
- [[provider-ordersroutes.ts]] - `imports` [EXTRACTED]
- [[rowToOrder()]] - `indirect_call` [INFERRED]

## Source
**From** `server/src/entities/provider-orders/repository.ts` **(starting line 233):**
```typescript
export function listProviderOrders(filter: ProviderOrderFilter): ProviderOrder[] {
  const conditions: string[] = [];
  const params: unknown[] = [];
  if (filter.provider) {
    conditions.push("provider = ?");
    params.push(filter.provider);
  }
  if (filter.status) {
    conditions.push("status = ?");
    params.push(filter.status);
  }
  if (filter.orderType) {
    conditions.push("orderType = ?");
    params.push(filter.orderType);
  }
  if (filter.orderFrom) {
    conditions.push("orderFrom = ?");
    params.push(filter.orderFrom);
  }
  if (filter.search) {
    conditions.push("(providerOrderId LIKE ? OR customerName LIKE ? OR restaurantName LIKE ?)");
    const like = `%${filter.search}%`;
    params.push(like, like, like);
  }
  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  const rows = db
    .prepare(`SELECT * FROM provider_orders ${where} ORDER BY receivedAt DESC LIMIT 1000`)
    .all(...params);
  return rows.map(rowToOrder);
}
```

#graphify/code #graphify/EXTRACTED #community/Provider_Order_Integration_Petpooja/GoSelfServe