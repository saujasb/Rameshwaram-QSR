---
source_file: "server/src/entities/ramesh/intents.ts"
type: "code"
community: "Ramesh Intent Classification"
location: "L374"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Ramesh_Intent_Classification
---

# pickIntent()

## Connections
- [[classify()]] - `calls` [EXTRACTED]
- [[intents.ts]] - `contains` [EXTRACTED]

## Source
**From** `server/src/entities/ramesh/intents.ts` **(starting line 374):**
```typescript
function pickIntent(q: string, slots: RameshSlots, types: DatasetType[], wantsCompare: boolean): RameshIntent {
  if (HELP_RE.test(q) && !TOTAL_RE.test(q)) return "help";
  if (COVERAGE_RE.test(q)) return "data_coverage";

  // --- analytical intents. These are checked before the narrow single-metric
  // fallbacks, otherwise "analyse today's sales" degrades to a bare total. ---
  if (CHANGED_RE.test(q)) return "trend";
  if (RECONCILE_RE.test(q)) return "reconciliation";
  if (OVERPRODUCED_RE.test(q)) {
    // "overproduced" names the comparison, not a dataset word, so tag production
    // explicitly -- otherwise the handler falls back to ranking by revenue.
    if (!slots.datasetType) slots.datasetType = "production";
    return "product_performance";
  }

  // "why ..." about a specific metric is a root-cause walk, not a total.
  if (slots.wantsWhy && types.length > 0) return "root_cause";

  if (EFFICIENCY_RE.test(q) && !TOTAL_RE.test(q)) return "efficiency";
  if (SHIFT_PERF_RE.test(q) && (slots.direction || /\bperform\w*|\bworst|\bbest|\bcompare\b/i.test(q))) return "shift_performance";
  if (OUTLET_PERF_RE.test(q) && (slots.direction || /\bperform\w*|\bworst|\bbest|\bcompare\b/i.test(q))) return "outlet_performance";

  // A bare "what anomalies do you see" is a listing, not an explanation.
  if (/\banomal\w*|\boutlier|\bunusual|\babnormal/i.test(q) && !slots.wantsWhy) return "anomaly_explain";

  if (CONTRIBUTING_RE.test(q) && types.length > 0) return "product_performance";

  // Executive last among the analytical group: it is the broadest match, so a
  // more specific analytical reading always wins first.
  if (EXECUTIVE_RE.test(q)) return "executive_analysis";

  if (PEAK_HOUR_RE.test(q) && HOUR_RE.test(q)) return "peak_hour";

  if (slots.dates && slots.dates.length >= 2) return "compare_dates";
  if (new Set(types).size >= 2 && (wantsCompare || slots.wantsWhy)) return "compare_datasets";
  if (new Set(types).size >= 2) return "compare_datasets";

  if (VARIANCE_RE.test(q)) return "variance_explain";

  if (types.includes("wastage") && (slots.wantsWhy || /\breasons?\b|\bcaus\w*\b/i.test(q))) return "wastage_reason";

  if (ANOMALY_RE.test(q) && (slots.wantsWhy || /\banomal\w*|\boutlier|\bunusual|\babnormal/i.test(q))) {
    return "anomaly_explain";
  }
  if (TREND_RE.test(q)) return "trend";

  if (slots.direction && (PRODUCT_NOUN_RE.test(q) || slots.product || slots.productTerm || types.length > 0)) {
    if (/\b(day|date|business\s*day)\b/i.test(q) && !PRODUCT_NOUN_RE.test(q) && !slots.product) return "trend";
    return slots.direction === "lowest" ? "bottom_product" : "top_product";
  }

  if (types.length > 0) {
    if (types[0] === "production") return "total_production";
    if (types[0] === "wastage") return "total_wastage";
    return "total_sales";
  }

  if (ANOMALY_RE.test(q)) return "anomaly_explain";
  if (slots.from || slots.to) return "total_sales";
  return "unsupported";
}
```

#graphify/code #graphify/EXTRACTED #community/Ramesh_Intent_Classification