import { useAnalyticsSnapshot } from "../../lib/api/analytics";

export function KpiScorecardPage() {
  const { data: snap, isLoading } = useAnalyticsSnapshot();
  if (isLoading || !snap) return <p style={{ color: "var(--muted)" }}>Loading…</p>;

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>KPI Scorecard & Targets</h1>
          <p className="page-desc">
            Manage the branch to these numbers every day. Figures below are from the {snap.reportDate} report — the
            targets/watch/act thresholds are reusable; grade the branch against them daily once a live feed exists.
          </p>
        </div>
      </div>
      <div className="card">
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>KPI</th><th>What it tells you</th><th className="num">🎯 Target</th><th className="num">⚠ Watch</th>
                <th className="num">🔴 Act</th><th className="num">{snap.reportDate}</th><th>Grade</th>
              </tr>
            </thead>
            <tbody>
              {snap.kpiTargets.map((row) => (
                <tr key={row.kpi}>
                  <td><b>{row.kpi}</b></td>
                  <td style={{ color: "var(--ink-2)", fontSize: 12.5 }}>{row.description}</td>
                  <td className="num">{row.target}</td>
                  <td className="num">{row.watch}</td>
                  <td className="num">{row.act}</td>
                  <td className="num"><b>{row.today}</b></td>
                  <td><span className={`pill ${row.grade}`}>{row.gradeLabel}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 14 }}>
          Targets are industry-standard starting points for a high-volume QSR/café; tune them to your own history over
          2–3 weeks of data.
        </p>
      </div>
    </div>
  );
}
