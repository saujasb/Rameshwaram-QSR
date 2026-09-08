---
source_file: "client/src/modules/live-orders/ProviderOrderDetailModal.tsx"
type: "code"
community: "Provider Order Integration (Petpooja/GoSelfServe)"
location: "L1"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Provider_Order_Integration_Petpooja/GoSelfServe
---

# ProviderOrderDetailModal.tsx

## Connections
- [[GSS_LABEL]] - `contains` [EXTRACTED]
- [[GSS_TONE]] - `contains` [EXTRACTED]
- [[LiveOrdersPage.tsx]] - `imports_from` [EXTRACTED]
- [[Modal()]] - `imports` [EXTRACTED]
- [[Modal.tsx]] - `imports_from` [EXTRACTED]
- [[PROVIDER_ORDER_SOURCE_LABELS]] - `imports` [EXTRACTED]
- [[PROVIDER_ORDER_TYPE_LABELS]] - `imports` [EXTRACTED]
- [[ProviderOrder]] - `imports` [EXTRACTED]
- [[ProviderOrderDetailModal()]] - `contains` [EXTRACTED]
- [[StatusBadge()]] - `imports` [EXTRACTED]
- [[StatusBadge.tsx]] - `imports_from` [EXTRACTED]
- [[money()_4]] - `contains` [EXTRACTED]
- [[shared-typesproviderOrders.ts]] - `imports_from` [EXTRACTED]

## Source
**Full file:** `client/src/modules/live-orders/ProviderOrderDetailModal.tsx`
```tsx
import { Modal } from "../../components/Modal";
import { StatusBadge } from "../../components/StatusBadge";
import { PROVIDER_ORDER_SOURCE_LABELS, PROVIDER_ORDER_TYPE_LABELS } from "@shared/providerOrders";
import type { ProviderOrder } from "@shared/providerOrders";

function money(n: number): string {
  return `₹${n.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
}

const GSS_TONE: Record<ProviderOrder["goselfserveSyncStatus"], "ok" | "over" | "under" | "neutral"> = {
  sent: "ok",
  failed: "over",
  pending: "under",
  not_configured: "neutral",
};

const GSS_LABEL: Record<ProviderOrder["goselfserveSyncStatus"], string> = {
  sent: "Synced",
  failed: "Sync failed",
  pending: "Sync pending",
  not_configured: "GoSelfServe not configured",
};

export function ProviderOrderDetailModal({ order, onClose }: { order: ProviderOrder; onClose: () => void }) {
  return (
    <Modal title={`Order #${order.providerOrderId} — ${order.orderFromLabel}`} onClose={onClose}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
        <StatusBadge label={order.status} tone={order.status === "success" ? "ok" : "over"} />
        <StatusBadge label={PROVIDER_ORDER_TYPE_LABELS[order.orderType]} tone="neutral" />
        <StatusBadge label={PROVIDER_ORDER_SOURCE_LABELS[order.orderFrom]} tone="neutral" />
        <StatusBadge label={GSS_LABEL[order.goselfserveSyncStatus]} tone={GSS_TONE[order.goselfserveSyncStatus]} />
      </div>

      <div className="grid2">
        <div>
          <h4 style={{ fontSize: 13, marginBottom: 6 }}>Order</h4>
          <p style={{ fontSize: 13, color: "var(--ink-2)", margin: 0 }}>
            {order.restaurantName || "—"} · {order.tableNo ? `Table ${order.tableNo}` : "No table"} · {order.paymentType || "—"}
            <br />
            {new Date(order.providerCreatedAt.replace(" ", "T")).toLocaleString() || order.providerCreatedAt}
          </p>
        </div>
        <div>
          <h4 style={{ fontSize: 13, marginBottom: 6 }}>Customer</h4>
          <p style={{ fontSize: 13, color: "var(--ink-2)", margin: 0 }}>
            {order.customerName || "Walk-in / not provided"}
            {order.customerPhone ? ` · ${order.customerPhone}` : ""}
          </p>
        </div>
      </div>

      <h4 style={{ fontSize: 13, margin: "16px 0 6px" }}>Items ({order.itemCount})</h4>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th className="num">Qty</th>
              <th className="num">Price</th>
              <th className="num">Total</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item, i) => (
              <tr key={i}>
                <td>
                  {item.name}
                  {item.categoryName && <div style={{ fontSize: 11, color: "var(--muted)" }}>{item.categoryName}</div>}
                  {item.addons.length > 0 && (
                    <div style={{ fontSize: 11.5, color: "var(--ink-2)", marginTop: 2 }}>
                      {item.addons.map((a) => `${a.name} ×${a.quantity}`).join(", ")}
                    </div>
                  )}
                  {item.specialNotes && <div style={{ fontSize: 11.5, color: "var(--brand)", marginTop: 2 }}>"{item.specialNotes}"</div>}
                </td>
                <td className="num">{item.quantity}</td>
                <td className="num">{money(item.price)}</td>
                <td className="num">{money(item.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(order.taxes.length > 0 || order.discounts.length > 0) && (
        <div className="grid2" style={{ marginTop: 14 }}>
          {order.taxes.length > 0 && (
            <div>
              <h4 style={{ fontSize: 13, marginBottom: 6 }}>Tax</h4>
              {order.taxes.map((t, i) => (
                <div key={i} style={{ fontSize: 13, display: "flex", justifyContent: "space-between" }}>
                  <span>{t.title} ({t.rate}%)</span> <span>{money(t.amount)}</span>
                </div>
              ))}
            </div>
          )}
          {order.discounts.length > 0 && (
            <div>
              <h4 style={{ fontSize: 13, marginBottom: 6 }}>Discount</h4>
              {order.discounts.map((d, i) => (
                <div key={i} style={{ fontSize: 13, display: "flex", justifyContent: "space-between" }}>
                  <span>{d.title}</span> <span>-{money(d.amount)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {order.partPayments.length > 0 && (
        <>
          <h4 style={{ fontSize: 13, margin: "14px 0 6px" }}>Part payments</h4>
          {order.partPayments.map((p, i) => (
            <div key={i} style={{ fontSize: 13, display: "flex", justifyContent: "space-between" }}>
              <span>{p.paymentType}{p.customPaymentType ? ` (${p.customPaymentType})` : ""}</span> <span>{money(p.amount)}</span>
            </div>
          ))}
        </>
      )}

      <div style={{ borderTop: "1px solid var(--line)", marginTop: 14, paddingTop: 10, display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: 15 }}>
        <span>Total</span>
        <span>{money(order.totalAmount)}</span>
      </div>

      {order.goselfserveSyncStatus === "failed" && order.goselfserveSyncError && (
        <div className="callout" style={{ marginTop: 14 }}>
          <b>GoSelfServe sync error:</b> {order.goselfserveSyncError}
        </div>
      )}
    </Modal>
  );
}
```

#graphify/code #graphify/EXTRACTED #community/Provider_Order_Integration_Petpooja/GoSelfServe