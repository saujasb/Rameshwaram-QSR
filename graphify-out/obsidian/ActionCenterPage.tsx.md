---
source_file: "client/src/modules/dashboard/ActionCenterPage.tsx"
type: "code"
community: "Action Center UI"
location: "L1"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Action_Center_UI
---

# ActionCenterPage.tsx

## Connections
- [[ActionCenterItem]] - `imports` [EXTRACTED]
- [[ActionCenterPage()]] - `contains` [EXTRACTED]
- [[SEVERITY_META]] - `contains` [EXTRACTED]
- [[Section()]] - `contains` [EXTRACTED]
- [[apiactionCenter.ts]] - `imports_from` [EXTRACTED]
- [[entities.ts]] - `imports_from` [EXTRACTED]
- [[routes.tsx]] - `imports_from` [EXTRACTED]
- [[useActionCenter()]] - `imports` [EXTRACTED]

## Source
**Full file:** `client/src/modules/dashboard/ActionCenterPage.tsx`
```tsx
import { Link } from "react-router-dom";
import { useActionCenter } from "../../lib/api/actionCenter";
import type { ActionCenterItem } from "@shared/entities";

const SEVERITY_META: Record<ActionCenterItem["severity"], { label: string; color: string }> = {
  critical: { label: "Critical", color: "var(--critical)" },
  attention: { label: "Attention", color: "var(--warning)" },
  completed: { label: "Completed", color: "var(--good)" },
};

function Section({ severity, items }: { severity: ActionCenterItem["severity"]; items: ActionCenterItem[] }) {
  const meta = SEVERITY_META[severity];
  return (
    <div className="card">
      <h3><span className="status-dot" style={{ background: meta.color }} />{meta.label} ({items.length})</h3>
      {items.length === 0 ? (
        <p style={{ color: "var(--muted)", fontSize: 13 }}>Nothing here right now.</p>
      ) : (
        items.map((item) => (
          <Link key={item.id} to={item.linkPath} className="action" style={{ display: "flex", textDecoration: "none", color: "inherit" }}>
            <div className="rank" style={{ background: meta.color }}>{item.module.slice(0, 1).toUpperCase()}</div>
            <div className="body">
              <b>{item.title}</b>
              <p>{item.detail}</p>
            </div>
            <div className="impact">{new Date(item.timestamp).toLocaleDateString()}</div>
          </Link>
        ))
      )}
    </div>
  );
}

export function ActionCenterPage() {
  const { data, isLoading } = useActionCenter();

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Action Center</h1>
          <p className="page-desc">
            Computed live from real records across every module — overdue tasks, critical/low stock, escalated
            complaints, open high-priority maintenance, overdue purchases, and high wastage entries. Click any item to
            open it.
          </p>
        </div>
      </div>
      {isLoading || !data ? (
        <p style={{ color: "var(--muted)" }}>Loading…</p>
      ) : (
        <>
          <Section severity="critical" items={data.filter((i) => i.severity === "critical")} />
          <Section severity="attention" items={data.filter((i) => i.severity === "attention")} />
          <Section severity="completed" items={data.filter((i) => i.severity === "completed")} />
        </>
      )}
    </div>
  );
}
```

#graphify/code #graphify/EXTRACTED #community/Action_Center_UI