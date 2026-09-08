---
source_file: "server/src/entities/ramesh/engine.ts"
type: "code"
community: "Ramesh AI Query Engine"
location: "L777"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Ramesh_AI_Query_Engine
---

# answer()

## Connections
- [[anomalyAnalysis()]] - `calls` [EXTRACTED]
- [[answerCompareDatasets()]] - `calls` [EXTRACTED]
- [[answerCompareDates()]] - `calls` [EXTRACTED]
- [[answerCoverage()]] - `calls` [EXTRACTED]
- [[answerHelp()]] - `calls` [EXTRACTED]
- [[answerPeakHour()]] - `calls` [EXTRACTED]
- [[answerRanked()]] - `calls` [EXTRACTED]
- [[answerSeries()]] - `calls` [EXTRACTED]
- [[answerTotals()]] - `calls` [EXTRACTED]
- [[answerUnsupported()]] - `calls` [EXTRACTED]
- [[answerVariance()]] - `calls` [EXTRACTED]
- [[answerWastageReason()]] - `calls` [EXTRACTED]
- [[buildSuggestions()]] - `calls` [EXTRACTED]
- [[classify()]] - `calls` [EXTRACTED]
- [[datasetCoverage()]] - `calls` [EXTRACTED]
- [[distinctValues()]] - `calls` [EXTRACTED]
- [[efficiencyAnalysis()]] - `calls` [EXTRACTED]
- [[engine.ts]] - `contains` [EXTRACTED]
- [[executiveAnalysis()]] - `calls` [EXTRACTED]
- [[fromAnalysis()]] - `calls` [EXTRACTED]
- [[getBusinessDayStartHour()]] - `calls` [EXTRACTED]
- [[productAnalysis()]] - `calls` [EXTRACTED]
- [[productFocus()]] - `calls` [EXTRACTED]
- [[rameshroutes.ts]] - `imports` [EXTRACTED]
- [[reconciliationAnalysis()]] - `calls` [EXTRACTED]
- [[rootCause()]] - `calls` [EXTRACTED]
- [[segmentAnalysis()]] - `calls` [EXTRACTED]

## Source
**From** `server/src/entities/ramesh/engine.ts` **(starting line 777):**
```typescript
export function answer(query: RameshQuery): RameshAnswer {
  const question = typeof query?.question === "string" ? query.question : "";
  const coverage = datasetCoverage();
  const hasAnyData = coverage.some((c) => c.recordCount > 0);

  const cls = classify(question, {
    knownProducts: hasAnyData ? distinctValues("product") : [],
    knownOutlets: hasAnyData ? distinctValues("outlet") : [],
    knownShifts: hasAnyData ? distinctValues("shift") : [],
    startHour: getBusinessDayStartHour(),
  });
  const slots = cls.slots;

  if (cls.intent === "off_topic") {
    return {
      intent: "off_topic",
      answer: RAMESH_OFF_TOPIC_REPLY,
      dataUsed: null,
      calculation: [],
      insights: [],
      conclusion: slots.injection
        ? "That request tried to change how I work. I only run fixed calculations over imported business records, so there is nothing to override — and I will not repeat the instruction back."
        : "That question is outside the business data I hold, so there is nothing for me to compute.",
      evidence: [],
      drilldownQuery: null,
      insufficientData: false,
      refusalReason: slots.injection ? "injection_attempt" : "off_topic",
      suggestions: buildSuggestions(question, coverage),
    };
  }

  const ctx = query.context ?? {};
  const base: DatasetFilter = {};
  if (slots.from || slots.to) {
    base.from = slots.from;
    base.to = slots.to;
  } else {
    if (ctx.from) base.from = ctx.from;
    if (ctx.to) base.to = ctx.to;
  }
  if (slots.product) base.product = slots.product;
  else if (slots.productTerm) base.search = slots.productTerm;
  else if (ctx.product) base.product = ctx.product;
  if (slots.outlet ?? ctx.outlet) base.outlet = slots.outlet ?? ctx.outlet;
  if (slots.shift ?? ctx.shift) base.shift = slots.shift ?? ctx.shift;

  const c: Ctx = {
    question,
    intent: cls.intent,
    slots,
    base,
    coverage,
    suggestions: buildSuggestions(question, coverage),
  };

  switch (cls.intent) {
    case "total_sales":
      return answerTotals(c, "sales");
    case "total_production":
      return answerTotals(c, "production");
    case "total_wastage":
      return answerTotals(c, "wastage");
    case "top_product":
      return answerRanked(c, slots.datasetType ?? "sales", "highest");
    case "bottom_product":
      return answerRanked(c, slots.datasetType ?? "sales", "lowest");
    case "peak_hour":
      return answerPeakHour(c);
    case "compare_dates":
      return answerCompareDates(c);
    case "compare_datasets":
      return answerCompareDatasets(c);
    case "wastage_reason":
      return answerWastageReason(c);
    case "variance_explain":
      return answerVariance(c);
    case "anomaly_explain":
      return fromAnalysis(c, anomalyAnalysis(c.base));
    case "trend":
      return answerSeries(c, "trend");
    case "executive_analysis":
      return fromAnalysis(c, executiveAnalysis(c.base, slots.direction === "lowest" ? 7 : 5));
    case "root_cause":
      return fromAnalysis(c, rootCause(slots.datasetType ?? slots.datasetTypes?.[0] ?? "wastage", c.base));
    case "efficiency":
      return fromAnalysis(c, efficiencyAnalysis(c.base));
    case "shift_performance":
      return fromAnalysis(c, segmentAnalysis("shift", c.base));
    case "outlet_performance":
      return fromAnalysis(c, segmentAnalysis("outlet", c.base));
    case "product_performance":
      return fromAnalysis(c, productAnalysis(c.base, productFocus(cls.slots)));
    case "reconciliation":
      return fromAnalysis(c, reconciliationAnalysis(c.base));
    case "data_coverage":
      return answerCoverage(c);
    case "help":
      return answerHelp(c);
    default:
      return answerUnsupported(c);
  }
}
```

#graphify/code #graphify/EXTRACTED #community/Ramesh_AI_Query_Engine