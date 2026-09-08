---
source_file: "server/src/entities/intelligence/anomalies.ts"
type: "code"
community: "Business Intelligence Engine"
location: "L233"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Business_Intelligence_Engine
---

# productStalls()

## Connections
- [[anomalies.ts]] - `contains` [EXTRACTED]
- [[dailyTotals()]] - `calls` [EXTRACTED]
- [[detectAnomalies()]] - `calls` [EXTRACTED]
- [[drilldown()]] - `calls` [EXTRACTED]
- [[formatBusinessDateLong()]] - `calls` [EXTRACTED]
- [[mean()]] - `calls` [EXTRACTED]
- [[productPerformance()]] - `calls` [EXTRACTED]
- [[qtyText()]] - `calls` [EXTRACTED]
- [[round2()]] - `calls` [EXTRACTED]
- [[shiftDateKey()]] - `calls` [EXTRACTED]

## Source
**From** `server/src/entities/intelligence/anomalies.ts` **(starting line 233):**
```typescript
function productStalls(filter: DatasetFilter): Candidate[] {
  const dates = [
    ...new Set(
      [
        ...dailyTotals({ ...filter, datasetType: "production" }).map((d) => d.businessDate),
        ...dailyTotals({ ...filter, datasetType: "wastage" }).map((d) => d.businessDate),
      ]
    ),
  ]
    .sort()
    .slice(-MAX_STALL_DAYS);

  const out: Candidate[] = [];
  for (const date of dates) {
    for (const row of productPerformance({ ...filter, from: date, to: date })) {
      const seenElsewhere = row.productionQty > 0 || row.wastageQty > 0;
      if (row.salesQty > 0 || !seenElsewhere) continue;

      const priorSales = dailyTotals({
        ...filter,
        datasetType: "sales",
        product: row.product,
        from: undefined,
        to: shiftDateKey(date, -1),
      }).filter((d) => d.quantity > 0);
      if (priorSales.length < MIN_PRIOR_DAYS) continue;

      const priors = priorSales.slice(-MAX_PRIOR_DAYS);
      const expected = mean(priors.map((d) => d.quantity));
      if (expected <= 0) continue;

      out.push({
        id: `product_stall:${date}:${row.product}`,
        kind: "product_stall",
        severity: "high",
        headline: `${row.product} sold nothing on ${formatBusinessDateLong(date)} despite ${qtyText(row.productionQty + row.wastageQty)} units recorded in production/wastage, after averaging ${qtyText(expected)} units/day`,
        businessDate: date,
        hour: null,
        product: row.product,
        outlet: filter.outlet ?? null,
        shift: filter.shift ?? null,
        expected: round2(expected),
        actual: 0,
        absoluteVariance: round2(expected),
        variancePct: -100,
        unit: "qty",
        expectedBasisNote: `Mean sales quantity for ${row.product} across its ${priors.length} most recent prior business day(s) with sales (${priors[0].businessDate} to ${priors[priors.length - 1].businessDate}). Zero sales is a real observation here because the product still appears in the production/wastage import for ${date}.`,
        evidenceTypes: ["sales", "production", "wastage"],
        drilldownQuery: drilldown(filter, { from: priors[0].businessDate, to: date, product: row.product }),
      });
    }
  }
  return out;
}
```

#graphify/code #graphify/EXTRACTED #community/Business_Intelligence_Engine