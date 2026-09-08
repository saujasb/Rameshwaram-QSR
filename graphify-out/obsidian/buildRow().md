---
source_file: "server/src/entities/intelligence/reconciliation.ts"
type: "code"
community: "Business Intelligence Engine"
location: "L80"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Business_Intelligence_Engine
---

# buildRow()

## Connections
- [[calculated()]] - `calls` [EXTRACTED]
- [[computeReconciliation()]] - `calls` [EXTRACTED]
- [[emptyRow()]] - `calls` [EXTRACTED]
- [[missingNames()]] - `calls` [EXTRACTED]
- [[observed()]] - `calls` [EXTRACTED]
- [[reconciliation.ts]] - `contains` [EXTRACTED]
- [[round2()_2]] - `calls` [EXTRACTED]
- [[unavailable()]] - `calls` [EXTRACTED]

## Source
**From** `server/src/entities/intelligence/reconciliation.ts` **(starting line 80):**
```typescript
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
```

#graphify/code #graphify/EXTRACTED #community/Business_Intelligence_Engine