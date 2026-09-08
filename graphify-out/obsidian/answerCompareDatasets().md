---
source_file: "server/src/entities/ramesh/engine.ts"
type: "code"
community: "Ramesh AI Query Engine"
location: "L459"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Ramesh_AI_Query_Engine
---

# answerCompareDatasets()

## Connections
- [[answer()]] - `calls` [EXTRACTED]
- [[coverageOf()]] - `calls` [EXTRACTED]
- [[dailyTotals()]] - `calls` [EXTRACTED]
- [[drilldown()_1]] - `calls` [EXTRACTED]
- [[engine.ts]] - `contains` [EXTRACTED]
- [[insufficient()]] - `calls` [EXTRACTED]
- [[noMatch()]] - `calls` [EXTRACTED]
- [[pct()_1]] - `calls` [EXTRACTED]
- [[qty()]] - `calls` [EXTRACTED]
- [[rangeLabel()]] - `calls` [EXTRACTED]
- [[scopeNote()]] - `calls` [EXTRACTED]
- [[shell()]] - `calls` [EXTRACTED]
- [[spanOf()]] - `calls` [EXTRACTED]
- [[totalsFor()]] - `calls` [EXTRACTED]
- [[units()_1]] - `calls` [EXTRACTED]
- [[used()]] - `calls` [EXTRACTED]

## Source
**From** `server/src/entities/ramesh/engine.ts` **(starting line 459):**
```typescript
function answerCompareDatasets(c: Ctx): RameshAnswer {
  const wanted = [...new Set(c.slots.datasetTypes ?? [])];
  const list: DatasetType[] = wanted.length >= 2 ? wanted : ["production", "sales"];
  const missing = list.filter((t) => !coverageOf(c, t));
  if (missing.length > 0) {
    const names = missing.map((t) => DATASET_LABELS[t].toLowerCase()).join(" and ");
    return insufficient(
      c,
      `That comparison needs ${list.map((t) => DATASET_LABELS[t].toLowerCase()).join(" and ")} side by side, and I hold no ${names} records at all.`,
      `Import a ${names} report and the comparison becomes computable — until then I will not estimate the missing side.`,
      c.base
    );
  }

  const rows = list.map((t) => ({ type: t, totals: totalsFor({ ...c.base, datasetType: t }) }));
  const emptyRows = rows.filter((r) => r.totals.recordCount === 0);
  if (emptyRows.length > 0) return noMatch(c, emptyRows.map((r) => r.type), { ...c.base, datasetType: emptyRows[0].type });

  const span = spanOf(c.base);
  const steps: RameshCalculationStep[] = rows.map((r) => ({
    label: `${DATASET_LABELS[r.type]} quantity`,
    expression: `sum over ${r.totals.recordCount} ${DATASET_LABELS[r.type].toLowerCase()} record(s)`,
    result: units(r.totals.quantity),
  }));

  const prod = rows.find((r) => r.type === "production");
  const sale = rows.find((r) => r.type === "sales");
  let conclusion = `Both series are shown in the same units so they can be read against each other directly.`;
  if (prod && sale) {
    // A ratio across dates where only ONE side was imported is arithmetically
    // valid and operationally meaningless -- e.g. 5 days of sales over 1 day of
    // production reads as 2113% sell-through. Restrict the ratio to the business
    // dates where BOTH datasets actually have records, and say so when that
    // differs from the range asked about.
    const prodDates = new Set(dailyTotals({ ...c.base, datasetType: "production" }).map((d) => d.businessDate));
    const saleDates = new Set(dailyTotals({ ...c.base, datasetType: "sales" }).map((d) => d.businessDate));
    const overlap = [...prodDates].filter((d) => saleDates.has(d)).sort();

    if (overlap.length === 0) {
      conclusion =
        `Production and sales never fall on the same business day in this range ` +
        `(production: ${[...prodDates].sort().join(", ") || "none"}; sales: ${[...saleDates].sort().join(", ") || "none"}), ` +
        `so a sell-through ratio would be misleading and I have not computed one.`;
    } else {
      const overlapFrom = overlap[0];
      const overlapTo = overlap[overlap.length - 1];
      const pOver = totalsFor({ ...c.base, datasetType: "production", from: overlapFrom, to: overlapTo });
      const sOver = totalsFor({ ...c.base, datasetType: "sales", from: overlapFrom, to: overlapTo });

      if (pOver.quantity > 0) {
        const sellThrough = (sOver.quantity / pOver.quantity) * 100;
        const sameSpan = overlapFrom === span.from && overlapTo === span.to && overlap.length === prodDates.size && overlap.length === saleDates.size;
        steps.push({
          label: sameSpan ? "Sell-through" : `Sell-through (over the ${overlap.length} business day(s) both datasets cover)`,
          expression: `${qty(sOver.quantity)} ÷ ${qty(pOver.quantity)} × 100`,
          result: pct(sellThrough),
        });
        conclusion = sameSpan
          ? `Sell-through for ${rangeLabel(span.from, span.to)} is ${pct(sellThrough)} of everything produced.`
          : `Sell-through is ${pct(sellThrough)}, computed only over ${rangeLabel(overlapFrom, overlapTo)} — the ${overlap.length} business day(s) with both production and sales on file. The wider totals above cover different date spans, so dividing them directly would overstate the ratio.`;
      }
    }
  } else if (rows.length >= 2) {
    const d = rows[0].totals.quantity - rows[1].totals.quantity;
    steps.push({
      label: `${DATASET_LABELS[rows[0].type]} minus ${DATASET_LABELS[rows[1].type]}`,
      expression: `${qty(rows[0].totals.quantity)} − ${qty(rows[1].totals.quantity)}`,
      result: units(d),
    });
    conclusion = `The gap between the two series is ${units(Math.abs(d))}.`;
  }

  return shell(c, {
    answer: `For ${rangeLabel(span.from, span.to)}${scopeNote(c.base)}: ${rows.map((r) => `${DATASET_LABELS[r.type].toLowerCase()} ${units(r.totals.quantity)}`).join(", ")}.`,
    dataUsed: used(list, c.base, rows.reduce((s, r) => s + r.totals.recordCount, 0), span),
    calculation: steps,
    conclusion,
    evidence: rows.map((r) => ({
      datasetType: r.type,
      description: `${DATASET_LABELS[r.type]} records for ${rangeLabel(span.from, span.to)}${scopeNote(c.base)}`,
      recordCount: r.totals.recordCount,
      quantity: r.totals.quantity,
      amount: r.type === "sales" ? r.totals.value : null,
    })),
    drilldownQuery: drilldown(c.base),
  });
}
```

#graphify/code #graphify/EXTRACTED #community/Ramesh_AI_Query_Engine