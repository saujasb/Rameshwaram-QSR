---
source_file: "server/src/entities/sales/repository.ts"
type: "code"
community: "Sales Import Parsing Pipeline"
location: "L305"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Sales_Import_Parsing_Pipeline
---

# setDailyTarget()

## Connections
- [[salesrepository.ts]] - `contains` [EXTRACTED]
- [[salesroutes.ts]] - `imports` [EXTRACTED]

## Source
**From** `server/src/entities/sales/repository.ts` **(starting line 305):**
```typescript
export function setDailyTarget(amount: number): { amount: number; updatedAt: string } {
  const now = new Date().toISOString();
  db.prepare(
    `INSERT INTO sales_settings (key, value, updatedAt) VALUES (?, ?, ?)
     ON CONFLICT(key) DO UPDATE SET value = excluded.value, updatedAt = excluded.updatedAt`
  ).run(DAILY_TARGET_KEY, String(amount), now);
  return { amount, updatedAt: now };
}
```

#graphify/code #graphify/EXTRACTED #community/Sales_Import_Parsing_Pipeline