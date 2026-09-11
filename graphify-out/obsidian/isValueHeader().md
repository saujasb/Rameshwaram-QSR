---
source_file: "server/src/entities/sales/parsers/petpooja.ts"
type: "code"
community: "Sales Import Parsing Pipeline"
location: "L35"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Sales_Import_Parsing_Pipeline
---

# isValueHeader()

## Connections
- [[parsePetpooja()]] - `indirect_call` [INFERRED]
- [[parserspetpooja.ts]] - `contains` [EXTRACTED]

## Source
**From** `server/src/entities/sales/parsers/petpooja.ts` **(starting line 35):**
```typescript
function isValueHeader(row: string[]): boolean {
  return row[0] === "Code" && row.includes("Sap Code") && row.some((c) => c.startsWith("Qty"));
}
```

#graphify/code #graphify/EXTRACTED #community/Sales_Import_Parsing_Pipeline