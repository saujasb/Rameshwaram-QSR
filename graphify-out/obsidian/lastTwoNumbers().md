---
source_file: "server/src/entities/sales/parsers/petpooja.ts"
type: "code"
community: "Sales Import Parsing Pipeline"
location: "L39"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Sales_Import_Parsing_Pipeline
---

# lastTwoNumbers()

## Connections
- [[parseNumber()]] - `calls` [EXTRACTED]
- [[parsePetpooja()]] - `calls` [EXTRACTED]
- [[parserspetpooja.ts]] - `contains` [EXTRACTED]

## Source
**From** `server/src/entities/sales/parsers/petpooja.ts` **(starting line 39):**
```typescript
function lastTwoNumbers(row: string[]): { quantity: number; amount: number } | null {
  if (row.length < 2) return null;
  const amount = parseNumber(row[row.length - 1]);
  const quantity = parseNumber(row[row.length - 2]);
  if (amount == null || quantity == null) return null;
  return { quantity, amount };
}
```

#graphify/code #graphify/EXTRACTED #community/Sales_Import_Parsing_Pipeline