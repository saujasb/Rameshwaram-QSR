---
source_file: "client/src/modules/import/ImportCenterPage.tsx"
type: "code"
community: "Data Explorer & Import UI"
location: "L74"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Data_Explorer__Import_UI
---

# dateRange()

## Connections
- [[FailureCard()]] - `calls` [EXTRACTED]
- [[ImportCenterPage.tsx]] - `contains` [EXTRACTED]
- [[ImportHistory()]] - `calls` [EXTRACTED]
- [[SheetsBlock()]] - `calls` [EXTRACTED]
- [[SuccessCard()]] - `calls` [EXTRACTED]
- [[formatBusinessDateLong()]] - `calls` [EXTRACTED]

## Source
**From** `client/src/modules/import/ImportCenterPage.tsx` **(starting line 74):**
```tsx
function dateRange(from: string | null, to: string | null): string {
  if (!from && !to) return "No dates";
  if (from && to && from !== to) return `${formatBusinessDateLong(from)} → ${formatBusinessDateLong(to)}`;
  const single = from ?? to;
  return single ? formatBusinessDateLong(single) : "No dates";
}
```

#graphify/code #graphify/EXTRACTED #community/Data_Explorer__Import_UI