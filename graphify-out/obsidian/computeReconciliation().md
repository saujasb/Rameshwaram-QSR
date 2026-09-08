---
source_file: "server/src/entities/intelligence/reconciliation.ts"
type: "code"
community: "Business Intelligence Engine"
location: "L153"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Business_Intelligence_Engine
---

# computeReconciliation()

## Connections
- [[analysis.ts]] - `imports` [EXTRACTED]
- [[buildRow()]] - `calls` [EXTRACTED]
- [[datasetCoverage()]] - `calls` [EXTRACTED]
- [[efficiencyAnalysis()]] - `calls` [EXTRACTED]
- [[factsFor()]] - `calls` [EXTRACTED]
- [[formatBusinessDateLong()]] - `calls` [EXTRACTED]
- [[intelligenceroutes.ts]] - `imports` [EXTRACTED]
- [[perDateFacts()]] - `calls` [EXTRACTED]
- [[reconciliation.ts]] - `contains` [EXTRACTED]
- [[reconciliationAnalysis()]] - `calls` [EXTRACTED]

## Source
**From** `server/src/entities/intelligence/reconciliation.ts` **(starting line 153):**
```typescript
export function computeReconciliation(filter: DatasetFilter): ReconciliationSummary {
  const coverage = datasetCoverage();
  const availableDatasets = ALL_DATASET_TYPES.filter((t) => (coverage.find((c) => c.datasetType === t)?.recordCount ?? 0) > 0);
  const missingDatasets = ALL_DATASET_TYPES.filter((t) => !availableDatasets.includes(t));

  // Only query types that exist at all; the common sales-only case costs one pass.
  const byType = new Map<DatasetType, Map<string, TypeFacts>>();
  for (const t of availableDatasets) byType.set(t, perDateFacts(filter, t));

  const dates = [...new Set([...byType.values()].flatMap((m) => [...m.keys()]))].sort();

  if (dates.length === 0) {
    return {
      businessDateFrom: filter.from ?? null,
      businessDateTo: filter.to ?? null,
      rows: [],
      totals: null,
      availableDatasets,
      missingDatasets,
    };
  }

  const businessDateFrom = dates[0];
  const businessDateTo = dates[dates.length - 1];

  const rows = dates.slice(0, MAX_ROWS).map((date) => {
    const facts: FactsByType = {
      sales: byType.get("sales")?.get(date) ?? ABSENT,
      production: byType.get("production")?.get(date) ?? ABSENT,
      wastage: byType.get("wastage")?.get(date) ?? ABSENT,
    };
    return buildRow(date, formatBusinessDateLong(date), facts);
  });

  const rangeFilter: DatasetFilter = { ...filter, from: businessDateFrom, to: businessDateTo };
  const totalFacts: FactsByType = {
    sales: availableDatasets.includes("sales") ? factsFor(rangeFilter, "sales") : ABSENT,
    production: availableDatasets.includes("production") ? factsFor(rangeFilter, "production") : ABSENT,
    wastage: availableDatasets.includes("wastage") ? factsFor(rangeFilter, "wastage") : ABSENT,
  };

  // The totals row keeps the range in businessDate so a UI row key stays unique
  // against the per-date rows above.
  const totalsKey = businessDateFrom === businessDateTo ? businessDateFrom : `${businessDateFrom}..${businessDateTo}`;
  const totalsLabel =
    businessDateFrom === businessDateTo
      ? formatBusinessDateLong(businessDateFrom)
      : `${formatBusinessDateLong(businessDateFrom)} to ${formatBusinessDateLong(businessDateTo)} (${dates.length} business day(s) with data)`;

  return {
    businessDateFrom,
    businessDateTo,
    rows,
    totals: buildRow(totalsKey, totalsLabel, totalFacts),
    availableDatasets,
    missingDatasets,
  };
}
```

#graphify/code #graphify/EXTRACTED #community/Business_Intelligence_Engine