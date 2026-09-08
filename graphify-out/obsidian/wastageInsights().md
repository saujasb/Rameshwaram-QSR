---
source_file: "server/src/entities/intelligence/insights.ts"
type: "code"
community: "Business Intelligence Engine"
location: "L262"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Business_Intelligence_Engine
---

# wastageInsights()

## Connections
- [[buildInsights()]] - `calls` [EXTRACTED]
- [[compact()]] - `calls` [EXTRACTED]
- [[drill()]] - `calls` [EXTRACTED]
- [[evidenceFor()]] - `calls` [EXTRACTED]
- [[insights.ts]] - `contains` [EXTRACTED]
- [[pctText()]] - `calls` [EXTRACTED]
- [[qtyText()]] - `calls` [EXTRACTED]
- [[share()]] - `calls` [EXTRACTED]
- [[totalsFor()]] - `calls` [EXTRACTED]
- [[wastageByReason()]] - `calls` [EXTRACTED]

## Source
**From** `server/src/entities/intelligence/insights.ts` **(starting line 262):**
```typescript
function wastageInsights(
  filter: DatasetFilter,
  win: Window,
  where: string,
  products: ProductPerformanceRow[]
): Insight[] {
  const totals = totalsFor({ ...filter, datasetType: "wastage" });
  if (totals.recordCount === 0) return []; // no wastage imports -> no wastage claims

  const out: Insight[] = [];
  const reasons = wastageByReason(filter).filter((r) => r.quantity > 0);
  if (reasons.length > 0) {
    const top = reasons[0];
    const pct = share(top.quantity, totals.quantity);
    out.push({
      id: `wastage-reason:${win.from}:${win.to}`,
      category: "wastage",
      severity: pct !== null && pct >= 50 ? "medium" : "info",
      what: `"${top.reason}" is the largest recorded wastage reason`,
      howMuch: `${qtyText(top.quantity)} units across ${top.recordCount} wastage record(s)`,
      when: win.label,
      where,
      product: null,
      impact:
        pct === null
          ? `${qtyText(top.quantity)} units of recorded wastage`
          : `${pctText(pct)} of the ${qtyText(totals.quantity)} units of wastage imported for the period`,
      action: `Attack "${top.reason}" first: it is ${pct === null ? "the largest" : pctText(pct)} of imported wastage. The ${top.recordCount} record(s) behind it are listed in the Data Explorer for the exact items and dates.`,
      evidence: compact([evidenceFor(filter, "wastage", win.from, win.to, null, `Wastage records between ${win.from} and ${win.to}`)]),
      drilldownQuery: drill(filter, { from: win.from, to: win.to, datasetType: "wastage" }),
      score: 70,
    });
  }

  const wasted = products.filter((p) => p.wastageQty > 0).sort((a, b) => b.wastageQty - a.wastageQty);
  if (wasted.length > 0) {
    const top = wasted[0];
    const pct = share(top.wastageQty, totals.quantity);
    out.push({
      id: `wastage-product:${win.from}:${win.to}`,
      category: "wastage",
      severity: top.wastagePct !== null && top.wastagePct >= 10 ? "medium" : "info",
      what: `${top.product} accounts for more recorded wastage than any other item`,
      howMuch: `${qtyText(top.wastageQty)} units wasted${top.productionQty > 0 ? ` against ${qtyText(top.productionQty)} produced` : ""}`,
      when: win.label,
      where,
      product: top.product,
      impact:
        top.wastagePct !== null
          ? `${pctText(top.wastagePct)} of ${top.product} production was wasted`
          : `${pct === null ? qtyText(top.wastageQty) + " units" : pctText(pct)} of the period's imported wastage`,
      action:
        top.productionQty > 0
          ? `Cut ${top.product} production toward the ${qtyText(top.salesQty)} units actually sold; ${qtyText(top.wastageQty)} of ${qtyText(top.productionQty)} produced units were recorded as waste.`
          : `Import production for ${top.product} -- ${qtyText(top.wastageQty)} units of waste are recorded but the produced quantity is not, so the waste rate cannot be computed.`,
      evidence: compact([
        evidenceFor(filter, "wastage", win.from, win.to, top.product, `Wastage records for ${top.product} between ${win.from} and ${win.to}`),
      ]),
      drilldownQuery: drill(filter, { from: win.from, to: win.to, datasetType: "wastage", product: top.product }),
      score: 68,
    });
  }

  return out;
}
```

#graphify/code #graphify/EXTRACTED #community/Business_Intelligence_Engine