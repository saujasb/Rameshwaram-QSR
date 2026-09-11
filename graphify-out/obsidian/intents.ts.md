---
source_file: "server/src/entities/ramesh/intents.ts"
type: "code"
community: "Ramesh Intent Classification"
location: "L1"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Ramesh_Intent_Classification
---

# intents.ts

## Connections
- [[ClassifyOptions]] - `contains` [EXTRACTED]
- [[DEFAULT_BUSINESS_DAY_START_HOUR]] - `imports` [EXTRACTED]
- [[DatasetType]] - `imports` [EXTRACTED]
- [[INJECTION_PATTERNS]] - `contains` [EXTRACTED]
- [[MONTHS]] - `contains` [EXTRACTED]
- [[MONTH_WORDS]] - `contains` [EXTRACTED]
- [[OFF_TOPIC_PATTERNS]] - `contains` [EXTRACTED]
- [[RameshClassification]] - `contains` [EXTRACTED]
- [[RameshIntent]] - `imports` [EXTRACTED]
- [[RameshSlots]] - `contains` [EXTRACTED]
- [[Range]] - `contains` [EXTRACTED]
- [[STOPWORDS]] - `contains` [EXTRACTED]
- [[businessDate.ts]] - `imports_from` [EXTRACTED]
- [[classify()]] - `contains` [EXTRACTED]
- [[datasetWords()]] - `contains` [EXTRACTED]
- [[engine.ts]] - `imports_from` [EXTRACTED]
- [[explicitDates()]] - `contains` [EXTRACTED]
- [[getCurrentBusinessDate()]] - `imports` [EXTRACTED]
- [[isDateKey()]] - `imports` [EXTRACTED]
- [[makeKey()]] - `contains` [EXTRACTED]
- [[matchDimension()]] - `contains` [EXTRACTED]
- [[matchProduct()]] - `contains` [EXTRACTED]
- [[monthBounds()]] - `contains` [EXTRACTED]
- [[norm()]] - `contains` [EXTRACTED]
- [[pad2()]] - `contains` [EXTRACTED]
- [[pickIntent()]] - `contains` [EXTRACTED]
- [[refusal()]] - `contains` [EXTRACTED]
- [[relativeRange()]] - `contains` [EXTRACTED]
- [[resolveYear()]] - `contains` [EXTRACTED]
- [[shared-typesdatasets.ts]] - `imports_from` [EXTRACTED]
- [[shared-typesramesh.ts]] - `imports_from` [EXTRACTED]
- [[shiftDateKey()]] - `imports` [EXTRACTED]
- [[weekStart()]] - `contains` [EXTRACTED]

