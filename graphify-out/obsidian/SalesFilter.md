---
source_file: "server/src/entities/sales/repository.ts"
type: "code"
community: "Sales Import Parsing Pipeline"
location: "L213"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Sales_Import_Parsing_Pipeline
---

# SalesFilter

## Connections
- [[salesrepository.ts]] - `contains` [EXTRACTED]

## Source
**From** `server/src/entities/sales/repository.ts` **(starting line 213):**
```typescript
export interface SalesFilter {
  from?: string;
  to?: string;
}
```

#graphify/code #graphify/EXTRACTED #community/Sales_Import_Parsing_Pipeline