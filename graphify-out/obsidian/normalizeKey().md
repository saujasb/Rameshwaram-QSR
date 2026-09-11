---
source_file: "server/src/entities/sales/repository.ts"
type: "code"
community: "Sales Import Parsing Pipeline"
location: "L37"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Sales_Import_Parsing_Pipeline
---

# normalizeKey()

## Connections
- [[salesrepository.ts]] - `contains` [EXTRACTED]
- [[upsertLineItems()]] - `calls` [EXTRACTED]

## Source
**From** `server/src/entities/sales/repository.ts` **(starting line 37):**
```typescript
function normalizeKey(itemName: string): string {
  return itemName.trim().toLowerCase().replace(/\s+/g, " ");
}
```

#graphify/code #graphify/EXTRACTED #community/Sales_Import_Parsing_Pipeline