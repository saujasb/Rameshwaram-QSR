---
source_file: "shared-types/businessDate.ts"
type: "code"
community: "Business Intelligence Engine"
location: "L82"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Business_Intelligence_Engine
---

# getClockHour()

## Connections
- [[businessDate.ts]] - `contains` [EXTRACTED]

## Source
**From** `shared-types/businessDate.ts` **(starting line 82):**
```typescript
export function getClockHour(timestamp: Date | string): number {
  const date = typeof timestamp === "string" ? new Date(timestamp) : timestamp;
  return date.getHours();
}
```

#graphify/code #graphify/EXTRACTED #community/Business_Intelligence_Engine