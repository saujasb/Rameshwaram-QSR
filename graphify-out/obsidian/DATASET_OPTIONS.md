---
source_file: "client/src/modules/explorer/DataExplorerPage.tsx"
type: "code"
community: "Data Explorer & Import UI"
location: "L10"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Data_Explorer__Import_UI
---

# DATASET_OPTIONS

## Connections
- [[DataExplorerPage.tsx]] - `contains` [EXTRACTED]

## Source
**From** `client/src/modules/explorer/DataExplorerPage.tsx` **(starting line 10):**
```tsx
const DATASET_OPTIONS: DatasetType[] = ["sales", "production", "wastage"];

function sourceLabel(r: DatasetRecord): string {
  const parts: string[] = [];
  if (r.sourceSheet) parts.push(`Sheet: ${r.sourceSheet}`);
  if (r.sourcePage != null) parts.push(`Page: ${r.sourcePage}`);
  if (r.sourceRow != null) parts.push(`Row: ${r.sourceRow}`);
  return parts.join(" · ");
}
```

#graphify/code #graphify/EXTRACTED #community/Data_Explorer__Import_UI