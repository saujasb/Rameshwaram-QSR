---
source_file: "server/src/entities/intelligence/anomalies.ts"
type: "code"
community: "Business Intelligence Engine"
location: "L174"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Business_Intelligence_Engine
---

# wastageSurges()

## Connections
- [[anomalies.ts]] - `contains` [EXTRACTED]
- [[dailyTotals()]] - `calls` [EXTRACTED]
- [[detectAnomalies()]] - `calls` [EXTRACTED]
- [[drilldown()]] - `calls` [EXTRACTED]
- [[formatBusinessDateLong()]] - `calls` [EXTRACTED]
- [[mean()]] - `calls` [EXTRACTED]
- [[pctText()]] - `calls` [EXTRACTED]
- [[productPerformance()]] - `calls` [EXTRACTED]
- [[qtyText()]] - `calls` [EXTRACTED]
- [[round2()]] - `calls` [EXTRACTED]
- [[severityFor()]] - `calls` [EXTRACTED]

## Source
**From** `server/src/entities/intelligence/anomalies.ts` **(starting line 174):**
```typescript
function wastageSurges(filter: DatasetFilter): Candidate[] {
  const products = productPerformance(filter)
    .filter((p) => p.wastageQty > 0)
    .sort((a, b) => b.wastageQty - a.wastageQty)
    .slice(0, MAX_WASTAGE_PRODUCTS);

  const out: Candidate[] = [];
  for (const p of products) {
    const series = dailyTotals({ ...filter, datasetType: "wastage", product: p.product, from: undefined });
    for (let i = MIN_PRIOR_DAYS; i < series.length; i++) {
      const day = series[i];
      if (filter.from && day.businessDate < filter.from) continue;

      const priors = series.slice(Math.max(0, i - MAX_PRIOR_DAYS), i);
      if (priors.length < MIN_PRIOR_DAYS) continue;

      const expected = mean(priors.map((d) => d.quantity));
      if (expected <= 0) continue;

      const variancePct = ((day.quantity - expected) / expected) * 100;
      if (variancePct < THRESHOLD_PCT) continue; // only surges are anomalous

      out.push({
        id: `wastage_surge:${day.businessDate}:${p.product}`,
        kind: "wastage_surge",
        severity: severityFor(variancePct),
        headline: `${p.product} wastage on ${formatBusinessDateLong(day.businessDate)} was ${pctText(variancePct)} above its prior ${priors.length}-day mean (${qtyText(day.quantity)} vs ${qtyText(expected)} units)`,
        businessDate: day.businessDate,
        hour: null,
        product: p.product,
        outlet: filter.outlet ?? null,
        shift: filter.shift ?? null,
        expected: round2(expected),
        actual: round2(day.quantity),
        absoluteVariance: round2(day.quantity - expected),
        variancePct: round2(variancePct),
        unit: "qty",
        expectedBasisNote: `Mean wastage quantity for ${p.product} across ${priors.length} prior business day(s) with imported wastage data (${priors[0].businessDate} to ${priors[priors.length - 1].businessDate}).`,
        evidenceTypes: ["wastage"],
        drilldownQuery: drilldown(filter, {
          from: priors[0].businessDate,
          to: day.businessDate,
          datasetType: "wastage",
          product: p.product,
        }),
      });
    }
  }
  return out;
}
```

#graphify/code #graphify/EXTRACTED #community/Business_Intelligence_Engine