---
source_file: "server/src/entities/intelligence/routes.ts"
type: "code"
community: "Business Intelligence Engine"
location: "L1"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Business_Intelligence_Engine
---

# intelligence/routes.ts

## Connections
- [[DatasetFilter]] - `imports` [EXTRACTED]
- [[DatasetType]] - `imports` [EXTRACTED]
- [[TodaysIntelligence]] - `imports` [EXTRACTED]
- [[anomalies.ts]] - `imports_from` [EXTRACTED]
- [[buildInsights()]] - `imports` [EXTRACTED]
- [[buildTodaysIntelligence()]] - `contains` [EXTRACTED]
- [[businessDate.ts]] - `imports_from` [EXTRACTED]
- [[calculated()]] - `imports` [EXTRACTED]
- [[computeReconciliation()]] - `imports` [EXTRACTED]
- [[datasetsdb.ts]] - `imports_from` [EXTRACTED]
- [[datasetsrepository.ts]] - `imports_from` [EXTRACTED]
- [[detectAnomalies()]] - `imports` [EXTRACTED]
- [[formatHourBucket()]] - `imports` [EXTRACTED]
- [[getBusinessDayStartHour()]] - `imports` [EXTRACTED]
- [[getCurrentBusinessDate()]] - `imports` [EXTRACTED]
- [[hourlyBuckets()]] - `imports` [EXTRACTED]
- [[index.ts]] - `imports_from` [EXTRACTED]
- [[insights.ts]] - `imports_from` [EXTRACTED]
- [[intelligenceRouter]] - `contains` [EXTRACTED]
- [[latestBusinessDate()]] - `imports` [EXTRACTED]
- [[observed()]] - `imports` [EXTRACTED]
- [[parseFilter()]] - `contains` [EXTRACTED]
- [[reconciliation.ts]] - `imports_from` [EXTRACTED]
- [[resolveBusinessDate()]] - `contains` [EXTRACTED]
- [[shared-typesdatasets.ts]] - `imports_from` [EXTRACTED]
- [[shared-typesintelligence.ts]] - `imports_from` [EXTRACTED]
- [[totalsFor()]] - `imports` [EXTRACTED]
- [[unavailable()]] - `imports` [EXTRACTED]

## Source
**From** `server/src/entities/intelligence/routes.ts` **(starting line 1):**
```typescript
import { Router } from "express";
```

#graphify/code #graphify/EXTRACTED #community/Business_Intelligence_Engine