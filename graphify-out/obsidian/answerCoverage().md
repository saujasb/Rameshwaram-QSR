---
source_file: "server/src/entities/ramesh/engine.ts"
type: "code"
community: "Ramesh AI Query Engine"
location: "L721"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Ramesh_AI_Query_Engine
---

# answerCoverage()

## Connections
- [[answer()]] - `calls` [EXTRACTED]
- [[engine.ts]] - `contains` [EXTRACTED]
- [[insufficient()]] - `calls` [EXTRACTED]
- [[rangeLabel()]] - `calls` [EXTRACTED]
- [[shell()]] - `calls` [EXTRACTED]
- [[used()]] - `calls` [EXTRACTED]

## Source
**From** `server/src/entities/ramesh/engine.ts` **(starting line 721):**
```typescript
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
```

#graphify/code #graphify/EXTRACTED #community/Ramesh_AI_Query_Engine