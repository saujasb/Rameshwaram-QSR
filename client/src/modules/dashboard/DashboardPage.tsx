import { useMemo } from "react";
import type { ReactNode } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAnalyticsSnapshot } from "../../lib/api/analytics";
import { useActionCenter } from "../../lib/api/actionCenter";
import { useSalesSummary, useLatestImportBatch } from "../../lib/api/sales";
import { wastageHooks } from "../../lib/api/wastage";
import { taskHooks } from "../../lib/api/tasks";
import { inventoryHooks } from "../../lib/api/inventory";
import { purchaseHooks } from "../../lib/api/purchases";
import { orderHooks } from "../../lib/api/orders";
import { attendanceHooks } from "../../lib/api/staff";
import { maintenanceHooks } from "../../lib/api/maintenance";
import { complaintHooks } from "../../lib/api/complaints";
import { computeInventoryStatus } from "@shared/inventoryStatus";
import { getCurrentBusinessDate, shiftDateKey, formatBusinessDateLong } from "@shared/businessDate";
import { formatInrCompact, formatTrendArrow } from "../../lib/format";
import { BusinessDayTimeline } from "../../components/BusinessDayTimeline";
import { DataFreshnessBadge } from "../../components/DataFreshnessBadge";
import { SalesTrendChart } from "../../components/charts/SalesTrendChart";
import { AttentionRequiredCard, type AttentionAlert } from "./AttentionRequiredCard";
import { useSalesTargetWithEditor } from "./SalesTargetEditor";

const TREND_WINDOW_DAYS = 14;

type Tone = "good" | "warn" | "ser" | "crit" | "notconn";

function KpiTile({
  label,
  value,
  note,
  tone,
  onClick,
}: {
  label: string;
  value: string;
  note: string;
  tone: Tone;
  onClick?: () => void;
}) {
  return (
    <button className={`kpi ${tone}`} onClick={onClick} disabled={!onClick}>
      <div className="lab">{label}</div>
      <div className="val">{value}</div>
      <div className="note">{note}</div>
    </button>
  );
}

function GroupHeading({ children }: { children: ReactNode }) {
  return <h2 style={{ fontSize: 15, margin: "26px 0 10px", color: "var(--ink-2)" }}>{children}</h2>;
}

function growthTone(pct: number | null): Tone {
  if (pct == null) return "notconn";
  return pct >= 0 ? "good" : "warn";
}

function targetTone(pct: number | null): Tone {
  if (pct == null) return "notconn";
  if (pct >= 100) return "good";
  if (pct >= 85) return "warn";
  return "crit";
}

