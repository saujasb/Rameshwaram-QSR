---
source_file: "shared-types/datasets.ts"
type: "code"
community: "Dataset Import & Normalization Pipeline"
location: "L1"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Dataset_Import__Normalization_Pipeline
---

# shared-types/datasets.ts

## Connections
- [[ColumnMapping]] - `contains` [EXTRACTED]
- [[DATASET_LABELS]] - `contains` [EXTRACTED]
- [[DataExplorerPage.tsx]] - `imports_from` [EXTRACTED]
- [[DatasetCoverage]] - `contains` [EXTRACTED]
- [[DatasetFilter]] - `contains` [EXTRACTED]
- [[DatasetRecord]] - `contains` [EXTRACTED]
- [[DatasetType]] - `contains` [EXTRACTED]
- [[ImportBatch]] - `contains` [EXTRACTED]
- [[ImportCenterPage.tsx]] - `imports_from` [EXTRACTED]
- [[ImportQuality]] - `contains` [EXTRACTED]
- [[ImportStatus]] - `contains` [EXTRACTED]
- [[PaginatedRecords]] - `contains` [EXTRACTED]
- [[QualityIssue]] - `contains` [EXTRACTED]
- [[RECORD_FLAG_LABELS]] - `contains` [EXTRACTED]
- [[RecordFlag]] - `contains` [EXTRACTED]
- [[RejectedRow]] - `contains` [EXTRACTED]
- [[SettingsPage.tsx]] - `imports_from` [EXTRACTED]
- [[SheetImportSummary]] - `contains` [EXTRACTED]
- [[SourceRef]] - `contains` [EXTRACTED]
- [[SourceType]] - `contains` [EXTRACTED]
- [[TopInsightsPanel.tsx]] - `imports_from` [EXTRACTED]
- [[analysis.ts]] - `imports_from` [EXTRACTED]
- [[anomalies.ts]] - `imports_from` [EXTRACTED]
- [[apidatasets.ts]] - `imports_from` [EXTRACTED]
- [[apiintelligence.ts]] - `imports_from` [EXTRACTED]
- [[columnMap.ts]] - `imports_from` [EXTRACTED]
- [[datasetsimportPipeline.ts]] - `imports_from` [EXTRACTED]
- [[datasetsrepository.ts]] - `imports_from` [EXTRACTED]
- [[datasetsroutes.ts]] - `imports_from` [EXTRACTED]
- [[engine.ts]] - `imports_from` [EXTRACTED]
- [[excel.ts]] - `imports_from` [EXTRACTED]
- [[insights.ts]] - `imports_from` [EXTRACTED]
- [[intelligenceroutes.ts]] - `imports_from` [EXTRACTED]
- [[intents.ts]] - `imports_from` [EXTRACTED]
- [[labels.ts]] - `imports_from` [EXTRACTED]
- [[normalize.ts]] - `imports_from` [EXTRACTED]
- [[pdfAdapter.ts]] - `imports_from` [EXTRACTED]
- [[reconciliation.ts]] - `imports_from` [EXTRACTED]
- [[shared-typesintelligence.ts]] - `imports_from` [EXTRACTED]
- [[shared-typesramesh.ts]] - `imports_from` [EXTRACTED]

## Source
**From** `shared-types/datasets.ts` **(starting line 1):**
```typescript
// Unified ingestion model. PDF and Excel imports both normalize into
// DatasetRecord rows so every downstream analytic, insight and Ramesh answer
// reads one shape -- and every number stays traceable to its source file,
// sheet/page and row.

```

#graphify/code #graphify/EXTRACTED #community/Dataset_Import__Normalization_Pipeline