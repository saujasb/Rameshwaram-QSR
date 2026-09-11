import { Link } from "react-router-dom";
import type { Anomaly } from "@shared/intelligence";
import { ANOMALY_KIND_LABELS, DATASET_LABELS_SAFE } from "./labels";
import { useAnomalies, useReconciliation } from "../../lib/api/intelligence";
import { MetricValue, TodaysIntelligencePanel, fmtQty, fmtPct } from "./TodaysIntelligencePanel";
import { TopInsightsPanel, drilldownPath } from "./TopInsightsPanel";
import "./intelligence.css";

const SEVERITY_TONE: Record<Anomaly["severity"], "crit" | "warn" | "ser"> = {
  high: "crit",
  medium: "warn",
  low: "ser",
};

function fmtNum(n: number, unit: Anomaly["unit"]): string {
  if (unit === "rupees") return `₹${n.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
  if (unit === "pct") return `${n.toFixed(1)}%`;
  return n.toLocaleString("en-IN", { maximumFractionDigits: 2 });
}

function AnomalyCard({ a }: { a: Anomaly }) {
  const drill = drilldownPath(a.drilldownQuery);
  return (
    <div className="anomaly-row">
      <div className="anomaly-head">
        <span className={`pill ${SEVERITY_TONE[a.severity]}`}>{a.severity}</span>
        <b>{ANOMALY_KIND_LABELS[a.kind] ?? a.kind}</b>
        <span className="anomaly-when">
          {a.businessDate}
          {a.hour != null && ` · hour ${String(a.hour).padStart(2, "0")}:00`}
          {a.product && ` · ${a.product}`}
        </span>
      </div>
      <p className="anomaly-headline">{a.headline}</p>
      <div className="anomaly-figures">
        <span><span className="lbl">Expected</span> {fmtNum(a.expected, a.unit)}</span>
        <span><span className="lbl">Actual</span> {fmtNum(a.actual, a.unit)}</span>
        <span><span className="lbl">Variance</span> {a.absoluteVariance >= 0 ? "+" : ""}{fmtNum(a.absoluteVariance, a.unit)} ({a.variancePct >= 0 ? "+" : ""}{a.variancePct.toFixed(1)}%)</span>
      </div>
      <p className="anomaly-basis">Expected basis: {a.expectedBasisNote}</p>
      {a.evidence.length > 0 && (
        <ul className="anomaly-evidence">
          {a.evidence.map((e, i) => (
            <li key={i}>
              <b>{DATASET_LABELS_SAFE(e.datasetType)}</b> — {e.description} ({e.recordCount} record
              {e.recordCount === 1 ? "" : "s"}, {e.quantity.toLocaleString()} units
              {e.amount != null && `, ₹${e.amount.toLocaleString()}`})
            </li>
          ))}
        </ul>
      )}
      {drill && <Link className="btn small" to={drill}>View proving records →</Link>}
    </div>
  );
}

export function IntelligencePage() {
  const { data: anomalies, isLoading: anomaliesLoading } = useAnomalies();
  const { data: recon, isLoading: reconLoading } = useReconciliation();

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Business Intelligence</h1>
          <p className="page-desc">
            Reconciliation, anomalies and evidence-backed insights computed from imported records only. Anything the data
            can't support is shown as <i>Insufficient data</i> rather than estimated.
          </p>
        </div>
      </div>

      <TodaysIntelligencePanel />
      <TopInsightsPanel limit={12} />

      <div className="card">
        <h3>Anomalies</h3>
        <p className="h3sub">Each one states expected vs actual, the variance, and the records that prove it.</p>
        {anomaliesLoading && <p style={{ color: "var(--muted)" }}>Checking for anomalies…</p>}
        {!anomaliesLoading && (anomalies?.length ?? 0) === 0 && (
          <div className="empty-state" style={{ padding: "22px 20px" }}>
            <p style={{ color: "var(--muted)", fontSize: 13.5, margin: 0 }}>
              No anomalies detected. Detection compares each business day against prior days, so it needs several days of
              imported history before it can flag anything.
            </p>
          </div>
        )}
        {(anomalies ?? []).map((a) => <AnomalyCard key={a.id} a={a} />)}
      </div>

      <div className="card">
        <h3>Reconciliation — production vs sales vs wastage</h3>
        <p className="h3sub">Expected balance = production − sales − wastage, per business day.</p>

        {reconLoading && <p style={{ color: "var(--muted)" }}>Reconciling…</p>}

        {recon && recon.missingDatasets.length > 0 && (
          <div className="banner-not-connected" style={{ marginBottom: 14 }}>
            <b>Partial reconciliation.</b> No{" "}
            {recon.missingDatasets.map((d) => DATASET_LABELS_SAFE(d).toLowerCase()).join(" or ")} records have been
            imported, so the ratios that depend on them can't be computed and are shown as insufficient data rather than
            zero. <Link to="/data-import">Import those reports</Link> to complete this view.
          </div>
        )}

        {recon && recon.rows.length > 0 ? (
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Business date</th>
                  <th className="num">Production</th><th className="num">Sales</th><th className="num">Wastage</th>
                  <th className="num">Expected balance</th><th className="num">Sell-through</th>
                  <th className="num">Wastage %</th><th className="num">Efficiency</th><th className="num">Variance</th>
                </tr>
              </thead>
              <tbody>
                {recon.rows.map((r) => (
                  <tr key={r.businessDate}>
                    <td><b>{r.businessDate}</b></td>
                    <td className="num"><MetricValue metric={r.productionQty} format={fmtQty} /></td>
                    <td className="num"><MetricValue metric={r.salesQty} format={fmtQty} /></td>
                    <td className="num"><MetricValue metric={r.wastageQty} format={fmtQty} /></td>
                    <td className="num"><MetricValue metric={r.expectedBalance} format={fmtQty} /></td>
                    <td className="num"><MetricValue metric={r.sellThroughPct} format={fmtPct} /></td>
                    <td className="num"><MetricValue metric={r.wastagePct} format={fmtPct} /></td>
                    <td className="num"><MetricValue metric={r.efficiencyPct} format={fmtPct} /></td>
                    <td className="num"><MetricValue metric={r.variancePct} format={fmtPct} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          !reconLoading && (
            <div className="empty-state" style={{ padding: "22px 20px" }}>
              <p style={{ color: "var(--muted)", fontSize: 13.5, margin: 0 }}>
                Nothing to reconcile yet — import sales, production or wastage data to populate this table.
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
