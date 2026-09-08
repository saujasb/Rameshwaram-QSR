---
source_file: "server/src/entities/ramesh/engine.ts"
type: "code"
community: "Ramesh AI Query Engine"
location: "L1"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Ramesh_AI_Query_Engine
---

# engine.ts

## Connections
- [[AnalysisResult]] - `imports` [EXTRACTED]
- [[AnomalyEvidence]] - `imports` [EXTRACTED]
- [[Ctx]] - `contains` [EXTRACTED]
- [[DATASET_LABELS]] - `imports` [EXTRACTED]
- [[DatasetCoverage]] - `imports` [EXTRACTED]
- [[DatasetFilter]] - `imports` [EXTRACTED]
- [[DatasetType]] - `imports` [EXTRACTED]
- [[INR_1]] - `contains` [EXTRACTED]
- [[NUM]] - `contains` [EXTRACTED]
- [[RAMESH_OFF_TOPIC_REPLY]] - `imports` [EXTRACTED]
- [[RameshAnswer]] - `imports` [EXTRACTED]
- [[RameshCalculationStep]] - `imports` [EXTRACTED]
- [[RameshDataUsed]] - `imports` [EXTRACTED]
- [[RameshIntent]] - `imports` [EXTRACTED]
- [[RameshQuery]] - `imports` [EXTRACTED]
- [[RameshSlots]] - `imports` [EXTRACTED]
- [[analysis.ts]] - `imports_from` [EXTRACTED]
- [[anomalyAnalysis()]] - `imports` [EXTRACTED]
- [[answer()]] - `contains` [EXTRACTED]
- [[answerCompareDatasets()]] - `contains` [EXTRACTED]
- [[answerCompareDates()]] - `contains` [EXTRACTED]
- [[answerCoverage()]] - `contains` [EXTRACTED]
- [[answerHelp()]] - `contains` [EXTRACTED]
- [[answerPeakHour()]] - `contains` [EXTRACTED]
- [[answerRanked()]] - `contains` [EXTRACTED]
- [[answerSeries()]] - `contains` [EXTRACTED]
- [[answerTotals()]] - `contains` [EXTRACTED]
- [[answerUnsupported()]] - `contains` [EXTRACTED]
- [[answerVariance()]] - `contains` [EXTRACTED]
- [[answerWastageReason()]] - `contains` [EXTRACTED]
- [[buildSuggestions()]] - `contains` [EXTRACTED]
- [[businessDate.ts]] - `imports_from` [EXTRACTED]
- [[changeAnalysis()]] - `imports` [EXTRACTED]
- [[classify()]] - `imports` [EXTRACTED]
- [[coverageOf()]] - `contains` [EXTRACTED]
- [[dailyTotals()]] - `imports` [EXTRACTED]
- [[datasetCoverage()]] - `imports` [EXTRACTED]
- [[datasetsrepository.ts]] - `imports_from` [EXTRACTED]
- [[distinctValues()]] - `imports` [EXTRACTED]
- [[drilldown()_1]] - `contains` [EXTRACTED]
- [[efficiencyAnalysis()]] - `imports` [EXTRACTED]
- [[executiveAnalysis()]] - `imports` [EXTRACTED]
- [[formatBusinessDateLong()]] - `imports` [EXTRACTED]
- [[formatHourBucket()]] - `imports` [EXTRACTED]
- [[fromAnalysis()]] - `contains` [EXTRACTED]
- [[getBusinessDayStartHour()]] - `imports` [EXTRACTED]
- [[hourlyBuckets()]] - `imports` [EXTRACTED]
- [[insufficient()]] - `contains` [EXTRACTED]
- [[intents.ts]] - `imports_from` [EXTRACTED]
- [[latestBusinessDate()]] - `imports` [EXTRACTED]
- [[missingDataset()]] - `contains` [EXTRACTED]
- [[money()_2]] - `contains` [EXTRACTED]
- [[noMatch()]] - `contains` [EXTRACTED]
- [[pct()_1]] - `contains` [EXTRACTED]
- [[productAnalysis()]] - `imports` [EXTRACTED]
- [[productFocus()]] - `contains` [EXTRACTED]
- [[qty()]] - `contains` [EXTRACTED]
- [[rameshroutes.ts]] - `imports_from` [EXTRACTED]
- [[rangeLabel()]] - `contains` [EXTRACTED]
- [[reconciliationAnalysis()]] - `imports` [EXTRACTED]
- [[rootCause()]] - `imports` [EXTRACTED]
- [[scopeNote()]] - `contains` [EXTRACTED]
- [[segmentAnalysis()]] - `imports` [EXTRACTED]
- [[shared-typesdatasets.ts]] - `imports_from` [EXTRACTED]
- [[shared-typesintelligence.ts]] - `imports_from` [EXTRACTED]
- [[shared-typesramesh.ts]] - `imports_from` [EXTRACTED]
- [[shell()]] - `contains` [EXTRACTED]
- [[spanOf()]] - `contains` [EXTRACTED]
- [[suggestionsForCurrentData()]] - `contains` [EXTRACTED]
- [[sumExpr()]] - `contains` [EXTRACTED]
- [[topProducts()]] - `imports` [EXTRACTED]
- [[totalsFor()]] - `imports` [EXTRACTED]
- [[units()_1]] - `contains` [EXTRACTED]
- [[used()]] - `contains` [EXTRACTED]
- [[wastageByReason()]] - `imports` [EXTRACTED]

