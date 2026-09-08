---
source_file: "server/src/entities/intelligence/insights.ts"
type: "code"
community: "Business Intelligence Engine"
location: "L183"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Business_Intelligence_Engine
---

# movementInsight()

## Connections
- [[buildInsights()]] - `calls` [EXTRACTED]
- [[businessDateRange()]] - `calls` [EXTRACTED]
- [[compact()]] - `calls` [EXTRACTED]
- [[drill()]] - `calls` [EXTRACTED]
- [[evidenceFor()]] - `calls` [EXTRACTED]
- [[formatBusinessDateLong()]] - `calls` [EXTRACTED]
- [[insights.ts]] - `contains` [EXTRACTED]
- [[money()]] - `calls` [EXTRACTED]
- [[pctText()]] - `calls` [EXTRACTED]
- [[qtyText()]] - `calls` [EXTRACTED]

## Source
**From** `server/src/entities/intelligence/insights.ts` **(starting line 183):**
```typescript
function movementInsight(
  filter: DatasetFilter,
  daily: { businessDate: string; quantity: number; value: number }[],
```

#graphify/code #graphify/EXTRACTED #community/Business_Intelligence_Engine