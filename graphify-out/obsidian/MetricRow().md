---
source_file: "client/src/modules/intelligence/TodaysIntelligencePanel.tsx"
type: "code"
community: "Business Intelligence Engine"
location: "L67"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Business_Intelligence_Engine
---

# MetricRow()

## Connections
- [[TodaysIntelligencePanel.tsx]] - `contains` [EXTRACTED]
- [[isUnavailable()]] - `calls` [EXTRACTED]

## Source
**From** `client/src/modules/intelligence/TodaysIntelligencePanel.tsx` **(starting line 67):**
```tsx
function MetricRow({
  label,
  metric,
  format,
  sub,
}: {
  label: string;
  metric: Metric;
  format?: (value: number) => string;
  sub?: string;
}) {
  return (
    <div className="glance-row">
      <span>{label}</span>
      <b>
        <MetricValue metric={metric} format={format} />
      </b>
      <span className="muted-text">
        {sub && !isUnavailable(metric) ? <span className="metric-sub">{sub} </span> : null}
        <BasisTag basis={metric.basis} note={metric.note} />
      </span>
    </div>
  );
}
```

#graphify/code #graphify/EXTRACTED #community/Business_Intelligence_Engine