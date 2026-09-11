---
source_file: "server/src/entities/datasets/columnMap.ts"
type: "code"
community: "Dataset Import & Normalization Pipeline"
location: "L112"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Dataset_Import__Normalization_Pipeline
---

# buildHeaderPlan()

## Connections
- [[columnMap.ts]] - `contains` [EXTRACTED]
- [[excel.ts]] - `imports` [EXTRACTED]
- [[matchField()]] - `calls` [EXTRACTED]
- [[parseWorkbook()]] - `calls` [EXTRACTED]

## Source
**From** `server/src/entities/datasets/columnMap.ts` **(starting line 112):**
```typescript
export function buildHeaderPlan(headers: string[], datasetType: DatasetType): HeaderPlan {
  const indexes: Partial<Record<NormalizedField, number>> = {};
  const mappings: ColumnMapping[] = [];
  const relevant = RELEVANT_BY_DATASET[datasetType];

  for (const field of relevant) {
    const m = matchField(field, headers);
    if (m.index != null) indexes[field] = m.index;
    mappings.push({
      normalizedField: field,
      sourceColumn: m.sourceColumn,
      confidence: m.confidence,
      matchedBy: m.matchedBy,
    });
  }

  const scored = mappings.filter((m) => REQUIRED_BY_DATASET[datasetType].includes(m.normalizedField as NormalizedField) || m.confidence > 0);
  const avg = scored.length ? scored.reduce((s, m) => s + m.confidence, 0) / scored.length : 0;

  return { indexes, mappings, mappingConfidencePct: Math.round(avg * 100) };
}
```

#graphify/code #graphify/EXTRACTED #community/Dataset_Import__Normalization_Pipeline