function deriveStatus(pct: number | null, criticalCount: number): { label: string; tone: Tone } {
  if (criticalCount > 0) return { label: "Attention required", tone: "crit" };
  if (pct == null) return { label: "Not connected", tone: "notconn" };
  if (pct >= 100) return { label: "On track", tone: "good" };
  if (pct >= 85) return { label: "Watch", tone: "warn" };
  return { label: "Attention required", tone: "crit" };
}

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
          data={trendSales?.dailyTrend ?? []}
          target={target?.amount}
          markers={[
            { businessDate: today, label: "Today", color: "var(--brand)" },
            { businessDate: yesterday, label: "Yesterday", color: "var(--s2)" },
            { businessDate: lastWeek, label: "Last week", color: "var(--s3)" },
          ]}
        />
      </div>

      <div className="card">
        <h3>Hourly Sales</h3>
        <p className="h3sub">Operating window 05:00 → 03:00 next day</p>
        <div className="empty-state" style={{ padding: "24px 20px" }}>
          <p style={{ color: "var(--muted)", fontSize: 13.5, margin: 0 }}>
            Hourly breakdown isn't available yet — Kiosk and PetPooja item-wise reports carry daily totals only, no
            per-order clock time. This section lights up automatically once a timestamped export is imported.
          </p>
        </div>
      </div>

      <AttentionRequiredCard salesAlerts={salesAlerts} />

      <GroupHeading>Orders (manually logged — no POS/online feed)</GroupHeading>
      <div className="kpis">
        <KpiTile label="Orders Today" value={String(ordersToday.length)} note="hand-logged" tone="good" onClick={() => navigate("/orders")} />
        <KpiTile label="Dine-in" value={String(ordersToday.filter((o) => o.channel === "dine_in").length)} note="today" tone="good" onClick={() => navigate("/front-counter")} />
        <KpiTile label="Takeaway" value={String(ordersToday.filter((o) => o.channel === "takeaway").length)} note="today" tone="good" onClick={() => navigate("/front-counter")} />
        <KpiTile label="Delivery" value={String(ordersToday.filter((o) => o.channel === "delivery").length)} note="today" tone="good" onClick={() => navigate("/delivery")} />
        <KpiTile label="Cancelled" value={String(ordersToday.filter((o) => o.status === "cancelled").length)} note="today" tone="warn" onClick={() => navigate("/orders")} />
        <KpiTile label="Delayed" value={String(ordersToday.filter((o) => o.status === "delayed").length)} note="today" tone={ordersToday.some((o) => o.status === "delayed") ? "crit" : "good"} onClick={() => navigate("/kitchen")} />
      </div>

      <GroupHeading>Kitchen</GroupHeading>
      <div className="kpis">
        <KpiTile label="Orders in Kitchen" value={String(kitchenQueue.length)} note="from logged orders" tone={kitchenQueue.length > 4 ? "crit" : kitchenQueue.length > 0 ? "warn" : "good"} onClick={() => navigate("/kitchen")} />
        <KpiTile label="Average Prep Time" value="Not connected" note="No KDS timestamps yet" tone="notconn" />
        <KpiTile label="Orders Beyond SLA" value="Not connected" note="No SLA tracking yet" tone="notconn" />
      </div>

      <GroupHeading>Staff</GroupHeading>
      <div className="kpis">
        <KpiTile label="Staff Scheduled" value={String(attendanceToday.filter((a) => a.scheduled).length)} note="today" tone="good" onClick={() => navigate("/attendance")} />
        <KpiTile label="Staff Present" value={String(attendanceToday.filter((a) => a.status === "present").length)} note="today" tone="good" onClick={() => navigate("/attendance")} />
        <KpiTile label="Staff Absent" value={String(attendanceToday.filter((a) => a.status === "absent").length)} note="today" tone={attendanceToday.some((a) => a.status === "absent") ? "crit" : "good"} onClick={() => navigate("/attendance")} />
        <KpiTile label="Open Shifts" value="Not connected" note="No shift-scheduling module yet" tone="notconn" />
      </div>

      <GroupHeading>Inventory</GroupHeading>
      <div className="kpis">
        <KpiTile label="Low Stock" value={String((inventory ?? []).filter((i) => computeInventoryStatus(i) === "low").length)} note="reorder soon" tone="warn" onClick={() => navigate("/inventory?status=low")} />
        <KpiTile label="Critical Stock" value={String((inventory ?? []).filter((i) => computeInventoryStatus(i) === "critical").length)} note="below minimum" tone="crit" onClick={() => navigate("/inventory?status=critical")} />
        <KpiTile label="Out of Stock" value={String((inventory ?? []).filter((i) => computeInventoryStatus(i) === "out_of_stock").length)} note="zero on hand" tone="crit" onClick={() => navigate("/inventory?status=out_of_stock")} />
        <KpiTile label="Pending Purchases" value={String(pendingPurchases.length)} note="not yet received" tone={pendingPurchases.length ? "warn" : "good"} onClick={() => navigate("/purchases")} />
        <KpiTile label="Wastage Today" value={`${wastageToday.toFixed(2)} kg`} note="logged entries" tone={wastageToday > 5 ? "crit" : wastageToday > 0 ? "warn" : "good"} onClick={() => navigate("/wastage")} />
      </div>

      <GroupHeading>Operations</GroupHeading>
      <div className="kpis">
        <KpiTile label="SPO Completion %" value={spoCompletionPct != null ? `${spoCompletionPct}%` : "—"} note={`${spoTasks.length} SPO tasks`} tone={spoCompletionPct != null && spoCompletionPct < 60 ? "warn" : "good"} onClick={() => navigate("/tasks?category=spo")} />
        <KpiTile label="Pending SPOs" value={String(spoTasks.filter((t) => t.status !== "completed").length)} note="not completed" tone="warn" onClick={() => navigate("/tasks?category=spo")} />
        <KpiTile label="Overdue SPOs" value={String(overdueSpo.length)} note="past due" tone={overdueSpo.length ? "crit" : "good"} onClick={() => navigate("/tasks?status=overdue")} />
        <KpiTile label="Hygiene Issues Open" value={String(hygieneOpen.length)} note="not completed" tone={hygieneOpen.length ? "warn" : "good"} onClick={() => navigate("/tasks?category=hygiene")} />
        <KpiTile label="Open Maintenance" value={String(openMaintenance.length)} note="unresolved" tone={openMaintenance.length ? "warn" : "good"} onClick={() => navigate("/maintenance")} />
        <KpiTile label="Open Complaints" value={String(openComplaints.length)} note="unresolved" tone={openComplaints.length ? "warn" : "good"} onClick={() => navigate("/complaints")} />
      </div>
    </div>
  );
}
