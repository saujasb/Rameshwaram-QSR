import { useMemo } from "react";
import type { ReactNode } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAnalyticsSnapshot } from "../../lib/api/analytics";
import { useActionCenter } from "../../lib/api/actionCenter";
import { wastageHooks } from "../../lib/api/wastage";
import { taskHooks } from "../../lib/api/tasks";
import { inventoryHooks } from "../../lib/api/inventory";
import { purchaseHooks } from "../../lib/api/purchases";
import { orderHooks } from "../../lib/api/orders";
import { attendanceHooks } from "../../lib/api/staff";
import { maintenanceHooks } from "../../lib/api/maintenance";
import { complaintHooks } from "../../lib/api/complaints";
import { computeInventoryStatus } from "@shared/inventoryStatus";

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
  tone: "good" | "warn" | "ser" | "crit" | "notconn";
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

export function DashboardPage() {
  const navigate = useNavigate();
  const today = new Date().toISOString().slice(0, 10);

  const { data: snap } = useAnalyticsSnapshot();
  const { data: actionItems } = useActionCenter();
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
  const lowCritOutInventory = useMemo(() => (inventory ?? []).filter((i) => ["low", "critical", "out_of_stock"].includes(computeInventoryStatus(i))), [inventory]);
  const pendingPurchases = useMemo(() => (purchases ?? []).filter((p) => p.status !== "received"), [purchases]);
  const attendanceToday = useMemo(() => (attendance ?? []).filter((a) => a.date === today), [attendance]);
  const openMaintenance = useMemo(() => (maintenance ?? []).filter((m) => m.status !== "resolved"), [maintenance]);
  const openComplaints = useMemo(() => (complaints ?? []).filter((c) => c.status !== "resolved"), [complaints]);
  const criticalCount = actionItems?.filter((i) => i.severity === "critical").length ?? 0;
  const attentionCount = actionItems?.filter((i) => i.severity === "attention").length ?? 0;

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Rameshwaram — Master Tracking Dashboard</h1>
          <p className="page-desc">Brookefield branch. Live metrics are computed from what your team has logged; anything without a connected feed is labeled, never invented.</p>
        </div>
      </div>

      {snap && (
        <div className="callout">
          <b>Last reported trading day ({snap.reportDate}):</b> {snap.itemsSold.toLocaleString()} items sold on{" "}
          {snap.productionKg} kg production, wastage {snap.wastagePct}%, recipe-vs-actual gap ₹{snap.recipeVsActualRupees.toLocaleString()}.{" "}
          <Link to="/sales-analytics">Full analytics →</Link>
        </div>
      )}

      <GroupHeading>Sales</GroupHeading>
      <div className="kpis">
        <KpiTile label="Today's Sales" value="Not connected" note="No live POS feed" tone="notconn" />
        <KpiTile label="Sales Target / Achievement %" value="Not connected" note="No target feed set" tone="notconn" />
        <KpiTile label="Sales vs Yesterday / Last Week" value="Not connected" note="Only one historic day on file" tone="notconn" />
        <KpiTile
          label="Last Reported Day's Sales"
          value={snap ? snap.itemsSold.toLocaleString() : "—"}
          note={snap ? `items sold, ${snap.reportDate}` : ""}
          tone="good"
          onClick={() => navigate("/sales-analytics")}
        />
      </div>

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

      <GroupHeading>Action Center</GroupHeading>
      <div className="kpis">
        <KpiTile label="Critical" value={String(criticalCount)} note="need action now" tone={criticalCount ? "crit" : "good"} onClick={() => navigate("/action-center")} />
        <KpiTile label="Attention" value={String(attentionCount)} note="worth a look" tone={attentionCount ? "warn" : "good"} onClick={() => navigate("/action-center")} />
        <KpiTile label="Full Action Center" value="Open →" note="everything, grouped" tone="good" onClick={() => navigate("/action-center")} />
      </div>
    </div>
  );
}
