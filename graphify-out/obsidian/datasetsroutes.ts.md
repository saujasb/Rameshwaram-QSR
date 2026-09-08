---
source_file: "server/src/entities/datasets/routes.ts"
type: "code"
community: "Ramesh AI Query Engine"
location: "L1"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Ramesh_AI_Query_Engine
---

# datasets/routes.ts

## Connections
- [[DatasetFilter]] - `imports` [EXTRACTED]
- [[DatasetType]] - `imports` [EXTRACTED]
- [[categoryTotals()]] - `imports` [EXTRACTED]
- [[channelTotals()]] - `imports` [EXTRACTED]
- [[csvCell()]] - `contains` [EXTRACTED]
- [[dailyTotals()]] - `imports` [EXTRACTED]
- [[datasetCoverage()]] - `imports` [EXTRACTED]
- [[datasetsdb.ts]] - `imports_from` [EXTRACTED]
- [[datasetsimportPipeline.ts]] - `imports_from` [EXTRACTED]
- [[datasetsrepository.ts]] - `imports_from` [EXTRACTED]
- [[datasetsRouter]] - `contains` [EXTRACTED]
- [[deleteImportBatch()]] - `imports` [EXTRACTED]
- [[distinctValues()]] - `imports` [EXTRACTED]
- [[exportRecords()]] - `imports` [EXTRACTED]
- [[getBusinessDayStartHour()]] - `imports` [EXTRACTED]
- [[getImportBatch()]] - `imports` [EXTRACTED]
- [[hourlyBuckets()]] - `imports` [EXTRACTED]
- [[index.ts]] - `imports_from` [EXTRACTED]
- [[listImportBatches()]] - `imports` [EXTRACTED]
- [[parseFilter()_1]] - `contains` [EXTRACTED]
- [[productPerformance()]] - `imports` [EXTRACTED]
- [[queryRecords()]] - `imports` [EXTRACTED]
- [[runImport()]] - `imports` [EXTRACTED]
- [[setBusinessDayStartHour()]] - `imports` [EXTRACTED]
- [[shared-typesdatasets.ts]] - `imports_from` [EXTRACTED]
- [[topProducts()]] - `imports` [EXTRACTED]
- [[totalsFor()]] - `imports` [EXTRACTED]
- [[upload]] - `contains` [EXTRACTED]
- [[uploadFiles()]] - `indirect_call` [INFERRED]
- [[wastageByReason()]] - `imports` [EXTRACTED]

## Source
**From** `server/src/entities/datasets/routes.ts` **(starting line 1):**
```typescript
import { Router, type RequestHandler } from "express";
```

#graphify/code #graphify/EXTRACTED #community/Ramesh_AI_Query_Engine