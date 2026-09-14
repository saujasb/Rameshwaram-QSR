import { CrudModulePage } from "../../components/crud/CrudModulePage";
import { StatusBadge } from "../../components/StatusBadge";
import { purchaseHooks } from "../../lib/api/purchases";
import type { Purchase } from "@shared/entities";
import type { ColumnConfig, FormFieldConfig } from "../../components/crud/types";

const columns: ColumnConfig<Purchase>[] = [
  { key: "purchaseDate", label: "Date" },
  { key: "item", label: "Item" },
  { key: "supplierName", label: "Supplier" },
  { key: "quantity", label: "Qty", numeric: true, render: (r) => `${r.quantity} ${r.unit}` },
  { key: "unitPrice", label: "Unit price", numeric: true, render: (r) => `₹${r.unitPrice}` },
  { key: "total", label: "Total", numeric: true, render: (r) => `₹${(r.quantity * r.unitPrice).toLocaleString()}` },
  { key: "receivedQuantity", label: "Received", numeric: true, render: (r) => `${r.receivedQuantity} / ${r.quantity}` },
  {
    key: "status",
    label: "Status",
    render: (r) => (
      <StatusBadge
        label={r.status.replace("_", " ")}
        tone={r.status === "received" ? "ok" : r.status === "partially_received" ? "under" : "neutral"}
      />
    ),
  },
];

const formFields: FormFieldConfig[] = [
  { key: "purchaseDate", label: "Purchase date", type: "date", required: true },
  { key: "item", label: "Item", type: "text", required: true },
  { key: "supplierName", label: "Supplier", type: "text", required: true },
  { key: "quantity", label: "Quantity", type: "number", required: true },
  { key: "unit", label: "Unit", type: "text", required: true, placeholder: "kg / L / pcs" },
  { key: "unitPrice", label: "Unit price (₹)", type: "number", required: true },
  { key: "expectedDelivery", label: "Expected delivery", type: "date" },
  { key: "receivedQuantity", label: "Received quantity", type: "number" },
  { key: "invoiceRef", label: "Invoice / reference", type: "text" },
  {
    key: "status",
    label: "Status",
    type: "select",
    options: [
      { value: "pending", label: "Pending" },
      { value: "partially_received", label: "Partially received" },
      { value: "received", label: "Received" },
    ],
  },
];

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
