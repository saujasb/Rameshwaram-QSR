import { useMemo } from "react";
import { DivergingBar } from "../../components/charts/DivergingBar";
import { StatusBadge } from "../../components/StatusBadge";
import { useAnalyticsSnapshot } from "../../lib/api/analytics";
import { computeVegIndent } from "./vegIndentCompute";

function toneFor(status: string) {
  if (status === "ON TARGET") return "ok" as const;
  if (status === "OVER-ORDERED" || status === "ORDERED, NO REQMT") return "over" as const;
  if (status === "UNDER-ORDERED") return "under" as const;
  return "neutral" as const;
}

export function VegIndentPage() {
  const { data: snap, isLoading, isError } = useAnalyticsSnapshot();
  const computed = useMemo(() => (snap ? snap.vegIndent.map(computeVegIndent) : []), [snap]);

  if (isError) {
    return (
      <div className="banner-not-connected">
        <b>Couldn't reach the analytics service.</b> No figures are shown rather than stale or guessed ones.
      </div>
    );
  }
  if (isLoading || !snap) return <p style={{ color: "var(--muted)" }}>Loading…</p>;

  const onTarget = computed.filter((v) => v.status === "ON TARGET").length;
  const over = computed.filter((v) => v.status === "OVER-ORDERED").length;
  const under = computed.filter((v) => v.status === "UNDER-ORDERED").length;
  const noReqmt = computed.filter((v) => v.status === "ORDERED, NO REQMT").length;
  const untracked = computed.length - onTarget - over - under - noReqmt;
  const chartable = computed.filter((v) => v.pct !== null).sort((a, b) => (b.pct ?? 0) - (a.pct ?? 0));

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Vegetable Indent — Requirement vs Order</h1>
          <p className="page-desc">
            Requirement stated <b>{snap.vegIndentRequirementDate}</b> vs the Kitchen Indent order recorded for{" "}
            <b>{snap.vegIndentOrderDate}</b> — a one-cycle procurement-accuracy snapshot, not a live stock level.
          </p>
        </div>
      </div>

      <div className="kpis" style={{ marginBottom: 18 }}>
        <div className="kpi good"><div className="lab">On target (±1%)</div><div className="val">{onTarget}</div><div className="note">of {computed.length} items</div></div>
        <div className="kpi crit"><div className="lab">Over-ordered</div><div className="val">{over}</div><div className="note">beyond +1% of requirement</div></div>
        <div className="kpi warn"><div className="lab">Under-ordered</div><div className="val">{under}</div><div className="note">beyond −1% of requirement</div></div>
        <div className="kpi ser"><div className="lab">Ordered, no requirement</div><div className="val">{noReqmt}</div><div className="note">check with kitchen</div></div>
        <div className="kpi good"><div className="lab">No data / not tracked</div><div className="val">{untracked}</div><div className="note">informational</div></div>
      </div>

      <div className="card">
        <h3>Order variance vs requirement (%)</h3>
        <DivergingBar
          data={chartable.map((v) => ({
            name: v.name,
            value: (v.pct ?? 0) * 100,
            positiveColor: v.status === "ON TARGET" ? "var(--good)" : "var(--critical)",
            negativeColor: v.status === "ON TARGET" ? "var(--good)" : "var(--critical)",
            tooltip: `${v.name}: req ${v.requirement} ${v.unit}, ordered ${v.orderQty} ${v.unit} (${v.status})`,
          }))}
          valueFormatter={(v) => `${v > 0 ? "+" : ""}${v.toFixed(0)}%`}
        />
      </div>

      <div className="card">
        <h3>Full comparison — all {computed.length} items</h3>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Item</th><th>Matched line</th><th>Unit</th><th className="num">Requirement</th>
                <th className="num">Order qty</th><th className="num">Diff</th><th className="num">Diff %</th><th>Status</th><th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {computed.map((v) => (
                <tr key={v.name}>
                  <td><b>{v.name}</b></td>
                  <td style={{ color: "var(--muted)", fontStyle: "italic", fontSize: 12 }}>{v.matchedLine ?? "— (no matching line)"}</td>
                  <td>{v.unit ?? "—"}</td>
                  <td className="num">{v.requirement ?? "—"}</td>
                  <td className="num">{v.orderQty ?? (v.kind === "none" ? "Not tracked" : v.kind === "dup" ? "See note" : "—")}</td>
                  <td className="num">{v.diff != null ? (v.diff > 0 ? "+" : "") + v.diff : "—"}</td>
                  <td className="num">{v.pct != null ? `${v.pct > 0 ? "+" : ""}${(v.pct * 100).toFixed(1)}%` : "—"}</td>
                  <td><StatusBadge label={v.status} tone={toneFor(v.status)} /></td>
                  <td style={{ fontSize: 12, color: "var(--ink-2)" }}>{v.note ?? ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
