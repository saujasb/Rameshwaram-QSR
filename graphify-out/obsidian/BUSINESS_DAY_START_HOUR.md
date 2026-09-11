---
source_file: "shared-types/businessDate.ts"
type: "code"
community: "Business Intelligence Engine"
location: "L13"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Business_Intelligence_Engine
---

# BUSINESS_DAY_START_HOUR

## Connections
- [[businessDate.ts]] - `contains` [EXTRACTED]

## Source
**From** `shared-types/businessDate.ts` **(starting line 13):**
```typescript
export const BUSINESS_DAY_START_HOUR = DEFAULT_BUSINESS_DAY_START_HOUR;

/** The trading window is always 24h long, just offset -- 05:00 -> 05:00(+1). */
export const BUSINESS_DAY_LENGTH_HOURS = 24;

function pad2(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}
```

#graphify/code #graphify/EXTRACTED #community/Business_Intelligence_Engine