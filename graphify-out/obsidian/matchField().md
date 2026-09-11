---
source_file: "server/src/entities/datasets/columnMap.ts"
type: "code"
community: "Dataset Import & Normalization Pipeline"
location: "L64"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Dataset_Import__Normalization_Pipeline
---

# matchField()

## Connections
- [[buildHeaderPlan()]] - `calls` [EXTRACTED]
- [[canonical()]] - `indirect_call` [INFERRED]
- [[columnMap.ts]] - `contains` [EXTRACTED]

## Source
**From** `server/src/entities/datasets/columnMap.ts` **(starting line 64):**
```typescript
function matchField(field: NormalizedField, headers: string[]): FieldMatch {
  const canonHeaders = headers.map(canonical);
  const aliases = ALIASES[field];

  for (let i = 0; i < canonHeaders.length; i++) {
    if (canonHeaders[i] && canonHeaders[i] === canonical(field)) {
      return { index: i, sourceColumn: headers[i], confidence: 1, matchedBy: "exact" };
    }
  }
  for (const alias of aliases) {
    const idx = canonHeaders.indexOf(alias);
    if (idx !== -1) return { index: idx, sourceColumn: headers[idx], confidence: 0.95, matchedBy: "alias" };
  }
  // Fuzzy: an alias appears as a whole word inside the header (e.g. "Total Qty. Sold").
  for (const alias of aliases) {
    for (let i = 0; i < canonHeaders.length; i++) {
      const h = canonHeaders[i];
      if (!h) continue;
      if (h === alias) continue;
      const asWord = new RegExp(`\\b${alias.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`);
      if (asWord.test(h)) {
        return { index: i, sourceColumn: headers[i], confidence: 0.75, matchedBy: "fuzzy" };
      }
    }
  }
  return { index: null, sourceColumn: null, confidence: 0, matchedBy: "unmatched" };
}
```

#graphify/code #graphify/EXTRACTED #community/Dataset_Import__Normalization_Pipeline