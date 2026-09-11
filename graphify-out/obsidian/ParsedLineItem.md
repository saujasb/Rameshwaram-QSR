---
source_file: "server/src/entities/sales/parseTypes.ts"
type: "code"
community: "Sales Import Parsing Pipeline"
location: "L3"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Sales_Import_Parsing_Pipeline
---

# ParsedLineItem

## Connections
- [[parseTypes.ts]] - `contains` [EXTRACTED]
- [[parserspetpooja.ts]] - `imports` [EXTRACTED]

## Source
**From** `server/src/entities/sales/parseTypes.ts` **(starting line 3):**
```typescript
export interface ParsedLineItem {
  category: string;
  itemName: string;
  quantity: number;
  amount: number;
}
```

#graphify/code #graphify/EXTRACTED #community/Sales_Import_Parsing_Pipeline