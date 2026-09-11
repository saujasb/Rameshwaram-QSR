---
source_file: "server/src/entities/sales/repository.ts"
type: "code"
community: "Sales Import Parsing Pipeline"
location: "L31"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Sales_Import_Parsing_Pipeline
---

# UpsertResult

## Connections
- [[salesrepository.ts]] - `contains` [EXTRACTED]

## Source
**From** `server/src/entities/sales/repository.ts` **(starting line 31):**
```typescript
export interface UpsertResult {
  inserted: number;
  updated: number;
  duplicates: number;
}
```

#graphify/code #graphify/EXTRACTED #community/Sales_Import_Parsing_Pipeline