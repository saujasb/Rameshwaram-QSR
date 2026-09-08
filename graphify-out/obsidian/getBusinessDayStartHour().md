---
source_file: "server/src/entities/datasets/db.ts"
type: "code"
community: "Business Intelligence Engine"
location: "L147"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Business_Intelligence_Engine
---

# getBusinessDayStartHour()

## Connections
- [[answer()]] - `calls` [EXTRACTED]
- [[buildTodaysIntelligence()]] - `calls` [EXTRACTED]
- [[datasetsdb.ts]] - `contains` [EXTRACTED]
- [[datasetsimportPipeline.ts]] - `imports` [EXTRACTED]
- [[datasetsrepository.ts]] - `imports` [EXTRACTED]
- [[datasetsroutes.ts]] - `imports` [EXTRACTED]
- [[engine.ts]] - `imports` [EXTRACTED]
- [[hourlyBuckets()]] - `calls` [EXTRACTED]
- [[intelligenceroutes.ts]] - `imports` [EXTRACTED]
- [[resolveBusinessDate()]] - `calls` [EXTRACTED]
- [[runImport()]] - `calls` [EXTRACTED]

## Source
**From** `server/src/entities/datasets/db.ts` **(starting line 147):**
```typescript
export function getBusinessDayStartHour(): number {
  const row = db.prepare(`SELECT value FROM app_settings WHERE key = ?`).get(BUSINESS_DAY_START_KEY) as
    | { value: string }
    | undefined;
  const parsed = row ? Number(row.value) : NaN;
  return Number.isInteger(parsed) && parsed >= 0 && parsed <= 23 ? parsed : 5;
}
```

#graphify/code #graphify/EXTRACTED #community/Business_Intelligence_Engine