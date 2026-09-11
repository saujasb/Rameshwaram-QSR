---
source_file: "server/src/entities/intelligence/insights.ts"
type: "code"
community: "Business Intelligence Engine"
location: "L362"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Business_Intelligence_Engine
---

# importQualityInsight()

## Connections
- [[buildInsights()]] - `calls` [EXTRACTED]
- [[compact()]] - `calls` [EXTRACTED]
- [[drill()]] - `calls` [EXTRACTED]
- [[evidenceFor()]] - `calls` [EXTRACTED]
- [[insights.ts]] - `contains` [EXTRACTED]

## Source
**From** `server/src/entities/intelligence/insights.ts` **(starting line 362):**
```typescript
function importQualityInsight(filter: DatasetFilter, where: string, batch: ImportBatch): Insight | null {
  const q = batch.quality;
  if (q.rowsRejected === 0 && q.rowsFlagged === 0) return null;
  const from = batch.businessDateFrom ?? batch.createdAt.slice(0, 10);
  const to = batch.businessDateTo ?? from;

  return {
    id: `quality-import:${batch.id}`,
    category: "quality",
    severity: q.rowsRejected > 0 ? "medium" : "low",
    what: `The most recent import (${batch.fileName}) rejected ${q.rowsRejected} row(s) and flagged ${q.rowsFlagged}`,
    howMuch: `${q.rowsValid} of ${q.rowsDetected} detected rows imported cleanly (${q.confidencePct}% confidence)`,
    when: `Imported ${new Date(batch.createdAt).toLocaleString("en-IN")}, covering ${from} to ${to}`,
    where,
    product: null,
    impact: `${q.rowsRejected} row(s) are absent from every figure on this dashboard; ${q.rowsFlagged} more are included but carry data-quality flags`,
    action:
      q.rowsRejected > 0
        ? `Open Import History for ${batch.fileName}, read the ${q.rowsRejected} rejected row(s) listed there, correct the source file and re-import it -- totals for ${from} to ${to} are understated until then.`
        : `Review the ${q.rowsFlagged} flagged row(s) from ${batch.fileName} in Import History; they are counted in totals, so confirm their quantities before relying on ${from} to ${to}.`,
    evidence: compact([evidenceFor(filter, "sales", from, to, null, `Sales records imported for ${from} to ${to}`)]),
    drilldownQuery: drill(filter, { from, to }),
    score: 52,
  };
}
```

#graphify/code #graphify/EXTRACTED #community/Business_Intelligence_Engine