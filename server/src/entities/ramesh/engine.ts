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

function answerCompareDatasets(c: Ctx): RameshAnswer {
  const wanted = [...new Set(c.slots.datasetTypes ?? [])];
  const list: DatasetType[] = wanted.length >= 2 ? wanted : ["production", "sales"];
  const missing = list.filter((t) => !coverageOf(c, t));
  if (missing.length > 0) {
    const names = missing.map((t) => DATASET_LABELS[t].toLowerCase()).join(" and ");
    return insufficient(
      c,
      `That comparison needs ${list.map((t) => DATASET_LABELS[t].toLowerCase()).join(" and ")} side by side, and I hold no ${names} records at all.`,
      `Import a ${names} report and the comparison becomes computable — until then I will not estimate the missing side.`,
      c.base
    );
  }

  const rows = list.map((t) => ({ type: t, totals: totalsFor({ ...c.base, datasetType: t }) }));
  const emptyRows = rows.filter((r) => r.totals.recordCount === 0);
  if (emptyRows.length > 0) return noMatch(c, emptyRows.map((r) => r.type), { ...c.base, datasetType: emptyRows[0].type });

  const span = spanOf(c.base);
  const steps: RameshCalculationStep[] = rows.map((r) => ({
    label: `${DATASET_LABELS[r.type]} quantity`,
    expression: `sum over ${r.totals.recordCount} ${DATASET_LABELS[r.type].toLowerCase()} record(s)`,
    result: units(r.totals.quantity),
  }));

  const prod = rows.find((r) => r.type === "production");
  const sale = rows.find((r) => r.type === "sales");
  let conclusion = `Both series are shown in the same units so they can be read against each other directly.`;
  if (prod && sale) {
    // A ratio across dates where only ONE side was imported is arithmetically
    // valid and operationally meaningless -- e.g. 5 days of sales over 1 day of
    // production reads as 2113% sell-through. Restrict the ratio to the business
    // dates where BOTH datasets actually have records, and say so when that
    // differs from the range asked about.
    const prodDates = new Set(dailyTotals({ ...c.base, datasetType: "production" }).map((d) => d.businessDate));
    const saleDates = new Set(dailyTotals({ ...c.base, datasetType: "sales" }).map((d) => d.businessDate));
    const overlap = [...prodDates].filter((d) => saleDates.has(d)).sort();

    if (overlap.length === 0) {
      conclusion =
        `Production and sales never fall on the same business day in this range ` +
        `(production: ${[...prodDates].sort().join(", ") || "none"}; sales: ${[...saleDates].sort().join(", ") || "none"}), ` +
        `so a sell-through ratio would be misleading and I have not computed one.`;
    } else {
      const overlapFrom = overlap[0];
      const overlapTo = overlap[overlap.length - 1];
      const pOver = totalsFor({ ...c.base, datasetType: "production", from: overlapFrom, to: overlapTo });
      const sOver = totalsFor({ ...c.base, datasetType: "sales", from: overlapFrom, to: overlapTo });

      if (pOver.quantity > 0) {
        const sellThrough = (sOver.quantity / pOver.quantity) * 100;
        const sameSpan = overlapFrom === span.from && overlapTo === span.to && overlap.length === prodDates.size && overlap.length === saleDates.size;
        steps.push({
          label: sameSpan ? "Sell-through" : `Sell-through (over the ${overlap.length} business day(s) both datasets cover)`,
          expression: `${qty(sOver.quantity)} ÷ ${qty(pOver.quantity)} × 100`,
          result: pct(sellThrough),
        });
        conclusion = sameSpan
          ? `Sell-through for ${rangeLabel(span.from, span.to)} is ${pct(sellThrough)} of everything produced.`
          : `Sell-through is ${pct(sellThrough)}, computed only over ${rangeLabel(overlapFrom, overlapTo)} — the ${overlap.length} business day(s) with both production and sales on file. The wider totals above cover different date spans, so dividing them directly would overstate the ratio.`;
      }
    }
  } else if (rows.length >= 2) {
    const d = rows[0].totals.quantity - rows[1].totals.quantity;
    steps.push({
      label: `${DATASET_LABELS[rows[0].type]} minus ${DATASET_LABELS[rows[1].type]}`,
      expression: `${qty(rows[0].totals.quantity)} − ${qty(rows[1].totals.quantity)}`,
      result: units(d),
    });
    conclusion = `The gap between the two series is ${units(Math.abs(d))}.`;
  }

  return shell(c, {
    answer: `For ${rangeLabel(span.from, span.to)}${scopeNote(c.base)}: ${rows.map((r) => `${DATASET_LABELS[r.type].toLowerCase()} ${units(r.totals.quantity)}`).join(", ")}.`,
    dataUsed: used(list, c.base, rows.reduce((s, r) => s + r.totals.recordCount, 0), span),
    calculation: steps,
    conclusion,
    evidence: rows.map((r) => ({
      datasetType: r.type,
      description: `${DATASET_LABELS[r.type]} records for ${rangeLabel(span.from, span.to)}${scopeNote(c.base)}`,
      recordCount: r.totals.recordCount,
      quantity: r.totals.quantity,
      amount: r.type === "sales" ? r.totals.value : null,
    })),
    drilldownQuery: drilldown(c.base),
  });
}

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

