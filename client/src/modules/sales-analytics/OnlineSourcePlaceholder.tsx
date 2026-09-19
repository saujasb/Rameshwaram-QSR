// Shown when the Sales & Revenue live-area source selector is set to "Online".
// Petpooja Online is NOT a separate integration -- it arrives through the
// same Petpooja webhook and is classified purely by its order_from value (see
// classifySalesChannel in server/src/entities/provider-orders/
// salesAggregation.ts). That classifier's confirmed-Online label list is
// deliberately empty because no real Petpooja Online order has been observed
// yet (every order to date carries order_from "POS"/"pos"), so this stays a
// placeholder -- not because a webhook/feed is missing, but because the real
// label to recognize hasn't been confirmed. Once it is (a real Online test
// order or direct word from Petpooja), adding it to that list is enough for
// this to light up on its own; no new selector option or component swap needed.
export function OnlineSourcePlaceholder({ area }: { area: "feed" | "amount" | "items" | "categories" }) {
  const title =
    area === "feed"
      ? "Live sales feed — Online"
      : area === "amount"
        ? "Sales Amount — Online"
        : area === "items"
          ? "Item Sales — Online"
          : "Category Performance — Online";

  return (
    <div>
      <div className="page-head">
        <div>
          <h2 style={{ fontSize: 15, margin: "0 0 4px", color: "var(--ink-2)" }}>{title}</h2>
        </div>
        <span className="tag neutral" style={{ fontSize: 10.5 }}>⏳ AWAITING CONFIRMATION</span>
      </div>
      <div className="banner-not-connected">
        <b>No confirmed Petpooja Online orders yet.</b> Petpooja and Kiosk (GoSelfServe) are live. Petpooja Online orders
        arrive through the same Petpooja webhook Offline/POS orders already use — but the exact order/channel value
        Petpooja sends for its Online-ordering mode hasn't been confirmed against real traffic (every order seen so far
        is "POS"). Nothing is shown here rather than invented or estimated figures — this view switches on automatically
        the moment that value is confirmed and added to the channel mapping, with no new integration required.
      </div>
    </div>
  );
}
