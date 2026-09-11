---
source_file: "server/src/entities/intelligence/anomalies.ts"
type: "code"
community: "Business Intelligence Engine"
location: "L292"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Business_Intelligence_Engine
---

# buildEvidence()

## Connections
- [[anomalies.ts]] - `contains` [EXTRACTED]
- [[detectAnomalies()]] - `calls` [EXTRACTED]
- [[round2()]] - `calls` [EXTRACTED]
- [[totalsFor()]] - `calls` [EXTRACTED]

## Source
**From** `server/src/entities/intelligence/anomalies.ts` **(starting line 292):**
```typescript
function buildEvidence(filter: DatasetFilter, candidate: Candidate): AnomalyEvidence[] {
  const out: AnomalyEvidence[] = [];
  for (const datasetType of candidate.evidenceTypes) {
    const totals = totalsFor({
      ...filter,
      datasetType,
      from: candidate.businessDate,
      to: candidate.businessDate,
      product: candidate.product ?? filter.product,
    });
    if (totals.recordCount === 0) continue; // never pad evidence with empty groups
    out.push({
      datasetType,
      description: `${totals.recordCount} imported ${DATASET_LABELS[datasetType].toLowerCase()} record(s) on ${candidate.businessDate}${candidate.product ? ` for ${candidate.product}` : ""}`,
      recordCount: totals.recordCount,
      quantity: round2(totals.quantity),
      amount: datasetType === "sales" && totals.value !== 0 ? round2(totals.value) : null,
    });
  }
  return out;
}
```

#graphify/code #graphify/EXTRACTED #community/Business_Intelligence_Engine