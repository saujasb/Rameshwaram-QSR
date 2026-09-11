---
source_file: "client/src/modules/purchases/PurchasesPage.tsx"
type: "code"
community: "Purchases UI"
location: "L49"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Purchases_UI
---

# PurchasesPage()

## Connections
- [[PurchasesPage.tsx]] - `contains` [EXTRACTED]
- [[routes.tsx]] - `imports` [EXTRACTED]

## Source
**From** `client/src/modules/purchases/PurchasesPage.tsx` **(starting line 49):**
```tsx
export function PurchasesPage() {
  const receiveAction = purchaseHooks.useAction<Purchase>("receive");

  return (
    <CrudModulePage<Purchase>
      title="Purchases"
      description="Every ingredient/supply order — quantity ordered vs received, cost, and status. Create a purchase, then mark it received as stock arrives."
      hooks={purchaseHooks}
      columns={columns}
      formFields={formFields}
      defaultValues={{
        purchaseDate: new Date().toISOString().slice(0, 10),
        item: "",
        supplierId: null,
        supplierName: "",
        quantity: 0,
        unit: "kg",
        unitPrice: 0,
        expectedDelivery: null,
        receivedQuantity: 0,
        invoiceRef: "",
        status: "pending",
      }}
      emptyMessage="No purchases recorded yet."
      addButtonLabel="Create purchase"
      renderDetail={(record) =>
        record.status !== "received" ? (
          <div className="btn-row" style={{ marginTop: 0, marginBottom: 14 }}>
            <button
              className="btn small"
              onClick={() => receiveAction.mutate({ id: record.id, body: { receivedQuantity: record.quantity } })}
            >
              Mark fully received
            </button>
          </div>
        ) : null
      }
    />
  );
}
```

#graphify/code #graphify/EXTRACTED #community/Purchases_UI