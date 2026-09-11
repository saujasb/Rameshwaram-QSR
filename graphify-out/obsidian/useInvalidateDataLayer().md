---
source_file: "client/src/lib/api/datasets.ts"
type: "code"
community: "Data Explorer & Import UI"
location: "L91"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Data_Explorer__Import_UI
---

# useInvalidateDataLayer()

## Connections
- [[apidatasets.ts]] - `contains` [EXTRACTED]
- [[useDeleteImportBatch()_1]] - `calls` [EXTRACTED]
- [[useImportFiles()]] - `calls` [EXTRACTED]
- [[useSetBusinessDayStartHour()]] - `calls` [EXTRACTED]

## Source
**From** `client/src/lib/api/datasets.ts` **(starting line 91):**
```typescript
export function useInvalidateDataLayer() {
  const qc = useQueryClient();
  return () => {
    for (const key of [
      "dataset-summary", "dataset-records", "dataset-products", "dataset-coverage",
      "dataset-facets", "dataset-import-batches", "todays-intelligence", "top-insights",
      "anomalies", "reconciliation", "sales-summary", "sales-import-batches",
    ]) {
      qc.invalidateQueries({ queryKey: [key] });
    }
  };
}
```

#graphify/code #graphify/EXTRACTED #community/Data_Explorer__Import_UI