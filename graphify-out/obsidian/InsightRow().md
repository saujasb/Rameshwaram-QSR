---
source_file: "client/src/modules/intelligence/TopInsightsPanel.tsx"
type: "code"
community: "Business Intelligence Engine"
location: "L41"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Business_Intelligence_Engine
---

# InsightRow()

## Connections
- [[TopInsightsPanel.tsx]] - `contains` [EXTRACTED]
- [[drilldownPath()]] - `calls` [EXTRACTED]

## Source
**From** `client/src/modules/intelligence/TopInsightsPanel.tsx` **(starting line 41):**
```tsx
function InsightRow({ insight }: { insight: Insight }) {
  const navigate = useNavigate();
  const tone = SEVERITY_TONE[insight.severity];
  const recordCount = insight.evidence.reduce((sum, e) => sum + e.recordCount, 0);

  return (
    <button
      type="button"
      className="insight"
      onClick={() => navigate(drilldownPath(insight.drilldownQuery))}
      title="Open the records this insight was computed from"
    >
      <span className={`status-dot ${tone} insight-dot`} aria-hidden="true" />
      <span className="insight-body">
        <span className="insight-what">{insight.what}</span>
        <dl className="insight-fields">
          <Field label="How much" value={insight.howMuch} />
          <Field label="When" value={insight.when} />
          <Field label="Where" value={insight.where} />
          <Field label="Product" value={insight.product ?? "All products"} />
          <Field label="Impact" value={insight.impact} variant="impact" />
          <Field label="Action" value={insight.action} variant="action" />
        </dl>
      </span>
      <span className="insight-go">
        {SEVERITY_LABEL[insight.severity]}
        {recordCount > 0 ? ` · ${recordCount.toLocaleString("en-IN")} records` : ""} →
      </span>
    </button>
  );
}
```

#graphify/code #graphify/EXTRACTED #community/Business_Intelligence_Engine