---
source_file: "client/src/lib/api/sales.ts"
type: "code"
community: "Sales Import UI"
location: "L1"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Sales_Import_UI
---

# api/sales.ts

## Connections
- [[DashboardPage.tsx]] - `imports_from` [EXTRACTED]
- [[ImportError]] - `contains` [EXTRACTED]
- [[SalesAnalyticsPage.tsx]] - `imports_from` [EXTRACTED]
- [[SalesImportBatch]] - `imports` [EXTRACTED]
- [[SalesImportPage.tsx]] - `imports_from` [EXTRACTED]
- [[SalesSummary]] - `imports` [EXTRACTED]
- [[SalesTargetEditor.tsx]] - `imports_from` [EXTRACTED]
- [[SalesTargetSetting]] - `imports` [EXTRACTED]
- [[apiclient.ts]] - `imports_from` [EXTRACTED]
- [[apiDelete()]] - `imports` [EXTRACTED]
- [[apiGet()]] - `imports` [EXTRACTED]
- [[apiPut()]] - `imports` [EXTRACTED]
- [[shared-typessales.ts]] - `imports_from` [EXTRACTED]
- [[summaryKey()]] - `contains` [EXTRACTED]
- [[useDeleteImportBatch()]] - `contains` [EXTRACTED]
- [[useImportBatches()]] - `contains` [EXTRACTED]
- [[useImportSalesPdf()]] - `contains` [EXTRACTED]
- [[useLatestImportBatch()]] - `contains` [EXTRACTED]
- [[useSalesSummary()]] - `contains` [EXTRACTED]
- [[useSalesTarget()]] - `contains` [EXTRACTED]
- [[useSetSalesTarget()]] - `contains` [EXTRACTED]

## Source
**From** `client/src/lib/api/sales.ts` **(starting line 1):**
```typescript
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
```

#graphify/code #graphify/EXTRACTED #community/Sales_Import_UI