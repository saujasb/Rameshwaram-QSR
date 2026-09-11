---
source_file: "client/src/modules/intelligence/TodaysIntelligencePanel.tsx"
type: "code"
community: "Business Intelligence Engine"
location: "L35"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Business_Intelligence_Engine
---

# BasisTag()

## Connections
- [[TodaysIntelligencePanel.tsx]] - `contains` [EXTRACTED]

## Source
**From** `client/src/modules/intelligence/TodaysIntelligencePanel.tsx` **(starting line 35):**
```tsx
export function BasisTag({ basis, note }: { basis: MetricBasis; note: string }) {
  return (
    <span className={`basis-tag ${basis}`} title={note || BASIS_LABEL[basis]}>
      {BASIS_LABEL[basis]}
    </span>
  );
}
```

#graphify/code #graphify/EXTRACTED #community/Business_Intelligence_Engine