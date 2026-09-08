---
source_file: "server/src/entities/intelligence/insights.ts"
type: "code"
community: "Business Intelligence Engine"
location: "L39"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Business_Intelligence_Engine
---

# compact()

## Connections
- [[concentrationInsight()]] - `calls` [EXTRACTED]
- [[importQualityInsight()]] - `calls` [EXTRACTED]
- [[insights.ts]] - `contains` [EXTRACTED]
- [[missingDatesInsight()]] - `calls` [EXTRACTED]
- [[movementInsight()]] - `calls` [EXTRACTED]
- [[peakHourInsight()]] - `calls` [EXTRACTED]
- [[salesInsights()]] - `calls` [EXTRACTED]
- [[wastageInsights()]] - `calls` [EXTRACTED]

## Source
**From** `server/src/entities/intelligence/insights.ts` **(starting line 39):**
```typescript
function compact(items: (AnomalyEvidence | null)[]): AnomalyEvidence[] {
  return items.filter((e): e is AnomalyEvidence => e !== null);
}
```

#graphify/code #graphify/EXTRACTED #community/Business_Intelligence_Engine