// Shown when the Sales & Revenue live-area source selector is set to "Online".
// No data source exists for this yet -- deliberately no API call, no mock
// data. Swapping this out for a real feed later is a one-line change in
// SalesAnalyticsPage (render <LiveSalesFeed source="online" /> once that
// provider exists), not a redesign of the selector.
export function OnlineSourcePlaceholder({ area }: { area: "feed" | "amount" }) {
  const title = area === "feed" ? "Live sales feed — Online" : "Sales Amount — Online";

  return (
    <div>
      <div className="page-head">
        <div>
          <h2 style={{ fontSize: 15, margin: "0 0 4px", color: "var(--ink-2)" }}>{title}</h2>
        </div>
        <span className="tag neutral" style={{ fontSize: 10.5 }}>🔜 COMING NEXT</span>
      </div>
      <div className="banner-not-connected">
        <b>Online integration coming next.</b> Petpooja and Kiosk (GoSelfServe) are live; Online orders aren't connected
        to a data source yet. Nothing is shown here rather than invented or estimated figures — this view will switch
        on automatically once that integration is built.
      </div>
    </div>
  );
}
