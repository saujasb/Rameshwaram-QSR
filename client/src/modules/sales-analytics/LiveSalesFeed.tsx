import { useState } from "react";
import { StatusBadge } from "../../components/StatusBadge";
import { ProviderOrderDetailModal } from "../live-orders/ProviderOrderDetailModal";
import { useProviderOrders, type RealtimeStatus } from "../../lib/api/providerOrders";
import { PROVIDER_ORDER_TYPE_LABELS } from "@shared/providerOrders";
import type { ProviderOrder } from "@shared/providerOrders";
import { SALES_SOURCE_LABELS, providerFilterFor, type LiveSalesSource } from "./salesSource";

function money(n: number): string {
  return `₹${n.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
}

/** receivedAt is always a server-set ISO timestamp (unlike providerCreatedAt, which is Petpooja's own free-text clock), so it's the reliable one for "just now". */
function relativeTime(receivedAtIso: string): string {
  const ms = new Date(receivedAtIso).getTime();
  if (Number.isNaN(ms)) return "";
  const minutes = Math.round((Date.now() - ms) / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hr${hours === 1 ? "" : "s"} ago`;
  return new Date(ms).toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
}

const CONNECTION_LABEL: Record<RealtimeStatus, string> = {
  live: "Realtime connected",
  connecting: "Connecting…",
  degraded: "Realtime unavailable — polling every 15s",
};

const CONNECTION_TONE: Record<RealtimeStatus, "good" | "notconn" | "warn"> = {
  live: "good",
  connecting: "notconn",
  degraded: "warn",
};

/**
 * Live Sales feed -- scoped to a single live provider, or "combined" for both
 * at once (provider filter simply omitted -- the same query Live Orders
 * already uses), chosen by the source selector in SalesAnalyticsPage.
 */
export function LiveSalesFeed({ connection, source }: { connection: RealtimeStatus; source: LiveSalesSource }) {
  const [selected, setSelected] = useState<ProviderOrder | null>(null);
  const { data, isLoading, isError } = useProviderOrders({ provider: providerFilterFor(source) });
  const orders = (data ?? []).slice(0, 30);
  const tone = CONNECTION_TONE[connection];
  const label = SALES_SOURCE_LABELS[source];
  const combined = source === "combined";

  return (
    <div>
      <div className="page-head">
        <div>
          <h2 style={{ fontSize: 15, margin: "0 0 4px", color: "var(--ink-2)" }}>Live sales feed — {label}</h2>
          <p className="page-desc" style={{ margin: 0 }}>
            {combined
              ? "Every order Petpooja or Kiosk pushes to their webhook lands here the moment it's billed — no import, no refresh needed."
              : `Every order ${label} pushes to the webhook lands here the moment it's billed — no import, no refresh needed.`}
          </p>
        </div>
        <span className={`freshness ${tone}`}>
          <span className={`status-dot ${tone}`} /> {CONNECTION_LABEL[connection]}
        </span>
      </div>

      <div className="card">
        {isError ? (
          <p style={{ color: "var(--critical)", fontSize: 13.5 }}>Couldn't load live orders. Check the backend connection and retry.</p>
        ) : isLoading ? (
          <p style={{ color: "var(--muted)", fontSize: 13.5 }}>Loading…</p>
        ) : orders.length === 0 ? (
          <div className="banner-not-connected">
            No {combined ? "" : `${label} `}orders yet. They'll appear here the moment one arrives.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {orders.map((o) => (
              <button
                key={o.id}
                onClick={() => setSelected(o)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "10px 12px",
                  border: "1px solid var(--line)",
                  borderRadius: 10,
                  background: "var(--card)",
                  cursor: "pointer",
                  textAlign: "left",
                  width: "100%",
                  font: "inherit",
                  color: "inherit",
                }}
              >
                <span className="tag ok" style={{ fontSize: 10, letterSpacing: 0.4, flexShrink: 0 }}>● LIVE</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 13.5 }}>
                    Order #{o.providerOrderId} · {PROVIDER_ORDER_TYPE_LABELS[o.orderType]}
                  </div>
                  <div style={{ fontSize: 11.5, color: "var(--muted)" }}>
                    {o.itemCount} item{o.itemCount === 1 ? "" : "s"} ·{" "}
                    {combined ? SALES_SOURCE_LABELS[o.provider] : o.restaurantName || label}
                  </div>
                </div>
                <div style={{ fontWeight: 700, fontSize: 14, flexShrink: 0 }}>{money(o.totalAmount)}</div>
                <StatusBadge label={o.status} tone={o.status === "success" ? "ok" : "over"} />
                <span style={{ fontSize: 11.5, color: "var(--muted)", minWidth: 70, textAlign: "right", flexShrink: 0 }}>
                  {relativeTime(o.receivedAt)}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {selected && <ProviderOrderDetailModal order={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
