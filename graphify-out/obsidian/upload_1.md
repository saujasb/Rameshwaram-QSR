---
source_file: "server/src/entities/sales/routes.ts"
type: "code"
community: "Sales Import Parsing Pipeline"
location: "L14"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Sales_Import_Parsing_Pipeline
---

# upload

## Connections
- [[salesroutes.ts]] - `contains` [EXTRACTED]

## Source
**From** `server/src/entities/sales/routes.ts` **(starting line 14):**
```typescript
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 20 * 1024 * 1024 } });
```

#graphify/code #graphify/EXTRACTED #community/Sales_Import_Parsing_Pipeline