## Source
**Full file:** `server/src/entities/ramesh/engine.ts`
```typescript
import { DATASET_LABELS } from "../../../../shared-types/datasets.js";
import type { DatasetCoverage, DatasetFilter, DatasetType } from "../../../../shared-types/datasets.js";
import type { AnomalyEvidence } from "../../../../shared-types/intelligence.js";
import { RAMESH_OFF_TOPIC_REPLY } from "../../../../shared-types/ramesh.js";
import type {
  RameshAnswer,
  RameshCalculationStep,
  RameshDataUsed,
  RameshIntent,
  RameshQuery,
} from "../../../../shared-types/ramesh.js";
import { formatBusinessDateLong, formatHourBucket } from "../../../../shared-types/businessDate.js";
import {
  dailyTotals,
  datasetCoverage,
  distinctValues,
  getBusinessDayStartHour,
  hourlyBuckets,
  latestBusinessDate,
  topProducts,
  totalsFor,
  wastageByReason,
} from "../datasets/repository.js";
import {
  anomalyAnalysis,
  changeAnalysis,
  efficiencyAnalysis,
  executiveAnalysis,
  productAnalysis,
  reconciliationAnalysis,
  rootCause,
  segmentAnalysis,
  type AnalysisResult,
} from "./analysis.js";
import { classify } from "./intents.js";
import type { RameshSlots } from "./intents.js";

// Every number that appears in `answer` or `conclusion` is read out of a value
// computed here and recorded in `calculation` / `dataUsed`. Nothing is inferred,
// rounded into existence, or carried over from a previous answer.

const INR = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });
const NUM = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 });

const money = (n: number): string => `₹${INR.format(Math.round(n))}`;
const qty = (n: number): string => NUM.format(n);
const units = (n: number): string => `${NUM.format(n)} units`;
const pct = (n: number): string => `${n.toFixed(1)}%`;

/** Renders the operands actually summed. Long series are abbreviated but the term count is real. */
function sumExpr(values: number[], fmt: (n: number) => string): string {
  if (values.length === 0) return "0";
  if (values.length === 1) return fmt(values[0]);
  if (values.length <= 8) return values.map(fmt).join(" + ");
  const head = values.slice(0, 3).map(fmt).join(" + ");
  return `${head} + … + ${fmt(values[values.length - 1])} (${values.length} daily subtotals)`;
}

function rangeLabel(from: string | null | undefined, to: string | null | undefined): string {
  if (!from && !to) return "all imported business days";
  if (from && to && from === to) return formatBusinessDateLong(from);
  if (from && to) return `${formatBusinessDateLong(from)} – ${formatBusinessDateLong(to)}`;
  return formatBusinessDateLong((from ?? to) as string);
}

function scopeNote(filter: DatasetFilter): string {
  const bits: string[] = [];
  if (filter.product) bits.push(`product “${filter.product}”`);
  else if (filter.search) bits.push(`products matching “${filter.search}”`);
  if (filter.outlet) bits.push(`outlet ${filter.outlet}`);
  if (filter.shift) bits.push(`shift ${filter.shift}`);
  return bits.length ? ` (${bits.join(", ")})` : "";
}

function drilldown(filter: DatasetFilter, type?: DatasetType): Record<string, string> {
  const out: Record<string, string> = {};
  if (filter.from) out.from = filter.from;
  if (filter.to) out.to = filter.to;
  if (type) out.datasetType = type;
  if (filter.product) out.product = filter.product;
  if (filter.search) out.search = filter.search;
  if (filter.outlet) out.outlet = filter.outlet;
  if (filter.shift) out.shift = filter.shift;
  return out;
}

function used(
  datasets: DatasetType[],
  filter: DatasetFilter,
  recordCount: number,
  span: { from: string | null; to: string | null }
): RameshDataUsed {
  return {
    datasets,
    businessDateFrom: span.from,
    businessDateTo: span.to,
    product: filter.product ?? filter.search ?? null,
    outlet: filter.outlet ?? null,
    shift: filter.shift ?? null,
    recordCount,
  };
}

function spanOf(filter: DatasetFilter): { from: string | null; to: string | null } {
  const daily = dailyTotals(filter);
  if (daily.length === 0) return { from: filter.from ?? null, to: filter.to ?? null };
  return { from: daily[0].businessDate, to: daily[daily.length - 1].businessDate };
}

// ------------------------------------------------------------ suggestions ----

function buildSuggestions(question: string, coverage: DatasetCoverage[]): string[] {
  const pool: string[] = [];
  const sales = coverage.find((c) => c.datasetType === "sales");
  const production = coverage.find((c) => c.datasetType === "production");
  const wastage = coverage.find((c) => c.datasetType === "wastage");

  if (sales && sales.recordCount > 0 && sales.businessDateTo) {
    const day = formatBusinessDateLong(sales.businessDateTo);
    pool.push(`What were total sales on ${day}?`);
    pool.push(`Which product sold the most on ${day}?`);
    const top = topProducts({ datasetType: "sales", from: sales.businessDateTo, to: sales.businessDateTo }, 1);
    if (top[0]) pool.push(`How much ${top[0].product} did we sell on ${day}?`);
    pool.push(`Which product sold the least on ${day}?`);
    if (sales.businessDateFrom && sales.businessDateFrom !== sales.businessDateTo) {
      pool.push(`How did sales trend from ${formatBusinessDateLong(sales.businessDateFrom)} to ${day}?`);
    }
  }
  if (wastage && wastage.recordCount > 0) pool.push("Which product had the highest wastage?");
  if (production && production.recordCount > 0 && sales && sales.recordCount > 0) {
    pool.push("Compare production and sales.");
  }
  pool.push("What data do you have?");

  const asked = question.trim().toLowerCase().replace(/[?.!]+$/, "");
  const out: string[] = [];
  for (const s of pool) {
    if (s.toLowerCase().replace(/[?.!]+$/, "") === asked) continue;
    if (!out.includes(s)) out.push(s);
    if (out.length === 3) break;
  }
  return out;
}

// -------------------------------------------------------------- outcomes ----

interface Ctx {
  question: string;
  intent: RameshIntent;
  slots: RameshSlots;
  base: DatasetFilter;
  coverage: DatasetCoverage[];
  suggestions: string[];
}

function shell(c: Ctx, over: Partial<RameshAnswer>): RameshAnswer {
  return {
    intent: c.intent,
    answer: "",
    dataUsed: null,
    calculation: [],
    conclusion: "",
    insights: [],
    evidence: [],
    drilldownQuery: null,
    insufficientData: false,
    refusalReason: null,
    suggestions: c.suggestions,
    ...over,
  };
}

/** Insufficient-data replies never contain a computed figure. */
function insufficient(c: Ctx, answer: string, conclusion: string, filter?: DatasetFilter, type?: DatasetType): RameshAnswer {
  return shell(c, {
    answer,
    conclusion,
    insufficientData: true,
    drilldownQuery: filter ? drilldown(filter, type) : null,
  });
}

function coverageOf(c: Ctx, type: DatasetType): DatasetCoverage | undefined {
  const cov = c.coverage.find((x) => x.datasetType === type);
  return cov && cov.recordCount > 0 ? cov : undefined;
}

function missingDataset(c: Ctx, type: DatasetType, why: string): RameshAnswer {
  const label = DATASET_LABELS[type].toLowerCase();
  const have = c.coverage.filter((x) => x.recordCount > 0).map((x) => DATASET_LABELS[x.datasetType].toLowerCase());
  const haveNote = have.length
    ? `So far only ${have.join(" and ")} data has been imported.`
    : "No files have been imported yet.";
  return insufficient(
    c,
    `I have no ${label} records at all, so I can't answer that. ${why}`,
    `${haveNote} Import a ${label} report (PDF or Excel) on the Import screen and ask again — I'll compute it from those rows.`
  );
}

