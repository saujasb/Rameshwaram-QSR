---
source_file: "shared-types/entities.ts"
type: "code"
community: "Complaints & Shared Entity Enums"
location: "L101"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Complaints__Shared_Entity_Enums
---

# PurchaseStatus

## Connections
- [[entities.ts]] - `contains` [EXTRACTED]

## Source
**From** `shared-types/entities.ts` **(starting line 101):**
```typescript
export type PurchaseStatus = "pending" | "partially_received" | "received";

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

#graphify/code #graphify/EXTRACTED #community/Complaints__Shared_Entity_Enums