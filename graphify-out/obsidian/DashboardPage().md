---
source_file: "client/src/modules/dashboard/DashboardPage.tsx"
type: "code"
community: "Dashboard & Sales Trend Visualization"
location: "L74"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Dashboard__Sales_Trend_Visualization
---

# DashboardPage()

## Connections
- [[DashboardPage.tsx]] - `contains` [EXTRACTED]
- [[computeInventoryStatus()]] - `calls` [EXTRACTED]
- [[deriveStatus()]] - `calls` [EXTRACTED]
- [[formatBusinessDateLong()]] - `calls` [EXTRACTED]
- [[formatInrCompact()]] - `calls` [EXTRACTED]
- [[formatTrendArrow()]] - `calls` [EXTRACTED]
- [[getCurrentBusinessDate()]] - `calls` [EXTRACTED]
- [[growthTone()]] - `calls` [EXTRACTED]
- [[routes.tsx]] - `imports` [EXTRACTED]
- [[shiftDateKey()]] - `calls` [EXTRACTED]
- [[targetTone()]] - `calls` [EXTRACTED]
- [[useActionCenter()]] - `calls` [EXTRACTED]
- [[useAnalyticsSnapshot()]] - `calls` [EXTRACTED]
- [[useLatestImportBatch()]] - `calls` [EXTRACTED]
- [[useSalesSummary()]] - `calls` [EXTRACTED]
- [[useSalesTargetWithEditor()]] - `calls` [EXTRACTED]

