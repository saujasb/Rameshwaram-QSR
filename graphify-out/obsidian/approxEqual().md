---
source_file: "server/src/entities/sales/numbers.ts"
type: "code"
community: "Sales Import Parsing Pipeline"
location: "L13"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Sales_Import_Parsing_Pipeline
---

# approxEqual()

## Connections
- [[numbers.ts]] - `contains` [EXTRACTED]
- [[runSalesImport()]] - `calls` [EXTRACTED]
- [[salesimportPipeline.ts]] - `imports` [EXTRACTED]

## Source
**From** `server/src/entities/sales/numbers.ts` **(starting line 13):**
```typescript
export function approxEqual(a: number, b: number, epsilon = 0.05): boolean {
  return Math.abs(a - b) <= epsilon;
}
```

#graphify/code #graphify/EXTRACTED #community/Sales_Import_Parsing_Pipeline