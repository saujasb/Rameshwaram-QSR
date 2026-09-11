---
source_file: "server/src/entities/intelligence/insights.ts"
type: "code"
community: "Business Intelligence Engine"
location: "L44"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Business_Intelligence_Engine
---

# evidenceFor()

## Connections
- [[concentrationInsight()]] - `calls` [EXTRACTED]
- [[importQualityInsight()]] - `calls` [EXTRACTED]
- [[insights.ts]] - `contains` [EXTRACTED]
- [[missingDatesInsight()]] - `calls` [EXTRACTED]
- [[movementInsight()]] - `calls` [EXTRACTED]
- [[peakHourInsight()]] - `calls` [EXTRACTED]
- [[round2()_1]] - `calls` [EXTRACTED]
- [[salesInsights()]] - `calls` [EXTRACTED]
- [[totalsFor()]] - `calls` [EXTRACTED]
- [[wastageInsights()]] - `calls` [EXTRACTED]

## Source
**From** `server/src/entities/intelligence/insights.ts` **(starting line 44):**
```typescript
function evidenceFor(
  filter: DatasetFilter,
  datasetType: DatasetType,
  from: string,
  to: string,
  product: string | null,
  description: string
): AnomalyEvidence | null {
  const t = totalsFor({ ...filter, datasetType, from, to, product: product ?? filter.product });
```

#graphify/code #graphify/EXTRACTED #community/Business_Intelligence_Engine