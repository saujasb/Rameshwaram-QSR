---
source_file: "client/src/lib/api/datasets.ts"
type: "code"
community: "Data Explorer & Import UI"
location: "L24"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Data_Explorer__Import_UI
---

# filterToParams()

## Connections
- [[apidatasets.ts]] - `contains` [EXTRACTED]
- [[apiintelligence.ts]] - `imports` [EXTRACTED]
- [[exportCsvUrl()]] - `calls` [EXTRACTED]
- [[useAnomalies()]] - `calls` [EXTRACTED]
- [[useDatasetRecords()]] - `calls` [EXTRACTED]
- [[useDatasetSummary()]] - `calls` [EXTRACTED]
- [[useProductPerformance()]] - `calls` [EXTRACTED]
- [[useReconciliation()]] - `calls` [EXTRACTED]
- [[useTopInsights()]] - `calls` [EXTRACTED]

## Source
**From** `client/src/lib/api/datasets.ts` **(starting line 24):**
```typescript
export function filterToParams(filter: DatasetFilter): string {
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(filter)) {
    if (v !== undefined && v !== null && v !== "") p.set(k, String(v));
  }
  const qs = p.toString();
  return qs ? `?${qs}` : "";
}
```

#graphify/code #graphify/EXTRACTED #community/Data_Explorer__Import_UI