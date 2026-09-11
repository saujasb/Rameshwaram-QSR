---
source_file: "client/src/modules/intelligence/TopInsightsPanel.tsx"
type: "code"
community: "Business Intelligence Engine"
location: "L32"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Business_Intelligence_Engine
---

# Field()

## Connections
- [[TopInsightsPanel.tsx]] - `contains` [EXTRACTED]

## Source
**From** `client/src/modules/intelligence/TopInsightsPanel.tsx` **(starting line 32):**
```tsx
function Field({ label, value, variant }: { label: string; value: string; variant?: "action" | "impact" }) {
  return (
    <div className={`insight-field${variant ? ` is-${variant}` : ""}`}>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}
```

#graphify/code #graphify/EXTRACTED #community/Business_Intelligence_Engine