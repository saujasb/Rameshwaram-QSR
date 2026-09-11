---
source_file: "client/src/modules/import/ImportCenterPage.tsx"
type: "code"
community: "Data Explorer & Import UI"
location: "L44"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Data_Explorer__Import_UI
---

# statusTone()

## Connections
- [[ImportCenterPage.tsx]] - `contains` [EXTRACTED]
- [[ImportHistory()]] - `calls` [EXTRACTED]
- [[SuccessCard()]] - `calls` [EXTRACTED]

## Source
**From** `client/src/modules/import/ImportCenterPage.tsx` **(starting line 44):**
```tsx
function statusTone(status: ImportStatus): Tone {
  if (status === "passed") return "good";
  if (status === "failed") return "crit";
  return "warn";
}
```

#graphify/code #graphify/EXTRACTED #community/Data_Explorer__Import_UI