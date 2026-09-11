---
source_file: "server/src/entities/ramesh/engine.ts"
type: "code"
community: "Ramesh AI Query Engine"
location: "L333"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Ramesh_AI_Query_Engine
---

# answerPeakHour()

## Connections
- [[answer()]] - `calls` [EXTRACTED]
- [[drilldown()_1]] - `calls` [EXTRACTED]
- [[engine.ts]] - `contains` [EXTRACTED]
- [[formatHourBucket()]] - `calls` [EXTRACTED]
- [[hourlyBuckets()]] - `calls` [EXTRACTED]
- [[insufficient()]] - `calls` [EXTRACTED]
- [[pct()_1]] - `calls` [EXTRACTED]
- [[rangeLabel()]] - `calls` [EXTRACTED]
- [[scopeNote()]] - `calls` [EXTRACTED]
- [[shell()]] - `calls` [EXTRACTED]
- [[spanOf()]] - `calls` [EXTRACTED]
- [[used()]] - `calls` [EXTRACTED]

## Source
**From** `server/src/entities/ramesh/engine.ts` **(starting line 333):**
```typescript
function answerPeakHour(c: Ctx): RameshAnswer {
  const buckets = hourlyBuckets(c.base);
  if (buckets.length === 0) {
    return insufficient(
      c,
      "None of the imported records carry a transaction time, so I cannot identify a peak hour without guessing — and I won't guess.",
      "The sources loaded so far are day-level item totals, which have a business date but no clock time. Import a transaction-level POS export (or an hourly sales report) and the peak hour becomes computable.",
      c.base
    );
  }
  const byValue = buckets.some((b) => b.salesValue > 0);
  const measure = (b: (typeof buckets)[number]) => (byValue ? b.salesValue : b.salesQty + b.productionQty + b.wastageQty);
  const ranked = [...buckets].sort((a, b) => measure(b) - measure(a));
  const peak = ranked[0];
  const fmt = byValue ? money : units;
  const total = buckets.reduce((s, b) => s + measure(b), 0);
  const span = spanOf(c.base);

  const steps: RameshCalculationStep[] = [
    {
      label: `Hourly buckets ranked by ${byValue ? "sales value" : "quantity"}, top ${Math.min(4, ranked.length)}`,
      expression: ranked.slice(0, 4).map((b) => `${formatHourBucket(b.hour)} ${fmt(measure(b))}`).join(" > "),
      result: formatHourBucket(peak.hour),
    },
  ];
  if (total > 0) {
    steps.push({
      label: "Peak hour share of the timed total",
      expression: `${fmt(measure(peak))} ÷ ${fmt(total)} × 100`,
      result: pct((measure(peak) / total) * 100),
    });
  }

  return shell(c, {
    answer: `The peak hour for ${rangeLabel(span.from, span.to)}${scopeNote(c.base)} was ${formatHourBucket(peak.hour)} at ${fmt(measure(peak))}.`,
    dataUsed: used(
      [...new Set(c.coverage.filter((x) => x.recordCount > 0).map((x) => x.datasetType))],
      c.base,
      buckets.reduce((s, b) => s + b.recordCount, 0),
      span
    ),
    calculation: steps,
    conclusion: total > 0 ? `${formatHourBucket(peak.hour)} carried ${pct((measure(peak) / total) * 100)} of everything recorded with a timestamp in this period.` : `Computed from ${buckets.length} timestamped hourly bucket(s).`,
    evidence: [
      {
        datasetType: "sales",
        description: `Timestamped records in the ${formatHourBucket(peak.hour)} bucket`,
        recordCount: peak.recordCount,
        quantity: peak.salesQty,
        amount: byValue ? peak.salesValue : null,
      },
    ],
    drilldownQuery: drilldown(c.base),
  });
}
```

#graphify/code #graphify/EXTRACTED #community/Ramesh_AI_Query_Engine