## Source
**From** `client/src/modules/dashboard/DashboardPage.tsx` **(starting line 74):**
```tsx
export function DashboardPage() {
  const navigate = useNavigate();
  // Business day (05:00 -> 03:00 next calendar day), not the raw calendar date --
  // e.g. at 14 Aug 01:30 AM "today" is still the 13 Aug trading day.
  const today = getCurrentBusinessDate();
  const yesterday = shiftDateKey(today, -1);
  const lastWeek = shiftDateKey(today, -7);
  const trendStart = shiftDateKey(today, -(TREND_WINDOW_DAYS - 1));

  const { data: snap } = useAnalyticsSnapshot();
  const { data: actionItems } = useActionCenter();
  const { data: todaySales } = useSalesSummary(today, today);
  const { data: yesterdaySales } = useSalesSummary(yesterday, yesterday);
  const { data: lastWeekSales } = useSalesSummary(lastWeek, lastWeek);
  const { data: trendSales } = useSalesSummary(trendStart, today);
  const { data: allSales } = useSalesSummary();
  const { data: latestBatch } = useLatestImportBatch();
  const { target, openEditor, editor } = useSalesTargetWithEditor();

  const { data: wastage } = wastageHooks.useList();
  const { data: tasks } = taskHooks.useList();
  const { data: inventory } = inventoryHooks.useList();
  const { data: purchases } = purchaseHooks.useList();
  const { data: orders } = orderHooks.useList();
  const { data: attendance } = attendanceHooks.useList();
  const { data: maintenance } = maintenanceHooks.useList();
  const { data: complaints } = complaintHooks.useList();

  const wastageToday = useMemo(() => (wastage ?? []).filter((w) => w.date === today).reduce((s, w) => s + w.quantityKg, 0), [wastage, today]);
  const ordersToday = useMemo(() => (orders ?? []).filter((o) => o.receivedAt.slice(0, 10) === today), [orders, today]);
  const kitchenQueue = useMemo(() => (orders ?? []).filter((o) => ["received", "accepted", "preparing", "ready", "delayed"].includes(o.status)), [orders]);
  const spoTasks = useMemo(() => (tasks ?? []).filter((t) => t.category === "spo"), [tasks]);
  const hygieneOpen = useMemo(() => (tasks ?? []).filter((t) => t.category === "hygiene" && t.status !== "completed"), [tasks]);
  const overdueSpo = useMemo(
    () => spoTasks.filter((t) => t.status !== "completed" && t.status !== "failed" && t.dueTime && new Date(t.dueTime).getTime() < Date.now()),
    [spoTasks]
  );
  const spoCompletionPct = spoTasks.length ? Math.round((spoTasks.filter((t) => t.status === "completed").length / spoTasks.length) * 100) : null;
  const pendingPurchases = useMemo(() => (purchases ?? []).filter((p) => p.status !== "received"), [purchases]);
  const attendanceToday = useMemo(() => (attendance ?? []).filter((a) => a.date === today), [attendance]);
  const openMaintenance = useMemo(() => (maintenance ?? []).filter((m) => m.status !== "resolved"), [maintenance]);
  const openComplaints = useMemo(() => (complaints ?? []).filter((c) => c.status !== "resolved"), [complaints]);
  const criticalCount = actionItems?.filter((i) => i.severity === "critical").length ?? 0;

  const hasToday = Boolean(todaySales && todaySales.totalAmount > 0);
  const hasYesterday = Boolean(yesterdaySales && yesterdaySales.totalAmount > 0);
  const hasLastWeek = Boolean(lastWeekSales && lastWeekSales.totalAmount > 0);

  const growthVsYesterday = hasToday && hasYesterday ? ((todaySales!.totalAmount - yesterdaySales!.totalAmount) / yesterdaySales!.totalAmount) * 100 : null;
  const growthVsLastWeek = hasToday && hasLastWeek ? ((todaySales!.totalAmount - lastWeekSales!.totalAmount) / lastWeekSales!.totalAmount) * 100 : null;
  const targetPct = target?.amount ? ((todaySales?.totalAmount ?? 0) / target.amount) * 100 : null;
  const status = deriveStatus(targetPct, criticalCount);

  const salesAlerts: AttentionAlert[] = useMemo(() => {
    const alerts: AttentionAlert[] = [];
    if (!allSales || allSales.totalAmount === 0) {
      alerts.push({
        id: "sales-none",
        severity: "info",
        title: "No sales data imported yet",
        detail: "Upload your first Kiosk / PetPooja report to start tracking real sales here.",
        linkPath: "/sales-import",
      });
    } else if (!hasToday) {
      alerts.push({
        id: "sales-today-missing",
        severity: "info",
        title: `No sales imported yet for today's business day (${today})`,
        detail: "Import today's report once trading closes to keep this dashboard current.",
        linkPath: "/sales-import",
      });
    } else if (targetPct != null && targetPct < 60) {
      alerts.push({
        id: "sales-target-critical",
        severity: "critical",
        title: `Sales are ${Math.round(100 - targetPct)}% below target so far today`,
        detail: `₹${todaySales!.totalAmount.toLocaleString()} of ₹${target!.amount!.toLocaleString()} target.`,
        linkPath: "/sales-analytics",
      });
    } else if (targetPct != null && targetPct < 85) {
      alerts.push({
        id: "sales-target-warn",
        severity: "attention",
        title: `Sales are tracking ${Math.round(100 - targetPct)}% below target so far today`,
        detail: `₹${todaySales!.totalAmount.toLocaleString()} of ₹${target!.amount!.toLocaleString()} target.`,
        linkPath: "/sales-analytics",
      });
    }
    if (latestBatch && latestBatch.validation.status !== "passed") {
      alerts.push({
        id: `import-${latestBatch.id}`,
        severity: latestBatch.validation.status === "failed" ? "critical" : "attention",
        title: `Import ${latestBatch.validation.status === "failed" ? "validation failed" : "completed with warnings"}: ${latestBatch.fileName}`,
        detail: latestBatch.validation.notes[0] ?? "Check the import history for details.",
        linkPath: "/sales-import",
      });
    }
    return alerts;
  }, [allSales, hasToday, targetPct, latestBatch, today, todaySales, target]);

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Rameshwaram — Master Tracking Command Centre</h1>
          <p className="page-desc">Brookefield branch. Live metrics are computed from what your team has logged and imported; anything without a connected feed is labeled, never invented.</p>
        </div>
        <DataFreshnessBadge lastSyncedAt={latestBatch?.createdAt ?? null} />
      </div>

      {snap && (
        <div className="callout">
          <b>Last reported trading day ({snap.reportDate}):</b> {snap.itemsSold.toLocaleString()} items sold on{" "}
          {snap.productionKg} kg production, wastage {snap.wastagePct}%, recipe-vs-actual gap ₹{snap.recipeVsActualRupees.toLocaleString()}.{" "}
          <Link to="/sales-analytics">Full analytics →</Link>
        </div>
      )}

      <div className="card hero-bizday">
        <div className="hero-bizday-head">
          <span className="lab">Business Day</span>
          <span className="hero-bizday-date">{formatBusinessDateLong(today)}</span>
        </div>
        <BusinessDayTimeline businessDate={today} live />
      </div>

      <GroupHeading>Executive Summary</GroupHeading>
      <div className="kpis">
        <KpiTile
          label="Total Sales"
          value={hasToday ? formatInrCompact(todaySales!.totalAmount) : "₹0"}
          note={hasToday ? `${todaySales!.totalQuantity.toLocaleString()} items · ${today}` : `No PDF imported yet for ${today}`}
          tone={hasToday ? "good" : "notconn"}
          onClick={() => navigate("/sales-import")}
        />
        <KpiTile label="Orders" value="Not available" note="No per-order/bill count in item-wise sales reports" tone="notconn" onClick={() => navigate("/sales-analytics")} />
        <KpiTile label="AOV" value="Not available" note="Needs an order/bill-count feed" tone="notconn" onClick={() => navigate("/sales-analytics")} />
        <KpiTile
          label="Target Achievement"
          value={targetPct != null ? `${Math.round(targetPct)}%` : "Set a target"}
          note={target?.amount ? `vs ₹${target.amount.toLocaleString()}/day · click to edit` : "Click to set a daily sales target"}
          tone={targetTone(targetPct)}
          onClick={openEditor}
        />
        <KpiTile
          label="Growth vs Yesterday"
          value={formatTrendArrow(growthVsYesterday)}
          note={hasYesterday ? `₹${todaySales?.totalAmount.toLocaleString() ?? 0} vs ₹${yesterdaySales!.totalAmount.toLocaleString()}` : "Need yesterday imported"}
          tone={growthTone(growthVsYesterday)}
          onClick={() => navigate("/sales-analytics")}
        />
        <KpiTile
          label="Weekly Growth"
          value={formatTrendArrow(growthVsLastWeek)}
          note={hasLastWeek ? `vs same day last week (₹${lastWeekSales!.totalAmount.toLocaleString()})` : "Need same day last week imported"}
          tone={growthTone(growthVsLastWeek)}
          onClick={() => navigate("/sales-analytics")}
        />
      </div>
      {editor}

      <div className="card glance-card">
        <h3>Today at a Glance</h3>
        <p className="h3sub">{today} business day</p>
        <div className="glance-grid">
          <div className="glance-row">
            <span>Sales</span>
            <b>{hasToday ? `₹${todaySales!.totalAmount.toLocaleString()}` : "₹0"}</b>
            <span className={growthVsYesterday == null ? "muted-text" : growthVsYesterday >= 0 ? "trend-up" : "trend-down"}>{formatTrendArrow(growthVsYesterday)}</span>
          </div>
          <div className="glance-row">
            <span>Orders</span>
            <b>Not available</b>
            <span className="muted-text">no bill count</span>
          </div>
          <div className="glance-row">
            <span>AOV</span>
            <b>Not available</b>
            <span className="muted-text">no bill count</span>
          </div>
          <div className="glance-row">
            <span>Target Achievement</span>
            <b>{targetPct != null ? `${Math.round(targetPct)}%` : "—"}</b>
            <span className="muted-text">{target?.amount ? `of ₹${target.amount.toLocaleString()}` : "not set"}</span>
          </div>
          <div className="glance-row">
            <span>Best Hour</span>
            <b>Not available</b>
            <span className="muted-text">no per-order time data</span>
          </div>
          <div className="glance-row">
            <span>Status</span>
            <b><span className={`status-dot ${status.tone}`} /> {status.label}</b>
            <span className="muted-text">{criticalCount > 0 ? `${criticalCount} critical` : ""}</span>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 18 }}>
        <h3>Sales Performance</h3>
        <p className="h3sub">Last {TREND_WINDOW_DAYS} business days on file · target shown as dashed line</p>
        <SalesTrendChart
```
*(truncated at 200 lines)*

#graphify/code #graphify/EXTRACTED #community/Dashboard__Sales_Trend_Visualization