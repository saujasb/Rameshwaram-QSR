---
source_file: "client/src/modules/sales-analytics/SalesImportPage.tsx"
type: "code"
community: "Sales Import UI"
location: "L23"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Sales_Import_UI
---

# validationTone()

## Connections
- [[ImportResultCard()]] - `calls` [EXTRACTED]
- [[SalesImportPage()]] - `calls` [EXTRACTED]
- [[SalesImportPage.tsx]] - `contains` [EXTRACTED]

## Source
**From** `client/src/modules/sales-analytics/SalesImportPage.tsx` **(starting line 23):**
```tsx
function validationTone(status: ImportValidationStatus): "good" | "warn" | "crit" {
  if (status === "passed") return "good";
  if (status === "failed") return "crit";
  return "warn";
}
```

#graphify/code #graphify/EXTRACTED #community/Sales_Import_UI