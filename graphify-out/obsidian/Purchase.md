---
source_file: "shared-types/entities.ts"
type: "code"
community: "Purchases UI"
location: "L103"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Purchases_UI
---

# Purchase

## Connections
- [[BaseRecord]] - `inherits` [EXTRACTED]
- [[PurchasesPage.tsx]] - `imports` [EXTRACTED]
- [[entities.ts]] - `contains` [EXTRACTED]
- [[purchases.ts]] - `imports` [EXTRACTED]
- [[purchasesrepository.ts]] - `imports` [EXTRACTED]

## Source
**From** `shared-types/entities.ts` **(starting line 103):**
```typescript
export interface Purchase extends BaseRecord {
  supplierId: string | null;
  supplierName: string;
  item: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  purchaseDate: string;
  expectedDelivery: string | null;
  receivedQuantity: number;
  invoiceRef: string;
  status: PurchaseStatus;
}
```

#graphify/code #graphify/EXTRACTED #community/Purchases_UI