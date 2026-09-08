---
source_file: "server/src/entities/ramesh/engine.ts"
type: "code"
community: "Ramesh AI Query Engine"
location: "L389"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Ramesh_AI_Query_Engine
---

# answerCompareDates()

## Connections
- [[answer()]] - `calls` [EXTRACTED]
- [[coverageOf()]] - `calls` [EXTRACTED]
- [[dailyTotals()]] - `calls` [EXTRACTED]
- [[drilldown()_1]] - `calls` [EXTRACTED]
- [[engine.ts]] - `contains` [EXTRACTED]
- [[formatBusinessDateLong()]] - `calls` [EXTRACTED]
- [[insufficient()]] - `calls` [EXTRACTED]
- [[missingDataset()]] - `calls` [EXTRACTED]
- [[pct()_1]] - `calls` [EXTRACTED]
- [[shell()]] - `calls` [EXTRACTED]
- [[totalsFor()]] - `calls` [EXTRACTED]
- [[used()]] - `calls` [EXTRACTED]

## Source
**From** `server/src/entities/ramesh/engine.ts` **(starting line 389):**
```typescript
function answerCompareDates(c: Ctx): RameshAnswer {
  const type = c.slots.datasetType ?? "sales";
  if (!coverageOf(c, type)) return missingDataset(c, type, "A date-vs-date comparison needs rows from that dataset.");

  let pair = c.slots.dates ?? [];
  if (pair.length < 2) {
    const daily = dailyTotals({ ...c.base, from: undefined, to: undefined, datasetType: type });
    if (daily.length < 2) {
      return insufficient(
        c,
        "I can only compare two business days when both are loaded, and right now a single business day of that dataset is imported.",
        "Import a second day's report and I'll compare the two day-on-day.",
        c.base,
        type
      );
    }
    pair = [daily[daily.length - 2].businessDate, daily[daily.length - 1].businessDate];
  }
  const [a, b] = [...pair].sort();
  const fa: DatasetFilter = { ...c.base, from: a, to: a, datasetType: type };
  const fb: DatasetFilter = { ...c.base, from: b, to: b, datasetType: type };
  const ta = totalsFor(fa);
  const tb = totalsFor(fb);
  const empty = [ta.recordCount === 0 ? a : null, tb.recordCount === 0 ? b : null].filter(Boolean) as string[];
  if (empty.length > 0) {
    return insufficient(
      c,
      `I have no ${DATASET_LABELS[type].toLowerCase()} records for ${empty.map(formatBusinessDateLong).join(" or ")}, so the comparison would be half-empty — I won't publish a difference against a day I cannot measure.`,
      `Import the ${DATASET_LABELS[type].toLowerCase()} report for ${empty.map(formatBusinessDateLong).join(" and ")} and ask again.`,
      { ...c.base, from: a, to: b },
      type
    );
  }

  const byValue = type === "sales" && (ta.value > 0 || tb.value > 0);
  const va = byValue ? ta.value : ta.quantity;
  const vb = byValue ? tb.value : tb.quantity;
  const fmt = byValue ? money : units;
  const diff = vb - va;
  const changePct = va !== 0 ? (diff / va) * 100 : null;

  const steps: RameshCalculationStep[] = [
    { label: formatBusinessDateLong(a), expression: `sum over ${ta.recordCount} record(s)`, result: fmt(va) },
    { label: formatBusinessDateLong(b), expression: `sum over ${tb.recordCount} record(s)`, result: fmt(vb) },
    { label: "Difference", expression: `${fmt(vb)} − ${fmt(va)}`, result: `${diff >= 0 ? "+" : "−"}${fmt(Math.abs(diff))}` },
  ];
  if (changePct !== null) {
    steps.push({
      label: "Change",
      expression: `(${fmt(vb)} − ${fmt(va)}) ÷ ${fmt(va)} × 100`,
      result: `${changePct >= 0 ? "+" : "−"}${pct(Math.abs(changePct))}`,
    });
  }

  return shell(c, {
    answer: `${DATASET_LABELS[type]} moved from ${fmt(va)} on ${formatBusinessDateLong(a)} to ${fmt(vb)} on ${formatBusinessDateLong(b)}, a ${diff >= 0 ? "rise" : "fall"} of ${fmt(Math.abs(diff))}.`,
    dataUsed: used([type], { ...c.base, from: a, to: b }, ta.recordCount + tb.recordCount, { from: a, to: b }),
    calculation: steps,
    conclusion:
      changePct !== null
        ? `That is a ${changePct >= 0 ? "gain" : "drop"} of ${pct(Math.abs(changePct))} day-on-day.`
        : `The earlier day had nothing to divide by, so no percentage change is shown.`,
    evidence: [
      { datasetType: type, description: `${DATASET_LABELS[type]} records on ${formatBusinessDateLong(a)}`, recordCount: ta.recordCount, quantity: ta.quantity, amount: byValue ? ta.value : null },
      { datasetType: type, description: `${DATASET_LABELS[type]} records on ${formatBusinessDateLong(b)}`, recordCount: tb.recordCount, quantity: tb.quantity, amount: byValue ? tb.value : null },
    ],
    drilldownQuery: drilldown({ ...c.base, from: a, to: b }, type),
  });
}
```

#graphify/code #graphify/EXTRACTED #community/Ramesh_AI_Query_Engine