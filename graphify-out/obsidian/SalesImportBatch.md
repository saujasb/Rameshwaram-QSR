---
source_file: "shared-types/sales.ts"
type: "code"
community: "Sales Import UI"
location: "L45"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Sales_Import_UI
---

# SalesImportBatch

## Connections
- [[BaseRecord]] - `inherits` [EXTRACTED]
- [[SalesImportPage.tsx]] - `imports` [EXTRACTED]
- [[apisales.ts]] - `imports` [EXTRACTED]
- [[salesimportPipeline.ts]] - `imports` [EXTRACTED]
- [[salesrepository.ts]] - `imports` [EXTRACTED]
- [[shared-typessales.ts]] - `contains` [EXTRACTED]

## Source
**From** `shared-types/sales.ts` **(starting line 45):**
```typescript
export interface SalesImportBatch extends BaseRecord {
  fileName: string;
  channel: SalesChannel;
  businessDate: string;
  recordsFound: number;
  recordsInserted: number;
  recordsUpdated: number;
  duplicatesSkipped: number;
  parsingErrors: string[];
  validation: SalesImportValidation;
  hasHourlyData: boolean;
}
```

#graphify/code #graphify/EXTRACTED #community/Sales_Import_UI