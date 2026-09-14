---
source_file: "server/src/entities/datasets/repository.ts"
type: "code"
community: "Dataset Schema & Migrations"
location: "L1"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Dataset_Schema__Migrations
---

# datasets/repository.ts

## Connections
- [[DatasetCoverage]] - `imports` [EXTRACTED]
- [[DatasetFilter]] - `imports` [EXTRACTED]
- [[DatasetRecord]] - `imports` [EXTRACTED]
- [[DatasetTotals]] - `contains` [EXTRACTED]
- [[DatasetType]] - `imports` [EXTRACTED]
- [[HourlyBucket]] - `imports` [EXTRACTED]
- [[ImportBatch]] - `imports` [EXTRACTED]
- [[PaginatedRecords]] - `imports` [EXTRACTED]
- [[ProductPerformanceRow]] - `imports` [EXTRACTED]
- [[SegmentPerformanceRow]] - `contains` [EXTRACTED]
- [[UpsertResult]] - `contains` [EXTRACTED]
- [[analysis.ts]] - `re_exports` [EXTRACTED]
- [[anomalies.ts]] - `imports_from` [EXTRACTED]
- [[buildWhere()]] - `contains` [EXTRACTED]
- [[businessDate.ts]] - `imports_from` [EXTRACTED]
- [[categoryTotals()]] - `contains` [EXTRACTED]
- [[channelTotals()]] - `contains` [EXTRACTED]
- [[dailyTotals()]] - `contains` [EXTRACTED]
- [[datasetCoverage()]] - `contains` [EXTRACTED]
- [[datasetsdb.ts]] - `re_exports` [EXTRACTED]
- [[datasetsimportPipeline.ts]] - `imports_from` [EXTRACTED]
- [[datasetsroutes.ts]] - `imports_from` [EXTRACTED]
- [[db]] - `imports` [EXTRACTED]
- [[dbclient.ts]] - `imports_from` [EXTRACTED]
- [[deleteImportBatch()]] - `contains` [EXTRACTED]
- [[distinctValues()]] - `contains` [EXTRACTED]
- [[engine.ts]] - `imports_from` [EXTRACTED]
- [[ensureDatasetTables()]] - `imports` [EXTRACTED]
- [[exportRecords()]] - `contains` [EXTRACTED]
- [[findBatchByFileHash()]] - `contains` [EXTRACTED]
- [[findByFingerprint]] - `contains` [EXTRACTED]
- [[formatHourBucket()]] - `imports` [EXTRACTED]
- [[getBusinessDayStartHour()]] - `imports` [EXTRACTED]
- [[getBusinessHourSlot()]] - `imports` [EXTRACTED]
- [[getImportBatch()]] - `contains` [EXTRACTED]
- [[hourlyBuckets()]] - `contains` [EXTRACTED]
- [[insertImportBatch()]] - `contains` [EXTRACTED]
- [[insertStmt]] - `contains` [EXTRACTED]
- [[insights.ts]] - `imports_from` [EXTRACTED]
- [[intelligenceroutes.ts]] - `imports_from` [EXTRACTED]
- [[latestBusinessDate()]] - `contains` [EXTRACTED]
- [[listImportBatches()]] - `contains` [EXTRACTED]
- [[mapRecord()]] - `contains` [EXTRACTED]
- [[outletPerformance()]] - `contains` [EXTRACTED]
- [[productKeyOf()]] - `contains` [EXTRACTED]
- [[productPerformance()]] - `contains` [EXTRACTED]
- [[queryRecords()]] - `contains` [EXTRACTED]
- [[reconciliation.ts]] - `imports_from` [EXTRACTED]
- [[rowToBatch()]] - `contains` [EXTRACTED]
- [[segmentPerformance()]] - `contains` [EXTRACTED]
- [[shared-typesdatasets.ts]] - `imports_from` [EXTRACTED]
- [[shared-typesintelligence.ts]] - `imports_from` [EXTRACTED]
- [[shiftPerformance()]] - `contains` [EXTRACTED]
- [[topProducts()]] - `contains` [EXTRACTED]
- [[totalsFor()]] - `contains` [EXTRACTED]
- [[updateStmt]] - `contains` [EXTRACTED]
- [[upsertRecords()]] - `contains` [EXTRACTED]
- [[wastageByReason()]] - `contains` [EXTRACTED]

#graphify/code #graphify/EXTRACTED #community/Dataset_Schema__Migrations