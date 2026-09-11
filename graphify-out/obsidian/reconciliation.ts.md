---
source_file: "server/src/entities/intelligence/reconciliation.ts"
type: "code"
community: "Business Intelligence Engine"
location: "L1"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Business_Intelligence_Engine
---

# reconciliation.ts

## Connections
- [[ABSENT]] - `contains` [EXTRACTED]
- [[ALL_DATASET_TYPES]] - `contains` [EXTRACTED]
- [[DATASET_LABELS]] - `imports` [EXTRACTED]
- [[DatasetFilter]] - `imports` [EXTRACTED]
- [[DatasetType]] - `imports` [EXTRACTED]
- [[FactsByType]] - `contains` [EXTRACTED]
- [[INR]] - `contains` [EXTRACTED]
- [[Metric]] - `imports` [EXTRACTED]
- [[ReconciliationRow]] - `imports` [EXTRACTED]
- [[ReconciliationSummary]] - `imports` [EXTRACTED]
- [[TypeFacts]] - `contains` [EXTRACTED]
- [[analysis.ts]] - `imports_from` [EXTRACTED]
- [[anomalies.ts]] - `imports_from` [EXTRACTED]
- [[buildRow()]] - `contains` [EXTRACTED]
- [[businessDate.ts]] - `imports_from` [EXTRACTED]
- [[calculated()]] - `contains` [EXTRACTED]
- [[computeReconciliation()]] - `contains` [EXTRACTED]
- [[dailyTotals()]] - `imports` [EXTRACTED]
- [[datasetCoverage()]] - `imports` [EXTRACTED]
- [[datasetsrepository.ts]] - `imports_from` [EXTRACTED]
- [[emptyRow()]] - `contains` [EXTRACTED]
- [[factsFor()]] - `contains` [EXTRACTED]
- [[formatBusinessDateLong()]] - `imports` [EXTRACTED]
- [[insights.ts]] - `imports_from` [EXTRACTED]
- [[intelligenceroutes.ts]] - `imports_from` [EXTRACTED]
- [[missingNames()]] - `contains` [EXTRACTED]
- [[money()]] - `contains` [EXTRACTED]
- [[observed()]] - `contains` [EXTRACTED]
- [[pctText()]] - `contains` [EXTRACTED]
- [[perDateFacts()]] - `contains` [EXTRACTED]
- [[qtyText()]] - `contains` [EXTRACTED]
- [[round2()_2]] - `contains` [EXTRACTED]
- [[salesValueMetric()]] - `contains` [EXTRACTED]
- [[shared-typesdatasets.ts]] - `imports_from` [EXTRACTED]
- [[shared-typesintelligence.ts]] - `imports_from` [EXTRACTED]
- [[totalsFor()]] - `imports` [EXTRACTED]
- [[unavailable()]] - `contains` [EXTRACTED]

