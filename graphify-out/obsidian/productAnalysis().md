---
source_file: "server/src/entities/ramesh/analysis.ts"
type: "code"
community: "Ramesh AI Query Engine"
location: "L469"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Ramesh_AI_Query_Engine
---

# productAnalysis()

## Connections
- [[analysis.ts]] - `contains` [EXTRACTED]
- [[answer()]] - `calls` [EXTRACTED]
- [[coverageEvidence()]] - `calls` [EXTRACTED]
- [[dailyTotals()]] - `calls` [EXTRACTED]
- [[engine.ts]] - `imports` [EXTRACTED]
- [[pct()]] - `calls` [EXTRACTED]
- [[productPerformance()]] - `calls` [EXTRACTED]
- [[units()]] - `calls` [EXTRACTED]

## Source
**From** `server/src/entities/ramesh/analysis.ts` **(starting line 469):**
```typescript
export function productAnalysis(filter: DatasetFilter, focus: "overproduced" | "wastage" | "revenue"): AnalysisResult {
  const perf = productPerformance(filter, 200);
  const cov = coverageEvidence(filter);

  if (perf.length === 0) {
    return {
      answer: "No product records in this scope.",
      calculation: [],
      insights: [],
      conclusion: "Import a report covering this period.",
      evidence: [],
      datasets: [],
      recordCount: 0,
      insufficientData: true,
    };
  }

  if (focus === "overproduced") {
    // Overproduction is only measurable on business dates that actually HAVE
    // production records. Aggregating sales from days with no production makes
    // every product look under-produced and hides real overproduction.
    const prodDates = dailyTotals({ ...filter, datasetType: "production" }).map((d) => d.businessDate).sort();
    if (prodDates.length === 0) {
      return {
        answer: "I can't name overproduced products because no production records exist in this scope.",
        calculation: [],
        insights: [],
        conclusion: "Overproduction compares production against sales and wastage for the same product and business date.",
        evidence: cov.evidence,
        datasets: cov.datasets,
        recordCount: cov.recordCount,
        insufficientData: true,
      };
    }
    const scoped: DatasetFilter = { ...filter, from: prodDates[0], to: prodDates[prodDates.length - 1] };
    const perfScoped = productPerformance(scoped, 200);
    const candidates = perfScoped.filter((p) => p.productionQty > 0 && p.variancePct != null && p.variancePct > 0).sort((a, b) => (b.variancePct ?? 0) - (a.variancePct ?? 0));
    if (candidates.length === 0) {
      const why = perf.every((p) => p.productionQty === 0)
        ? "no production records exist in this scope, so over- and under-production cannot be measured"
        : "no product produced more than it sold and wasted";
      return {
        answer: `I can't name overproduced products: ${why}.`,
        calculation: [],
        insights: [],
        conclusion: "Overproduction needs production and demand for the same product and business date.",
        evidence: cov.evidence,
        datasets: cov.datasets,
        recordCount: cov.recordCount,
        insufficientData: true,
      };
    }
    const calculation: RameshCalculationStep[] = candidates.slice(0, 5).map((p) => ({
      label: p.product,
      expression: `(${p.productionQty.toLocaleString("en-IN")} produced − ${p.salesQty.toLocaleString("en-IN")} sold − ${p.wastageQty.toLocaleString("en-IN")} wasted) ÷ ${p.productionQty.toLocaleString("en-IN")} × 100`,
      result: pct(p.variancePct ?? 0),
    }));
    const insights = candidates.slice(0, 5).map((p, n) => ({
      rank: n + 1,
      severity: (p.variancePct ?? 0) >= 40 ? "high" : (p.variancePct ?? 0) >= 20 ? "medium" : "low",
      category: "production",
      headline: `${p.product} produced ${units(p.productionQty - p.salesQty - p.wastageQty)} more than was sold or wasted`,
      magnitude: `${pct(p.variancePct ?? 0)} of its production went unaccounted for`,
      scope: [filter.from, filter.to].filter(Boolean).join(" → ") || "all imported dates",
      impact: `${units(p.productionQty - p.salesQty - p.wastageQty)} of ${p.product} unaccounted for.`,
      action: `Bring ${p.product} batching toward the ${units(p.salesQty + p.wastageQty)} actually consumed.`,
      evidence: cov.evidence,
      drilldownQuery: { product: p.product, ...(filter.from ? { from: filter.from } : {}), ...(filter.to ? { to: filter.to } : {}) },
    })) as RameshInsightLine[];

    return {
      answer: `${candidates.length} product(s) produced more than they sold and wasted. The largest gap is ${candidates[0].product} at ${pct(candidates[0].variancePct ?? 0)} of its production.`,
      calculation,
      insights,
      conclusion: `Ranked by unaccounted share of production, computed per product from production, sales and wastage on the same business dates.`,
      evidence: cov.evidence,
      datasets: cov.datasets,
      recordCount: cov.recordCount,
      insufficientData: false,
    };
  }

  const key = focus === "wastage" ? (p: (typeof perf)[number]) => p.wastageQty : (p: (typeof perf)[number]) => p.salesValue;
  const ranked = perf.filter((p) => key(p) > 0).sort((a, b) => key(b) - key(a));
  if (ranked.length === 0) {
    return {
      answer: `No ${focus} figures in this scope.`,
      calculation: [],
      insights: [],
      conclusion: `Import ${focus === "wastage" ? "wastage" : "sales"} data for this period.`,
      evidence: cov.evidence,
      datasets: cov.datasets,
      recordCount: cov.recordCount,
      insufficientData: true,
    };
  }
  const total = ranked.reduce((s, p) => s + key(p), 0);
  const fmt = focus === "wastage" ? units : money;
  return {
    answer: `${ranked[0].product} leads on ${focus} at ${fmt(key(ranked[0]))}, ${pct((key(ranked[0]) / total) * 100)} of the total.`,
    calculation: ranked.slice(0, 5).map((p) => ({
      label: p.product,
      expression: `${fmt(key(p))} ÷ ${fmt(total)} × 100`,
      result: pct((key(p) / total) * 100),
    })),
    insights: ranked.slice(0, 3).map((p, n) => ({
      rank: n + 1,
      severity: n === 0 ? "medium" : "low",
      category: "product",
      headline: `${p.product}: ${fmt(key(p))} of ${focus}`,
      magnitude: `${pct((key(p) / total) * 100)} of the ${focus} total`,
      scope: [filter.from, filter.to].filter(Boolean).join(" → ") || "all imported dates",
      impact: `${fmt(key(p))} attributable to this one product.`,
      action: `Review ${p.product} first — it carries the largest share.`,
      evidence: cov.evidence,
      drilldownQuery: { product: p.product, ...(filter.from ? { from: filter.from } : {}), ...(filter.to ? { to: filter.to } : {}) },
    })) as RameshInsightLine[],
    conclusion: `Ranked across ${ranked.length} product(s) with non-zero ${focus}.`,
    evidence: cov.evidence,
    datasets: cov.datasets,
    recordCount: cov.recordCount,
    insufficientData: false,
  };
}
```

#graphify/code #graphify/EXTRACTED #community/Ramesh_AI_Query_Engine