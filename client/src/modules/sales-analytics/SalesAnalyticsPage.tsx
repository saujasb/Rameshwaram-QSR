import { Link } from "react-router-dom";
import { DivergingBar } from "../../components/charts/DivergingBar";
import { HBarChart } from "../../components/charts/HBarChart";
import { Donut } from "../../components/charts/Donut";
import { useAnalyticsSnapshot, usePrioritizedActions } from "../../lib/api/analytics";

const SEVERITY_COLOR: Record<string, string> = {
  critical: "var(--critical)",
  serious: "var(--serious)",
  warning: "var(--warning)",
  info: "var(--brand)",
};

export function SalesAnalyticsPage() {
  const { data: snap, isLoading } = useAnalyticsSnapshot();
  const { data: actions } = usePrioritizedActions();

  if (isLoading || !snap) return <p style={{ color: "var(--muted)" }}>Loading…</p>;

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Sales & Revenue</h1>
          <p className="page-desc">
            Read-only analytics from the last reported trading day — <b>{snap.reportDate}</b>. There is no live POS feed
            yet, so there is no "today", "vs yesterday" or "target achievement" figure to show; those tiles are on the
            Dashboard as "not connected" rather than invented.
          </p>
        </div>
      </div>

      <div className="kpis" style={{ marginBottom: 18 }}>
        <div className="kpi good"><div className="lab">Items Sold</div><div className="val">{snap.itemsSold.toLocaleString()}</div><div className="note">across 3 channels</div></div>
        <div className="kpi good"><div className="lab">Production</div><div className="val">{snap.productionKg} kg</div><div className="note">2 shifts combined</div></div>
        <div className="kpi ser"><div className="lab">Wastage</div><div className="val">{snap.wastagePct}%</div><div className="note">{snap.wastageKg} kg · target &lt;2% · <Link to="/wastage">see tracker</Link></div></div>
        <div className="kpi crit"><div className="lab">Variance breaches</div><div className="val">{snap.varianceBreaches} items</div><div className="note">outside ±10% band</div></div>
        <div className="kpi warn"><div className="lab">Recipe vs actual</div><div className="val">₹{snap.recipeVsActualRupees.toLocaleString()}</div><div className="note">net consumption gap</div></div>
      </div>

      <div className="grid2">
        <div className="card" style={{ marginBottom: 0 }}>
          <h3>Sales by channel</h3>
          <p className="h3sub">{snap.reportDate}</p>
          <div className="legend">
            <span><span className="sw" style={{ background: "var(--s1)" }} />Kiosk</span>
            <span><span className="sw" style={{ background: "var(--s2)" }} />PetPooja (Counter/POS)</span>
            <span><span className="sw" style={{ background: "var(--s3)" }} />Online</span>
          </div>
          <Donut
            data={[
              { name: "PetPooja (Counter/POS)", value: snap.channelMix[0].value, color: "var(--s2)" },
              { name: "Kiosk", value: snap.channelMix[1].value, color: "var(--s1)" },
              { name: "Online", value: snap.channelMix[2].value, color: "var(--s3)" },
            ]}
            centerLabel={snap.itemsSold.toLocaleString()}
            centerSub="items sold"
          />
        </div>
        <div className="card" style={{ marginBottom: 0 }}>
          <h3>Top 10 sellers</h3>
          <p className="h3sub">{snap.reportDate}</p>
          <HBarChart data={snap.topSellers.map((t) => ({ name: t.name, value: t.unitsSold }))} defaultColor="var(--brand)" />
        </div>
      </div>

      <div className="card" style={{ marginTop: 18 }}>
        <h3>Production vs sales variance</h3>
        <p className="h3sub">Kilograms. Right of zero = over-produced; left = under-produced vs sales. {snap.reportDate}.</p>
        <div className="legend">
          <span><span className="sw" style={{ background: "var(--s2)" }} />Over-produced</span>
          <span><span className="sw" style={{ background: "var(--s1)" }} />Under-produced</span>
        </div>
        <DivergingBar
          data={snap.variance.map((v) => ({
            name: v.name,
            value: v.netDiffKg,
            tooltip: `${v.name}: produced ${v.producedKg}kg, consumed ${v.consumedKg}kg, sold ${v.soldPlates} plates — ${v.variancePct > 0 ? "+" : ""}${v.variancePct}%`,
          }))}
          valueFormatter={(v) => `${v > 0 ? "+" : ""}${v.toFixed(1)}kg`}
        />
      </div>

      <div className="card">
        <h3>Cost reconciliation — recipe vs actual (₹)</h3>
        <p className="h3sub">Left of zero = under-consumed vs recipe. Right of zero = over-consumed vs sales. {snap.reportDate}.</p>
        <div className="legend">
          <span><span className="sw" style={{ background: "var(--s1)" }} />Under-consumed</span>
          <span><span className="sw" style={{ background: "var(--s2)" }} />Over-consumed</span>
        </div>
        <DivergingBar
          data={snap.costVariance.map((c) => ({ name: c.name, value: c.varianceRupees }))}
          valueFormatter={(v) => `₹${v > 0 ? "+" : ""}${v.toLocaleString()}`}
        />
      </div>

      {actions && actions.length > 0 && (
        <div className="card">
          <h3>Prioritised actions from the {snap.reportDate} report</h3>
          {actions.map((a, i) => (
            <div className="action" key={a.id}>
              <div className="rank" style={{ background: SEVERITY_COLOR[a.severity] }}>{i + 1}</div>
              <div className="body"><b>{a.title}</b><p>{a.detail}</p></div>
              <div className="impact">{a.impact}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
