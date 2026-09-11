---
source_file: "server/src/entities/sales/importPipeline.ts"
type: "code"
community: "Sales Import Parsing Pipeline"
location: "L22"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Sales_Import_Parsing_Pipeline
---

# ImportOutcome

## Connections
- [[salesimportPipeline.ts]] - `contains` [EXTRACTED]

## Source
**From** `server/src/entities/sales/importPipeline.ts` **(starting line 22):**
```typescript
export type ImportOutcome = { ok: true; batch: SalesImportBatch } | { ok: false; error: string; detail?: string };
```

#graphify/code #graphify/EXTRACTED #community/Sales_Import_Parsing_Pipeline