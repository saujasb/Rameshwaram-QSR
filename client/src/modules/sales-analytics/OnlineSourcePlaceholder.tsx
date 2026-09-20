// Shown when the Sales & Revenue live-area source selector is set to "Online".
// Petpooja Online is NOT a separate integration -- it arrives through the
// same Petpooja webhook. Swiggy and Zomato orders (order_from "zomato"/
// "swiggy") are ALREADY recognized and combined into the one "Online" channel
// bucket (see classifySalesChannel in shared-types/providerOrders.ts) -- they
// already show up correctly in the Combined view's channel breakdown the
// moment such an order arrives, no code change needed. This DEDICATED tab
// specifically stays a placeholder only because it isn't wired to a live
// per-channel query yet (real Online order volume didn't exist to build and
// verify that against until now) -- that wiring, plus mapping any further
// confirmed order_from value beyond zomato/swiggy via
// CONFIRMED_PETPOOJA_ONLINE_LABELS, is what "tomorrow" covers.
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
        <span className="tag neutral" style={{ fontSize: 10.5 }}>⏳ AWAITING LIVE DATA</span>
      </div>
      <div className="banner-not-connected">
        <b>No Online orders recorded yet.</b> Petpooja and Kiosk (GoSelfServe) are live. Swiggy and Zomato orders placed
        through Petpooja are already recognized as one combined "Online" channel — visible in the Combined view's
        channel breakdown as soon as a real one arrives — but this dedicated Online tab isn't wired to a live
        per-channel feed yet. Nothing is shown here rather than invented or estimated figures; individual Online orders
        (with their Swiggy/Zomato platform) already show correctly in Live Orders and the Combined feed today.
      </div>
    </div>
  );
}
