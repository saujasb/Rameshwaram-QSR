---
source_file: "server/src/entities/sales/repository.ts"
type: "code"
community: "Sales Import Parsing Pipeline"
location: "L41"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Sales_Import_Parsing_Pipeline
---

# fingerprintFor()

## Connections
- [[salesrepository.ts]] - `contains` [EXTRACTED]
- [[upsertLineItems()]] - `calls` [EXTRACTED]

## Source
**From** `server/src/entities/sales/repository.ts` **(starting line 41):**
```typescript
function fingerprintFor(channel: SalesChannel, businessDate: string, itemNameKey: string): string {
  return `${channel}::${businessDate}::${itemNameKey}`;
}
```

#graphify/code #graphify/EXTRACTED #community/Sales_Import_Parsing_Pipeline