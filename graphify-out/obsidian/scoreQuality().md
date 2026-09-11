---
source_file: "server/src/entities/datasets/normalize.ts"
type: "code"
community: "Dataset Import & Normalization Pipeline"
location: "L210"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Dataset_Import__Normalization_Pipeline
---

# scoreQuality()

## Connections
- [[datasetsimportPipeline.ts]] - `imports` [EXTRACTED]
- [[normalize.ts]] - `contains` [EXTRACTED]
- [[runImport()]] - `calls` [EXTRACTED]
- [[severityRank()]] - `calls` [EXTRACTED]

## Source
**From** `server/src/entities/datasets/normalize.ts` **(starting line 210):**
```typescript
export function scoreQuality(input: QualityInput): ImportQuality {
  const { rowsDetected, rowsRejected, rowsDuplicate, flagCounts, mappingConfidencePct } = input;
  const issues: QualityIssue[] = [...(input.extraIssues ?? [])];

  let weightedProblems = rowsRejected;
  let flaggedRows = 0;

  for (const [flag, count] of Object.entries(flagCounts) as [RecordFlag, number][]) {
    if (!count) continue;
    const severity = FLAG_SEVERITY[flag];
    if (severity !== "info") flaggedRows += count;
    weightedProblems += severity === "error" ? count : severity === "warning" ? count * 0.5 : 0;
    issues.push({ code: flag, severity, message: `${count} ${FLAG_MESSAGES[flag]}`, count });
  }

  if (rowsDuplicate > 0) {
    issues.push({
      code: "duplicates_skipped",
      severity: "info",
      message: `${rowsDuplicate} row(s) already on file were skipped rather than double-counted`,
      count: rowsDuplicate,
    });
  }

  const denom = Math.max(1, rowsDetected);
  const extractionPct = Math.max(0, 1 - weightedProblems / denom) * 100;
  // Blend extraction cleanliness with how sure we were about column mapping.
  const confidencePct = Math.round(extractionPct * 0.75 + mappingConfidencePct * 0.25);

  return {
    confidencePct: Math.max(0, Math.min(100, confidencePct)),
    mappingConfidencePct,
    rowsDetected,
    rowsValid: input.rowsInserted + input.rowsUpdated,
    rowsFlagged: flaggedRows,
    rowsRejected,
    rowsDuplicate,
    rowsMissingTimestamp: flagCounts.missing_timestamp ?? 0,
    issues: issues.sort((a, b) => severityRank(a.severity) - severityRank(b.severity)),
  };
}
```

#graphify/code #graphify/EXTRACTED #community/Dataset_Import__Normalization_Pipeline