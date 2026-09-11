---
source_file: "server/src/entities/ramesh/analysis.ts"
type: "code"
community: "Ramesh AI Query Engine"
location: "L690"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Ramesh_AI_Query_Engine
---

# changeAnalysis()

## Connections
- [[analysis.ts]] - `contains` [EXTRACTED]
- [[coverageEvidence()]] - `calls` [EXTRACTED]
- [[engine.ts]] - `imports` [EXTRACTED]
- [[formatBusinessDateLong()]] - `calls` [EXTRACTED]
- [[totalsFor()]] - `calls` [EXTRACTED]

## Source
**From** `server/src/entities/ramesh/analysis.ts` **(starting line 690):**
```typescript
export function changeAnalysis(current: string, previous: string, filter: DatasetFilter): AnalysisResult {
  const cov = coverageEvidence({ ...filter, from: previous, to: current });
  const calculation: RameshCalculationStep[] = [];
  const insights: RameshInsightLine[] = [];
  let rank = 1;
  let any = false;

  for (const t of ["sales", "production", "wastage"] as DatasetType[]) {
    const now = totalsFor({ ...filter, datasetType: t, from: current, to: current });
    const then = totalsFor({ ...filter, datasetType: t, from: previous, to: previous });
    if (now.recordCount === 0 && then.recordCount === 0) continue;
    if (then.recordCount === 0 || now.recordCount === 0) {
      calculation.push({
        label: `${DATASET_LABELS[t]} comparison`,
        expression: `${now.recordCount} record(s) on ${current} vs ${then.recordCount} on ${previous}`,
        result: "not comparable — one side has no data",
      });
      continue;
    }
    any = true;
    const useValue = t === "sales";
    const a = useValue ? now.value : now.quantity;
    const b = useValue ? then.value : then.quantity;
    const deltaPct = b !== 0 ? ((a - b) / b) * 100 : null;
    const fmt = useValue ? money : units;
    calculation.push({
      label: `${DATASET_LABELS[t]} change`,
      expression: `(${fmt(a)} − ${fmt(b)}) ÷ ${fmt(b)} × 100`,
      result: deltaPct != null ? `${deltaPct >= 0 ? "+" : ""}${deltaPct.toFixed(1)}%` : "baseline is zero",
    });
    if (deltaPct != null && Math.abs(deltaPct) >= 5) {
      insights.push({
        rank: rank++,
        severity: Math.abs(deltaPct) >= 25 ? "high" : "medium",
        category: t,
        headline: `${DATASET_LABELS[t]} ${deltaPct >= 0 ? "rose" : "fell"} ${Math.abs(deltaPct).toFixed(1)}% versus ${formatBusinessDateLong(previous)}`,
        magnitude: `${fmt(b)} → ${fmt(a)}`,
        scope: `${formatBusinessDateLong(previous)} → ${formatBusinessDateLong(current)}`,
        impact: `${deltaPct >= 0 ? "+" : ""}${fmt(a - b)} day over day.`,
        action: `Confirm whether the ${DATASET_LABELS[t].toLowerCase()} shift was planned before reacting to it.`,
        evidence: cov.evidence,
        drilldownQuery: { datasetType: t, from: previous, to: current },
      });
    }
  }

  if (!any) {
    return {
      answer: `I can't compare ${formatBusinessDateLong(current)} with ${formatBusinessDateLong(previous)} — no dataset has records on both days.`,
      calculation,
      insights: [],
      conclusion: "Historical comparison needs the same dataset present on both business dates.",
      evidence: cov.evidence,
      datasets: cov.datasets,
      recordCount: cov.recordCount,
      insufficientData: true,
    };
  }

  return {
    answer: insights.length
      ? `Comparing ${formatBusinessDateLong(current)} with ${formatBusinessDateLong(previous)}: ${insights.map((i) => i.headline.toLowerCase()).join("; ")}.`
      : `${formatBusinessDateLong(current)} is within 5% of ${formatBusinessDateLong(previous)} on every dataset that has records on both days.`,
    calculation,
    insights,
    conclusion: insights.length
      ? `Movements above 5% are listed; each is computed from the two days' own totals.`
      : `No dataset moved more than 5%.`,
    evidence: cov.evidence,
    datasets: cov.datasets,
    recordCount: cov.recordCount,
    insufficientData: false,
  };
}
```

#graphify/code #graphify/EXTRACTED #community/Ramesh_AI_Query_Engine