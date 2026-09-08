---
source_file: "client/src/modules/import/ImportCenterPage.tsx"
type: "code"
community: "Data Explorer & Import UI"
location: "L70"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Data_Explorer__Import_UI
---

# fileKindLabel()

## Connections
- [[ImportCenterPage()]] - `calls` [EXTRACTED]
- [[ImportCenterPage.tsx]] - `contains` [EXTRACTED]

## Source
**From** `client/src/modules/import/ImportCenterPage.tsx` **(starting line 70):**
```tsx
function fileKindLabel(name: string): string {
  return /\.(xlsx|xls|xlsm)$/i.test(name) ? "Excel workbook" : "PDF report";
}
```

#graphify/code #graphify/EXTRACTED #community/Data_Explorer__Import_UI