---
source_file: "server/src/entities/sales/parseTypes.ts"
type: "code"
community: "Sales Import Parsing Pipeline"
location: "L31"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Sales_Import_Parsing_Pipeline
---

# sumItems()

## Connections
- [[adaptPdf()]] - `calls` [EXTRACTED]
- [[parseTypes.ts]] - `contains` [EXTRACTED]
- [[pdfAdapter.ts]] - `imports` [EXTRACTED]
- [[runSalesImport()]] - `calls` [EXTRACTED]
- [[salesimportPipeline.ts]] - `imports` [EXTRACTED]

## Source
**From** `server/src/entities/sales/parseTypes.ts` **(starting line 31):**
```typescript
export function sumItems(items: ParsedLineItem[]): { quantity: number; amount: number } {
  return items.reduce(
    (acc, i) => ({ quantity: acc.quantity + i.quantity, amount: acc.amount + i.amount }),
    { quantity: 0, amount: 0 }
  );
}
```

#graphify/code #graphify/EXTRACTED #community/Sales_Import_Parsing_Pipeline