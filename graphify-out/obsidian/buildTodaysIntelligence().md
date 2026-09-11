---
source_file: "server/src/entities/intelligence/routes.ts"
type: "code"
community: "Business Intelligence Engine"
location: "L37"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Business_Intelligence_Engine
---

# buildTodaysIntelligence()

## Connections
- [[calculated()]] - `calls` [EXTRACTED]
- [[formatHourBucket()]] - `calls` [EXTRACTED]
- [[getBusinessDayStartHour()]] - `calls` [EXTRACTED]
- [[hourlyBuckets()]] - `calls` [EXTRACTED]
- [[intelligenceroutes.ts]] - `contains` [EXTRACTED]
- [[observed()]] - `calls` [EXTRACTED]
- [[totalsFor()]] - `calls` [EXTRACTED]
- [[unavailable()]] - `calls` [EXTRACTED]

## Source
**From** `server/src/entities/intelligence/routes.ts` **(starting line 37):**
```typescript
function buildTodaysIntelligence(businessDate: string): TodaysIntelligence {
  const startHour = getBusinessDayStartHour();
  const range: DatasetFilter = { from: businessDate, to: businessDate };

  const sales = totalsFor({ ...range, datasetType: "sales" });
  const production = totalsFor({ ...range, datasetType: "production" });
  const wastage = totalsFor({ ...range, datasetType: "wastage" });

  const scope = `${businessDate} business day`;
  const hasSales = sales.recordCount > 0;
  const hasProduction = production.recordCount > 0;
  const hasWastage = wastage.recordCount > 0;

  const buckets = hourlyBuckets(range);
  const salesBuckets = buckets.filter((b) => b.salesValue > 0);
  const peak = salesBuckets.length
    ? salesBuckets.reduce((a, b) => (b.salesValue > a.salesValue ? b : a))
    : null;

  // Ratios need production as a denominator; without it they are genuinely
  // unknowable, so they report "unavailable" rather than 0.
  const ratio = (num: number, label: string) =>
    hasProduction && production.quantity > 0
      ? calculated((num / production.quantity) * 100, `${label} over ${production.quantity} produced units, ${scope}`)
      : unavailable(
          hasProduction
            ? `Production recorded as 0 units for ${scope}, so this ratio has no denominator`
            : `No production records imported for ${scope}`
        );

  return {
    businessDate,
    businessDayStartHour: startHour,
    salesValue: hasSales
      ? observed(sales.value, `${sales.recordCount} sales records, ${scope}`)
      : unavailable(`No sales records imported for ${scope}`),
    salesQty: hasSales
      ? observed(sales.quantity, `${sales.recordCount} sales records, ${scope}`)
      : unavailable(`No sales records imported for ${scope}`),
    productionQty: hasProduction
      ? observed(production.quantity, `${production.recordCount} production records, ${scope}`)
      : unavailable(`No production records imported for ${scope}`),
    wastageQty: hasWastage
      ? observed(wastage.quantity, `${wastage.recordCount} wastage records, ${scope}`)
      : unavailable(`No wastage records imported for ${scope}`),
    efficiencyPct: ratio(sales.quantity + wastage.quantity, "Sales plus wastage"),
    variancePct: ratio(production.quantity - sales.quantity - wastage.quantity, "Production minus sales and wastage"),
    sellThroughPct: ratio(sales.quantity, "Sales quantity"),
    wastagePct: ratio(wastage.quantity, "Wastage quantity"),
    peakHour: peak ? { hour: peak.hour, label: formatHourBucket(peak.hour), salesValue: peak.salesValue } : null,
    hasTimestampedData: buckets.length > 0,
  };
}
```

#graphify/code #graphify/EXTRACTED #community/Business_Intelligence_Engine