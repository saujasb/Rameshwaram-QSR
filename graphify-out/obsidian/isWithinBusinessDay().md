---
source_file: "shared-types/businessDate.ts"
type: "code"
community: "Data Explorer & Import UI"
location: "L62"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Data_Explorer__Import_UI
---

# isWithinBusinessDay()

## Connections
- [[businessDate.ts]] - `contains` [EXTRACTED]
- [[getBusinessDate()]] - `calls` [EXTRACTED]

## Source
**From** `shared-types/businessDate.ts` **(starting line 62):**
```typescript
export function isWithinBusinessDay(
  timestamp: Date | string,
  businessDate: string,
  startHour = DEFAULT_BUSINESS_DAY_START_HOUR
): boolean {
  return getBusinessDate(timestamp, startHour) === businessDate;
}
```

#graphify/code #graphify/EXTRACTED #community/Data_Explorer__Import_UI