---
source_file: "server/src/entities/ramesh/intents.ts"
type: "code"
community: "Ramesh Intent Classification"
location: "L311"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Ramesh_Intent_Classification
---

# classify()

## Connections
- [[answer()]] - `calls` [EXTRACTED]
- [[datasetWords()]] - `calls` [EXTRACTED]
- [[engine.ts]] - `imports` [EXTRACTED]
- [[explicitDates()]] - `calls` [EXTRACTED]
- [[getCurrentBusinessDate()]] - `calls` [EXTRACTED]
- [[intents.ts]] - `contains` [EXTRACTED]
- [[matchDimension()]] - `calls` [EXTRACTED]
- [[matchProduct()]] - `calls` [EXTRACTED]
- [[pickIntent()]] - `calls` [EXTRACTED]
- [[refusal()]] - `calls` [EXTRACTED]
- [[relativeRange()]] - `calls` [EXTRACTED]

## Source
**From** `server/src/entities/ramesh/intents.ts` **(starting line 311):**
```typescript
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
```

#graphify/code #graphify/EXTRACTED #community/Ramesh_Intent_Classification