function noMatch(c: Ctx, types: DatasetType[], filter: DatasetFilter): RameshAnswer {
  const labels = types.map((t) => DATASET_LABELS[t].toLowerCase()).join("/");
  const where = rangeLabel(filter.from, filter.to);
  const latest = latestBusinessDate(types.length === 1 ? types[0] : undefined);
  const hint = latest
    ? `The most recent business day I hold ${labels} data for is ${formatBusinessDateLong(latest)}.`
    : `No ${labels} records have been imported yet.`;
  return insufficient(
    c,
    `No ${labels} records match ${where}${scopeNote(filter)}, so there is nothing for me to total.`,
    `${hint} Import the report for the day you asked about, or ask about a business day that is already loaded.`,
    filter,
    types.length === 1 ? types[0] : undefined
  );
}

// ------------------------------------------------------------- handlers -----

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

function answerPeakHour(c: Ctx): RameshAnswer {
  const buckets = hourlyBuckets(c.base);
  if (buckets.length === 0) {
    return insufficient(
      c,
      "None of the imported records carry a transaction time, so I cannot identify a peak hour without guessing — and I won't guess.",
      "The sources loaded so far are day-level item totals, which have a business date but no clock time. Import a transaction-level POS export (or an hourly sales report) and the peak hour becomes computable.",
      c.base
    );
  }
  const byValue = buckets.some((b) => b.salesValue > 0);
  const measure = (b: (typeof buckets)[number]) => (byValue ? b.salesValue : b.salesQty + b.productionQty + b.wastageQty);
  const ranked = [...buckets].sort((a, b) => measure(b) - measure(a));
  const peak = ranked[0];
  const fmt = byValue ? money : units;
  const total = buckets.reduce((s, b) => s + measure(b), 0);
  const span = spanOf(c.base);

  const steps: RameshCalculationStep[] = [
    {
      label: `Hourly buckets ranked by ${byValue ? "sales value" : "quantity"}, top ${Math.min(4, ranked.length)}`,
      expression: ranked.slice(0, 4).map((b) => `${formatHourBucket(b.hour)} ${fmt(measure(b))}`).join(" > "),
      result: formatHourBucket(peak.hour),
    },
  ];
  if (total > 0) {
    steps.push({
      label: "Peak hour share of the timed total",
      expression: `${fmt(measure(peak))} ÷ ${fmt(total)} × 100`,
      result: pct((measure(peak) / total) * 100),
    });
  }

  return shell(c, {
    answer: `The peak hour for ${rangeLabel(span.from, span.to)}${scopeNote(c.base)} was ${formatHourBucket(peak.hour)} at ${fmt(measure(peak))}.`,
    dataUsed: used(
      [...new Set(c.coverage.filter((x) => x.recordCount > 0).map((x) => x.datasetType))],
      c.base,
      buckets.reduce((s, b) => s + b.recordCount, 0),
      span
    ),
    calculation: steps,
    conclusion: total > 0 ? `${formatHourBucket(peak.hour)} carried ${pct((measure(peak) / total) * 100)} of everything recorded with a timestamp in this period.` : `Computed from ${buckets.length} timestamped hourly bucket(s).`,
    evidence: [
      {
        datasetType: "sales",
        description: `Timestamped records in the ${formatHourBucket(peak.hour)} bucket`,
        recordCount: peak.recordCount,
        quantity: peak.salesQty,
        amount: byValue ? peak.salesValue : null,
      },
    ],
    drilldownQuery: drilldown(c.base),
  });
}

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
```
*(truncated, showing first 400 of 922 lines)*

#graphify/code #graphify/EXTRACTED #community/Ramesh_AI_Query_Engine