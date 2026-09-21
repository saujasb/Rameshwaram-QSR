import { useMemo } from "react";
import { attendanceHooks } from "../../lib/api/staff";
import { wastageHooks } from "../../lib/api/wastage";
import { taskHooks } from "../../lib/api/tasks";
import { orderHooks } from "../../lib/api/orders";
import { getCurrentBusinessDate } from "@shared/businessDate";
import type { Shift } from "@shared/entities";

const SHIFTS: { key: Shift; label: string }[] = [
  { key: "opening", label: "Opening" },
  { key: "mid", label: "Mid" },
  { key: "closing", label: "Closing" },
];

export function ShiftPerformancePage() {
  const { data: attendance } = attendanceHooks.useList();
  const { data: wastage } = wastageHooks.useList();
  const { data: tasks } = taskHooks.useList();
  const { data: orders } = orderHooks.useList();

  // Business day (05:00 -> 03:00 next calendar day), not the raw calendar date --
  // a 1am shift log still belongs to the trading day that started the previous morning.
  const today = getCurrentBusinessDate();

  const rows = useMemo(() => {
    return SHIFTS.map((s) => {
      const att = (attendance ?? []).filter((a) => a.shift === s.key && a.date === today);
      const scheduled = att.filter((a) => a.scheduled).length;
      const present = att.filter((a) => a.status === "present").length;
      const absent = att.filter((a) => a.status === "absent").length;
      const wasteKg = (wastage ?? []).filter((w) => w.shift === s.key && w.date === today).reduce((sum, w) => sum + w.quantityKg, 0);
      const shiftTasks = (tasks ?? []).filter((t) => t.shift === s.key);
      const tasksCompleted = shiftTasks.filter((t) => t.status === "completed").length;
      return { ...s, scheduled, present, absent, wasteKg, tasksTotal: shiftTasks.length, tasksCompleted, hasAttendanceData: att.length > 0 };
    });
  }, [attendance, wastage, tasks, today]);

  const hasAnyData = rows.some((r) => r.hasAttendanceData) || (wastage ?? []).some((w) => w.date === today) || (orders ?? []).length > 0;

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Shift & Store Performance</h1>
          <p className="page-desc">
            A rollup computed live from Attendance, Wastage and Tasks — not its own dataset. Shows {today}; log
            attendance/wastage/tasks against a shift to populate this view.
          </p>
        </div>
      </div>

      {!hasAnyData && (
        <div className="callout notconn">
          No attendance, wastage, or task activity has been logged for {today} yet. This page fills in automatically as
          your team uses Attendance, Wastage and Tasks day to day — nothing here is invented.
        </div>
      )}

      <div className="grid2" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
        {rows.map((r) => (
          <div className="card" key={r.key} style={{ marginBottom: 0 }}>
            <h3>{r.label} shift</h3>
            <p className="h3sub">{today}</p>
            <table>
              <tbody>
                <tr><td>Staff scheduled</td><td className="num">{r.scheduled}</td></tr>
                <tr><td>Staff present</td><td className="num">{r.present}</td></tr>
                <tr><td>Staff absent</td><td className="num">{r.absent}</td></tr>
                <tr><td>Wastage logged</td><td className="num">{r.wasteKg.toFixed(2)} kg</td></tr>
                <tr><td>Tasks (this shift)</td><td className="num">{r.tasksCompleted} / {r.tasksTotal} completed</td></tr>
              </tbody>
            </table>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginTop: 18 }}>
        <h3>Orders logged today</h3>
        <p className="h3sub">From manually-logged Orders/Kitchen/Delivery/Front Counter entries — see the note there on live-feed status.</p>
        <p style={{ fontSize: 24, fontWeight: 800 }}>{(orders ?? []).filter((o) => o.receivedAt.slice(0, 10) === today).length}</p>
      </div>
    </div>
  );
}
