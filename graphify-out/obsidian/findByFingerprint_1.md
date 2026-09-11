---
source_file: "server/src/entities/sales/repository.ts"
type: "code"
community: "Sales Import Parsing Pipeline"
location: "L45"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Sales_Import_Parsing_Pipeline
---

# findByFingerprint

## Connections
- [[salesrepository.ts]] - `contains` [EXTRACTED]

## Source
**From** `server/src/entities/sales/repository.ts` **(starting line 45):**
```typescript
const findByFingerprint = db.prepare(
  `SELECT id, quantity, amount FROM sales_line_items WHERE fingerprint = ?`
);
```

#graphify/code #graphify/EXTRACTED #community/Sales_Import_Parsing_Pipeline