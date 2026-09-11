---
source_file: "client/src/modules/dashboard/ActionCenterPage.tsx"
type: "code"
community: "Action Center UI"
location: "L11"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Action_Center_UI
---

# Section()

## Connections
- [[ActionCenterPage.tsx]] - `contains` [EXTRACTED]

## Source
**From** `client/src/modules/dashboard/ActionCenterPage.tsx` **(starting line 11):**
```tsx
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
```

#graphify/code #graphify/EXTRACTED #community/Action_Center_UI