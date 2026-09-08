---
source_file: "server/src/entities/intelligence/insights.ts"
type: "code"
community: "Business Intelligence Engine"
location: "L415"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Business_Intelligence_Engine
---

# anomalyAction()

## Connections
- [[anomalyInsight()]] - `calls` [EXTRACTED]
- [[formatBusinessDateLong()]] - `calls` [EXTRACTED]
- [[insights.ts]] - `contains` [EXTRACTED]
- [[money()]] - `calls` [EXTRACTED]
- [[qtyText()]] - `calls` [EXTRACTED]

## Source
**From** `server/src/entities/intelligence/insights.ts` **(starting line 415):**
```typescript
function anomalyAction(a: Anomaly): string {
  const gap = a.unit === "rupees" ? money(a.absoluteVariance) : `${qtyText(a.absoluteVariance)} units`;
  switch (a.kind) {
    case "sales_drop":
      return `Confirm the ${a.businessDate} import is complete (${a.evidence.map((e) => `${e.recordCount} ${e.datasetType}`).join(", ") || "no supporting records"}) before treating this as demand: if the file is complete, the ${gap} shortfall against the stated baseline is real.`;
    case "sales_spike":
      return `Record what drove ${formatBusinessDateLong(a.businessDate)} (event, festival, bulk order) alongside the import -- ${gap} above the stated baseline is the size of the effect to plan for if it repeats.`;
    case "overproduction":
      return `Bring ${a.product ?? "this item"} production down toward the ${qtyText(a.actual)} units that were actually sold or wasted; ${gap} went unaccounted for on ${a.businessDate}.`;
    case "underproduction":
      return `${a.product ?? "This item"} sold or wasted ${gap} more than the production record shows for ${a.businessDate} -- either production was under-recorded or stock carried over; check the production sheet for that date.`;
    case "wastage_surge":
      return `Pull the ${a.evidence.find((e) => e.datasetType === "wastage")?.recordCount ?? 0} wastage record(s) for ${a.product ?? "this item"} on ${a.businessDate}: ${gap} above its own prior mean is a specific batch or reason, not noise.`;
    case "product_stall":
      return `${a.product ?? "This item"} was still recorded in production/wastage on ${a.businessDate} but sold nothing -- check availability at the counter and the POS item mapping for that date.`;
    default:
      return `Verify the ${a.businessDate} records behind this variance in the Data Explorer before acting on it.`;
  }
}
```

#graphify/code #graphify/EXTRACTED #community/Business_Intelligence_Engine