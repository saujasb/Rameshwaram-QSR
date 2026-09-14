---
source_file: "server/src/entities/provider-orders/repository.ts"
type: "code"
community: "Provider Orders & Live Feed"
location: "L1"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Provider_Orders__Live_Feed
---

# provider-orders/repository.ts

## Connections
- [[NormalizedProviderOrder]] - `contains` [EXTRACTED]
- [[ProviderName]] - `imports` [EXTRACTED]
- [[ProviderOrder]] - `imports` [EXTRACTED]
- [[ProviderOrderAddon]] - `imports` [EXTRACTED]
- [[ProviderOrderDiscount]] - `imports` [EXTRACTED]
- [[ProviderOrderFilter]] - `imports` [EXTRACTED]
- [[ProviderOrderItem]] - `imports` [EXTRACTED]
- [[ProviderOrderPartPayment]] - `imports` [EXTRACTED]
- [[ProviderOrderSource]] - `imports` [EXTRACTED]
- [[ProviderOrderStatus]] - `imports` [EXTRACTED]
- [[ProviderOrderTax]] - `imports` [EXTRACTED]
- [[ProviderOrderType]] - `imports` [EXTRACTED]
- [[UpsertOutcome]] - `contains` [EXTRACTED]
- [[db]] - `imports` [EXTRACTED]
- [[dbclient.ts]] - `imports_from` [EXTRACTED]
- [[ensureProviderOrderTables()]] - `imports` [EXTRACTED]
- [[findExistingStmt]] - `contains` [EXTRACTED]
- [[getByIdStmt]] - `contains` [EXTRACTED]
- [[getProviderOrder()]] - `contains` [EXTRACTED]
- [[insertEventStmt]] - `contains` [EXTRACTED]
- [[listProviderOrders()]] - `contains` [EXTRACTED]
- [[markGoSelfServeNotConfigured()]] - `contains` [EXTRACTED]
- [[markGoSelfServeSyncResult()]] - `contains` [EXTRACTED]
- [[provider-ordersdb.ts]] - `imports_from` [EXTRACTED]
- [[provider-ordersgoselfserve.ts]] - `imports_from` [EXTRACTED]
- [[provider-ordersroutes.ts]] - `imports_from` [EXTRACTED]
- [[providersgoselfserve.ts]] - `imports_from` [EXTRACTED]
- [[providerspetpooja.ts]] - `imports_from` [EXTRACTED]
- [[recordWebhookEvent()]] - `contains` [EXTRACTED]
- [[redactTokens()]] - `contains` [EXTRACTED]
- [[rowToOrder()]] - `contains` [EXTRACTED]
- [[shared-typesproviderOrders.ts]] - `imports_from` [EXTRACTED]
- [[upsertProviderOrder()]] - `contains` [EXTRACTED]
- [[upsertStmt]] - `contains` [EXTRACTED]
- [[webhook.ts]] - `imports_from` [EXTRACTED]

#graphify/code #graphify/EXTRACTED #community/Provider_Orders__Live_Feed