---
source_file: "client/src/lib/api/sales.ts"
type: "code"
community: "Sales Import UI"
location: "L7"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Sales_Import_UI
---

# summaryKey()

## Connections
- [[apisales.ts]] - `contains` [EXTRACTED]
- [[useSalesSummary()]] - `calls` [EXTRACTED]

## Source
**From** `client/src/lib/api/sales.ts` **(starting line 7):**
```typescript
function summaryKey(from?: string, to?: string) {
  return ["sales-summary", from ?? null, to ?? null] as const;
}
```

#graphify/code #graphify/EXTRACTED #community/Sales_Import_UI