function answerCoverage(c: Ctx): RameshAnswer {
  const present = c.coverage.filter((x) => x.recordCount > 0);
  if (present.length === 0) {
    return insufficient(
      c,
      "Nothing has been imported yet, so I have no business data to answer from.",
      "Upload a sales, production or wastage report (PDF or Excel) on the Import screen and every answer below becomes computable."
    );
  }
  const steps: RameshCalculationStep[] = present.map((x) => ({
    label: `${DATASET_LABELS[x.datasetType]} coverage`,
    expression: `${x.recordCount} record(s) · ${x.distinctProducts} distinct product(s) · ${x.businessDateFrom} → ${x.businessDateTo}`,
    result: x.hasTimestamps ? "has transaction times" : "no transaction times",
  }));
  const from = present.map((x) => x.businessDateFrom).filter(Boolean).sort()[0] ?? null;
  const to = present.map((x) => x.businessDateTo).filter(Boolean).sort().reverse()[0] ?? null;
  const totalRecords = present.reduce((s, x) => s + x.recordCount, 0);
  const missing = (["sales", "production", "wastage"] as DatasetType[]).filter((t) => !present.some((p) => p.datasetType === t));

  return shell(c, {
    answer: `I hold ${totalRecords} record(s) across ${present.map((x) => DATASET_LABELS[x.datasetType].toLowerCase()).join(", ")}, covering ${rangeLabel(from, to)}.`,
    dataUsed: used(present.map((x) => x.datasetType), c.base, totalRecords, { from, to }),
    calculation: steps,
    conclusion: missing.length
      ? `No ${missing.map((t) => DATASET_LABELS[t].toLowerCase()).join(" or ")} data is loaded, so anything that depends on it will be declined rather than estimated.`
      : `All three datasets are loaded, so cross-dataset questions (variance, sell-through, wastage %) are answerable.`,
    evidence: present.map((x) => ({
      datasetType: x.datasetType,
      description: `${DATASET_LABELS[x.datasetType]} records ${x.businessDateFrom} → ${x.businessDateTo}`,
      recordCount: x.recordCount,
      quantity: 0,
      amount: null,
    })),
    drilldownQuery: {},
  });
}

function answerHelp(c: Ctx): RameshAnswer {
  return shell(c, {
    answer:
      "I answer questions about the sales, production and wastage records imported into this dashboard. Ask me for totals, the best or worst performing product, peak hour, day-vs-day comparisons, wastage reasons, production variance or a trend — and I will show the arithmetic I used.",
    conclusion:
      "I compute every figure from the imported rows, so the same question always gives the same answer. When the data needed is missing I say so instead of estimating, and I cannot answer anything outside this business's data.",
  });
}

function answerUnsupported(c: Ctx): RameshAnswer {
  return shell(c, {
    answer:
      "I could not map that to a calculation I can run over the imported records. I work from sales, production and wastage rows, so try naming a metric (total, highest, lowest, trend, variance, wastage reason) and a business day or product.",
    conclusion: "Ask one of the questions below and I will answer it from the data that is actually loaded.",
  });
}

// ----------------------------------------------------------------- entry ----

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


/**
 * Adapts an analytical result from ./analysis.ts into the chat contract. The
 * numbers are already computed there by the dashboard's own engines; nothing is
 * recalculated or reworded into a claim the evidence doesn't carry.
 */
function fromAnalysis(c: Ctx, r: AnalysisResult, drillFilter?: DatasetFilter): RameshAnswer {
  const span = spanOf(c.base);
  return shell(c, {
    answer: r.answer,
    dataUsed: r.recordCount
      ? {
          datasets: r.datasets,
          businessDateFrom: span.from,
          businessDateTo: span.to,
          product: c.base.product ?? null,
          outlet: c.base.outlet ?? null,
          shift: c.base.shift ?? null,
          recordCount: r.recordCount,
        }
      : null,
    calculation: r.calculation,
    insights: r.insights,
    conclusion: r.conclusion,
    evidence: r.evidence,
    insufficientData: r.insufficientData,
    drilldownQuery: drilldown(drillFilter ?? c.base),
  });
}


/** Which product ranking the question is really after. */
function productFocus(slots: RameshSlots): "overproduced" | "wastage" | "revenue" {
  if (slots.datasetType === "production" || slots.datasetTypes?.includes("production")) return "overproduced";
  if (slots.datasetType === "wastage" || slots.datasetTypes?.includes("wastage")) return "wastage";
  return "revenue";
}

/** Starter questions for the empty chat state, derived from what is actually loaded. */
export function suggestionsForCurrentData(): { suggestions: string[]; hasData: boolean } {
  const coverage = datasetCoverage();
  return { suggestions: buildSuggestions("", coverage), hasData: coverage.some((c) => c.recordCount > 0) };
}
