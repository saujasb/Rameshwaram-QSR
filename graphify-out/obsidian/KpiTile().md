---
source_file: "client/src/modules/dashboard/DashboardPage.tsx"
type: "code"
community: "Dashboard & Sales Trend Visualization"
location: "L28"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Dashboard__Sales_Trend_Visualization
---

# KpiTile()

## Connections
- [[DashboardPage.tsx]] - `contains` [EXTRACTED]

## Source
**From** `client/src/modules/dashboard/DashboardPage.tsx` **(starting line 28):**
```tsx
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
```

#graphify/code #graphify/EXTRACTED #community/Dashboard__Sales_Trend_Visualization