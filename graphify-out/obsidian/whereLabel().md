---
source_file: "server/src/entities/intelligence/insights.ts"
type: "code"
community: "Business Intelligence Engine"
location: "L76"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Business_Intelligence_Engine
---

# whereLabel()

## Connections
- [[buildInsights()]] - `calls` [EXTRACTED]
- [[distinctValues()]] - `calls` [EXTRACTED]
- [[insights.ts]] - `contains` [EXTRACTED]

## Source
**From** `server/src/entities/intelligence/insights.ts` **(starting line 76):**
```typescript
function whereLabel(filter: DatasetFilter): string {
  if (filter.outlet) return `${filter.outlet} (outlet filter applied)`;
  const outlets = distinctValues("outlet");
  if (outlets.length === 0) return "Outlet is not recorded in the imported files, so this covers all imported records";
  if (outlets.length === 1) return `${outlets[0]} branch (single outlet in the data)`;
  return `${outlets.length} outlets present in the data (${outlets.slice(0, 3).join(", ")})`;
}
```

#graphify/code #graphify/EXTRACTED #community/Business_Intelligence_Engine