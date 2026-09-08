---
source_file: "server/src/entities/sales/numbers.ts"
type: "code"
community: "Sales Import Parsing Pipeline"
location: "L9"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Sales_Import_Parsing_Pipeline
---

# round2()

## Connections
- [[numbers.ts]] - `contains` [EXTRACTED]
- [[parsePetpooja()]] - `calls` [EXTRACTED]
- [[parserspetpooja.ts]] - `imports` [EXTRACTED]

## Source
**From** `server/src/entities/sales/numbers.ts` **(starting line 9):**
```typescript
export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
```

#graphify/code #graphify/EXTRACTED #community/Sales_Import_Parsing_Pipeline