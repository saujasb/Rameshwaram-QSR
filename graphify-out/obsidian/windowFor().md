---
source_file: "server/src/entities/intelligence/insights.ts"
type: "code"
community: "Business Intelligence Engine"
location: "L91"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Business_Intelligence_Engine
---

# windowFor()

## Connections
- [[buildInsights()]] - `calls` [EXTRACTED]
- [[formatBusinessDateLong()]] - `calls` [EXTRACTED]
- [[insights.ts]] - `contains` [EXTRACTED]

## Source
**From** `server/src/entities/intelligence/insights.ts` **(starting line 91):**
```typescript
function windowFor(dates: string[]): Window | null {
  if (dates.length === 0) return null;
  const from = dates[0];
  const to = dates[dates.length - 1];
  return {
    from,
    to,
    days: dates.length,
    label:
      from === to
        ? `${formatBusinessDateLong(from)} business day`
        : `${formatBusinessDateLong(from)} to ${formatBusinessDateLong(to)} (${dates.length} business days with data)`,
  };
}
```

#graphify/code #graphify/EXTRACTED #community/Business_Intelligence_Engine