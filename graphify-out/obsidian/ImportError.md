---
source_file: "client/src/lib/api/sales.ts"
type: "code"
community: "Sales Import UI"
location: "L38"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Sales_Import_UI
---

# ImportError

## Connections
- [[SalesImportPage.tsx]] - `imports` [EXTRACTED]
- [[apisales.ts]] - `contains` [EXTRACTED]

## Source
**From** `client/src/lib/api/sales.ts` **(starting line 38):**
```typescript
export interface ImportError extends Error {
  detail?: string;
}
```

#graphify/code #graphify/EXTRACTED #community/Sales_Import_UI