---
source_file: "client/src/lib/api/client.ts"
type: "code"
community: "App Shell & Bootstrap"
location: "L14"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/App_Shell__Bootstrap
---

# apiGet()

## Connections
- [[GlobalSearch()]] - `calls` [EXTRACTED]
- [[GlobalSearch.tsx]] - `imports` [EXTRACTED]
- [[InventoryDetailModal()]] - `calls` [EXTRACTED]
- [[InventoryDetailModal.tsx]] - `imports` [EXTRACTED]
- [[apiactionCenter.ts]] - `imports` [EXTRACTED]
- [[apianalytics.ts]] - `imports` [EXTRACTED]
- [[apiclient.ts]] - `contains` [EXTRACTED]
- [[apidatasets.ts]] - `imports` [EXTRACTED]
- [[apiintelligence.ts]] - `imports` [EXTRACTED]
- [[apiproviderOrders.ts]] - `imports` [EXTRACTED]
- [[apiramesh.ts]] - `imports` [EXTRACTED]
- [[apisales.ts]] - `imports` [EXTRACTED]
- [[createEntityHooks.ts]] - `imports` [EXTRACTED]
- [[handle()]] - `calls` [EXTRACTED]
- [[system.ts]] - `imports` [EXTRACTED]
- [[useActionCenter()]] - `calls` [EXTRACTED]
- [[useAnalyticsSnapshot()]] - `calls` [EXTRACTED]
- [[useAnomalies()]] - `calls` [EXTRACTED]
- [[useBusinessDaySettings()]] - `calls` [EXTRACTED]
- [[useDatasetCoverage()]] - `calls` [EXTRACTED]
- [[useDatasetFacets()]] - `calls` [EXTRACTED]
- [[useDatasetRecords()]] - `calls` [EXTRACTED]
- [[useDatasetSummary()]] - `calls` [EXTRACTED]
- [[useHealthCheck()]] - `calls` [EXTRACTED]
- [[useImportBatches()_1]] - `calls` [EXTRACTED]
- [[useImportBatches()]] - `calls` [EXTRACTED]
- [[useLatestImportBatch()_1]] - `calls` [EXTRACTED]
- [[useLatestImportBatch()]] - `calls` [EXTRACTED]
- [[useList()]] - `calls` [EXTRACTED]
- [[useOne()]] - `calls` [EXTRACTED]
- [[usePrioritizedActions()]] - `calls` [EXTRACTED]
- [[useProductPerformance()]] - `calls` [EXTRACTED]
- [[useProviderOrders()]] - `calls` [EXTRACTED]
- [[useRameshSuggestions()]] - `calls` [EXTRACTED]
- [[useReconciliation()]] - `calls` [EXTRACTED]
- [[useSalesSummary()]] - `calls` [EXTRACTED]
- [[useSalesTarget()]] - `calls` [EXTRACTED]
- [[useTodaysIntelligence()]] - `calls` [EXTRACTED]
- [[useTopInsights()]] - `calls` [EXTRACTED]

## Source
**From** `client/src/lib/api/client.ts` **(starting line 14):**
```typescript
export function apiGet<T>(path: string): Promise<T> {
  return fetch(`${BASE}${path}`).then((res) => handle<T>(res));
}
```

#graphify/code #graphify/EXTRACTED #community/App_Shell__Bootstrap