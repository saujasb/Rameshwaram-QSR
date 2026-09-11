---
source_file: "server/src/entities/intelligence/anomalies.ts"
type: "code"
community: "Business Intelligence Engine"
location: "L127"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Business_Intelligence_Engine
---

# productionVariance()

## Connections
- [[anomalies.ts]] - `contains` [EXTRACTED]
- [[dailyTotals()]] - `calls` [EXTRACTED]
- [[detectAnomalies()]] - `calls` [EXTRACTED]
- [[drilldown()]] - `calls` [EXTRACTED]
- [[formatBusinessDateLong()]] - `calls` [EXTRACTED]
- [[productPerformance()]] - `calls` [EXTRACTED]
- [[qtyText()]] - `calls` [EXTRACTED]
- [[round2()]] - `calls` [EXTRACTED]
- [[severityFor()]] - `calls` [EXTRACTED]

## Source
**From** `server/src/entities/intelligence/anomalies.ts` **(starting line 127):**
```typescript
function productionVariance(filter: DatasetFilter): Candidate[] {
  const productionDays = dailyTotals({ ...filter, datasetType: "production" });
  if (productionDays.length === 0) return [];

  const salesDays = new Set(dailyTotals({ ...filter, datasetType: "sales" }).map((d) => d.businessDate));
  const wastageDays = new Set(dailyTotals({ ...filter, datasetType: "wastage" }).map((d) => d.businessDate));

  const out: Candidate[] = [];
  for (const day of productionDays.slice(-MAX_PRODUCTION_DAYS)) {
    const date = day.businessDate;
    if (!salesDays.has(date) || !wastageDays.has(date)) continue;

    for (const row of productPerformance({ ...filter, from: date, to: date })) {
      if (row.productionQty <= 0) continue;

      const accounted = row.salesQty + row.wastageQty;
      const variancePct = ((accounted - row.productionQty) / row.productionQty) * 100;
      if (Math.abs(variancePct) < THRESHOLD_PCT) continue;

      const kind = variancePct < 0 ? "overproduction" : "underproduction";
      const direction = variancePct < 0 ? "more than was sold or wasted" : "less than was sold or wasted";
      out.push({
        id: `${kind}:${date}:${row.product}`,
        kind,
        severity: severityFor(Math.abs(variancePct)),
        headline: `${row.product} on ${formatBusinessDateLong(date)}: ${qtyText(row.productionQty)} produced, ${qtyText(accounted)} accounted for (${qtyText(Math.abs(row.productionQty - accounted))} units ${direction})`,
        businessDate: date,
        hour: null,
        product: row.product,
        outlet: filter.outlet ?? null,
        shift: filter.shift ?? null,
        expected: round2(row.productionQty),
        actual: round2(accounted),
        absoluteVariance: round2(Math.abs(accounted - row.productionQty)),
        variancePct: round2(variancePct),
        unit: "qty",
        expectedBasisNote: `Production quantity recorded for ${row.product} on ${date}; sales (${qtyText(row.salesQty)}) and wastage (${qtyText(row.wastageQty)}) imports both cover this business date, so the unaccounted quantity is measurable.`,
        evidenceTypes: ["production", "sales", "wastage"],
        drilldownQuery: drilldown(filter, { from: date, to: date, product: row.product }),
      });
    }
  }
  return out;
}
```

#graphify/code #graphify/EXTRACTED #community/Business_Intelligence_Engine