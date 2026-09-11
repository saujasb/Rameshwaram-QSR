---
source_file: "client/src/modules/import/ImportCenterPage.tsx"
type: "code"
community: "Data Explorer & Import UI"
location: "L60"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Data_Explorer__Import_UI
---

# fmtBytes()

## Connections
- [[ImportCenterPage()]] - `calls` [EXTRACTED]
- [[ImportCenterPage.tsx]] - `contains` [EXTRACTED]
- [[SuccessCard()]] - `calls` [EXTRACTED]

## Source
**From** `client/src/modules/import/ImportCenterPage.tsx` **(starting line 60):**
```tsx
function fmtBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
```

#graphify/code #graphify/EXTRACTED #community/Data_Explorer__Import_UI