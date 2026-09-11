---
source_file: "shared-types/businessDate.ts"
type: "code"
community: "Sales Import Parsing Pipeline"
location: "L53"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Sales_Import_Parsing_Pipeline
---

# getBusinessDayBounds()

## Connections
- [[businessDate.ts]] - `contains` [EXTRACTED]
- [[pad2()_1]] - `calls` [EXTRACTED]
- [[runSalesImport()]] - `calls` [EXTRACTED]
- [[salesimportPipeline.ts]] - `imports` [EXTRACTED]
- [[shiftDateKey()]] - `calls` [EXTRACTED]

## Source
**From** `shared-types/businessDate.ts` **(starting line 53):**
```typescript
export function getBusinessDayBounds(
  businessDate: string,
  startHour = DEFAULT_BUSINESS_DAY_START_HOUR
): { start: string; end: string } {
  const nextDay = shiftDateKey(businessDate, 1);
  const hh = pad2(startHour);
  return { start: `${businessDate}T${hh}:00:00`, end: `${nextDay}T${hh}:00:00` };
}
```

#graphify/code #graphify/EXTRACTED #community/Sales_Import_Parsing_Pipeline