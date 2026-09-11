---
source_file: "server/src/entities/intelligence/insights.ts"
type: "code"
community: "Business Intelligence Engine"
location: "L35"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Business_Intelligence_Engine
---

# share()

## Connections
- [[insights.ts]] - `contains` [EXTRACTED]
- [[peakHourInsight()]] - `calls` [EXTRACTED]
- [[salesInsights()]] - `calls` [EXTRACTED]
- [[wastageInsights()]] - `calls` [EXTRACTED]

## Source
**From** `server/src/entities/intelligence/insights.ts` **(starting line 35):**
```typescript
function share(part: number, whole: number): number | null {
  return whole > 0 ? (part / whole) * 100 : null;
}
```

#graphify/code #graphify/EXTRACTED #community/Business_Intelligence_Engine