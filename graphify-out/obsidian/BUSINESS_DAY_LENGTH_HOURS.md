---
source_file: "shared-types/businessDate.ts"
type: "code"
community: "Business Intelligence Engine"
location: "L16"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Business_Intelligence_Engine
---

# BUSINESS_DAY_LENGTH_HOURS

## Connections
- [[businessDate.ts]] - `contains` [EXTRACTED]

## Source
**From** `shared-types/businessDate.ts` **(starting line 16):**
```typescript
export const BUSINESS_DAY_LENGTH_HOURS = 24;

function pad2(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}
```

#graphify/code #graphify/EXTRACTED #community/Business_Intelligence_Engine