## Source
**Full file:** `server/src/entities/intelligence/reconciliation.ts`
```typescript
// Production - Sales - Wastage, per business date.
//
// The single hard rule here: a number is only emitted when records exist to
// back it. The business has so far imported sales PDFs only, so production and
// wastage are routinely EMPTY -- and a 0 rendered as a measurement would be
// read as "nothing was produced", which is a lie. Every figure that cannot be
// proved therefore comes back as Metric { value: null, basis: "unavailable" }
// carrying the reason, and missingDatasets tells the UI what to ask for.

import type { DatasetFilter, DatasetType } from "../../../../shared-types/datasets.js";
import type { Metric, ReconciliationRow, ReconciliationSummary } from "../../../../shared-types/intelligence.js";
import { DATASET_LABELS } from "../../../../shared-types/datasets.js";
import { formatBusinessDateLong } from "../../../../shared-types/businessDate.js";
import { dailyTotals, datasetCoverage, totalsFor } from "../datasets/repository.js";

export const ALL_DATASET_TYPES: DatasetType[] = ["sales", "production", "wastage"];

/**
 * Business dates come from the data itself, never from a generated calendar, so
 * this cap only ever trims an implausibly long imported history.
 */
const MAX_ROWS = 400;

/** Float sums otherwise surface 0.30000000000000004 in the UI. */
function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function unavailable(note: string): Metric {
  return { value: null, basis: "unavailable", note };
}

/** Read straight off imported records -- a sum of rows, nothing inferred. */
export function observed(value: number, note: string): Metric {
  return { value: round2(value), basis: "observed", note };
}

/** Arithmetic over observed sums. Never emitted when an input dataset is absent. */
export function calculated(value: number, note: string): Metric {
  return { value: round2(value), basis: "calculated", note };
}

// Shared number formatting lives here because both anomalies and insights need
// it and this is the module they already depend on -- no import cycle.
const INR = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 });

export function money(n: number): string {
  return INR.format(round2(n));
}

export function qtyText(n: number): string {
  return round2(n).toLocaleString("en-IN", { maximumFractionDigits: 2 });
}

export function pctText(n: number): string {
  return `${n >= 0 ? "" : "-"}${Math.abs(n).toFixed(1)}%`;
}

interface TypeFacts {
  /** False when zero records matched -- the difference between "0 units" and "unknown". */
  present: boolean;
  quantity: number;
  value: number;
  recordCount: number;
}

const ABSENT: TypeFacts = { present: false, quantity: 0, value: 0, recordCount: 0 };

type FactsByType = Record<DatasetType, TypeFacts>;

function factsFor(filter: DatasetFilter, datasetType: DatasetType): TypeFacts {
  const t = totalsFor({ ...filter, datasetType });
  return { present: t.recordCount > 0, quantity: t.quantity, value: t.value, recordCount: t.recordCount };
}

function missingNames(facts: FactsByType, needed: DatasetType[]): string[] {
  return needed.filter((t) => !facts[t].present).map((t) => DATASET_LABELS[t].toLowerCase());
}

function buildRow(businessDate: string, scopeLabel: string, facts: FactsByType): ReconciliationRow {
  const p = facts.production;
  const s = facts.sales;
  const w = facts.wastage;

  const direct = (t: DatasetType): Metric => {
    const f = facts[t];
    const label = DATASET_LABELS[t].toLowerCase();
    return f.present
      ? observed(f.quantity, `Sum of quantity across ${f.recordCount} imported ${label} record(s) for ${scopeLabel}.`)
      : unavailable(`No ${label} records imported for ${scopeLabel}.`);
  };

  /** Every ratio needs its inputs proved AND a non-zero production denominator. */
  const ratio = (needed: DatasetType[], compute: () => number, formula: string): Metric => {
    const missing = missingNames(facts, needed);
    if (missing.length > 0) {
      return unavailable(`${formula} needs ${missing.join(" and ")} records, which are not imported for ${scopeLabel}.`);
    }
    if (p.quantity === 0) {
      return unavailable(`${formula} cannot be computed: production quantity for ${scopeLabel} is 0.`);
    }
    return calculated(compute(), `${formula} over ${scopeLabel}, from ${p.recordCount} production, ${s.recordCount} sales and ${w.recordCount} wastage record(s).`);
  };

  const balanceMissing = missingNames(facts, ALL_DATASET_TYPES);

  return {
    businessDate,
    product: null,
    productionQty: direct("production"),
    salesQty: direct("sales"),
    wastageQty: direct("wastage"),
    expectedBalance:
      balanceMissing.length > 0
        ? unavailable(`Production minus sales minus wastage needs all three datasets; missing ${balanceMissing.join(", ")} for ${scopeLabel}.`)
        : calculated(
            p.quantity - s.quantity - w.quantity,
            `Production ${round2(p.quantity)} minus sales ${round2(s.quantity)} minus wastage ${round2(w.quantity)} for ${scopeLabel}.`
          ),
    wastagePct: ratio(["production", "wastage"], () => (w.quantity / p.quantity) * 100, "Wastage / production x 100"),
    sellThroughPct: ratio(["production", "sales"], () => (s.quantity / p.quantity) * 100, "Sales / production x 100"),
    efficiencyPct: ratio(ALL_DATASET_TYPES, () => ((s.quantity + w.quantity) / p.quantity) * 100, "(Sales + wastage) / production x 100"),
    variancePct: ratio(
      ALL_DATASET_TYPES,
      () => ((p.quantity - s.quantity - w.quantity) / p.quantity) * 100,
      "(Production - sales - wastage) / production x 100"
    ),
    recordCounts: { production: p.recordCount, sales: s.recordCount, wastage: w.recordCount },
  };
}

/** A row of all-unavailable metrics, used when the requested window holds no records at all. */
export function emptyRow(businessDate: string, scopeLabel: string): ReconciliationRow {
  return buildRow(businessDate, scopeLabel, { sales: ABSENT, production: ABSENT, wastage: ABSENT });
}

/**
 * Per-date facts for one dataset type. Dates absent from dailyTotals have no
 * records at all, which is why they are left out of the map rather than stored
 * as zero -- callers then get "unavailable", not a fake measurement.
 */
function perDateFacts(filter: DatasetFilter, datasetType: DatasetType): Map<string, TypeFacts> {
  const out = new Map<string, TypeFacts>();
  for (const day of dailyTotals({ ...filter, datasetType })) {
    // recordCount is only obtainable per date via a scoped totals read; the
    // repository is the data layer, so no raw SQL is written here.
    const t = totalsFor({ ...filter, datasetType, from: day.businessDate, to: day.businessDate });
    out.set(day.businessDate, { present: t.recordCount > 0, quantity: t.quantity, value: t.value, recordCount: t.recordCount });
  }
  return out;
}

export function computeReconciliation(filter: DatasetFilter): ReconciliationSummary {
  const coverage = datasetCoverage();
  const availableDatasets = ALL_DATASET_TYPES.filter((t) => (coverage.find((c) => c.datasetType === t)?.recordCount ?? 0) > 0);
  const missingDatasets = ALL_DATASET_TYPES.filter((t) => !availableDatasets.includes(t));

  // Only query types that exist at all; the common sales-only case costs one pass.
  const byType = new Map<DatasetType, Map<string, TypeFacts>>();
  for (const t of availableDatasets) byType.set(t, perDateFacts(filter, t));

  const dates = [...new Set([...byType.values()].flatMap((m) => [...m.keys()]))].sort();

  if (dates.length === 0) {
    return {
      businessDateFrom: filter.from ?? null,
      businessDateTo: filter.to ?? null,
      rows: [],
      totals: null,
      availableDatasets,
      missingDatasets,
    };
  }

  const businessDateFrom = dates[0];
  const businessDateTo = dates[dates.length - 1];

  const rows = dates.slice(0, MAX_ROWS).map((date) => {
    const facts: FactsByType = {
      sales: byType.get("sales")?.get(date) ?? ABSENT,
      production: byType.get("production")?.get(date) ?? ABSENT,
      wastage: byType.get("wastage")?.get(date) ?? ABSENT,
    };
    return buildRow(date, formatBusinessDateLong(date), facts);
  });

  const rangeFilter: DatasetFilter = { ...filter, from: businessDateFrom, to: businessDateTo };
  const totalFacts: FactsByType = {
    sales: availableDatasets.includes("sales") ? factsFor(rangeFilter, "sales") : ABSENT,
    production: availableDatasets.includes("production") ? factsFor(rangeFilter, "production") : ABSENT,
    wastage: availableDatasets.includes("wastage") ? factsFor(rangeFilter, "wastage") : ABSENT,
  };

  // The totals row keeps the range in businessDate so a UI row key stays unique
  // against the per-date rows above.
  const totalsKey = businessDateFrom === businessDateTo ? businessDateFrom : `${businessDateFrom}..${businessDateTo}`;
  const totalsLabel =
    businessDateFrom === businessDateTo
      ? formatBusinessDateLong(businessDateFrom)
      : `${formatBusinessDateLong(businessDateFrom)} to ${formatBusinessDateLong(businessDateTo)} (${dates.length} business day(s) with data)`;

  return {
    businessDateFrom,
    businessDateTo,
    rows,
    totals: buildRow(totalsKey, totalsLabel, totalFacts),
    availableDatasets,
    missingDatasets,
  };
}

/** Sales value for a window, or "unavailable" when the records carry no amounts. */
export function salesValueMetric(filter: DatasetFilter, scopeLabel: string): Metric {
  const t = totalsFor({ ...filter, datasetType: "sales" });
  if (t.recordCount === 0) return unavailable(`No sales records imported for ${scopeLabel}.`);
  if (t.value === 0 && t.quantity !== 0) {
    return unavailable(`The ${t.recordCount} sales record(s) for ${scopeLabel} carry no monetary amount, so revenue cannot be stated.`);
  }
  return observed(t.value, `Sum of salesValue across ${t.recordCount} imported sales record(s) for ${scopeLabel}.`);
}
```

#graphify/code #graphify/EXTRACTED #community/Business_Intelligence_Engine