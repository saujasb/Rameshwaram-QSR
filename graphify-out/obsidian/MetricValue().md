---
source_file: "client/src/modules/intelligence/TodaysIntelligencePanel.tsx"
type: "code"
community: "Business Intelligence Engine"
location: "L44"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Business_Intelligence_Engine
---

# MetricValue()

## Connections
- [[IntelligencePage.tsx]] - `imports` [EXTRACTED]
- [[TodaysIntelligencePanel.tsx]] - `contains` [EXTRACTED]
- [[isUnavailable()]] - `calls` [EXTRACTED]

## Source
**From** `client/src/modules/intelligence/TodaysIntelligencePanel.tsx` **(starting line 44):**
```tsx
export function MetricValue({
  metric,
  format = fmtQty,
  fallback = "Insufficient data",
}: {
  metric: Metric | null | undefined;
  format?: (value: number) => string;
  fallback?: string;
}) {
  if (isUnavailable(metric)) {
    return (
      <span className="metric-val metric-unavailable" title={metric?.note || "Not enough imported data to compute this."}>
        {fallback}
      </span>
    );
  }
  return (
    <span className="metric-val" title={metric!.note}>
      {format(metric!.value as number)}
    </span>
  );
}
```

#graphify/code #graphify/EXTRACTED #community/Business_Intelligence_Engine