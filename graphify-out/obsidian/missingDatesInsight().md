---
source_file: "server/src/entities/intelligence/insights.ts"
type: "code"
community: "Business Intelligence Engine"
location: "L389"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Business_Intelligence_Engine
---

# missingDatesInsight()

## Connections
- [[buildInsights()]] - `calls` [EXTRACTED]
- [[businessDateRange()]] - `calls` [EXTRACTED]
- [[compact()]] - `calls` [EXTRACTED]
- [[drill()]] - `calls` [EXTRACTED]
- [[evidenceFor()]] - `calls` [EXTRACTED]
- [[formatBusinessDateLong()]] - `calls` [EXTRACTED]
- [[insights.ts]] - `contains` [EXTRACTED]

## Source
**From** `server/src/entities/intelligence/insights.ts` **(starting line 389):**
```typescript
function missingDatesInsight(filter: DatasetFilter, win: Window, where: string, dates: string[]): Insight | null {
  if (win.from === win.to) return null;
  const present = new Set(dates);
  const span = businessDateRange(win.from, win.to);
  const missing = span.filter((d) => !present.has(d));
  if (missing.length === 0 || missing.length > span.length / 2) return null;

  return {
    id: `quality-gaps:${win.from}:${win.to}`,
    category: "quality",
    severity: "medium",
    what: `${missing.length} business date(s) inside the imported range have no records at all`,
    howMuch: `${dates.length} of ${span.length} business dates present; missing ${missing.slice(0, 5).join(", ")}${missing.length > 5 ? ` and ${missing.length - 5} more` : ""}`,
    when: `${formatBusinessDateLong(win.from)} to ${formatBusinessDateLong(win.to)}`,
    where,
    product: null,
    impact: `Period totals cover ${dates.length} of ${span.length} business dates, so any per-day average is computed over ${dates.length} days and understates a ${span.length}-day period`,
    action: `Import the sales report(s) for ${missing.slice(0, 5).join(", ")}${missing.length > 5 ? " and the other missing dates" : ""} before comparing period totals or daily averages.`,
    evidence: compact([evidenceFor(filter, "sales", win.from, win.to, null, `Sales records present between ${win.from} and ${win.to}`)]),
    drilldownQuery: drill(filter, { from: win.from, to: win.to }),
    score: 66,
  };
}
```

#graphify/code #graphify/EXTRACTED #community/Business_Intelligence_Engine