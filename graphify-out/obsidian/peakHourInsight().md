---
source_file: "server/src/entities/intelligence/insights.ts"
type: "code"
community: "Business Intelligence Engine"
location: "L331"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Business_Intelligence_Engine
---

# peakHourInsight()

## Connections
- [[buildInsights()]] - `calls` [EXTRACTED]
- [[compact()]] - `calls` [EXTRACTED]
- [[drill()]] - `calls` [EXTRACTED]
- [[evidenceFor()]] - `calls` [EXTRACTED]
- [[formatHourBucket()]] - `calls` [EXTRACTED]
- [[hourlyBuckets()]] - `calls` [EXTRACTED]
- [[insights.ts]] - `contains` [EXTRACTED]
- [[money()]] - `calls` [EXTRACTED]
- [[pctText()]] - `calls` [EXTRACTED]
- [[qtyText()]] - `calls` [EXTRACTED]
- [[share()]] - `calls` [EXTRACTED]

## Source
**From** `server/src/entities/intelligence/insights.ts` **(starting line 331):**
```typescript
function peakHourInsight(filter: DatasetFilter, win: Window, where: string): Insight | null {
  const buckets = hourlyBuckets(filter);
  if (buckets.length === 0) return null;

  const dayValue = buckets.reduce((a, b) => a + b.salesValue, 0);
  const peak = [...buckets].sort((a, b) => b.salesValue - a.salesValue)[0];
  if (peak.salesValue <= 0) return null;

  const pct = share(peak.salesValue, dayValue);
  return {
    id: `time-peak:${win.from}:${win.to}:${peak.hour}`,
    category: "time",
    severity: "info",
    what: `${formatHourBucket(peak.hour)} is the highest-value trading hour on record`,
    howMuch: `${money(peak.salesValue)} from ${qtyText(peak.salesQty)} units across ${peak.recordCount} timestamped record(s)`,
    when: `${formatHourBucket(peak.hour)}${peak.isAfterMidnight ? " (after midnight, same business day)" : ""}, ${win.label}`,
    where,
    product: null,
    impact:
      pct === null
        ? `${money(peak.salesValue)} of timestamped sales fall in this hour`
        : `${pctText(pct)} of timestamped sales value falls in this single hour`,
    action: `Keep the counter fully staffed through ${formatHourBucket(peak.hour)} and schedule breaks or changeovers outside it -- ${pct === null ? money(peak.salesValue) : pctText(pct)} of timestamped sales value lands in that hour.`,
    evidence: compact([evidenceFor(filter, "sales", win.from, win.to, null, `Timestamped sales records between ${win.from} and ${win.to}`)]),
    drilldownQuery: drill(filter, { from: win.from, to: win.to, datasetType: "sales" }),
    score: 58,
  };
}
```

#graphify/code #graphify/EXTRACTED #community/Business_Intelligence_Engine