---
source_file: "server/src/entities/intelligence/routes.ts"
type: "code"
community: "Business Intelligence Engine"
location: "L32"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Business_Intelligence_Engine
---

# resolveBusinessDate()

## Connections
- [[getBusinessDayStartHour()]] - `calls` [EXTRACTED]
- [[getCurrentBusinessDate()]] - `calls` [EXTRACTED]
- [[intelligenceroutes.ts]] - `contains` [EXTRACTED]
- [[latestBusinessDate()]] - `calls` [EXTRACTED]

## Source
**From** `server/src/entities/intelligence/routes.ts` **(starting line 32):**
```typescript
function resolveBusinessDate(requested?: string): string {
  if (requested) return requested;
  return latestBusinessDate() ?? getCurrentBusinessDate(getBusinessDayStartHour());
}
```

#graphify/code #graphify/EXTRACTED #community/Business_Intelligence_Engine