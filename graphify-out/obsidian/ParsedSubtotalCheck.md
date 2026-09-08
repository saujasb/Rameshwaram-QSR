---
source_file: "server/src/entities/sales/parseTypes.ts"
type: "code"
community: "Sales Import Parsing Pipeline"
location: "L10"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Sales_Import_Parsing_Pipeline
---

# ParsedSubtotalCheck

## Connections
- [[parseTypes.ts]] - `contains` [EXTRACTED]
- [[parserspetpooja.ts]] - `imports` [EXTRACTED]

## Source
**From** `server/src/entities/sales/parseTypes.ts` **(starting line 10):**
```typescript
export interface ParsedSubtotalCheck {
  category: string;
  expectedQuantity: number;
  expectedAmount: number;
  actualQuantity: number;
  actualAmount: number;
}
```

#graphify/code #graphify/EXTRACTED #community/Sales_Import_Parsing_Pipeline