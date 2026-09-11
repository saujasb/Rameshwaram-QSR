---
source_file: "client/src/lib/api/datasets.ts"
type: "code"
community: "Data Explorer & Import UI"
location: "L86"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Data_Explorer__Import_UI
---

# exportCsvUrl()

## Connections
- [[DataExplorerPage()]] - `calls` [EXTRACTED]
- [[DataExplorerPage.tsx]] - `imports` [EXTRACTED]
- [[apidatasets.ts]] - `contains` [EXTRACTED]
- [[filterToParams()_1]] - `calls` [EXTRACTED]

## Source
**From** `client/src/lib/api/datasets.ts` **(starting line 86):**
```typescript
export function exportCsvUrl(filter: DatasetFilter): string {
  return `${BASE}/datasets/export.csv${filterToParams(filter)}`;
}
```

#graphify/code #graphify/EXTRACTED #community/Data_Explorer__Import_UI