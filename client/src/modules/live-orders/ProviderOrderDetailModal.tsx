import { Modal } from "../../components/Modal";
import { StatusBadge } from "../../components/StatusBadge";
import { PROVIDER_ORDER_SOURCE_LABELS, PROVIDER_ORDER_TYPE_LABELS, classifyOnlinePlatform } from "@shared/providerOrders";
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
  // Kiosk/GoSelfServe orders carry a Bill No (providerInvoiceId, falling back
  // to the order ref if Kiosk didn't send one) that's the more recognizable
  // identifier for staff than the internal order ref id -- Petpooja is
  // unchanged, its providerOrderId already is the bill/order id.
  const isKiosk = order.provider === "goselfserve";
  const primaryLabel = isKiosk ? "Bill" : "Order";
  const primaryId = isKiosk && order.providerInvoiceId ? order.providerInvoiceId : order.providerOrderId;
  const showOrderRef = isKiosk && order.providerInvoiceId && order.providerInvoiceId !== order.providerOrderId;
  // Swiggy/Zomato orders are ONE combined "Online" reporting category (see
  // classifyOnlinePlatform) -- Source always reads "Online" here, with the
  // actual aggregator shown separately as the Platform, never as if Swiggy/
  // Zomato were their own top-level source.
  const online = classifyOnlinePlatform(order);

  return (
    <Modal title={`${primaryLabel} #${primaryId} — ${order.orderFromLabel}`} onClose={onClose}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
        <StatusBadge label={order.status} tone={order.status === "success" ? "ok" : "over"} />
        <StatusBadge label={PROVIDER_ORDER_TYPE_LABELS[order.orderType]} tone="neutral" />
        {online.isOnline ? (
          <>
            <StatusBadge label="Source: Online" tone="neutral" />
            <StatusBadge label={`Platform: ${online.platformLabel ?? "Unknown"}`} tone="neutral" />
          </>
        ) : (
          <StatusBadge label={PROVIDER_ORDER_SOURCE_LABELS[order.orderFrom]} tone="neutral" />
        )}
        {/* "not_configured" just means outbound GoSelfServe sync has no API
            credentials set -- true for every Petpooja order today, so it's
            noise rather than information. Real states (pending/sent/failed)
            still show normally once sync is actually configured. */}
        {order.goselfserveSyncStatus !== "not_configured" && (
          <StatusBadge label={GSS_LABEL[order.goselfserveSyncStatus]} tone={GSS_TONE[order.goselfserveSyncStatus]} />
        )}
      </div>

      <div className="grid2">
        <div>
          <h4 style={{ fontSize: 13, marginBottom: 6 }}>Order</h4>
          <p style={{ fontSize: 13, color: "var(--ink-2)", margin: 0 }}>
            {order.restaurantName || "—"} · {order.tableNo ? `Table ${order.tableNo}` : "No table"} · {order.paymentType || "—"}
            {showOrderRef && <> · Order ref #{order.providerOrderId}</>}
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
