---
source_file: "server/src/entities/sales/importPipeline.ts"
type: "code"
community: "Sales Import Parsing Pipeline"
location: "L12"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Sales_Import_Parsing_Pipeline
---

# ImportOptions

## Connections
- [[salesimportPipeline.ts]] - `contains` [EXTRACTED]

## Source
**From** `server/src/entities/sales/importPipeline.ts` **(starting line 12):**
```typescript
export interface ImportOptions {
  fileName: string;
  buffer: Buffer;
  // Required for formats (Kiosk) that print no date at all. Optional for
  // formats that do print one (Petpooja) -- if supplied it must agree with
  // the report's own date, otherwise we reject rather than silently
  // relabeling data to a date the report doesn't claim.
  businessDate?: string;
}
```

#graphify/code #graphify/EXTRACTED #community/Sales_Import_Parsing_Pipeline