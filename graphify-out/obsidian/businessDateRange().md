---
source_file: "shared-types/businessDate.ts"
type: "code"
community: "Business Intelligence Engine"
location: "L110"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Business_Intelligence_Engine
---

# businessDateRange()

## Connections
- [[businessDate.ts]] - `contains` [EXTRACTED]
- [[insights.ts]] - `imports` [EXTRACTED]
- [[missingDatesInsight()]] - `calls` [EXTRACTED]
- [[movementInsight()]] - `calls` [EXTRACTED]
- [[shiftDateKey()]] - `calls` [EXTRACTED]

## Source
**From** `shared-types/businessDate.ts` **(starting line 110):**
```typescript
export function businessDateRange(from: string, to: string, maxDays = 400): string[] {
  const out: string[] = [];
  let cursor = from;
  for (let i = 0; i < maxDays; i++) {
    out.push(cursor);
    if (cursor >= to) break;
    cursor = shiftDateKey(cursor, 1);
  }
  return out;
}
```

#graphify/code #graphify/EXTRACTED #community/Business_Intelligence_Engine