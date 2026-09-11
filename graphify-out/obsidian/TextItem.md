---
source_file: "server/src/entities/sales/pdfExtract.ts"
type: "code"
community: "Sales Import Parsing Pipeline"
location: "L20"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Sales_Import_Parsing_Pipeline
---

# TextItem

## Connections
- [[pdfExtract.ts]] - `contains` [EXTRACTED]

## Source
**From** `server/src/entities/sales/pdfExtract.ts` **(starting line 20):**
```typescript
interface TextItem {
  str: string;
  transform: number[];
}
```

#graphify/code #graphify/EXTRACTED #community/Sales_Import_Parsing_Pipeline