---
source_file: "server/src/entities/intelligence/insights.ts"
type: "code"
community: "Business Intelligence Engine"
location: "L63"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Business_Intelligence_Engine
---

# drill()

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
**From** `server/src/entities/intelligence/insights.ts` **(starting line 63):**
```typescript
function drill(
  filter: DatasetFilter,
  parts: { from: string; to: string; datasetType?: DatasetType; product?: string | null }
```

#graphify/code #graphify/EXTRACTED #community/Business_Intelligence_Engine