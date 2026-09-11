---
source_file: "server/src/entities/sales/repository.ts"
type: "code"
community: "Sales Import Parsing Pipeline"
location: "L297"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Sales_Import_Parsing_Pipeline
---

# getDailyTarget()

## Connections
- [[salesrepository.ts]] - `contains` [EXTRACTED]
- [[salesroutes.ts]] - `imports` [EXTRACTED]

## Source
**From** `server/src/entities/sales/repository.ts` **(starting line 297):**
```typescript
export function getDailyTarget(): { amount: number | null; updatedAt: string | null } {
  const row = db.prepare(`SELECT value, updatedAt FROM sales_settings WHERE key = ?`).get(DAILY_TARGET_KEY) as
    | { value: string; updatedAt: string }
    | undefined;
  if (!row) return { amount: null, updatedAt: null };
  return { amount: Number(row.value), updatedAt: row.updatedAt };
}
```

#graphify/code #graphify/EXTRACTED #community/Sales_Import_Parsing_Pipeline