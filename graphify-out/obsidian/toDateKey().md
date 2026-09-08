---
source_file: "shared-types/businessDate.ts"
type: "code"
community: "Data Explorer & Import UI"
location: "L22"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Data_Explorer__Import_UI
---

# toDateKey()

## Connections
- [[BusinessDayExamples()]] - `calls` [EXTRACTED]
- [[SettingsPage.tsx]] - `imports` [EXTRACTED]
- [[buildIso()]] - `calls` [EXTRACTED]
- [[businessDate.ts]] - `contains` [EXTRACTED]
- [[coerce.ts]] - `imports` [EXTRACTED]
- [[coerceDateKey()]] - `calls` [EXTRACTED]
- [[coerceTimestamp()]] - `calls` [EXTRACTED]
- [[getBusinessDate()]] - `calls` [EXTRACTED]
- [[pad2()_1]] - `calls` [EXTRACTED]
- [[shiftDateKey()]] - `calls` [EXTRACTED]

## Source
**From** `shared-types/businessDate.ts` **(starting line 22):**
```typescript
export function toDateKey(date: Date): string {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}
```

#graphify/code #graphify/EXTRACTED #community/Data_Explorer__Import_UI