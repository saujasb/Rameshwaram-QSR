---
source_file: "server/src/entities/intelligence/anomalies.ts"
type: "code"
community: "Business Intelligence Engine"
location: "L65"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Business_Intelligence_Engine
---

# salesMovement()

## Connections
- [[anomalies.ts]] - `contains` [EXTRACTED]
- [[dailyTotals()]] - `calls` [EXTRACTED]
- [[detectAnomalies()]] - `calls` [EXTRACTED]
- [[drilldown()]] - `calls` [EXTRACTED]
- [[formatBusinessDateLong()]] - `calls` [EXTRACTED]
- [[mean()]] - `calls` [EXTRACTED]
- [[money()]] - `calls` [EXTRACTED]
- [[pctText()]] - `calls` [EXTRACTED]
- [[qtyText()]] - `calls` [EXTRACTED]
- [[round2()]] - `calls` [EXTRACTED]
- [[severityFor()]] - `calls` [EXTRACTED]

## Source
**From** `server/src/entities/intelligence/anomalies.ts` **(starting line 65):**
```typescript
function salesMovement(filter: DatasetFilter): Candidate[] {
  const history = dailyTotals({ ...filter, datasetType: "sales", from: undefined });
  if (history.length <= MIN_PRIOR_DAYS) return [];

  // Sales value is the honest measure when the imports carry amounts; when they
  // do not, quantity is the only thing that was actually recorded.
  const useValue = history.reduce((a, d) => a + d.value, 0) > 0;
  const measureOf = (d: { quantity: number; value: number }) => (useValue ? d.value : d.quantity);
  const fmt = (n: number) => (useValue ? money(n) : `${qtyText(n)} units`);

  const out: Candidate[] = [];
  for (let i = MIN_PRIOR_DAYS; i < history.length; i++) {
    const day = history[i];
    if (filter.from && day.businessDate < filter.from) continue;

    const priors = history.slice(Math.max(0, i - MAX_PRIOR_DAYS), i);
    if (priors.length < MIN_PRIOR_DAYS) continue;

    const expected = mean(priors.map(measureOf));
    if (expected <= 0) continue; // no baseline to divide by -- say nothing

    const actual = measureOf(day);
    const variancePct = ((actual - expected) / expected) * 100;
    if (Math.abs(variancePct) < THRESHOLD_PCT) continue;

    const kind = variancePct < 0 ? "sales_drop" : "sales_spike";
    out.push({
      id: `${kind}:${day.businessDate}`,
      kind,
      severity: severityFor(Math.abs(variancePct)),
      headline: `Sales on ${formatBusinessDateLong(day.businessDate)} came in ${pctText(variancePct)} versus the prior ${priors.length}-day mean (${fmt(actual)} vs ${fmt(expected)})`,
      businessDate: day.businessDate,
      hour: null,
      product: filter.product ?? null,
      outlet: filter.outlet ?? null,
      shift: filter.shift ?? null,
      expected: round2(expected),
      actual: round2(actual),
      absoluteVariance: round2(Math.abs(actual - expected)),
      variancePct: round2(variancePct),
      unit: useValue ? "rupees" : "qty",
      expectedBasisNote: `Mean of ${priors.length} prior business day(s) with imported sales data (${priors[0].businessDate} to ${priors[priors.length - 1].businessDate}), measured by ${useValue ? "sales value" : "quantity"}.`,
      evidenceTypes: ["sales"],
      drilldownQuery: drilldown(filter, {
        from: priors[0].businessDate,
        to: day.businessDate,
        datasetType: "sales",
        product: filter.product ?? null,
      }),
    });
  }
  return out;
}
```

#graphify/code #graphify/EXTRACTED #community/Business_Intelligence_Engine