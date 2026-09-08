---
source_file: "server/src/entities/ramesh/engine.ts"
type: "code"
community: "Ramesh AI Query Engine"
location: "L219"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Ramesh_AI_Query_Engine
---

# answerTotals()

## Connections
- [[answer()]] - `calls` [EXTRACTED]
- [[coverageOf()]] - `calls` [EXTRACTED]
- [[dailyTotals()]] - `calls` [EXTRACTED]
- [[drilldown()_1]] - `calls` [EXTRACTED]
- [[engine.ts]] - `contains` [EXTRACTED]
- [[missingDataset()]] - `calls` [EXTRACTED]
- [[money()_2]] - `indirect_call` [INFERRED]
- [[noMatch()]] - `calls` [EXTRACTED]
- [[qty()]] - `indirect_call` [INFERRED]
- [[rangeLabel()]] - `calls` [EXTRACTED]
- [[scopeNote()]] - `calls` [EXTRACTED]
- [[shell()]] - `calls` [EXTRACTED]
- [[sumExpr()]] - `calls` [EXTRACTED]
- [[totalsFor()]] - `calls` [EXTRACTED]
- [[units()_1]] - `calls` [EXTRACTED]
- [[used()]] - `calls` [EXTRACTED]

## Source
**From** `server/src/entities/ramesh/engine.ts` **(starting line 219):**
```typescript
function answerTotals(c: Ctx, type: DatasetType): RameshAnswer {
  if (!coverageOf(c, type)) {
    return missingDataset(c, type, `A ${DATASET_LABELS[type].toLowerCase()} total can only come from ${DATASET_LABELS[type].toLowerCase()} rows.`);
  }
  const filter: DatasetFilter = { ...c.base, datasetType: type };
  const totals = totalsFor(filter);
  if (totals.recordCount === 0) return noMatch(c, [type], filter);

  const daily = dailyTotals(filter);
  const span = { from: daily[0].businessDate, to: daily[daily.length - 1].businessDate };
  const label = rangeLabel(span.from, span.to);
  const byValue = type === "sales" && totals.value > 0;

  const steps: RameshCalculationStep[] = [];
  if (byValue) {
    steps.push({
      label: `Sales value summed across ${daily.length} business day(s)`,
      expression: sumExpr(daily.map((d) => d.value), money),
      result: money(totals.value),
    });
  }
  steps.push({
    label: `${DATASET_LABELS[type]} quantity summed across ${daily.length} business day(s)`,
    expression: sumExpr(daily.map((d) => d.quantity), qty),
    result: units(totals.quantity),
  });
  if (daily.length > 1) {
    steps.push({
      label: "Average per business day",
      expression: byValue
        ? `${money(totals.value)} ÷ ${daily.length}`
        : `${qty(totals.quantity)} ÷ ${daily.length}`,
      result: byValue ? money(totals.value / daily.length) : units(totals.quantity / daily.length),
    });
  }

  const headline = byValue
    ? `${DATASET_LABELS[type]} for ${label}${scopeNote(filter)} totalled ${money(totals.value)} on ${units(totals.quantity)}.`
    : `${DATASET_LABELS[type]} for ${label}${scopeNote(filter)} totalled ${units(totals.quantity)}.`;

  return shell(c, {
    answer: headline,
    dataUsed: used([type], filter, totals.recordCount, span),
    calculation: steps,
    conclusion:
      daily.length > 1
        ? `Averaged over the ${daily.length} business days with data, that is ${byValue ? money(totals.value / daily.length) : units(totals.quantity / daily.length)} per day.`
        : `Computed from ${totals.recordCount} ${DATASET_LABELS[type].toLowerCase()} record(s) on a single business day.`,
    evidence: [
      {
        datasetType: type,
        description: `${DATASET_LABELS[type]} records for ${label}${scopeNote(filter)}`,
        recordCount: totals.recordCount,
        quantity: totals.quantity,
        amount: byValue ? totals.value : null,
      },
    ],
    drilldownQuery: drilldown(filter, type),
  });
}
```

#graphify/code #graphify/EXTRACTED #community/Ramesh_AI_Query_Engine