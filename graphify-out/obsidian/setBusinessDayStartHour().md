---
source_file: "server/src/entities/datasets/db.ts"
type: "code"
community: "Ramesh AI Query Engine"
location: "L155"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Ramesh_AI_Query_Engine
---

# setBusinessDayStartHour()

## Connections
- [[datasetsdb.ts]] - `contains` [EXTRACTED]
- [[datasetsroutes.ts]] - `imports` [EXTRACTED]

## Source
**From** `server/src/entities/datasets/db.ts` **(starting line 155):**
```typescript
export function setBusinessDayStartHour(hour: number): { hour: number; updatedAt: string } {
  const now = new Date().toISOString();
  db.prepare(
    `INSERT INTO app_settings (key, value, updatedAt) VALUES (?, ?, ?)
     ON CONFLICT(key) DO UPDATE SET value = excluded.value, updatedAt = excluded.updatedAt`
  ).run(BUSINESS_DAY_START_KEY, String(hour), now);
  return { hour, updatedAt: now };
}
```

#graphify/code #graphify/EXTRACTED #community/Ramesh_AI_Query_Engine