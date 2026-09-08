---
source_file: "server/src/entities/ramesh/engine.ts"
type: "code"
community: "Ramesh AI Query Engine"
location: "L547"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Ramesh_AI_Query_Engine
---

# answerWastageReason()

## Connections
- [[answer()]] - `calls` [EXTRACTED]
- [[coverageOf()]] - `calls` [EXTRACTED]
- [[drilldown()_1]] - `calls` [EXTRACTED]
- [[engine.ts]] - `contains` [EXTRACTED]
- [[insufficient()]] - `calls` [EXTRACTED]
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
- [[wastageByReason()]] - `calls` [EXTRACTED]

## Source
**From** `server/src/entities/ramesh/engine.ts` **(starting line 547):**
```typescript
function answerWastageReason(c: Ctx): RameshAnswer {
  if (!coverageOf(c, "wastage")) {
    return missingDataset(c, "wastage", "Wastage reasons live on wastage rows only.");
  }
  const filter: DatasetFilter = { ...c.base, datasetType: "wastage" };
  const rows = wastageByReason(c.base);
  if (rows.length === 0) return noMatch(c, ["wastage"], filter);
  if (rows.every((r) => r.reason === "Not recorded")) {
    return insufficient(
      c,
      "Wastage rows exist for this period, but not one of them carries a reason, so I cannot say why the wastage happened.",
      "The imported wastage source has no reason column. Re-import with the reason/remarks column included and I will rank the causes for you.",
      filter,
      "wastage"
    );
  }
  const totals = totalsFor(filter);
  const top = rows[0];
  const span = spanOf(filter);
  const steps: RameshCalculationStep[] = [
    {
      label: `Wastage quantity by reason (descending), ${rows.length} reason(s)`,
      expression: rows.slice(0, 5).map((r) => `${r.reason} ${qty(r.quantity)}`).join(" > "),
      result: top.reason,
    },
  ];
  if (totals.quantity > 0) {
    steps.push({
      label: "Leading reason's share of wastage",
      expression: `${qty(top.quantity)} ÷ ${qty(totals.quantity)} × 100`,
      result: pct((top.quantity / totals.quantity) * 100),
    });
  }
  return shell(c, {
    answer: `The largest recorded wastage reason for ${rangeLabel(span.from, span.to)}${scopeNote(filter)} is “${top.reason}” at ${units(top.quantity)}.`,
    dataUsed: used(["wastage"], filter, totals.recordCount, span),
    calculation: steps,
    conclusion:
      totals.quantity > 0
        ? `“${top.reason}” accounts for ${pct((top.quantity / totals.quantity) * 100)} of the ${units(totals.quantity)} wasted in this period.`
        : `Grouped over ${totals.recordCount} wastage record(s).`,
    evidence: [
      { datasetType: "wastage", description: `Wastage records with reason “${top.reason}”`, recordCount: top.recordCount, quantity: top.quantity, amount: null },
    ],
    drilldownQuery: drilldown(filter, "wastage"),
  });
}
```

#graphify/code #graphify/EXTRACTED #community/Ramesh_AI_Query_Engine