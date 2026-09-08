---
source_file: "client/src/modules/import/ImportCenterPage.tsx"
type: "code"
community: "Data Explorer & Import UI"
location: "L66"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Data_Explorer__Import_UI
---

# fileIcon()

## Connections
- [[ImportCenterPage()]] - `calls` [EXTRACTED]
- [[ImportCenterPage.tsx]] - `contains` [EXTRACTED]

## Source
**From** `client/src/modules/import/ImportCenterPage.tsx` **(starting line 66):**
```tsx
function fileIcon(name: string): string {
  return /\.(xlsx|xls|xlsm)$/i.test(name) ? "▦" : "▤";
}
```

#graphify/code #graphify/EXTRACTED #community/Data_Explorer__Import_UI