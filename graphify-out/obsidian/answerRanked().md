---
source_file: "server/src/entities/ramesh/engine.ts"
type: "code"
community: "Ramesh AI Query Engine"
location: "L280"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Ramesh_AI_Query_Engine
---

# answerRanked()

## Connections
- [[answer()]] - `calls` [EXTRACTED]
- [[coverageOf()]] - `calls` [EXTRACTED]
- [[drilldown()_1]] - `calls` [EXTRACTED]
- [[engine.ts]] - `contains` [EXTRACTED]
- [[missingDataset()]] - `calls` [EXTRACTED]
- [[noMatch()]] - `calls` [EXTRACTED]
- [[pct()_1]] - `calls` [EXTRACTED]
- [[rangeLabel()]] - `calls` [EXTRACTED]
- [[scopeNote()]] - `calls` [EXTRACTED]
- [[shell()]] - `calls` [EXTRACTED]
- [[spanOf()]] - `calls` [EXTRACTED]
- [[topProducts()]] - `calls` [EXTRACTED]
- [[totalsFor()]] - `calls` [EXTRACTED]
- [[used()]] - `calls` [EXTRACTED]

## Source
**From** `server/src/entities/ramesh/engine.ts` **(starting line 280):**
```typescript
function answerRanked(c: Ctx, type: DatasetType, direction: "highest" | "lowest"): RameshAnswer {
  if (!coverageOf(c, type)) {
    return missingDataset(c, type, `Ranking products by ${DATASET_LABELS[type].toLowerCase()} needs ${DATASET_LABELS[type].toLowerCase()} rows.`);
  }
  const filter: DatasetFilter = { ...c.base, datasetType: type, product: undefined };
  const rows = topProducts(filter, 5, direction === "lowest" ? "asc" : "desc");
  if (rows.length === 0) return noMatch(c, [type], filter);

  const totals = totalsFor(filter);
  const byValue = type === "sales" && totals.value > 0;
  const measure = (r: { quantity: number; value: number }) => (byValue ? r.value : r.quantity);
  const fmt = byValue ? money : units;
  const winner = rows[0];
  const span = spanOf(filter);
  const label = rangeLabel(span.from, span.to);

  const steps: RameshCalculationStep[] = [
    {
      label: `Products ranked by ${byValue ? "sales value" : `${DATASET_LABELS[type].toLowerCase()} quantity`} (${direction === "lowest" ? "ascending" : "descending"}), top ${rows.length}`,
      expression: rows.map((r) => `${r.product} ${fmt(measure(r))}`).join(direction === "lowest" ? " < " : " > "),
      result: winner.product,
    },
  ];
  const denom = byValue ? totals.value : totals.quantity;
  if (denom > 0) {
    steps.push({
      label: `Share of the ${DATASET_LABELS[type].toLowerCase()} total`,
      expression: `${fmt(measure(winner))} ÷ ${fmt(denom)} × 100`,
      result: pct((measure(winner) / denom) * 100),
    });
  }

  return shell(c, {
    answer: `${winner.product} had the ${direction} ${DATASET_LABELS[type].toLowerCase()} ${byValue ? "value" : "quantity"} for ${label}${scopeNote(filter)} at ${fmt(measure(winner))}.`,
    dataUsed: used([type], filter, totals.recordCount, span),
    calculation: steps,
    conclusion:
      denom > 0
        ? `That is ${pct((measure(winner) / denom) * 100)} of the ${fmt(denom)} ${DATASET_LABELS[type].toLowerCase()} total for the same period.`
        : `Ranked over ${totals.recordCount} ${DATASET_LABELS[type].toLowerCase()} record(s).`,
    evidence: [
      {
        datasetType: type,
        description: `${DATASET_LABELS[type]} records for ${winner.product} in ${label}`,
        recordCount: totals.recordCount,
        quantity: winner.quantity,
        amount: byValue ? winner.value : null,
      },
    ],
    drilldownQuery: drilldown({ ...filter, product: winner.product }, type),
  });
}
```

#graphify/code #graphify/EXTRACTED #community/Ramesh_AI_Query_Engine