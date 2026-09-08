---
source_file: "server/src/entities/ramesh/engine.ts"
type: "code"
community: "Ramesh AI Query Engine"
location: "L595"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Ramesh_AI_Query_Engine
---

# answerVariance()

## Connections
- [[answer()]] - `calls` [EXTRACTED]
- [[coverageOf()]] - `calls` [EXTRACTED]
- [[drilldown()_1]] - `calls` [EXTRACTED]
- [[engine.ts]] - `contains` [EXTRACTED]
- [[missingDataset()]] - `calls` [EXTRACTED]
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
**From** `server/src/entities/ramesh/engine.ts` **(starting line 595):**
```typescript
function answerVariance(c: Ctx): RameshAnswer {
  if (!coverageOf(c, "production")) {
    return missingDataset(c, "production", "Variance is production minus sales minus wastage, so production rows are mandatory.");
  }
  const p = totalsFor({ ...c.base, datasetType: "production" });
  if (p.recordCount === 0) return noMatch(c, ["production"], { ...c.base, datasetType: "production" });
  const s = totalsFor({ ...c.base, datasetType: "sales" });
  const w = totalsFor({ ...c.base, datasetType: "wastage" });
  const variance = p.quantity - s.quantity - w.quantity;
  const span = spanOf(c.base);

  const steps: RameshCalculationStep[] = [
    { label: "Unaccounted quantity", expression: `${qty(p.quantity)} produced − ${qty(s.quantity)} sold − ${qty(w.quantity)} wasted`, result: units(variance) },
  ];
  if (p.quantity > 0) {
    steps.push({ label: "Variance %", expression: `${qty(variance)} ÷ ${qty(p.quantity)} × 100`, result: pct((variance / p.quantity) * 100) });
    steps.push({ label: "Sell-through %", expression: `${qty(s.quantity)} ÷ ${qty(p.quantity)} × 100`, result: pct((s.quantity / p.quantity) * 100) });
  }

  return shell(c, {
    answer: `For ${rangeLabel(span.from, span.to)}${scopeNote(c.base)}, ${units(variance)} of production is unaccounted for after sales and wastage.`,
    dataUsed: used(["production", "sales", "wastage"], c.base, p.recordCount + s.recordCount + w.recordCount, span),
    calculation: steps,
    conclusion:
      p.quantity > 0
        ? `That is ${pct((variance / p.quantity) * 100)} of the ${units(p.quantity)} produced; sell-through was ${pct((s.quantity / p.quantity) * 100)}.`
        : `Production quantity was zero in this period, so no percentage is shown.`,
    evidence: [
      { datasetType: "production", description: "Production records in range", recordCount: p.recordCount, quantity: p.quantity, amount: null },
      { datasetType: "sales", description: "Sales records in range", recordCount: s.recordCount, quantity: s.quantity, amount: s.value },
      { datasetType: "wastage", description: "Wastage records in range", recordCount: w.recordCount, quantity: w.quantity, amount: null },
    ],
    drilldownQuery: drilldown(c.base),
  });
}
```

#graphify/code #graphify/EXTRACTED #community/Ramesh_AI_Query_Engine