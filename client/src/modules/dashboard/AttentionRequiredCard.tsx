import { Link } from "react-router-dom";
import { useActionCenter } from "../../lib/api/actionCenter";

export interface AttentionAlert {
  id: string;
  severity: "critical" | "attention" | "info";
  title: string;
  detail: string;
  linkPath: string;
}

const SEVERITY_META: Record<AttentionAlert["severity"], { label: string; color: string }> = {
  critical: { label: "Critical", color: "var(--critical)" },
  attention: { label: "Warning", color: "var(--warning)" },
  info: { label: "Info", color: "var(--brand)" },
};

const SEVERITY_RANK: Record<AttentionAlert["severity"], number> = { critical: 0, attention: 1, info: 2 };

/**
 * Dashboard-homepage digest of real operational issues -- sales-specific
 * alerts computed by the caller (target/validation/no-data) merged with the
 * live Action Center feed (tasks, inventory, complaints, maintenance,
 * purchases, wastage). Nothing here is invented; it links straight to the
 * full Action Center for everything else.
 */
export function AttentionRequiredCard({ salesAlerts, limit = 6 }: { salesAlerts: AttentionAlert[]; limit?: number }) {
  const { data: actionItems } = useActionCenter();

  const fromActionCenter: AttentionAlert[] = (actionItems ?? [])
    .filter((i) => i.severity !== "completed")
    .map((i) => ({
      id: i.id,
      severity: i.severity === "critical" ? "critical" : "attention",
      title: i.title,
      detail: i.detail,
      linkPath: i.linkPath,
    }));

  const all = [...salesAlerts, ...fromActionCenter];
  const shown = [...all].sort((a, b) => SEVERITY_RANK[a.severity] - SEVERITY_RANK[b.severity]).slice(0, limit);
  const criticalCount = all.filter((a) => a.severity === "critical").length;
  const attentionCount = all.filter((a) => a.severity === "attention").length;

  return (
    <div className="card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 8 }}>
        <h3>Attention Required</h3>
        <Link to="/action-center" className="btn small">Full Action Center →</Link>
      </div>
      <p className="h3sub">
        {criticalCount === 0 && attentionCount === 0
          ? "Nothing needs attention right now."
          : `${criticalCount} critical · ${attentionCount} worth a look`}
      </p>
      {shown.length === 0 ? (
        <div className="empty-state" style={{ padding: "20px" }}>
          <p style={{ color: "var(--muted)", fontSize: 13.5, margin: 0 }}>
            All clear — nothing flagged across sales, inventory, tasks, complaints or maintenance.
          </p>
        </div>
      ) : (
        shown.map((a) => {
          const meta = SEVERITY_META[a.severity];
          return (
            <Link key={a.id} to={a.linkPath} className="action" style={{ display: "flex", textDecoration: "none", color: "inherit" }}>
              <div className="rank" style={{ background: meta.color }}>!</div>
              <div className="body">
                <b>{a.title}</b>
                <p>{a.detail}</p>
              </div>
              <div className="impact" style={{ color: meta.color }}>{meta.label}</div>
            </Link>
          );
        })
      )}
    </div>
  );
}
