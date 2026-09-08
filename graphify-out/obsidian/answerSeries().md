---
source_file: "server/src/entities/ramesh/engine.ts"
type: "code"
community: "Ramesh AI Query Engine"
location: "L631"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Ramesh_AI_Query_Engine
---

# answerSeries()

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
- [[scopeNote()]] - `calls` [EXTRACTED]
- [[shell()]] - `calls` [EXTRACTED]
- [[totalsFor()]] - `calls` [EXTRACTED]
- [[used()]] - `calls` [EXTRACTED]

## Source
**From** `server/src/entities/ramesh/engine.ts` **(starting line 631):**
```typescript
function answerSeries(c: Ctx, mode: "trend" | "anomaly"): RameshAnswer {
  const type = c.slots.datasetType ?? "sales";
  if (!coverageOf(c, type)) return missingDataset(c, type, `A ${mode === "trend" ? "trend" : "baseline"} needs rows from that dataset.`);

  const history = dailyTotals({ ...c.base, from: undefined, to: undefined, datasetType: type });
  if (history.length < 2) {
    return insufficient(
      c,
      mode === "trend"
        ? "A trend needs more than a single business day, and only one business day of that dataset is imported."
        : "Calling a day unusual means comparing it with prior days, and only one business day of that dataset is imported.",
      "Import at least one more business day's report and this becomes computable.",
      { ...c.base, datasetType: type },
      type
    );
  }

  const byValue = type === "sales" && history.some((d) => d.value > 0);
  const val = (d: { quantity: number; value: number }) => (byValue ? d.value : d.quantity);
  const fmt = byValue ? money : units;

  if (mode === "trend") {
    const windowed = c.base.from || c.base.to ? dailyTotals({ ...c.base, datasetType: type }) : history;
    const series = windowed.length >= 2 ? windowed : history;
    const first = series[0];
    const last = series[series.length - 1];
    const diff = val(last) - val(first);
    const changePct = val(first) !== 0 ? (diff / val(first)) * 100 : null;
    const totals = totalsFor({ ...c.base, from: series[0].businessDate, to: last.businessDate, datasetType: type });
    const steps: RameshCalculationStep[] = [
      { label: `Daily ${byValue ? "value" : "quantity"} series, ${series.length} business day(s)`, expression: series.map((d) => `${d.businessDate} ${fmt(val(d))}`).join(" → "), result: `${fmt(val(first))} → ${fmt(val(last))}` },
      { label: "Change across the window", expression: `${fmt(val(last))} − ${fmt(val(first))}`, result: `${diff >= 0 ? "+" : "−"}${fmt(Math.abs(diff))}` },
    ];
    if (changePct !== null) {
      steps.push({ label: "Change %", expression: `(${fmt(val(last))} − ${fmt(val(first))}) ÷ ${fmt(val(first))} × 100`, result: `${changePct >= 0 ? "+" : "−"}${pct(Math.abs(changePct))}` });
    }
    return shell(c, {
      answer: `${DATASET_LABELS[type]} went from ${fmt(val(first))} on ${formatBusinessDateLong(first.businessDate)} to ${fmt(val(last))} on ${formatBusinessDateLong(last.businessDate)}${scopeNote(c.base)}.`,
      dataUsed: used([type], c.base, totals.recordCount, { from: series[0].businessDate, to: last.businessDate }),
      calculation: steps,
      conclusion: changePct === null ? `The first day in the window was zero, so no percentage change is shown.` : `Over ${series.length} business days the direction is ${diff >= 0 ? "up" : "down"} by ${pct(Math.abs(changePct))}.`,
      evidence: [{ datasetType: type, description: `${DATASET_LABELS[type]} records across ${series.length} business day(s)`, recordCount: totals.recordCount, quantity: totals.quantity, amount: byValue ? totals.value : null }],
      drilldownQuery: drilldown({ ...c.base, from: series[0].businessDate, to: last.businessDate }, type),
    });
  }

  // anomaly: compare one day against the mean of the days before it
  const targetKey = c.slots.from && history.some((d) => d.businessDate === c.slots.from) ? c.slots.from : history[history.length - 1].businessDate;
  const idx = history.findIndex((d) => d.businessDate === targetKey);
  const prior = history.slice(Math.max(0, idx - 7), idx);
  if (prior.length === 0) {
    return insufficient(
      c,
      `${formatBusinessDateLong(targetKey)} is the earliest business day I hold for that dataset, so there is no prior day to compare it against.`,
      "Import an earlier business day's report and I can judge whether this one is unusual.",
      { ...c.base, datasetType: type },
      type
    );
  }
  const target = history[idx];
  const mean = prior.reduce((s, d) => s + val(d), 0) / prior.length;
  const diff = val(target) - mean;
  const devPct = mean !== 0 ? (diff / mean) * 100 : null;
  const totals = totalsFor({ ...c.base, from: targetKey, to: targetKey, datasetType: type });

  const steps: RameshCalculationStep[] = [
    { label: `Baseline: mean of the ${prior.length} prior business day(s)`, expression: `(${prior.map((d) => fmt(val(d))).join(" + ")}) ÷ ${prior.length}`, result: fmt(mean) },
    { label: formatBusinessDateLong(targetKey), expression: `sum over ${totals.recordCount} record(s)`, result: fmt(val(target)) },
    { label: "Deviation from baseline", expression: `${fmt(val(target))} − ${fmt(mean)}`, result: `${diff >= 0 ? "+" : "−"}${fmt(Math.abs(diff))}` },
  ];
  if (devPct !== null) {
    steps.push({ label: "Deviation %", expression: `(${fmt(val(target))} − ${fmt(mean)}) ÷ ${fmt(mean)} × 100`, result: `${devPct >= 0 ? "+" : "−"}${pct(Math.abs(devPct))}` });
  }
  return shell(c, {
    answer: `${formatBusinessDateLong(targetKey)} recorded ${fmt(val(target))} of ${DATASET_LABELS[type].toLowerCase()} against a ${prior.length}-day baseline of ${fmt(mean)}${scopeNote(c.base)}.`,
    dataUsed: used([type], { ...c.base, from: targetKey, to: targetKey }, totals.recordCount, { from: prior[0].businessDate, to: targetKey }),
    calculation: steps,
    conclusion:
      devPct === null
        ? `The baseline was zero, so no deviation percentage is shown.`
        : Math.abs(devPct) >= 20
          ? `That is ${pct(Math.abs(devPct))} ${devPct >= 0 ? "above" : "below"} the baseline — large enough to be worth investigating.`
          : `That is ${pct(Math.abs(devPct))} ${devPct >= 0 ? "above" : "below"} the baseline, which is within normal day-to-day movement.`,
    evidence: [
      { datasetType: type, description: `${DATASET_LABELS[type]} records on ${formatBusinessDateLong(targetKey)}`, recordCount: totals.recordCount, quantity: totals.quantity, amount: byValue ? totals.value : null },
    ],
    drilldownQuery: drilldown({ ...c.base, from: targetKey, to: targetKey }, type),
  });
}
```

#graphify/code #graphify/EXTRACTED #community/Ramesh_AI_Query_Engine