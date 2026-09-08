---
source_file: "server/src/entities/intelligence/insights.ts"
type: "code"
community: "Business Intelligence Engine"
location: "L457"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Business_Intelligence_Engine
---

# buildInsights()

## Connections
- [[analysis.ts]] - `imports` [EXTRACTED]
- [[anomalyInsight()]] - `calls` [EXTRACTED]
- [[concentrationInsight()]] - `calls` [EXTRACTED]
- [[dailyTotals()]] - `calls` [EXTRACTED]
- [[datasetCoverage()]] - `calls` [EXTRACTED]
- [[detectAnomalies()]] - `calls` [EXTRACTED]
- [[executiveAnalysis()]] - `calls` [EXTRACTED]
- [[importQualityInsight()]] - `calls` [EXTRACTED]
- [[insights.ts]] - `contains` [EXTRACTED]
- [[intelligenceroutes.ts]] - `imports` [EXTRACTED]
- [[listImportBatches()]] - `calls` [EXTRACTED]
- [[missingDatesInsight()]] - `calls` [EXTRACTED]
- [[movementInsight()]] - `calls` [EXTRACTED]
- [[peakHourInsight()]] - `calls` [EXTRACTED]
- [[productPerformance()]] - `calls` [EXTRACTED]
- [[salesInsights()]] - `calls` [EXTRACTED]
- [[totalsFor()]] - `calls` [EXTRACTED]
- [[wastageInsights()]] - `calls` [EXTRACTED]
- [[whereLabel()]] - `calls` [EXTRACTED]
- [[windowFor()]] - `calls` [EXTRACTED]

## Source
**From** `server/src/entities/intelligence/insights.ts` **(starting line 457):**
```typescript
export function buildInsights(filter: DatasetFilter): Insight[] {
  const coverage = datasetCoverage();
  const hasSales = (coverage.find((c) => c.datasetType === "sales")?.recordCount ?? 0) > 0;
  const missingProduction = (coverage.find((c) => c.datasetType === "production")?.recordCount ?? 0) === 0;

  const daily = hasSales ? dailyTotals({ ...filter, datasetType: "sales" }) : [];
  const win = windowFor(daily.map((d) => d.businessDate));
  const where = whereLabel(filter);
  const out: Insight[] = [];

  // Anomalies are the sharpest insights available, so they lead the list.
  const anomalies = detectAnomalies(filter)
    .filter((a) => a.severity !== "low")
    .slice(0, MAX_ANOMALY_INSIGHTS);
  for (const a of anomalies) out.push(anomalyInsight(a, where));

  if (win) {
    const rangeFilter: DatasetFilter = { ...filter, from: win.from, to: win.to };
    const products = productPerformance(rangeFilter);
    const salesTotals = totalsFor({ ...rangeFilter, datasetType: "sales" });

    out.push(...salesInsights(rangeFilter, win, where, products, salesTotals.value, salesTotals.quantity, missingProduction));
    const movement = movementInsight(filter, daily, where);
    if (movement) out.push(movement);
    const concentration = concentrationInsight(rangeFilter, win, where, products, salesTotals.value);
    if (concentration) out.push(concentration);
    out.push(...wastageInsights(rangeFilter, win, where, products));
    const peak = peakHourInsight(rangeFilter, win, where);
    if (peak) out.push(peak);
    const gaps = missingDatesInsight(rangeFilter, win, where, daily.map((d) => d.businessDate));
    if (gaps) out.push(gaps);
  }

  const [latestBatch] = listImportBatches(1);
  if (latestBatch) {
    const quality = importQualityInsight(filter, where, latestBatch);
    if (quality) out.push(quality);
  }

  // De-duplicate by id: an anomaly-derived insight can restate a movement.
  const seen = new Set<string>();
  return out
    .filter((i) => (seen.has(i.id) ? false : (seen.add(i.id), true)))
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_INSIGHTS);
}
```

#graphify/code #graphify/EXTRACTED #community/Business_Intelligence_Engine