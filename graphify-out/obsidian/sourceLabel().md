---
source_file: "client/src/modules/explorer/DataExplorerPage.tsx"
type: "code"
community: "Data Explorer & Import UI"
location: "L12"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Data_Explorer__Import_UI
---

# sourceLabel()

## Connections
- [[DataExplorerPage()]] - `calls` [EXTRACTED]
- [[DataExplorerPage.tsx]] - `contains` [EXTRACTED]

## Source
**From** `client/src/modules/explorer/DataExplorerPage.tsx` **(starting line 12):**
```tsx
function sourceLabel(r: DatasetRecord): string {
  const parts: string[] = [];
  if (r.sourceSheet) parts.push(`Sheet: ${r.sourceSheet}`);
  if (r.sourcePage != null) parts.push(`Page: ${r.sourcePage}`);
  if (r.sourceRow != null) parts.push(`Row: ${r.sourceRow}`);
  return parts.join(" · ");
}
```

#graphify/code #graphify/EXTRACTED #community/Data_Explorer__Import_UI