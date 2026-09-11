---
source_file: "client/src/lib/api/datasets.ts"
type: "code"
community: "Data Explorer & Import UI"
location: "L1"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Data_Explorer__Import_UI
---

# api/datasets.ts

## Connections
- [[AppShell.tsx]] - `imports_from` [EXTRACTED]
- [[DataExplorerPage.tsx]] - `imports_from` [EXTRACTED]
- [[DatasetCoverage]] - `imports` [EXTRACTED]
- [[DatasetFilter]] - `imports` [EXTRACTED]
- [[DatasetSummary]] - `contains` [EXTRACTED]
- [[DatasetType]] - `imports` [EXTRACTED]
- [[HourlyBucket]] - `imports` [EXTRACTED]
- [[ImportBatch]] - `imports` [EXTRACTED]
- [[ImportCenterPage.tsx]] - `imports_from` [EXTRACTED]
- [[ImportFileResult]] - `contains` [EXTRACTED]
- [[PaginatedRecords]] - `imports` [EXTRACTED]
- [[ProductPerformanceRow]] - `imports` [EXTRACTED]
- [[SettingsPage.tsx]] - `imports_from` [EXTRACTED]
- [[TopInsightsPanel.tsx]] - `imports_from` [EXTRACTED]
- [[apiclient.ts]] - `imports_from` [EXTRACTED]
- [[apiintelligence.ts]] - `imports_from` [EXTRACTED]
- [[apiGet()]] - `imports` [EXTRACTED]
- [[apiPut()]] - `imports` [EXTRACTED]
- [[exportCsvUrl()]] - `contains` [EXTRACTED]
- [[filterToParams()_1]] - `contains` [EXTRACTED]
- [[shared-typesdatasets.ts]] - `imports_from` [EXTRACTED]
- [[shared-typesintelligence.ts]] - `imports_from` [EXTRACTED]
- [[useBusinessDaySettings()]] - `contains` [EXTRACTED]
- [[useDatasetCoverage()]] - `contains` [EXTRACTED]
- [[useDatasetFacets()]] - `contains` [EXTRACTED]
- [[useDatasetRecords()]] - `contains` [EXTRACTED]
- [[useDatasetSummary()]] - `contains` [EXTRACTED]
- [[useDeleteImportBatch()_1]] - `contains` [EXTRACTED]
- [[useImportBatches()_1]] - `contains` [EXTRACTED]
- [[useImportFiles()]] - `contains` [EXTRACTED]
- [[useInvalidateDataLayer()]] - `contains` [EXTRACTED]
- [[useLatestImportBatch()_1]] - `contains` [EXTRACTED]
- [[useProductPerformance()]] - `contains` [EXTRACTED]
- [[useSetBusinessDayStartHour()]] - `contains` [EXTRACTED]

## Source
**From** `client/src/lib/api/datasets.ts` **(starting line 1):**
```typescript
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
```

#graphify/code #graphify/EXTRACTED #community/Data_Explorer__Import_UI