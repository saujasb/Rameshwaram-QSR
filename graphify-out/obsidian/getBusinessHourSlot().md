---
source_file: "shared-types/businessDate.ts"
type: "code"
community: "Ramesh AI Query Engine"
location: "L76"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Ramesh_AI_Query_Engine
---

# getBusinessHourSlot()

## Connections
- [[businessDate.ts]] - `contains` [EXTRACTED]
- [[datasetsrepository.ts]] - `imports` [EXTRACTED]

## Source
**From** `shared-types/businessDate.ts` **(starting line 76):**
```typescript
export function getBusinessHourSlot(timestamp: Date | string, startHour = DEFAULT_BUSINESS_DAY_START_HOUR): number {
  const date = typeof timestamp === "string" ? new Date(timestamp) : timestamp;
  return (date.getHours() - startHour + BUSINESS_DAY_LENGTH_HOURS) % BUSINESS_DAY_LENGTH_HOURS;
}
```

#graphify/code #graphify/EXTRACTED #community/Ramesh_AI_Query_Engine