## Source
**Full file:** `server/src/entities/ramesh/intents.ts`
```typescript
import type { DatasetType } from "../../../../shared-types/datasets.js";
import type { RameshIntent } from "../../../../shared-types/ramesh.js";
import {
  DEFAULT_BUSINESS_DAY_START_HOUR,
  getCurrentBusinessDate,
  isDateKey,
  shiftDateKey,
} from "../../../../shared-types/businessDate.js";

// Ramesh's parser. A question becomes an intent plus a slot bag -- nothing here
// is generative, so the same question always yields the same structured query.
// Relative dates ("yesterday") resolve against the BUSINESS date, never the
// calendar date, so a 01:30 AM question still means the previous trading day.

export interface RameshSlots {
  from?: string;
  to?: string;
  /** Human label for the resolved range, e.g. "13 Aug 2026" or "the last 7 business days". */
  dateLabel?: string;
  /** Two explicit dates, when the question asks for a date-vs-date comparison. */
  dates?: string[];
  datasetType?: DatasetType;
  /** Every dataset word the question mentioned, in order of first appearance. */
  datasetTypes?: DatasetType[];
  /** Exact product name, matched against the imported product list. */
  product?: string;
  /** Partial product term (matched more than one product) -- becomes a LIKE search. */
  productTerm?: string;
  outlet?: string;
  shift?: string;
  direction?: "highest" | "lowest";
  wantsWhy?: boolean;
  /** True when the question tried to override Ramesh's instructions. */
  injection?: boolean;
}

export interface RameshClassification {
  intent: RameshIntent;
  slots: RameshSlots;
}

export interface ClassifyOptions {
  knownProducts?: string[];
  knownOutlets?: string[];
  knownShifts?: string[];
  startHour?: number;
}

// ------------------------------------------------------------- security ----

/**
 * Instruction-override attempts. Matching one does NOT change Ramesh's
 * behaviour in any way -- there is no model to steer. The match exists so the
 * attempt can be refused and logged rather than silently treated as a question.
 */
const INJECTION_PATTERNS: RegExp[] = [
  /ignore\s+(?:all\s+|any\s+|the\s+)?(?:previous|prior|above|earlier|preceding)?\s*instructions?/i,
  /ignore\s+everything\s+(?:above|before)/i,
  /system\s*prompt/i,
  /\bdisregard\b/i,
  /you\s+are\s+now\b/i,
  /reveal\s+your\b/i,
  /show\s+me\s+your\s+(?:prompt|instructions|rules)/i,
  /\bjailbreak\b/i,
  /\bact\s+as\b/i,
  /new\s+instructions?/i,
  /pretend\s+(?:to\s+be|that|you)/i,
  /forget\s+(?:everything|all\s+|your\s+)/i,
  /developer\s+mode/i,
  /prompt\s+injection/i,
  /override\s+(?:your|the)\s+/i,
  /\bDAN\s+mode\b/,
];

/** Unambiguously non-business subjects. */
const OFF_TOPIC_PATTERNS: RegExp[] = [
  /\bweather\b|\bforecast\b|\btemperature\s+in\b|\braining\b|\brainfall\b/i,
  /\bprime\s+minister\b|\bpresident\b|\belections?\b|\bpolitics?\b|\bparliament\b/i,
  /\bmovie\b|\bfilm\b|\bsong\b|\bpoem\b|\bjoke\b|\bbedtime\s+story\b/i,
  /\bcricket\b|\bfootball\b|\bworld\s+cup\b|\bipl\b/i,
  /\bbitcoin\b|\bcrypto\b|\bstock\s+(?:price|market)\b|\bnifty\b|\bsensex\b/i,
  /\bcapital\s+of\b|\bpopulation\s+of\b|\btranslate\b/i,
  /\b(?:write|generate|debug|fix|explain)\s+(?:me\s+)?(?:some\s+)?(?:code|a\s+script|python|javascript|typescript|sql\s+query|java)\b/i,
  /\bmeaning\s+of\s+life\b/i,
  /\brecipe\b|\bhow\s+(?:do\s+i|to)\s+(?:cook|make)\s+/i,
];

/** Anything in here means the question is plausibly about this business. */
const BUSINESS_SIGNAL =
  /\b(sales?|sold|sell|selling|revenue|turnover|billing|production|produced|producing|overproduc\w*|underproduc\w*|wastage|wasted|waste|spoil\w*|product|products|item|items|menu|dish|outlet|branch|shift|business\s*day|peak\s*hour|record|records|dataset|datasets|import\w*|variance|reconcil\w*|trend|anomal\w*|quantity|qty|amount|rupees?|coverage|efficien\w*|sell[-\s]?through|insight\w*|analys\w*|analyz\w*|performance|problem\w*|issue\w*|dashboard|business|today|yesterday|kpi|metric\w*|₹)\b/i;

/** Composite/analytical asks: "analyse today", "biggest problems", "top insights". */
const EXECUTIVE_RE =
  /\b(analys\w*|analyz\w*|overview|summar\w*|biggest\s+problem\w*|main\s+(problem|issue)\w*|key\s+(issue|finding|problem)\w*|top\s+\d*\s*insight\w*|give\s+me\s+insight\w*|what\s+insight\w*|find\s+insight\w*|pay\s+attention|should\s+i\s+know|what\s+do\s+you\s+see|everything|entire\s+business|complete\s+analysis|full\s+analysis|health\s+check)\b/i;

const EFFICIENCY_RE = /\b(efficien\w*|losing\s+efficiency|least\s+efficient|most\s+efficient|inefficien\w*|sell[-\s]?through)\b/i;
const SHIFT_PERF_RE = /\bshift\b/i;
const OUTLET_PERF_RE = /\b(outlet|branch|store|location)\b/i;
const OVERPRODUCED_RE = /\b(overproduc\w*|over[-\s]produc\w*|produc\w*\s+too\s+much|underproduc\w*|under[-\s]produc\w*)\b/i;
const RECONCILE_RE = /\breconcil\w*|expected\s+balance|unaccounted\b/i;
const CHANGED_RE = /\b(what\s+changed|changed?\s+(compared|versus|vs)|difference\s+(from|vs|versus)|compared\s+(with|to)\s+yesterday)\b/i;
const CONTRIBUTING_RE = /\bcontribut\w*\b/i;

// ----------------------------------------------------------- vocabulary ----

const SALES_RE = /\b(sales?|sold|sell|selling|revenue|turnover|billing|takings|earned|income)\b/i;
const PRODUCTION_RE = /\b(production|produced|producing|produce|made|manufactur\w*|prepared|cooked|batches)\b/i;
const WASTAGE_RE = /\b(wastage|wasted|waste|wastes|spoil\w*|discard\w*|thrown|scrapp?ed|dump\w*)\b/i;

const HIGH_RE = /\b(highest|top|most|max|maximum|best|largest|biggest|peak|leading|number\s*one)\b/i;
const LOW_RE = /\b(lowest|least|bottom|min|minimum|worst|smallest|slowest|poorest|fewest)\b/i;

const HOUR_RE = /\b(hour|hourly|hours|time|timing|o'?clock|rush)\b/i;
const PEAK_HOUR_RE = /\b(peak|busiest|rush|best|highest)\b[^?]{0,20}\b(hour|time|period|slot)\b|\bhourly\b|\bby\s+hour\b|\bwhat\s+(?:time|hour)\b/i;

const COMPARE_RE = /\b(compare|comparison|versus|vs\.?|against|difference\s+between|higher\s+than|lower\s+than|better\s+than|worse\s+than|compared\s+(?:to|with))\b/i;
const TREND_RE = /\b(trend|trending|over\s+time|day[-\s]by[-\s]day|growth|growing|declin\w*|trajector\w*|rising|falling|pattern\s+over)\b/i;
const ANOMALY_RE = /\b(anomal\w*|unusual|unusually|spike|spiked|dropped|drop|slump|outlier|abnormal|strange|odd|sudden\w*|off\b)\b/i;
const VARIANCE_RE = /\b(variance|unaccounted|reconcil\w*|sell[-\s]?through|efficiency|leakage|shrinkage|balance\s+between)\b/i;
const COVERAGE_RE =
  /\b(what\s+data|which\s+data|which\s+dates|what\s+dates|data\s+(?:do\s+you\s+have|available|coverage)|coverage|what\s+(?:have|did)\s+(?:i|we)\s+import\w*|what'?s\s+imported|how\s+many\s+records|do\s+you\s+have\s+(?:any\s+)?data)\b/i;
const HELP_RE =
  /^\s*(?:help|hi|hello|hey)\b|\bwhat\s+can\s+you\s+(?:do|answer|tell)|\bhow\s+do\s+you\s+work\b|\bwho\s+are\s+you\b|\bwhat\s+are\s+you\b|\bwhat\s+questions\b/i;
const TOTAL_RE = /\b(total|totals|how\s+much|how\s+many|sum|overall|altogether|what\s+(?:were|was|is|are))\b/i;
const PRODUCT_NOUN_RE = /\b(product|products|item|items|dish|dishes|sku|seller|sellers|selling|menu\s+item)\b/i;

// ------------------------------------------------------------- calendar ----

const MONTHS: Record<string, number> = {
  jan: 1, january: 1, feb: 2, february: 2, mar: 3, march: 3, apr: 4, april: 4,
  may: 5, jun: 6, june: 6, jul: 7, july: 7, aug: 8, august: 8, sep: 9, sept: 9,
  september: 9, oct: 10, october: 10, nov: 11, november: 11, dec: 12, december: 12,
};

const MONTH_WORDS = Object.keys(MONTHS).sort((a, b) => b.length - a.length).join("|");

function pad2(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

function makeKey(year: number, month: number, day: number): string | null {
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  const key = `${year}-${pad2(month)}-${pad2(day)}`;
  const [y, m, d] = [year, month, day];
  const probe = new Date(y, m - 1, d);
  if (probe.getMonth() + 1 !== m || probe.getDate() !== d) return null;
  return key;
}

/** No year in the question => assume the most recent occurrence at or before today's business date. */
function resolveYear(month: number, day: number, year: number | undefined, businessDate: string): string | null {
  if (year !== undefined) {
    const full = year < 100 ? 2000 + year : year;
    return makeKey(full, month, day);
  }
  const thisYear = Number(businessDate.slice(0, 4));
  const candidate = makeKey(thisYear, month, day);
  if (candidate && candidate <= businessDate) return candidate;
  return makeKey(thisYear - 1, month, day) ?? candidate;
}

/** Every explicit date in the question, in order of appearance, de-duplicated. */
function explicitDates(q: string, businessDate: string): string[] {
  const found: string[] = [];
  const push = (key: string | null) => {
    if (key && isDateKey(key) && !found.includes(key)) found.push(key);
  };

  for (const m of q.matchAll(/\b(\d{4})-(\d{1,2})-(\d{1,2})\b/g)) {
    push(makeKey(Number(m[1]), Number(m[2]), Number(m[3])));
  }
  // 13/08/2026, 13.8.26, 13/08
  for (const m of q.matchAll(/\b(\d{1,2})[/.](\d{1,2})(?:[/.](\d{2,4}))?\b/g)) {
    push(resolveYear(Number(m[2]), Number(m[1]), m[3] ? Number(m[3]) : undefined, businessDate));
  }
  // 13 Aug, 13th August 2026
  for (const m of q.matchAll(new RegExp(`\\b(\\d{1,2})(?:st|nd|rd|th)?\\s+(${MONTH_WORDS})\\.?(?:\\s+(\\d{4}))?\\b`, "gi"))) {
    push(resolveYear(MONTHS[m[2].toLowerCase()], Number(m[1]), m[3] ? Number(m[3]) : undefined, businessDate));
  }
  // August 14, Aug 13th 2026
  for (const m of q.matchAll(new RegExp(`\\b(${MONTH_WORDS})\\.?\\s+(\\d{1,2})(?:st|nd|rd|th)?(?:,?\\s+(\\d{4}))?\\b`, "gi"))) {
    push(resolveYear(MONTHS[m[1].toLowerCase()], Number(m[2]), m[3] ? Number(m[3]) : undefined, businessDate));
  }
  return found;
}

function monthBounds(dateKey: string, monthsBack: number): { from: string; to: string } {
  const y = Number(dateKey.slice(0, 4));
  const m = Number(dateKey.slice(5, 7));
  const target = new Date(y, m - 1 - monthsBack, 1);
  const from = makeKey(target.getFullYear(), target.getMonth() + 1, 1)!;
  const last = new Date(target.getFullYear(), target.getMonth() + 1, 0);
  const to = makeKey(last.getFullYear(), last.getMonth() + 1, last.getDate())!;
  return { from, to };
}

function weekStart(dateKey: string): string {
  const [y, m, d] = dateKey.split("-").map(Number);
  const dow = new Date(y, m - 1, d).getDay(); // 0 = Sunday
  return shiftDateKey(dateKey, -((dow + 6) % 7));
}

interface Range {
  from: string;
  to: string;
  label: string;
}

/** Relative phrases, longest/most specific first. */
function relativeRange(q: string, bd: string): Range | null {
  const nDays = q.match(/\b(?:last|past|previous|latest|trailing)\s+(\d{1,3})\s*(day|days|d)\b/i);
  if (nDays) {
    const n = Math.min(400, Math.max(1, Number(nDays[1])));
    return { from: shiftDateKey(bd, -(n - 1)), to: bd, label: `the last ${n} business days` };
  }
  const nWeeks = q.match(/\b(?:last|past|previous)\s+(\d{1,2})\s*weeks?\b/i);
  if (nWeeks) {
    const n = Math.min(52, Math.max(1, Number(nWeeks[1])));
    return { from: shiftDateKey(bd, -(n * 7 - 1)), to: bd, label: `the last ${n * 7} business days` };
  }
  if (/\bday\s+before\s+yesterday\b/i.test(q)) {
    const d = shiftDateKey(bd, -2);
    return { from: d, to: d, label: "the day before yesterday" };
  }
  if (/\byesterday'?s?\b/i.test(q)) {
    const d = shiftDateKey(bd, -1);
    return { from: d, to: d, label: "yesterday" };
  }
  if (/\b(today|today'?s|so\s+far\s+today|tonight|current\s+business\s+day)\b/i.test(q)) {
    return { from: bd, to: bd, label: "today" };
  }
  if (/\bthis\s+week\b/i.test(q)) {
    return { from: weekStart(bd), to: bd, label: "this week so far" };
  }
  if (/\b(last|past|previous)\s+week\b/i.test(q)) {
    return { from: shiftDateKey(bd, -6), to: bd, label: "the last 7 business days" };
  }
  if (/\bthis\s+month\b/i.test(q)) {
    return { from: monthBounds(bd, 0).from, to: bd, label: "this month so far" };
  }
  if (/\b(last|past|previous)\s+month\b/i.test(q)) {
    const b = monthBounds(bd, 1);
    return { from: b.from, to: b.to, label: "last month" };
  }
  if (/\b(last|past)\s+(?:fortnight|two\s+weeks)\b/i.test(q)) {
    return { from: shiftDateKey(bd, -13), to: bd, label: "the last 14 business days" };
  }
  return null;
}

// -------------------------------------------------------------- helpers ----

function norm(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, " ");
}

const STOPWORDS = new Set([
  "what", "were", "was", "total", "sales", "sale", "sold", "production", "produced", "wastage",
  "wasted", "waste", "yesterday", "today", "week", "month", "days", "product", "products",
  "item", "items", "highest", "lowest", "most", "least", "best", "worst", "much", "many",
  "compare", "between", "which", "that", "this", "with", "from", "have", "does", "did",
  "peak", "hour", "hours", "time", "show", "tell", "give", "about", "revenue", "amount",
  "quantity", "records", "record", "data", "dataset", "trend", "reason", "reasons", "why",
  "outlet", "shift", "please", "there", "their", "value", "values", "count", "counts",
]);

/** Match the question against the real product list -- never invent a product. */
function matchProduct(q: string, products: string[]): { product?: string; productTerm?: string } {
  const nq = norm(q);
  const byLength = [...products].sort((a, b) => b.length - a.length);
  for (const p of byLength) {
    const np = norm(p);
    if (np.length >= 3 && nq.includes(np)) return { product: p };
  }
  const tokens = nq.replace(/[^a-z0-9 ]/g, " ").split(/\s+/).filter((t) => t.length >= 4 && !STOPWORDS.has(t));
  for (const t of tokens) {
    const hits = products.filter((p) => norm(p).includes(t));
    if (hits.length === 1) return { product: hits[0] };
    if (hits.length > 1) return { productTerm: t };
  }
  return {};
}

function matchDimension(q: string, values: string[]): string | undefined {
  const nq = norm(q);
  for (const v of [...values].sort((a, b) => b.length - a.length)) {
    const nv = norm(v);
    if (nv.length >= 3 && nq.includes(nv)) return v;
  }
  return undefined;
}

function datasetWords(q: string): DatasetType[] {
  const hits: { type: DatasetType; at: number }[] = [];
  const push = (type: DatasetType, re: RegExp) => {
    const m = re.exec(q);
    if (m) hits.push({ type, at: m.index });
  };
  push("sales", SALES_RE);
  push("production", PRODUCTION_RE);
  push("wastage", WASTAGE_RE);
  return hits.sort((a, b) => a.at - b.at).map((h) => h.type);
}

function refusal(injection: boolean): RameshClassification {
  return { intent: "off_topic", slots: { injection } };
}

// ------------------------------------------------------------- classify ----

export function classify(question: string, opts: ClassifyOptions = {}): RameshClassification {
  const raw = typeof question === "string" ? question : "";
  const q = raw.trim();
  if (!q) return { intent: "unsupported", slots: {} };

  // 1. Instruction-override attempts are refused before anything else is read.
  if (INJECTION_PATTERNS.some((re) => re.test(q))) return refusal(true);

  const hasBusiness = BUSINESS_SIGNAL.test(q);
  if (!hasBusiness && OFF_TOPIC_PATTERNS.some((re) => re.test(q))) return refusal(false);

  const startHour = opts.startHour ?? DEFAULT_BUSINESS_DAY_START_HOUR;
  const businessDate = getCurrentBusinessDate(startHour);

  // ---- slots ----
  const slots: RameshSlots = {};
  const dates = explicitDates(q, businessDate);
  const isRangePhrase = /\b(from|between|since|through|to)\b/i.test(q);
  const wantsCompare = COMPARE_RE.test(q);

  if (dates.length >= 2 && (isRangePhrase && !wantsCompare)) {
    const sorted = [...dates].sort();
    slots.from = sorted[0];
    slots.to = sorted[sorted.length - 1];
    slots.dateLabel = `${slots.from} to ${slots.to}`;
  } else if (dates.length >= 2) {
    slots.dates = dates.slice(0, 2);
  } else if (dates.length === 1) {
    slots.from = dates[0];
    slots.to = dates[0];
    slots.dateLabel = dates[0];
  } else {
    const rel = relativeRange(q, businessDate);
    if (rel) {
      slots.from = rel.from;
      slots.to = rel.to;
      slots.dateLabel = rel.label;
    }
  }

  const types = datasetWords(q);
  if (types.length > 0) {
    slots.datasetTypes = types;
    slots.datasetType = types[0];
  }

  const prod = matchProduct(q, opts.knownProducts ?? []);
  if (prod.product) slots.product = prod.product;
  if (prod.productTerm) slots.productTerm = prod.productTerm;
  const outlet = matchDimension(q, opts.knownOutlets ?? []);
  if (outlet) slots.outlet = outlet;
  const shift = matchDimension(q, opts.knownShifts ?? []);
  if (shift) slots.shift = shift;

  if (LOW_RE.test(q)) slots.direction = "lowest";
  else if (HIGH_RE.test(q)) slots.direction = "highest";
  if (/\bwhy\b|\bwhat\s+caused\b|\breason/i.test(q)) slots.wantsWhy = true;

  // ---- intent, most specific test first ----
  const intent = pickIntent(q, slots, types, wantsCompare);
  return { intent, slots };
}

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

```
*(truncated, showing first 400 of 434 lines)*

#graphify/code #graphify/EXTRACTED #community/Ramesh_Intent_Classification