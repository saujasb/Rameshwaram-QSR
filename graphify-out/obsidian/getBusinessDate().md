---
source_file: "shared-types/businessDate.ts"
type: "code"
community: "Data Explorer & Import UI"
location: "L42"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Data_Explorer__Import_UI
---

# getBusinessDate()

## Connections
- [[BusinessDayExamples()]] - `calls` [EXTRACTED]
- [[SettingsPage.tsx]] - `imports` [EXTRACTED]
- [[buildRecord()]] - `calls` [EXTRACTED]
- [[businessDate.ts]] - `contains` [EXTRACTED]
- [[getCurrentBusinessDate()]] - `calls` [EXTRACTED]
- [[isWithinBusinessDay()]] - `calls` [EXTRACTED]
- [[normalize.ts]] - `imports` [EXTRACTED]
- [[shiftDateKey()]] - `calls` [EXTRACTED]
- [[toDateKey()]] - `calls` [EXTRACTED]

## Source
**From** `shared-types/businessDate.ts` **(starting line 42):**
```typescript
export function getBusinessDate(timestamp: Date | string, startHour = DEFAULT_BUSINESS_DAY_START_HOUR): string {
  const date = typeof timestamp === "string" ? new Date(timestamp) : timestamp;
  const calendarKey = toDateKey(date);
  return date.getHours() < startHour ? shiftDateKey(calendarKey, -1) : calendarKey;
}
```

#graphify/code #graphify/EXTRACTED #community/Data_Explorer__Import_UI